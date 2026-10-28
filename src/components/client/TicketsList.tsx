'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Wrench,
  User,
  ChevronDown,
  ChevronUp,
  Inbox,
  Sparkles,
  Star,
  Calendar,
  Check,
  Plus,
} from 'lucide-react';
import { ServiceOrder } from '@/types';

interface TicketsListProps {
  onOpenNewTicket?: () => void;
}

export default function TicketsList({ onOpenNewTicket }: TicketsListProps) {
  const { tickets, activeClient, rateServiceOrder } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Filter by active client
  const clientTickets = tickets.filter((t) => t.cliente_id === activeClient.id);

  const filteredTickets = clientTickets.filter((t) => {
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'aberto') return t.status === 'RECEBIDO_TRIAGEM' || t.status === 'TECNICO_ATRIBUIDO';
    if (filterStatus === 'em_atendimento') return t.status === 'EM_DESLOCAMENTO' || t.status === 'EM_EXECUCAO';
    if (filterStatus === 'concluido') return t.status === 'CONCLUIDO';
    return true;
  });

  // Calculate timeline stage (0 to 3)
  const getTimelineStage = (status: ServiceOrder['status']): number => {
    switch (status) {
      case 'RECEBIDO_TRIAGEM':
        return 0;
      case 'TECNICO_ATRIBUIDO':
        return 1;
      case 'EM_DESLOCAMENTO':
      case 'EM_EXECUCAO':
        return 2;
      case 'CONCLUIDO':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {/* Subheader & Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Meus Chamados & O.S.</h3>
          <p className="text-[11px] text-slate-500">
            {activeClient.nome_completo} • {clientTickets.length} chamado(s)
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10px]">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              filterStatus === 'todos' ? 'bg-[#0a2540] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({clientTickets.length})
          </button>
          <button
            onClick={() => setFilterStatus('aberto')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              filterStatus === 'aberto' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Abertos
          </button>
          <button
            onClick={() => setFilterStatus('concluido')}
            className={`px-2 py-1 rounded-lg transition font-medium ${
              filterStatus === 'concluido' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídos
          </button>
        </div>
      </div>

      {/* Ticket Cards List */}
      {filteredTickets.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-600 font-medium">Nenhum chamado registrado para este filtro.</p>
          {onOpenNewTicket && (
            <button
              onClick={onOpenNewTicket}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a2540] text-white font-bold text-xs shadow-md hover:bg-blue-900 transition active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Abrir Novo Chamado</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const isConcluido = ticket.status === 'CONCLUIDO';
            const stage = getTimelineStage(ticket.status);
            const isExpanded = expandedTicketId === ticket.id;

            // Service badge
            let badgeService = { label: 'Reparo Corretivo', color: 'bg-rose-50 text-rose-700 border-rose-200' };
            if (ticket.tipo_servico === 'MANUTENCAO_PREVENTIVA_6_MESES') {
              badgeService = { label: 'Revisão 6 Meses', color: 'bg-amber-50 text-amber-700 border-amber-200' };
            } else if (ticket.tipo_servico === 'INSTALACAO_NOVO_APARELHO') {
              badgeService = { label: 'Nova Instalação', color: 'bg-blue-50 text-blue-700 border-blue-200' };
            }

            return (
              <div
                key={ticket.id}
                className={`p-4 rounded-2xl border transition-all duration-200 shadow-xs ${
                  isConcluido
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{ticket.numero_os}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeService.color}`}>
                      {badgeService.label}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ticket.prioridade === 'ALTA_URGENCIA'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : ticket.prioridade === 'MEDIA'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {ticket.prioridade === 'ALTA_URGENCIA' ? 'Alta Urgência' : ticket.prioridade}
                  </span>
                </div>

                {/* Equipment & Problem Title */}
                <div className="mb-3">
                  <span className="text-[11px] text-blue-700 font-semibold block">
                    {ticket.equipamento_tag ? `${ticket.equipamento_tag} • ` : ''}
                    {ticket.endereco_apelido || ticket.location}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{ticket.title || ticket.relato_cliente}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ticket.relato_cliente}</p>
                </div>

                {/* Visual Step Timeline */}
                <div className="my-3 py-2 px-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Status do Atendimento em Tempo Real
                  </span>
                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                    <div
                      className="absolute top-2.5 left-4 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
                      style={{ width: `${(stage / 3) * 100}%` }}
                    />

                    {/* Step 1: Criada */}
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          stage >= 0 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        ✓
                      </div>
                      <span className="text-[9px] text-slate-500">Criada</span>
                    </div>

                    {/* Step 2: Técnico Atribuído */}
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          stage >= 1 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {stage >= 1 ? '✓' : '2'}
                      </div>
                      <span className="text-[9px] text-slate-500">Técnico</span>
                    </div>

                    {/* Step 3: Em Atendimento */}
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          stage >= 2 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {stage >= 2 ? '✓' : '3'}
                      </div>
                      <span className="text-[9px] text-slate-500">Em Rota</span>
                    </div>

                    {/* Step 4: Concluído */}
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          stage >= 3 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {stage >= 3 ? '✓' : '4'}
                      </div>
                      <span className="text-[9px] text-slate-500">Concluído</span>
                    </div>
                  </div>
                </div>

                {/* 5-Star Rating Component for Completed Orders */}
                {isConcluido && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl my-2 flex flex-col items-center justify-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-900">
                      {ticket.avaliacao_cliente_estrelas
                        ? `Sua Avaliação: ${ticket.avaliacao_cliente_estrelas} de 5 Estrelas`
                        : 'Como foi sua experiência? Avalie o técnico:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (ticket.avaliacao_cliente_estrelas || 0) >= star;
                        return (
                          <button
                            key={star}
                            onClick={() => rateServiceOrder(ticket.id, star)}
                            className="p-1 text-slate-300 hover:text-amber-400 transition transform hover:scale-125"
                            title={`Avaliar com ${star} estrela(s)`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 hover:text-amber-400'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer details */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ticket.data_abertura || ticket.openedAt}
                  </span>

                  <button
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    <span>{isExpanded ? 'Ocultar' : 'Histórico Técnico'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Expanded Technical Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-[11px] bg-slate-50 p-3 rounded-xl animate-in fade-in duration-150">
                    {ticket.tecnico_nome && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Técnico Atribuído:</span>
                        <span className="text-blue-800 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" /> {ticket.tecnico_nome}
                        </span>
                      </div>
                    )}

                    {ticket.pecas_utilizadas && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Peças / Insumos Utilizados:</span>
                        <span className="text-emerald-700 font-medium">{ticket.pecas_utilizadas}</span>
                      </div>
                    )}

                    {ticket.relatorio_tecnico && (
                      <div>
                        <span className="text-slate-500 block text-[10px]">Relatório do Serviço:</span>
                        <p className="text-slate-700 italic">{ticket.relatorio_tecnico}</p>
                      </div>
                    )}

                    {ticket.data_conclusao && (
                      <div className="text-[10px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                        Finalizado em: {ticket.data_conclusao}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
