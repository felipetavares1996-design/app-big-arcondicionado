export type ClientType = 'PF' | 'PJ';

export type UnitType = 'EVAPORADORA' | 'CONDENSADORA' | 'CONJUNTO_SPLIT';

export type InstallationStatus =
  | 'AGUARDANDO_AGENDAMENTO'
  | 'AGENDADO'
  | 'INSTALADO_EM_OPERACAO';

export type ServiceOrderType =
  | 'INSTALACAO_NOVO_APARELHO'
  | 'MANUTENCAO_PREVENTIVA_6_MESES'
  | 'MANUTENCAO_CORRETIVA_DEFEITO';

export type OrderStatus =
  | 'RECEBIDO_TRIAGEM'
  | 'TECNICO_ATRIBUIDO'
  | 'EM_DESLOCAMENTO'
  | 'EM_EXECUCAO'
  | 'CONCLUIDO';

export type OrderPriority = 'BAIXA' | 'MEDIA' | 'ALTA_URGENCIA';

// Visual maintenance status for badges & progress bar
export type MaintenanceStatus = 'ok' | 'warning' | 'overdue';

export interface AddressRecinto {
  id: string;
  apelido: string; // e.g. 'Casa de Praia', 'Sala Reunião', 'Sede Principal'
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
}

export interface Client {
  id: string;
  nome_completo: string; // ou razao_social
  tipo_cliente: ClientType;
  cpf_cnpj: string;
  whatsapp: string;
  email: string;
  enderecos: AddressRecinto[];
  created_at?: string;
}

export interface PmocReportData {
  reportNumber: string;
  inspectionDate: string;
  technician: string;
  crea: string;
  artNumber: string;
  cleanlinessStatus: 'Aprovado' | 'Conforme com Ressalva' | 'Reprovado';
  airQualityPpm: number;
  temperatureMeasured: number;
  humidity: number;
  filterReplaced: boolean;
  chemicalDisinfection: boolean;
  drainCleaned: boolean;
  electricalTightening: boolean;
  refrigerantPressurePsi: number;
  anvisaCompliant: boolean;
  validUntil: string;
  observations: string;
}

export interface Equipment {
  id: string;
  cliente_id: string;
  cliente_nome?: string;
  endereco_apelido: string; // Apelido do recinto onde está instalado
  tag_patrimonio: string; // ex: "AR-SAL-001"
  tipo_unidade: UnitType;
  marca: string;
  modelo: string;
  capacidade_btu: number;
  status_instalacao: InstallationStatus;
  data_instalacao: string;
  data_ultima_manutencao: string;
  ciclo_meses: number; // default: 6
  data_proxima_preventiva: string;
  qr_code_url?: string;
  observacoes?: string;
  
  // UI & Compatibility attributes
  name: string;
  location: string;
  patrimonyCode: string;
  unitType?: string;
  secretaria?: string;
  brand?: string;
  gasType: string;
  voltage: string;
  serialNumber: string;
  daysRemaining: number;
  status: MaintenanceStatus;
  qrPayload: string;
  lastReport?: PmocReportData;
}

export interface ServiceOrder {
  id: string;
  numero_os: string; // ex: "OS-2026-0089"
  cliente_id: string;
  cliente_nome?: string;
  equipamento_id: string | null; // nullable para compra/novo aparelho
  equipamento_tag?: string;
  equipamento_nome?: string;
  endereco_apelido?: string;
  tipo_servico: ServiceOrderType;
  status: OrderStatus;
  prioridade: OrderPriority;
  relato_cliente: string;
  fotos_problema: string[];
  relatorio_tecnico?: string;
  pecas_utilizadas?: string;
  laudo_pmoc_url?: string;
  avaliacao_cliente_estrelas?: number; // 1 a 5 estrelas
  tecnico_nome?: string;
  preferencia_data?: string;
  data_abertura: string;
  data_conclusao?: string;
  
  // Backward compatibility aliases
  title?: string;
  description?: string;
  category?: string;
  openedAt?: string;
  openedBy?: string;
  priority?: string;
  location?: string;
  secretaria?: string;
  equipmentId?: string;
  equipmentName?: string;
  technician?: string;
  partsReplaced?: string;
  serviceReport?: string;
  completedAt?: string;
  photoUrl?: string;
}

// Aliases for compatibility
export type Ticket = ServiceOrder;
export type TicketPriority = OrderPriority;
export type TicketStatus = OrderStatus;

export interface NewPointRequest {
  id: string;
  cliente_id?: string;
  secretaria?: string;
  unitLocation: string;
  roomSizeM2: number;
  peopleCount: number;
  sunExposure: 'Manhã' | 'Tarde' | 'Dia todo' | 'Sombra';
  estimatedBtu: number;
  justification: string;
  requesterName: string;
  requesterRole: string;
  status: 'Pendente Vistoria Técnica' | 'Em Análise Orçamentária' | 'Aprovado para Instalação';
  createdAt: string;
}

export type ViewMode = 'client' | 'crm' | 'split';
