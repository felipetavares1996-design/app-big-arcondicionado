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
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Organization & Contract Context */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center font-black text-base sm:text-xl tracking-wider text-white shadow-md shrink-0">
            BIG
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white truncate">BIG AR CONDICIONADO</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full shrink-0">
                <Award className="w-3 h-3" /> PMOC Certificado
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="font-semibold text-white truncate">{activeClient.nome_completo}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 shrink-0">{activeClient.tipo_cliente === 'PF' ? 'Residencial' : 'Corporativo'}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: View Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-[#071324] p-0.5 sm:p-1 rounded-xl border border-blue-900/50 shadow-inner">
            <button
              id="btn-view-client"
              onClick={() => setViewMode('client')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
                viewMode === 'client'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">📱 App do Cliente</span>
              <span className="sm:hidden">App</span>
            </button>

            <button
              id="btn-view-crm"
              onClick={() => setViewMode('crm')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
                viewMode === 'crm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">💻 CRM Operacional</span>
              <span className="sm:hidden">CRM</span>
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
              <span>Split</span>
            </button>
          </div>

          {/* Quick Scanner Trigger */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition shadow-xs"
            title="Simular leitura da etiqueta QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Ler QR</span>
          </button>

          {/* Overdue / Alert Indicator */}
          {overdueCount > 0 && (
            <div
              className="hidden md:flex items-center gap-1 bg-rose-500/20 border border-rose-500/40 text-rose-200 px-2 py-1 rounded-lg text-xs font-bold"
              title={`${overdueCount} aparelho(s) com atenção ou PMOC vencido`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
              <span>{overdueCount} Críticos</span>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Resetar dados da demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
