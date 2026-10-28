'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  Clock,
  Calendar,
  ShieldCheck,
  Zap,
  Wind,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

export default function PreventiveAlertModal() {
  const {
    isPreventiveAlertOpen,
    setIsPreventiveAlertOpen,
    preventiveAlertEquipment,
    setSelectedEquipment,
    setIsOpenTicketModalOpen,
    setPrefillServiceType,
  } = useApp();

  if (!isPreventiveAlertOpen || !preventiveAlertEquipment) return null;

  const isOverdue = preventiveAlertEquipment.daysRemaining <= 0;
  const daysText = isOverdue
    ? `vencido há ${Math.abs(preventiveAlertEquipment.daysRemaining)} dias`
    : `restam apenas ${preventiveAlertEquipment.daysRemaining} dias`;

  const handleScheduleNow = () => {
    setSelectedEquipment(preventiveAlertEquipment);
    setPrefillServiceType('MANUTENCAO_PREVENTIVA_6_MESES');
    setIsPreventiveAlertOpen(false);
    setIsOpenTicketModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="p-4 bg-[#0a192f] border-b border-blue-900 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-inner">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                Revisão Semestral PMOC
              </span>
              <h3 className="text-sm font-extrabold text-white">
                Alerta de Manutenção Preventiva (6 Meses)
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsPreventiveAlertOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Warning Callout */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-amber-950 text-xs leading-relaxed">
              ⚠️ <strong>Atenção:</strong> Seu ar-condicionado{' '}
              <strong className="text-amber-800">
                {preventiveAlertEquipment.marca} ({preventiveAlertEquipment.location})
              </strong>{' '}
              atingiu o prazo do ciclo de 6 meses ({daysText}) para garantir ar puro, evitar odores e manter a máxima eficiência energética.
            </p>
          </div>

          {/* Equipment Snapshot Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Equipamento:</span>
              <span className="font-mono font-bold text-blue-700">
                {preventiveAlertEquipment.tag_patrimonio}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Recinto / Cômodo:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {preventiveAlertEquipment.endereco_apelido}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Capacidade:</span>
              <span className="text-slate-700">
                {preventiveAlertEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs • {preventiveAlertEquipment.tipo_unidade}
              </span>
            </div>

            {/* Cycle Bar */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Ciclo Semestral:
                </span>
                <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-amber-800'}>
                  {preventiveAlertEquipment.daysRemaining} dias restantes
                </strong>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                <div
                  className={`h-full rounded-full ${
                    isOverdue
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(10, (preventiveAlertEquipment.daysRemaining / 180) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Benefits bullets */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-slate-700">
              <Wind className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Ar puro sem ácaros</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Economia de até 30%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleScheduleNow}
              className="w-full py-3 px-4 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Agendar Manutenção Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPreventiveAlertOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Lembrar Mais Tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
