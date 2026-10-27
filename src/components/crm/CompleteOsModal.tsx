'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, CheckCircle2, Wrench, User, Calendar, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export default function CompleteOsModal() {
  const {
    isCompleteOsModalOpen,
    setIsCompleteOsModalOpen,
    ticketToComplete,
    completeOs,
  } = useApp();

  const [technician, setTechnician] = useState('Carlos Eduardo Silva (Líder Técnico - CREA 50698421-D)');
  const [partsReplaced, setPartsReplaced] = useState('Higienização Química Biocida + Troca de Filtro HEPA + Carga de Gás 350g');
  const [serviceReport, setServiceReport] = useState('Desmontagem completa da carenagem, limpeza sob pressão da serpentina e desobstrução da linha de dreno. Teste de estanqueidade e aferição de rendimento térmico em 21°C.');
  const [renewCycle, setRenewCycle] = useState(true);

  if (!isCompleteOsModalOpen || !ticketToComplete) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    completeOs({
      ticketId: ticketToComplete.id,
      tecnico_nome: technician,
      pecas_utilizadas: partsReplaced,
      relatorio_tecnico: serviceReport,
      renewCycle,
    });

    setIsCompleteOsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-emerald-950/40 border-b border-emerald-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Conclusão e Baixa de Ordem de Serviço</h3>
              <p className="text-[11px] text-emerald-300/80">Fechamento técnico com emissão de histórico PMOC</p>
            </div>
          </div>
          <button
            onClick={() => setIsCompleteOsModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Identification Box */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-sm text-sky-400">{ticketToComplete.id}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold">
              {ticketToComplete.priority}
            </span>
          </div>
          <p className="font-bold text-slate-200 mt-1">{ticketToComplete.title}</p>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
            <span>Aparelho: <strong className="text-white">{ticketToComplete.equipmentId}</strong></span>
            <span>•</span>
            <span>{ticketToComplete.location}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Technician selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Técnico Mecânico Responsável:
            </label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Carlos Eduardo Silva (Líder Técnico - CREA 50698421-D)">
                Carlos Eduardo Silva (Líder Técnico - CREA 50698421-D)
              </option>
              <option value="André Luiz Santos (Técnico Mecânico PMOC)">
                André Luiz Santos (Técnico Mecânico PMOC)
              </option>
              <option value="Rodrigo Mendes (Técnico em Refrigeração)">
                Rodrigo Mendes (Técnico em Refrigeração)
              </option>
            </select>
          </div>

          {/* Parts Replaced */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Peças, Filtros e Insumos Trocados:
            </label>
            <input
              type="text"
              required
              value={partsReplaced}
              onChange={(e) => setPartsReplaced(e.target.value)}
              placeholder="Ex: Filtro antibacteriano, capacitor 35uF, 400g gás R410A..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Descrição do Serviço Executado:
            </label>
            <textarea
              required
              rows={3}
              value={serviceReport}
              onChange={(e) => setServiceReport(e.target.value)}
              placeholder="Descreva as ações realizadas no aparelho..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none text-xs"
            />
          </div>

          {/* Automatic PMOC 6-month cycle renewal checkbox */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="renewCycleCheck"
              checked={renewCycle}
              onChange={(e) => setRenewCycle(e.target.checked)}
              className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="renewCycleCheck" className="text-xs text-slate-200 cursor-pointer">
              <strong className="text-emerald-400 block font-bold">
                ✓ Atualizar ciclo do PMOC automaticamente (+6 meses / 180 dias)
              </strong>
              <span className="text-[11px] text-slate-400">
                Atualiza a data da última manutenção para hoje, reestabelece o status &apos;Verde&apos; do aparelho no app do cliente e recalcula o vencimento.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCompleteOsModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir e Salvar Histórico</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
