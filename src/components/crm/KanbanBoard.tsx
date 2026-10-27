'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  User,
  Wrench,
  ShieldAlert,
  Sparkles,
  Building,
  Check,
  Calendar,
  Zap,
} from 'lucide-react';
import { ServiceOrder, OrderStatus } from '@/types';

export default function KanbanBoard() {
  const {
    tickets,
    updateTicketStatus,
    setTicketToComplete,
    setIsCompleteOsModalOpen,
    setSelectedEquipment,
    setIsDetailModalOpen,
    equipments,
  } = useApp();

  const triagem = tickets.filter((t) => t.status === 'RECEBIDO_TRIAGEM');
  const atribuido = tickets.filter((t) => t.status === 'TECNICO_ATRIBUIDO');
  const emAtendimento = tickets.filter(
    (t) => t.status === 'EM_DESLOCAMENTO' || t.status === 'EM_EXECUCAO'
  );
  const concluidos = tickets.filter((t) => t.status === 'CONCLUIDO');

  const handleAssignTechnician = (ticket: ServiceOrder) => {
    updateTicketStatus(ticket.id, 'TECNICO_ATRIBUIDO', 'André Luiz Santos (Técnico Big Ar)');
  };

  const handleStartDispatch = (ticket: ServiceOrder) => {
    updateTicketStatus(ticket.id, 'EM_DESLOCAMENTO', ticket.tecnico_nome || 'André Luiz Santos');
  };

  const handleOpenCompleteModal = (ticket: ServiceOrder) => {
    setTicketToComplete(ticket);
    setIsCompleteOsModalOpen(true);
  };

  const handleOpenEquipment = (equipmentId?: string | null) => {
    if (!equipmentId) return;
    const eq = equipments.find((e) => e.id === equipmentId || e.tag_patrimonio === equipmentId);
    if (eq) {
      setSelectedEquipment(eq);
      setIsDetailModalOpen(true);
    }
  };

  const renderServiceBadge = (tipo: ServiceOrder['tipo_servico']) => {
    if (tipo === 'MANUTENCAO_PREVENTIVA_6_MESES') {
      return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          <span>Revisão 6 Meses</span>
        </span>
      );
    }
    if (tipo === 'INSTALACAO_NOVO_APARELHO') {
      return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" />
          <span>Nova Instalação</span>
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
        <Wrench className="w-2.5 h-2.5" />
        <span>Reparo Corretivo</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Esteira Operacional de Ordens de Serviço (OS)</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Kanban Integrado
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ao concluir uma OS preventiva ou corretiva, o ciclo de 6 meses do aparelho é estendido automaticamente (+180 dias).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total na Esteira: <strong className="text-white">{tickets.length} chamados</strong></span>
        </div>
      </div>

      {/* 4 Kanban Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* ================= COLUMN 1: RECEBIDO_TRIAGEM ================= */}
        <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping" />
              <h3 className="font-bold text-xs text-white">Recebido (Triagem)</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {triagem.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {triagem.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Sem chamados pendentes de triagem.
              </div>
            ) : (
              triagem.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900 p-3 rounded-2xl border border-rose-500/30 hover:border-rose-500/60 transition shadow-md space-y-2"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono font-black text-xs text-sky-400">{ticket.numero_os}</span>
                    {renderServiceBadge(ticket.tipo_servico)}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">{ticket.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ticket.relato_cliente}</p>

                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                    <div>Cliente: <strong className="text-white">{ticket.cliente_nome}</strong></div>
                    <div>Local: <span className="text-slate-300">{ticket.endereco_apelido || ticket.location}</span></div>
                    {ticket.equipamento_tag && (
                      <div>Aparelho: <span className="text-sky-400 font-mono font-bold">{ticket.equipamento_tag}</span></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ticket.data_abertura}
                    </span>

                    <button
                      onClick={() => handleAssignTechnician(ticket)}
                      className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow-sm"
                    >
                      Atribuir ➔
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= COLUMN 2: TECNICO_ATRIBUIDO ================= */}
        <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              <h3 className="font-bold text-xs text-white">Técnico Atribuído</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {atribuido.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {atribuido.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Nenhum chamado aguardando deslocamento.
              </div>
            ) : (
              atribuido.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900 p-3 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition shadow-md space-y-2"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono font-black text-xs text-sky-400">{ticket.numero_os}</span>
                    {renderServiceBadge(ticket.tipo_servico)}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">{ticket.title}</h4>

                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                    <div>Cliente: <strong className="text-white">{ticket.cliente_nome}</strong></div>
                    <div>Técnico: <strong className="text-amber-400">{ticket.tecnico_nome}</strong></div>
                    <div>Local: <span className="text-slate-300">{ticket.endereco_apelido || ticket.location}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'RECEBIDO_TRIAGEM')}
                      className="text-slate-500 hover:text-slate-300"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartDispatch(ticket)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shadow-sm"
                    >
                      Despachar Rota ➔
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= COLUMN 3: EM_DESLOCAMENTO / EM_EXECUCAO ================= */}
        <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <h3 className="font-bold text-xs text-white">Em Atendimento (Campo)</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {emAtendimento.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {emAtendimento.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Sem técnicos em campo no momento.
              </div>
            ) : (
              emAtendimento.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900 p-3 rounded-2xl border border-blue-500/30 hover:border-blue-500/60 transition shadow-md space-y-2"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono font-black text-xs text-sky-400">{ticket.numero_os}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-blue-400 animate-bounce" />
                      Em Execução
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">{ticket.title}</h4>

                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                    <div>Cliente: <strong className="text-white">{ticket.cliente_nome}</strong></div>
                    <div>Técnico: <span className="text-sky-300">{ticket.tecnico_nome}</span></div>
                    <div>Local: <span className="text-slate-300">{ticket.endereco_apelido || ticket.location}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'TECNICO_ATRIBUIDO')}
                      className="text-slate-500 hover:text-slate-300"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenCompleteModal(ticket)}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-[11px] shadow-sm transition"
                    >
                      Concluir OS (+6 Meses)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= COLUMN 4: CONCLUIDO ================= */}
        <div className="bg-slate-900/40 rounded-2xl p-3 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <h3 className="font-bold text-xs text-white">Concluído (Baixa Homologada)</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {concluidos.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {concluidos.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Nenhum chamado concluído recentemente.
              </div>
            ) : (
              concluidos.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/50 transition shadow-sm space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono font-black text-xs text-slate-400">{ticket.numero_os}</span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Concluído
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{ticket.title}</h4>

                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                    <div>Cliente: <strong className="text-white">{ticket.cliente_nome}</strong></div>
                    {ticket.pecas_utilizadas && (
                      <div className="text-emerald-400 truncate">Peças: {ticket.pecas_utilizadas}</div>
                    )}
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{ticket.data_conclusao || 'Finalizado'}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> PMOC +180d
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
