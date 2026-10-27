'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Layers,
  Wrench,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Client, Equipment, ServiceOrder } from '@/types';

export default function ClientDetailsDrawer() {
  const {
    isClient360DrawerOpen,
    setIsClient360DrawerOpen,
    client360Selected,
    equipments,
    tickets,
    setSelectedEquipment,
    setIsDetailModalOpen,
    setIsOpenTicketModalOpen,
    setPrefillServiceType,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'aparelhos' | 'recintos' | 'chamados'>('aparelhos');

  if (!isClient360DrawerOpen || !client360Selected) return null;

  const clientEquipments = equipments.filter((e) => e.cliente_id === client360Selected.id);
  const clientTickets = tickets.filter((t) => t.cliente_id === client360Selected.id);

  const handleOpenEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setIsDetailModalOpen(true);
  };

  const handleOpenTicketForClient = (eq?: Equipment) => {
    if (eq) {
      setSelectedEquipment(eq);
    } else if (clientEquipments.length > 0) {
      setSelectedEquipment(clientEquipments[0]);
    }
    setPrefillServiceType('MANUTENCAO_PREVENTIVA_6_MESES');
    setIsOpenTicketModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
              {client360Selected.tipo_cliente === 'PF' ? 'PF' : 'PJ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {client360Selected.nome_completo}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {client360Selected.tipo_cliente}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CPF/CNPJ: {client360Selected.cpf_cnpj}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClient360DrawerOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Strip */}
        <div className="bg-slate-950/70 p-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/55${client360Selected.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{client360Selected.whatsapp} (WhatsApp)</span>
            </a>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5" />
              <span>{client360Selected.email}</span>
            </span>
          </div>

          <button
            onClick={() => handleOpenTicketForClient()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova OS para Cliente</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-900 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('aparelhos')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'aparelhos'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Aparelhos Monitorados ({clientEquipments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recintos')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'recintos'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Recintos / Imóveis ({client360Selected.enderecos.length})
          </button>
          <button
            onClick={() => setActiveSubTab('chamados')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'chamados'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Histórico de OS ({clientTickets.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* SubTab 1: Aparelhos */}
          {activeSubTab === 'aparelhos' && (
            <div className="space-y-3">
              {clientEquipments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Nenhum equipamento cadastrado para este cliente.
                </div>
              ) : (
                clientEquipments.map((eq) => {
                  const isOverdue = eq.daysRemaining <= 0;
                  const isWarning = eq.daysRemaining <= 30 && !isOverdue;

                  return (
                    <div
                      key={eq.id}
                      className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 hover:border-sky-500/50 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">{eq.tag_patrimonio}</span>
                          <span className="text-[10px] bg-slate-800 text-sky-400 px-2 py-0.5 rounded font-semibold">
                            {eq.tipo_unidade}
                          </span>
                        </div>
                        {isOverdue ? (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                            Vencido há {Math.abs(eq.daysRemaining)} dias
                          </span>
                        ) : isWarning ? (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Atenção: {eq.daysRemaining} dias
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Em dia ({eq.daysRemaining}d)
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-200">{eq.name}</h4>
                      <p className="text-[11px] text-slate-400">{eq.location}</p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Última revisão: {eq.data_ultima_manutencao}</span>
                        <button
                          onClick={() => handleOpenEquipment(eq)}
                          className="text-sky-400 hover:text-sky-300 font-bold"
                        >
                          Ver Ficha Completa ➔
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SubTab 2: Recintos */}
          {activeSubTab === 'recintos' && (
            <div className="space-y-3">
              {client360Selected.enderecos.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <h4 className="font-bold text-white text-xs">{rec.apelido}</h4>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    {rec.logradouro}, {rec.numero} — {rec.bairro}
                  </p>
                  <p className="text-slate-500 text-[10px]">{rec.cidade}</p>
                </div>
              ))}
            </div>
          )}

          {/* SubTab 3: Chamados */}
          {activeSubTab === 'chamados' && (
            <div className="space-y-3">
              {clientTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Nenhuma Ordem de Serviço registrada para este cliente.
                </div>
              ) : (
                clientTickets.map((t) => (
                  <div key={t.id} className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-400 text-xs">{t.numero_os}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200">{t.title}</h4>
                    <p className="text-slate-400 text-[11px]">{t.relato_cliente}</p>
                    {t.avaliacao_cliente_estrelas && (
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= t.avaliacao_cliente_estrelas! ? 'fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({t.avaliacao_cliente_estrelas} estrelas)
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
