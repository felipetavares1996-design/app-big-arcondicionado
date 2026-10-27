'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  Layers,
  Printer,
  PlusCircle,
  FileCheck2,
  Users,
  Settings,
  Bell,
  Search,
  Shield,
  Award,
  Sparkles,
  Wrench,
  Building,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import CrmDashboard from './CrmDashboard';
import KanbanBoard from './KanbanBoard';
import EquipmentTable from './EquipmentTable';
import Client360View from './Client360View';
import CompleteOsModal from './CompleteOsModal';
import QrTagModal from './QrTagModal';
import BatchPrintModal from './BatchPrintModal';
import PmocReportModal from '../client/PmocReportModal';
import OpenTicketModal from '../client/OpenTicketModal';
import EquipmentDetailModal from '../client/EquipmentDetailModal';

export default function CrmView() {
  const {
    tickets,
    equipments,
    clients,
    newPoints,
    setIsBatchPrintModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clientes' | 'kanban' | 'equipamentos' | 'novospontos'>('dashboard');

  const abertosCount = tickets.filter(
    (t) => t.status === 'RECEBIDO_TRIAGEM' || t.status === 'TECNICO_ATRIBUIDO'
  ).length;

  const overdueCount = equipments.filter(
    (e) => e.daysRemaining <= 30 && e.status_instalacao === 'INSTALADO_EM_OPERACAO'
  ).length;

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-950 text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Header Contract Badge */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <Building className="w-3.5 h-3.5 text-sky-400" />
              <span>Big Ar • Centro Operacional</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Gestão PMOC & Climatização</p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{clients.length} Clientes • {equipments.length} Aparelhos</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Inicial</span>
              </div>
            </button>

            {/* Módulo Clientes 360° */}
            <button
              id="tab-clientes"
              onClick={() => setActiveTab('clientes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'clientes'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Gestão de Clientes (360°)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 font-bold border border-sky-800/50">
                {clients.length}
              </span>
            </button>

            {/* Esteira de Ordens de Serviço (Kanban) */}
            <button
              id="tab-kanban"
              onClick={() => setActiveTab('kanban')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'kanban'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Kanban className="w-4 h-4" />
                <span>Esteira de OS (Kanban)</span>
              </div>
              {abertosCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                  {abertosCount}
                </span>
              )}
            </button>

            {/* Módulo de Equipamentos & Etiquetas QR */}
            <button
              id="tab-equipamentos"
              onClick={() => setActiveTab('equipamentos')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'equipamentos'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Equipamentos & QR Code</span>
              </div>
              {overdueCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {overdueCount}
                </span>
              )}
            </button>

            {/* Solicitações de Novos Pontos */}
            <button
              onClick={() => setActiveTab('novospontos')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'novospontos'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4" />
                <span>Novos Pontos de Ar</span>
              </div>
              {newPoints.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                  {newPoints.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Technician In Charge */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
              CS
            </div>
            <div>
              <span className="font-bold text-slate-200 block leading-tight">Eng. Carlos Eduardo Silva</span>
              <span className="text-[10px] text-slate-500">CREA-SP 50698421-D</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            Responsável Técnico PMOC • Big Ar
          </p>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Mobile Submenu Bar */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-3 mb-4 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              activeTab === 'dashboard' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              activeTab === 'clientes' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Clientes 360° ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              activeTab === 'kanban' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Kanban OS ({abertosCount})
          </button>
          <button
            onClick={() => setActiveTab('equipamentos')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              activeTab === 'equipamentos' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Equipamentos ({equipments.length})
          </button>
        </div>

        {/* Tab Router */}
        {activeTab === 'dashboard' && (
          <CrmDashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'clientes' && <Client360View />}
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'equipamentos' && <EquipmentTable />}
        {activeTab === 'novospontos' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white">Solicitações de Novos Pontos de Ar-Condicionado</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demandas registradas pelos clientes para instalação de novos aparelhos e expansão térmica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newPoints.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-400 text-xs">{item.id}</span>
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.unitLocation}</h4>
                  <p className="text-xs text-slate-400 italic">&quot;{item.justification}&quot;</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <div>Área: <strong className="text-white">{item.roomSizeM2} m²</strong></div>
                    <div>Pessoas: <strong className="text-white">{item.peopleCount}</strong></div>
                    <div>Sugerido: <strong className="text-sky-400">{item.estimatedBtu.toLocaleString('pt-BR')} BTUs</strong></div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Solicitado por: {item.requesterName}</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CRM Modals */}
      <CompleteOsModal />
      <QrTagModal />
      <BatchPrintModal />
      <PmocReportModal />
      <OpenTicketModal />
      <EquipmentDetailModal />
    </div>
  );
}
