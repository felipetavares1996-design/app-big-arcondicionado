'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  AlertCircle,
  Camera,
  Check,
  Wrench,
  ShieldAlert,
  Calendar,
  Sparkles,
  Clock,
} from 'lucide-react';
import { OrderPriority, ServiceOrderType } from '@/types';

export default function OpenTicketModal() {
  const {
    isOpenTicketModalOpen,
    setIsOpenTicketModalOpen,
    selectedEquipment,
    setSelectedEquipment,
    equipments,
    activeClient,
    openTicketFromClient,
    prefillServiceType,
  } = useApp();

  const clientEquipments = equipments.filter((eq) => eq.cliente_id === activeClient.id);
  const currentEquipment = selectedEquipment || clientEquipments[0];

  const [tipoServico, setTipoServico] = useState<ServiceOrderType>(prefillServiceType);
  const [priority, setPriority] = useState<OrderPriority>('MEDIA');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [simulatedPhoto, setSimulatedPhoto] = useState(false);

  // Sync with prefill intent whenever modal opens
  useEffect(() => {
    if (isOpenTicketModalOpen) {
      setTipoServico(prefillServiceType);
      if (prefillServiceType === 'MANUTENCAO_PREVENTIVA_6_MESES') {
        setDescription(
          'Revisão semestral do ciclo de 6 meses preventiva. Higienização química antibacteriana e checagem de dreno e filtros.'
        );
      }
    }
  }, [isOpenTicketModalOpen, prefillServiceType]);

  if (!isOpenTicketModalOpen || !currentEquipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    openTicketFromClient({
      equipmentId: currentEquipment.id,
      tipo_servico: tipoServico,
      prioridade: priority,
      relato_cliente: description,
      preferencia_data: preferredDate || new Date().toISOString().split('T')[0],
      fotos_problema: simulatedPhoto
        ? ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80']
        : [],
    });

    setDescription('');
    setSimulatedPhoto(false);
    setIsOpenTicketModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#0a192f] border-b border-blue-900 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-800/60 text-blue-200 flex items-center justify-center border border-blue-700">
              <Wrench className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Solicitação de Atendimento Técnico</h3>
              <p className="text-[11px] text-blue-200/80">Cliente: {activeClient.nome_completo}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpenTicketModalOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Equipment Identification Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Aparelho Selecionado</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-blue-700 font-mono text-sm">{currentEquipment.tag_patrimonio}</span>
              <span className="text-slate-800 font-semibold">
                ({currentEquipment.marca} {currentEquipment.capacidade_btu.toLocaleString('pt-BR')} BTU)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{currentEquipment.endereco_apelido} • {currentEquipment.name}</p>
          </div>

          {clientEquipments.length > 1 && (
            <select
              value={currentEquipment.id}
              onChange={(e) => {
                const found = clientEquipments.find((eq) => eq.id === e.target.value);
                if (found) setSelectedEquipment(found);
              }}
              className="bg-white border border-slate-300 text-slate-800 text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600 max-w-[220px]"
            >
              {clientEquipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.tag_patrimonio} - {eq.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Service Type Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Tipo de Serviço Desejado:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipoServico('MANUTENCAO_PREVENTIVA_6_MESES')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  tipoServico === 'MANUTENCAO_PREVENTIVA_6_MESES'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Revisão 6 Meses</span>
                <span className="text-[9px] opacity-80 font-normal">Prevenção / PMOC</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoServico('MANUTENCAO_CORRETIVA_DEFEITO')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  tipoServico === 'MANUTENCAO_CORRETIVA_DEFEITO'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Reparo / Defeito</span>
                <span className="text-[9px] opacity-80 font-normal">Não gela / Vazando</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoServico('INSTALACAO_NOVO_APARELHO')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  tipoServico === 'INSTALACAO_NOVO_APARELHO'
                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-[11px]">Nova Instalação</span>
                <span className="text-[9px] opacity-80 font-normal">Novo Ponto</span>
              </button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Urgência do Atendimento:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['BAIXA', 'MEDIA', 'ALTA_URGENCIA'] as OrderPriority[]).map((p) => {
                const isSelected = priority === p;
                let colorClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                if (isSelected) {
                  if (p === 'ALTA_URGENCIA') colorClass = 'bg-rose-600 border-rose-500 text-white font-bold shadow-xs';
                  else if (p === 'MEDIA') colorClass = 'bg-amber-600 border-amber-500 text-white font-bold shadow-xs';
                  else colorClass = 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-xs';
                }

                const label = p === 'ALTA_URGENCIA' ? '🚨 Alta / Urgência' : p === 'MEDIA' ? 'Média' : 'Baixa';

                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`p-2 rounded-xl text-center border transition ${colorClass}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Relato do Cliente / Sintoma Observado:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema ou solicitação..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none text-xs"
            />
          </div>

          {/* Preferred Date & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Data de Preferência para Visita:
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Foto do Problema / Aparelho:
              </label>
              <button
                type="button"
                onClick={() => setSimulatedPhoto(!simulatedPhoto)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition ${
                  simulatedPhoto
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>{simulatedPhoto ? '✓ Foto Anexada (evidência.jpg)' : 'Simular Foto'}</span>
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpenTicketModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-bold shadow-md flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Abertura de OS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
