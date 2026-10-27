'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Smartphone, LayoutDashboard, SplitSquareVertical, RotateCcw, QrCode, ShieldAlert, Award } from 'lucide-react';

export default function TopSwitcher() {
  const {
    viewMode,
    setViewMode,
    tickets,
    equipments,
    activeClient,
    resetDemoData,
    setIsScannerOpen,
  } = useApp();

  const openTicketsCount = tickets.filter((t) => t.status !== 'CONCLUIDO').length;
  const overdueCount = equipments.filter((e) => e.daysRemaining <= 15).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Organization & Contract Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center font-black text-xl tracking-wider text-white shadow-lg shadow-sky-500/20">
            BIG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">BIG AR CONDICIONADO</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" /> PMOC Certificado
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold text-slate-300">{activeClient.nome_completo}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{activeClient.tipo_cliente === 'PF' ? 'Residencial' : 'Corporativo / PMOC'}</span>
            </div>
          </div>
        </div>

        {/* Center: The Mandatory View Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          <span className="text-xs font-medium text-slate-400 px-2.5 hidden md:inline">
            Alternar Modo:
          </span>

          <button
            id="btn-view-client"
            onClick={() => setViewMode('client')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'client'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-200" />
            <span>📱 App do Cliente Final</span>
          </button>

          <button
            id="btn-view-crm"
            onClick={() => setViewMode('crm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'crm'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-200" />
            <span>💻 CRM Operacional da Assistência</span>
          </button>

          <button
            id="btn-view-split"
            onClick={() => setViewMode('split')}
            title="Exibir lado a lado para apresentação comercial"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-slate-800 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Lado a Lado</span>
          </button>
        </div>

        {/* Right: Quick Demo Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Scanner Trigger */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
            title="Simular leitura da etiqueta QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Ler QR Code</span>
          </button>

          {/* Overdue / Alert Indicator */}
          {overdueCount > 0 && (
            <div
              className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-1 rounded-lg text-xs font-medium"
              title={`${overdueCount} aparelho(s) com atenção ou PMOC vencido`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{overdueCount} Críticos</span>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Resetar dados da demonstração"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
