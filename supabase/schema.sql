-- ==============================================================================
-- MODELAGEM COMPLETA DO BANCO DE DADOS (Supabase / PostgreSQL)
-- Sistema Big Arcondicionado - Gestão SaaS de Climatização & PMOC
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE tipo_cliente_enum AS ENUM ('PF', 'PJ');

CREATE TYPE tipo_unidade_enum AS ENUM (
  'EVAPORADORA',
  'CONDENSADORA',
  'CONJUNTO_SPLIT'
);

CREATE TYPE status_instalacao_enum AS ENUM (
  'AGUARDANDO_AGENDAMENTO',
  'AGENDADO',
  'INSTALADO_EM_OPERACAO'
);

CREATE TYPE tipo_servico_enum AS ENUM (
  'INSTALACAO_NOVO_APARELHO',
  'MANUTENCAO_PREVENTIVA_6_MESES',
  'MANUTENCAO_CORRETIVA_DEFEITO'
);

CREATE TYPE status_ordem_enum AS ENUM (
  'RECEBIDO_TRIAGEM',
  'TECNICO_ATRIBUIDO',
  'EM_DESLOCAMENTO',
  'EM_EXECUCAO',
  'CONCLUIDO'
);

CREATE TYPE prioridade_ordem_enum AS ENUM (
  'BAIXA',
  'MEDIA',
  'ALTA_URGENCIA'
);

-- 3. TABELA: CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_completo TEXT NOT NULL,
  tipo_cliente tipo_cliente_enum NOT NULL DEFAULT 'PF',
  cpf_cnpj TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  enderecos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de recintos: [{ id, apelido, logradouro, numero, bairro, cidade }]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA: EQUIPAMENTOS
CREATE TABLE IF NOT EXISTS equipamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  endereco_apelido TEXT NOT NULL, -- Apelido do recinto onde o ar está instalado
  tag_patrimonio TEXT NOT NULL UNIQUE, -- ex: "AR-SAL-001" ou "PMB-2024-0418"
  tipo_unidade tipo_unidade_enum NOT NULL DEFAULT 'EVAPORADORA',
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  capacidade_btu INTEGER NOT NULL,
  status_instalacao status_instalacao_enum NOT NULL DEFAULT 'INSTALADO_EM_OPERACAO',
  data_instalacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_ultima_manutencao DATE NOT NULL DEFAULT CURRENT_DATE,
  ciclo_meses INTEGER NOT NULL DEFAULT 6,
  data_proxima_preventiva DATE GENERATED ALWAYS AS (data_ultima_manutencao + INTERVAL '6 months') STORED,
  qr_code_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA: ORDENS DE SERVIÇO
CREATE TABLE IF NOT EXISTS ordens_servico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_os TEXT NOT NULL UNIQUE, -- ex: "OS-2026-0089"
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  equipamento_id UUID REFERENCES equipamentos(id) ON DELETE SET NULL, -- Nullable para compra/novo aparelho
  tipo_servico tipo_servico_enum NOT NULL,
  status status_ordem_enum NOT NULL DEFAULT 'RECEBIDO_TRIAGEM',
  prioridade prioridade_ordem_enum NOT NULL DEFAULT 'MEDIA',
  relato_cliente TEXT NOT NULL,
  fotos_problema TEXT[] DEFAULT ARRAY[]::TEXT[],
  relatorio_tecnico TEXT,
  pecas_utilizadas TEXT,
  laudo_pmoc_url TEXT,
  avaliacao_cliente_estrelas INTEGER CHECK (avaliacao_cliente_estrelas >= 1 AND avaliacao_cliente_estrelas <= 5),
  tecnico_nome TEXT,
  endereco_apelido TEXT,
  preferencia_data DATE,
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_equipamentos_cliente ON equipamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_equipamentos_tag ON equipamentos(tag_patrimonio);
CREATE INDEX IF NOT EXISTS idx_ordens_cliente ON ordens_servico(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordens_equipamento ON ordens_servico(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_ordens_status ON ordens_servico(status);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total a clientes para usuários autenticados" ON clientes
  FOR ALL USING (true);

CREATE POLICY "Acesso total a equipamentos para usuários autenticados" ON equipamentos
  FOR ALL USING (true);

CREATE POLICY "Acesso total a ordens_servico para usuários autenticados" ON ordens_servico
  FOR ALL USING (true);
