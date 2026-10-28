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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 bg-[#0a192f] border-b border-blue-900 flex items-start justify-between text-white">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
              {client360Selected.tipo_cliente === 'PF' ? 'PF' : 'PJ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {client360Selected.nome_completo}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700">
                  {client360Selected.tipo_cliente}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-mono mt-0.5">
                CPF/CNPJ: {client360Selected.cpf_cnpj}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClient360DrawerOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Strip */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/55${client360Selected.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{client360Selected.whatsapp} (WhatsApp)</span>
            </a>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3.5 h-3.5" />
              <span>{client360Selected.email}</span>
            </span>
          </div>

          <button
            onClick={() => handleOpenTicketForClient()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-bold text-[11px] shadow-xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova OS para Cliente</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('aparelhos')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'aparelhos'
                ? 'bg-[#0a2540] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aparelhos Monitorados ({clientEquipments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recintos')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'recintos'
                ? 'bg-[#0a2540] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recintos / Imóveis ({client360Selected.enderecos.length})
          </button>
          <button
            onClick={() => setActiveSubTab('chamados')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'chamados'
                ? 'bg-[#0a2540] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Histórico de OS ({clientTickets.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-800">
          {/* SubTab 1: Aparelhos */}
          {activeSubTab === 'aparelhos' && (
            <div className="space-y-3">
              {clientEquipments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-slate-50">
                  Nenhum equipamento cadastrado para este cliente.
                </div>
              ) : (
                clientEquipments.map((eq) => {
                  const isOverdue = eq.daysRemaining <= 0;
                  const isWarning = eq.daysRemaining <= 30 && !isOverdue;

                  return (
                    <div
                      key={eq.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-400 transition shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-700 text-xs">{eq.tag_patrimonio}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                            {eq.tipo_unidade}
                          </span>
                        </div>
                        {isOverdue ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                            Vencido há {Math.abs(eq.daysRemaining)} dias
                          </span>
                        ) : isWarning ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            Atenção: {eq.daysRemaining} dias
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            Em dia ({eq.daysRemaining}d)
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900">{eq.name}</h4>
                      <p className="text-[11px] text-slate-500">{eq.location}</p>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Última revisão: {eq.data_ultima_manutencao}</span>
                        <button
                          onClick={() => handleOpenEquipment(eq)}
                          className="text-blue-700 hover:text-blue-900 font-bold"
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
                <div key={rec.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-700" />
                    <h4 className="font-bold text-slate-900 text-xs">{rec.apelido}</h4>
                  </div>
                  <p className="text-slate-700 text-[11px]">
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
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-slate-50">
                  Nenhuma Ordem de Serviço registrada para este cliente.
                </div>
              ) : (
                clientTickets.map((t) => (
                  <div key={t.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700 text-xs">{t.numero_os}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{t.title}</h4>
                    <p className="text-slate-600 text-[11px]">{t.relato_cliente}</p>
                    {t.avaliacao_cliente_estrelas && (
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= t.avaliacao_cliente_estrelas! ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-500 ml-1">
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
