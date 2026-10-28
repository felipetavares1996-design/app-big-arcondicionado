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
    <header className="sticky top-0 z-40 w-full bg-[#0a192f] backdrop-blur-md border-b border-blue-900/40 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Organization & Contract Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center font-black text-xl tracking-wider text-white shadow-md">
            BIG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide text-white">BIG AR CONDICIONADO</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" /> PMOC Certificado
              </span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="font-semibold text-white">{activeClient.nome_completo}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{activeClient.tipo_cliente === 'PF' ? 'Residencial' : 'Corporativo / PMOC'}</span>
            </div>
          </div>
        </div>

        {/* Center: The Mandatory View Switcher */}
        <div className="flex items-center bg-[#071324] p-1 rounded-xl border border-blue-900/50 shadow-inner">
          <span className="text-xs font-medium text-slate-300 px-2.5 hidden md:inline">
            Alternar Modo:
          </span>

          <button
            id="btn-view-client"
            onClick={() => setViewMode('client')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'client'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-300" />
            <span>📱 App do Cliente Final</span>
          </button>

          <button
            id="btn-view-crm"
            onClick={() => setViewMode('crm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'crm'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-300" />
            <span>💻 CRM Operacional da Assistência</span>
          </button>

          <button
            id="btn-view-split"
            onClick={() => setViewMode('split')}
            title="Exibir lado a lado para apresentação comercial"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
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
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition shadow-xs"
            title="Simular leitura da etiqueta QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Ler QR Code</span>
          </button>

          {/* Overdue / Alert Indicator */}
          {overdueCount > 0 && (
            <div
              className="flex items-center gap-1 bg-rose-500/20 border border-rose-500/40 text-rose-200 px-2 py-1 rounded-lg text-xs font-bold"
              title={`${overdueCount} aparelho(s) com atenção ou PMOC vencido`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
              <span>{overdueCount} Críticos</span>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Resetar dados da demonstração"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
