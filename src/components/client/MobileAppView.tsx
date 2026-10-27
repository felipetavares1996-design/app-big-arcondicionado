'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  QrCode,
  Building2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Search,
  Plus,
  ShieldCheck,
  Wrench,
  Smartphone,
  Layers,
  Sparkles,
  Home,
  User,
  Users,
  Calendar,
  Zap,
} from 'lucide-react';
import TicketsList from './TicketsList';
import QrScannerModal from './QrScannerModal';
import EquipmentDetailModal from './EquipmentDetailModal';
import PmocReportModal from './PmocReportModal';
import OpenTicketModal from './OpenTicketModal';
import NewPointModal from './NewPointModal';
import PreventiveAlertModal from './PreventiveAlertModal';
import NewTicketView from './NewTicketView';

export default function MobileAppView() {
  const {
    equipments,
    selectedEquipment,
    setSelectedEquipment,
    setIsDetailModalOpen,
    setIsScannerOpen,
    setIsNewPointModalOpen,
    tickets,
    clients,
    activeClient,
    setActiveClient,
    checkAndTriggerPreventiveAlert,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'equipamentos' | 'chamados' | 'novochamado'>('equipamentos');
  const [selectedRecinto, setSelectedRecinto] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Equipments of active client
  const clientEquipments = equipments.filter((eq) => eq.cliente_id === activeClient.id);

  // Filter equipments by recinto & search
  const filteredEquipments = clientEquipments.filter((eq) => {
    const matchesRecinto = selectedRecinto === 'TODOS' || eq.endereco_apelido === selectedRecinto;
    const matchesSearch =
      eq.tag_patrimonio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.endereco_apelido.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRecinto && matchesSearch;
  });

  const clientOpenTicketsCount = tickets.filter(
    (t) => t.cliente_id === activeClient.id && t.status !== 'CONCLUIDO'
  ).length;

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Smartphone Outer Chassis Simulator */}
      <div className="w-full max-w-md bg-slate-950 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border-4 border-slate-800 relative">
        {/* Phone Top Notch / Dynamic Island */}
        <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-slate-400 text-xs font-semibold select-none">
          <span>09:41</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500/50" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Screen Inside */}
        <div className="bg-slate-900 rounded-[34px] overflow-hidden border border-slate-800 min-h-[660px] flex flex-col text-slate-100">
          {/* Header: Client Identity & Switcher */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 p-4 border-b border-slate-800 space-y-3">
            {/* Top row: Client Selection Pill & QR Scanner */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  {activeClient.tipo_cliente === 'PF' ? 'PF' : 'PJ'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-extrabold text-white tracking-tight truncate max-w-[170px]">
                      {activeClient.nome_completo}
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {activeClient.tipo_cliente}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Big Ar • Climatização Inteligente</p>
                </div>
              </div>

              {/* QR Code Camera Button */}
              <button
                id="btn-scan-qr"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-600/30 transition transform active:scale-95"
                title="Abrir Câmera de Leitura de QR Code"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Ler QR</span>
              </button>
            </div>

            {/* Client Profile Switcher (Commercial Demo Utility) */}
            <div className="bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 px-1 font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-sky-400" />
                Perfil Demo:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveClient(c)}
                    className={`px-2 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                      activeClient.id === c.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {c.nome_completo.split(' ')[0]} ({c.tipo_cliente})
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] sm:text-[11px]">
              <button
                id="tab-aparelhos"
                onClick={() => setActiveTab('equipamentos')}
                className={`py-1.5 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activeTab === 'equipamentos'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Aparelhos</span>
                <span className="text-[9px] px-1 py-0.2 rounded-full bg-sky-950/60 text-sky-200">
                  {clientEquipments.length}
                </span>
              </button>

              <button
                id="tab-chamados"
                onClick={() => setActiveTab('chamados')}
                className={`py-1.5 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 relative ${
                  activeTab === 'chamados'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Chamados</span>
                {clientOpenTicketsCount > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    {clientOpenTicketsCount}
                  </span>
                )}
              </button>

              <button
                id="tab-novo-ar"
                onClick={() => setIsNewPointModalOpen(true)}
                className="py-1.5 px-1 rounded-lg font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center justify-center gap-0.5"
                title="Cadastrar ou Solicitar Novo Ar-Condicionado"
              >
                <Plus className="w-3 h-3 text-sky-400" />
                <span className="truncate">Novo Ar</span>
              </button>

              <button
                id="tab-novo-chamado"
                onClick={() => {
                  if (clientEquipments.length > 0 && (!selectedEquipment || selectedEquipment.cliente_id !== activeClient.id)) {
                    setSelectedEquipment(clientEquipments[0]);
                  }
                  setActiveTab('novochamado');
                }}
                className={`py-1.5 px-1 rounded-lg font-bold transition flex items-center justify-center gap-0.5 ${
                  activeTab === 'novochamado'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-sm'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
                }`}
                title="Solicitar Atendimento Técnico / Abrir Novo Chamado"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span className="truncate">Novo Chamado</span>
              </button>
            </div>
          </div>

          {/* Body Content Area */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
            {activeTab === 'equipamentos' ? (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar por tag, cômodo, marca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Recintos / Imóveis Selector Filter */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Home className="w-3 h-3 text-sky-400" />
                    Selecione o Imóvel / Recinto:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                    <button
                      onClick={() => setSelectedRecinto('TODOS')}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium border transition ${
                        selectedRecinto === 'TODOS'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Todos os Imóveis ({clientEquipments.length})
                    </button>
                    {activeClient.enderecos.map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => setSelectedRecinto(rec.apelido)}
                        className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium border transition ${
                          selectedRecinto === rec.apelido
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {rec.apelido}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment Cards with IoT Visual & 6-Month Progress */}
                <div className="space-y-2.5 pt-1">
                  {filteredEquipments.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                      Nenhum equipamento cadastrado neste recinto.
                    </div>
                  ) : (
                    filteredEquipments.map((eq) => {
                      const isOverdue = eq.daysRemaining <= 0;
                      const isWarning = eq.daysRemaining <= 30 && !isOverdue;
                      const isOk = !isOverdue && !isWarning;
                      const isPendingInstall = eq.status_instalacao !== 'INSTALADO_EM_OPERACAO';

                      const cyclePercent = Math.min(
                        100,
                        Math.max(10, Math.round((Math.max(0, eq.daysRemaining) / 180) * 100))
                      );

                      return (
                        <div
                          key={eq.id}
                          id={`card-${eq.id}`}
                          onClick={() => {
                            setSelectedEquipment(eq);
                            setIsDetailModalOpen(true);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group ${
                            isPendingInstall
                              ? 'bg-blue-950/20 border-blue-500/40 hover:border-blue-500/70'
                              : isOverdue
                              ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70 shadow-sm'
                              : isWarning
                              ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70 shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 hover:border-sky-500/50'
                          }`}
                        >
                          {/* Top: Tag, Unit Type and Badge */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-white group-hover:text-sky-300 transition">
                                {eq.tag_patrimonio}
                              </span>
                              <span className="text-[10px] text-sky-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-semibold">
                                {eq.tipo_unidade}
                              </span>
                            </div>

                            {/* Status Badge */}
                            {isPendingInstall ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                                <Zap className="w-3 h-3 text-blue-400" />
                                <span>Instalação Agendada</span>
                              </span>
                            ) : isOk ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Em dia ({eq.daysRemaining}d)</span>
                              </span>
                            ) : isWarning ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                <span>Vence em {eq.daysRemaining}d</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/50">
                                <AlertOctagon className="w-3 h-3 text-rose-400" />
                                <span>PMOC Vencido</span>
                              </span>
                            )}
                          </div>

                          {/* Equipment Name & Recinto */}
                          <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{eq.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                            <Home className="w-3 h-3 text-slate-500" />
                            <span>{eq.endereco_apelido}</span>
                          </p>

                          {/* Visual 6-Month Cycle Progress Bar */}
                          <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-slate-400">Ciclo de 6 Meses:</span>
                              <span className={isOverdue ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400 font-bold' : 'text-emerald-400 font-semibold'}>
                                {isPendingInstall
                                  ? 'Novo Equipamento'
                                  : isOverdue
                                  ? `Vencido (${Math.abs(eq.daysRemaining)}d)`
                                  : `${eq.daysRemaining} dias restantes`}
                              </span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isPendingInstall
                                    ? 'bg-blue-500'
                                    : isOverdue
                                    ? 'bg-rose-500'
                                    : isWarning
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-sky-400'
                                }`}
                                style={{ width: `${cyclePercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Specs footer */}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{eq.capacidade_btu.toLocaleString('pt-BR')} BTUs • {eq.marca}</span>
                            <span className="text-sky-400 font-medium group-hover:underline flex items-center gap-0.5">
                              <span>Ficha & Laudo</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : activeTab === 'chamados' ? (
              <TicketsList onOpenNewTicket={() => setActiveTab('novochamado')} />
            ) : (
              <NewTicketView
                onCancel={() => setActiveTab('equipamentos')}
                onSuccess={() => setActiveTab('chamados')}
              />
            )}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-around text-xs text-slate-400">
            <button
              onClick={() => setActiveTab('equipamentos')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'equipamentos' ? 'text-sky-400 font-bold' : 'hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-[10px]">Aparelhos</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex flex-col items-center gap-1 -mt-5 bg-gradient-to-tr from-sky-600 to-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-sky-600/40 hover:scale-105 active:scale-95 transition"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('chamados')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'chamados' ? 'text-sky-400 font-bold' : 'hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span className="text-[10px]">Chamados</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <PreventiveAlertModal />
      <QrScannerModal />
      <EquipmentDetailModal />
      <PmocReportModal />
      <OpenTicketModal />
      <NewPointModal />
    </div>
  );
}
