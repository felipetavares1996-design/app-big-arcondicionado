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
    <div className="flex flex-col items-center justify-center py-0 md:py-6 px-0 md:px-4 w-full">
      {/* Smartphone Outer Chassis Simulator (Mobile: edge-to-edge full width; Desktop: sleek phone chassis) */}
      <div className="w-full md:max-w-md bg-transparent md:bg-slate-950 rounded-none md:rounded-[44px] p-0 md:p-3 shadow-none md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border-0 md:border-4 md:border-slate-800 relative">
        {/* Phone Top Notch / Dynamic Island (Only visible on desktop simulator) */}
        <div className="hidden md:flex w-full items-center justify-between px-6 pt-2 pb-1 text-slate-400 text-xs font-semibold select-none">
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
        <div className="bg-slate-50 rounded-none md:rounded-[34px] overflow-hidden border-0 md:border md:border-slate-700 min-h-screen md:min-h-[660px] flex flex-col text-slate-800">
          {/* Header: Client Identity & Switcher (Deep Navy Blue) */}
          <div className="bg-[#0a192f] p-4 border-b border-blue-950 space-y-3 text-white">
            {/* Top row: Client Selection Pill & QR Scanner */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  {activeClient.tipo_cliente === 'PF' ? 'PF' : 'PJ'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-extrabold text-white tracking-tight truncate max-w-[170px]">
                      {activeClient.nome_completo}
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      {activeClient.tipo_cliente}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium">Big Ar • Climatização Inteligente</p>
                </div>
              </div>

              {/* QR Code Camera Button */}
              <button
                id="btn-scan-qr"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-900/40 transition transform active:scale-95"
                title="Abrir Câmera de Leitura de QR Code"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Ler QR</span>
              </button>
            </div>

            {/* Client Profile Switcher (Commercial Demo Utility) */}
            <div className="bg-[#071324] p-1.5 rounded-xl border border-blue-900/50 flex items-center justify-between text-[10px]">
              <span className="text-slate-300 px-1 font-semibold flex items-center gap-1">
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
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {c.nome_completo.split(' ')[0]} ({c.tipo_cliente})
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-[10px] sm:text-[11px]">
              <button
                id="tab-aparelhos"
                onClick={() => setActiveTab('equipamentos')}
                className={`py-1.5 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activeTab === 'equipamentos'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Aparelhos</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full ${activeTab === 'equipamentos' ? 'bg-blue-950 text-sky-200' : 'bg-slate-100 text-slate-700'}`}>
                  {clientEquipments.length}
                </span>
              </button>

              <button
                id="tab-chamados"
                onClick={() => setActiveTab('chamados')}
                className={`py-1.5 px-1 rounded-lg font-bold transition flex items-center justify-center gap-1 relative ${
                  activeTab === 'chamados'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
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
                className="py-1.5 px-1 rounded-lg font-bold text-blue-700 hover:bg-blue-50 transition flex items-center justify-center gap-0.5"
                title="Cadastrar ou Solicitar Novo Ar-Condicionado"
              >
                <Plus className="w-3 h-3 text-blue-700" />
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
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
                title="Solicitar Atendimento Técnico / Abrir Novo Chamado"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span className="truncate">Chamado</span>
              </button>
            </div>
          </div>

          {/* Body Content Area */}
          {/* Body Content Area */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
            {activeTab === 'equipamentos' ? (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por tag, cômodo, marca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* Recintos / Imóveis Selector Filter */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                    <Home className="w-3 h-3 text-blue-700" />
                    Selecione o Imóvel / Recinto:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                    <button
                      onClick={() => setSelectedRecinto('TODOS')}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium border transition ${
                        selectedRecinto === 'TODOS'
                          ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
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
                            ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
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
                    <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-xs">
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
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group bg-white shadow-xs hover:shadow-md ${
                            isPendingInstall
                              ? 'border-blue-300 hover:border-blue-500'
                              : isOverdue
                              ? 'border-rose-300 hover:border-rose-500 bg-rose-50/30'
                              : isWarning
                              ? 'border-amber-300 hover:border-amber-500 bg-amber-50/30'
                              : 'border-slate-200 hover:border-blue-500'
                          }`}
                        >
                          {/* Top: Tag, Unit Type and Badge */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-blue-950 group-hover:text-blue-700 transition">
                                {eq.tag_patrimonio}
                              </span>
                              <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                                {eq.tipo_unidade}
                              </span>
                            </div>

                            {/* Status Badge */}
                            {isPendingInstall ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                <Zap className="w-3 h-3 text-blue-600" />
                                <span>Instalação Agendada</span>
                              </span>
                            ) : isOk ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Em dia ({eq.daysRemaining}d)</span>
                              </span>
                            ) : isWarning ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Vence em {eq.daysRemaining}d</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                <AlertOctagon className="w-3 h-3 text-rose-600" />
                                <span>PMOC Vencido</span>
                              </span>
                            )}
                          </div>

                          {/* Equipment Name & Recinto */}
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {eq.nome_aparelho || eq.name}
                            </h4>
                            {eq.comodo && (
                              <span className="text-[9px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                                {eq.comodo}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                            <Home className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{eq.endereco_apelido}</span>
                          </p>

                          {/* Visual 6-Month Cycle Progress Bar */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-slate-500 font-medium">Ciclo de 6 Meses:</span>
                              <span className={isOverdue ? 'text-rose-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-emerald-700 font-semibold'}>
                                {isPendingInstall
                                  ? 'Novo Equipamento'
                                  : isOverdue
                                  ? `Vencido (${Math.abs(eq.daysRemaining)}d)`
                                  : `${eq.daysRemaining} dias restantes`}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isPendingInstall
                                    ? 'bg-blue-600'
                                    : isOverdue
                                    ? 'bg-rose-500'
                                    : isWarning
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-blue-600'
                                }`}
                                style={{ width: `${cyclePercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Specs footer */}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{eq.capacidade_btu.toLocaleString('pt-BR')} BTUs • {eq.marca}</span>
                            <span className="text-blue-700 font-semibold group-hover:underline flex items-center gap-0.5">
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
          <div className="bg-white p-3 border-t border-slate-200 flex items-center justify-around text-xs text-slate-500 shadow-sm">
            <button
              onClick={() => setActiveTab('equipamentos')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'equipamentos' ? 'text-blue-900 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-[10px]">Aparelhos</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex flex-col items-center gap-1 -mt-5 bg-gradient-to-tr from-blue-700 to-sky-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-900/30 hover:scale-105 active:scale-95 transition"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('chamados')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'chamados' ? 'text-blue-900 font-bold' : 'hover:text-slate-900'
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
