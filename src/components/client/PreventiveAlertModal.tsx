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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 w-full max-w-md rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.25)] flex flex-col">
        {/* Top Glowing Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
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
            className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Warning Callout */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
            <p className="text-slate-200 text-xs leading-relaxed">
              ⚠️ <strong>Atenção:</strong> Seu ar-condicionado{' '}
              <strong className="text-amber-300">
                {preventiveAlertEquipment.marca} ({preventiveAlertEquipment.location})
              </strong>{' '}
              atingiu o prazo do ciclo de 6 meses ({daysText}) para garantir ar puro, evitar odores e manter a máxima eficiência energética.
            </p>
          </div>

          {/* Equipment Snapshot Card */}
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Equipamento:</span>
              <span className="font-mono font-bold text-sky-400">
                {preventiveAlertEquipment.tag_patrimonio}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Recinto / Cômodo:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">
                {preventiveAlertEquipment.endereco_apelido}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Capacidade:</span>
              <span className="text-slate-300">
                {preventiveAlertEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs • {preventiveAlertEquipment.tipo_unidade}
              </span>
            </div>

            {/* Cycle Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Ciclo Semestral:
                </span>
                <strong className={isOverdue ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                  {preventiveAlertEquipment.daysRemaining} dias restantes
                </strong>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
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
            <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Ar puro sem ácaros</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Economia de até 30%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleScheduleNow}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Agendar Manutenção Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPreventiveAlertOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
            >
              Lembrar Mais Tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
