'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import TopSwitcher from '@/components/TopSwitcher';
import MobileAppView from '@/components/client/MobileAppView';
import CrmView from '@/components/crm/CrmView';

export default function HomePage() {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Fixed Demonstration Switcher */}
      <TopSwitcher />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {viewMode === 'client' && (
          <div className="animate-in fade-in duration-300">
            <MobileAppView />
          </div>
        )}

        {viewMode === 'crm' && (
          <div className="animate-in fade-in duration-300">
            <CrmView />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="p-4 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1700px] mx-auto animate-in fade-in duration-300">
            {/* Left: Mobile App Simulator */}
            <div className="xl:col-span-5 flex flex-col items-center">
              <div className="w-full bg-white p-3 rounded-2xl border border-slate-200 mb-3 text-center shadow-xs">
                <span className="text-xs font-bold text-blue-900">📱 App do Cliente Final (Residencial & Corporativo)</span>
                <p className="text-[11px] text-slate-500">Interações aqui refletem instantaneamente no CRM operacional à direita</p>
              </div>
              <MobileAppView />
            </div>

            {/* Right: CRM Desktop */}
            <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200 p-2 overflow-hidden shadow-sm">
              <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 text-center">
                <span className="text-xs font-bold text-blue-950">💻 CRM Operacional da Assistência Técnica</span>
                <p className="text-[11px] text-slate-500">Gestão 360° de clientes, esteira Kanban de OS e controle de etiquetas físicas</p>
              </div>
              <CrmView />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
