'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Clock,
  FileCheck2,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Tag,
  Building,
  Calendar,
  Wrench,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function EquipmentDetailModal() {
  const {
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedEquipment,
    setIsReportModalOpen,
    setIsOpenTicketModalOpen,
    setIsNewPointModalOpen,
    setQrTagEquipment,
    setIsQrTagModalOpen,
    setPrefillServiceType,
  } = useApp();

  if (!isDetailModalOpen || !selectedEquipment) return null;

  const isOverdue = selectedEquipment.status === 'overdue' || selectedEquipment.daysRemaining <= 0;
  const isWarning = selectedEquipment.status === 'warning' && !isOverdue;
  const isOk = !isOverdue && !isWarning;

  // 6-month cycle percentage (180 days total)
  const remainingDays = Math.max(0, selectedEquipment.daysRemaining);
  const cyclePercent = Math.min(100, Math.max(0, Math.round((remainingDays / 180) * 100)));

  const handleOpenCorrectiveTicket = () => {
    setPrefillServiceType('MANUTENCAO_CORRETIVA_DEFEITO');
    setIsDetailModalOpen(false);
    setIsOpenTicketModalOpen(true);
  };

  const handleOpenPreventiveTicket = () => {
    setPrefillServiceType('MANUTENCAO_PREVENTIVA_6_MESES');
    setIsDetailModalOpen(false);
    setIsOpenTicketModalOpen(true);
  };

  const handleOpenQrTag = () => {
    setQrTagEquipment(selectedEquipment);
    setIsQrTagModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col my-6">
        {/* Header (Sticky) */}
        <div className="sticky top-0 z-20 p-4 bg-[#0a192f] border-b border-blue-900 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                isOverdue
                  ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                  : isWarning
                  ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                  : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-mono">
                  {selectedEquipment.tag_patrimonio}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-800">
                  {selectedEquipment.tipo_unidade}
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">{selectedEquipment.endereco_apelido}</p>
            </div>
          </div>

          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh] text-slate-800">
          {/* Main Equipment Title & Location */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900 mb-1">{selectedEquipment.name}</h4>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs">
              <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{selectedEquipment.location}</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Tag / Código: <strong className="text-slate-900">{selectedEquipment.tag_patrimonio || selectedEquipment.patrimonyCode}</strong></span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedEquipment.status_instalacao === 'INSTALADO_EM_OPERACAO'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {selectedEquipment.status_instalacao === 'INSTALADO_EM_OPERACAO' ? '✓ Em Operação' : 'Instalação Agendada'}
              </span>
            </div>
          </div>

          {/* 6-Month Visual Preventive Cycle Gauge / Clock */}
          <div
            className={`p-4 rounded-2xl border relative overflow-hidden ${
              isOverdue
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : isWarning
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-blue-50/60 border-blue-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${
                    isOverdue ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-blue-700'
                  }`}
                />
                <span className="font-bold text-xs uppercase tracking-wide text-slate-900">
                  Ciclo Preventivo Semestral (6 Meses)
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isOverdue
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : isWarning
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isOverdue
                  ? `Vencido há ${Math.abs(selectedEquipment.daysRemaining)} dias`
                  : isWarning
                  ? `Atenção: ${selectedEquipment.daysRemaining} dias restantes`
                  : `Em dia (${selectedEquipment.daysRemaining} dias restantes)`}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 p-0.5 border border-slate-300 mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverdue
                    ? 'bg-rose-500'
                    : isWarning
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-blue-600 to-sky-500'
                }`}
                style={{ width: `${isOverdue ? 100 : cyclePercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Última Limpeza/Revisão: <strong className="text-slate-800">{selectedEquipment.data_ultima_manutencao}</strong></span>
              <span>Próxima Preventiva: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>{selectedEquipment.data_proxima_preventiva}</strong></span>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div>
            <h5 className="text-[11px] font-bold uppercase text-slate-600 tracking-wider mb-2">
              Especificações Técnicas
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Marca / Modelo</span>
                <span className="font-semibold text-slate-800">{selectedEquipment.marca} {selectedEquipment.modelo}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Capacidade Térmica</span>
                <span className="font-semibold text-slate-800">{selectedEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Tipo de Unidade</span>
                <span className="font-semibold text-slate-800">{selectedEquipment.tipo_unidade}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Data de Instalação</span>
                <span className="font-semibold text-slate-800">{selectedEquipment.data_instalacao}</span>
              </div>
            </div>
          </div>

          {/* QR Code and PMOC buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenQrTag}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold flex items-center justify-center gap-1.5 transition text-xs shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Etiqueta QR Code</span>
            </button>

            <button
              onClick={() => {
                setIsDetailModalOpen(false);
                setIsReportModalOpen(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold flex items-center justify-center gap-1.5 transition text-xs shadow-2xs"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Laudo do PMOC</span>
            </button>
          </div>

          {/* Core Action Triggers */}
          <div className="pt-2 space-y-2">
            {/* Action 1: Preventive 6-Month Review */}
            <button
              onClick={handleOpenPreventiveTicket}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 text-xs"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Agendar Revisão Preventiva (6 Meses)</span>
            </button>

            {/* Action 2: Corrective Defect Ticket */}
            <button
              onClick={handleOpenCorrectiveTicket}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold flex items-center justify-center gap-2 transition shadow-md shadow-rose-600/25 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-white" />
              <span>🚨 Chamar Suporte / Reparo Imediato</span>
            </button>

            {/* Action 3: Request New AC point */}
            <button
              onClick={() => {
                setIsDetailModalOpen(false);
                setIsNewPointModalOpen(true);
              }}
              className="w-full py-2 px-4 rounded-xl bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 hover:text-blue-950 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>➕ Solicitar Novo Ponto de Ar-Condicionado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
