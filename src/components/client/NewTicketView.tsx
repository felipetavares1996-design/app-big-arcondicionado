'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wrench,
  ShieldCheck,
  Zap,
  Clock,
  Calendar,
  AlertTriangle,
  Camera,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  Check,
  Building,
} from 'lucide-react';
import { OrderPriority, ServiceOrderType } from '@/types';

interface NewTicketViewProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function NewTicketView({ onCancel, onSuccess }: NewTicketViewProps) {
  const {
    activeClient,
    equipments,
    selectedEquipment,
    setSelectedEquipment,
    openTicketFromClient,
    prefillServiceType,
    setIsScannerOpen,
  } = useApp();

  // Equipments of this client
  const clientEquipments = equipments.filter((eq) => eq.cliente_id === activeClient.id);

  // Selected equipment ID (defaults to selectedEquipment or first client equipment)
  const [selectedEqId, setSelectedEqId] = useState<string>(
    selectedEquipment && selectedEquipment.cliente_id === activeClient.id
      ? selectedEquipment.id
      : clientEquipments[0]?.id || ''
  );

  const [tipoServico, setTipoServico] = useState<ServiceOrderType>(
    prefillServiceType || 'MANUTENCAO_CORRETIVA_DEFEITO'
  );
  const [prioridade, setPrioridade] = useState<OrderPriority>('MEDIA');
  const [descricao, setDescricao] = useState('');
  const [selectedShift, setSelectedShift] = useState<'MANHA' | 'TARDE' | 'COMERCIAL'>('MANHA');
  const [preferenciaData, setPreferenciaData] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [simulatedPhoto, setSimulatedPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The active equipment selected for this ticket
  const currentEquipment = clientEquipments.find((eq) => eq.id === selectedEqId) || clientEquipments[0];

  // Quick problem chips
  const defectPresets = [
    { label: '❄️ Não gela / Fraco', text: 'Ar-condicionado está ventilando normalmente porém não gela o ambiente.' },
    { label: '💧 Pingando água', text: 'Evaporadora está pingando água na parede / piso pelo dreno obstruído.' },
    { label: '🔊 Barulho no motor', text: 'Ruído estridente / vibração excessiva vindo da condensadora/evaporadora.' },
    { label: '👃 Cheiro de mofo', text: 'Mau cheiro e odor de mofo/poeira forte saindo das aletas ao ligar.' },
    { label: '⚡ Desarmando disjuntor', text: 'Ao ligar o ar condicionado, o disjuntor elétrico desarma imediatamente.' },
    { label: '📱 Controle não responde', text: 'Aparelho não responde aos comandos do controle remoto nem liga no display.' },
  ];

  const handleApplyPreset = (presetText: string) => {
    if (!descricao.trim()) {
      setDescricao(presetText);
    } else if (!descricao.includes(presetText)) {
      setDescricao((prev) => `${prev.trim()} ${presetText}`);
    }
  };

  const handleSelectServiceType = (type: ServiceOrderType) => {
    setTipoServico(type);
    if (type === 'MANUTENCAO_PREVENTIVA_6_MESES') {
      if (!descricao.trim() || descricao.startsWith('Ar-condicionado está ventilando')) {
        setDescricao('Revisão semestral do ciclo de 6 meses preventiva PMOC. Higienização química antibacteriana, limpeza de filtros, verificação de dreno e pressão de gás.');
      }
    } else if (type === 'INSTALACAO_NOVO_APARELHO') {
      if (!descricao.trim()) {
        setDescricao('Solicitação de agendamento de nova instalação / remanejamento com passagem de tubulação de cobre e cabeamento.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setIsSubmitting(true);

    const shiftText =
      selectedShift === 'MANHA'
        ? 'Período: Manhã (08h às 12h)'
        : selectedShift === 'TARDE'
        ? 'Período: Tarde (13h às 18h)'
        : 'Horário Comercial';

    const fullDescription = `${descricao.trim()} [Preferência: ${preferenciaData} - ${shiftText}]`;

    setTimeout(() => {
      openTicketFromClient({
        equipmentId: currentEquipment ? currentEquipment.id : clientEquipments[0]?.id || '',
        tipo_servico: tipoServico,
        prioridade,
        relato_cliente: fullDescription,
        preferencia_data: preferenciaData,
        fotos_problema: simulatedPhoto
          ? ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80']
          : [],
      });

      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 300);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#0a192f] p-3.5 rounded-2xl border border-blue-900 flex items-center justify-between shadow-sm text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Solicitar Novo Chamado
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                SLA Express
              </span>
            </div>
            <p className="text-[10px] text-blue-200/80">
              Abertura de Ordem de Serviço técnica para {activeClient.nome_completo}
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            title="Voltar para Aparelhos"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Step 1: Select Equipment */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-extrabold border border-blue-200">
                1
              </span>
              Selecione o Aparelho que Precisa de Atenção:
            </span>
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="text-[10px] text-blue-700 hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>Escanear QR</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>
          </label>

          {clientEquipments.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              Nenhum ar-condicionado cadastrado para este cliente.
            </div>
          ) : (
            <div className="space-y-2">
              <select
                id="select-equipment-ticket"
                value={selectedEqId}
                onChange={(e) => {
                  setSelectedEqId(e.target.value);
                  const found = clientEquipments.find((eq) => eq.id === e.target.value);
                  if (found) setSelectedEquipment(found);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
              >
                {clientEquipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    [{eq.tag_patrimonio}] {eq.name} — {eq.endereco_apelido} ({eq.marca} {eq.capacidade_btu.toLocaleString('pt-BR')} BTU)
                  </option>
                ))}
              </select>

              {/* Current equipment preview chip */}
              {currentEquipment && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 text-xs">
                        {currentEquipment.tag_patrimonio}
                      </span>
                      <span className="text-slate-800 font-semibold">{currentEquipment.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {currentEquipment.endereco_apelido} • {currentEquipment.marca} {currentEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        currentEquipment.daysRemaining <= 0
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : currentEquipment.daysRemaining <= 30
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {currentEquipment.daysRemaining <= 0
                        ? 'PMOC Vencido'
                        : currentEquipment.daysRemaining <= 30
                        ? `Vence em ${currentEquipment.daysRemaining}d`
                        : `Em dia (${currentEquipment.daysRemaining}d)`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Service Type */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-extrabold border border-blue-200">
              2
            </span>
            Tipo de Atendimento Necessário:
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectServiceType('MANUTENCAO_CORRETIVA_DEFEITO')}
              className={`p-2.5 rounded-xl text-left border transition relative flex flex-col justify-between ${
                tipoServico === 'MANUTENCAO_CORRETIVA_DEFEITO'
                  ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <Wrench className={`w-4 h-4 mb-1.5 ${tipoServico === 'MANUTENCAO_CORRETIVA_DEFEITO' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="font-bold text-[11px] block leading-tight">Reparo / Defeito</span>
                <span className="text-[9px] opacity-80 leading-tight block mt-0.5">Não gela ou vazando</span>
              </div>
              {tipoServico === 'MANUTENCAO_CORRETIVA_DEFEITO' && (
                <div className="w-2 h-2 rounded-full bg-rose-500 self-end mt-1" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectServiceType('MANUTENCAO_PREVENTIVA_6_MESES')}
              className={`p-2.5 rounded-xl text-left border transition relative flex flex-col justify-between ${
                tipoServico === 'MANUTENCAO_PREVENTIVA_6_MESES'
                  ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <ShieldCheck className={`w-4 h-4 mb-1.5 ${tipoServico === 'MANUTENCAO_PREVENTIVA_6_MESES' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="font-bold text-[11px] block leading-tight">Revisão 6 Meses</span>
                <span className="text-[9px] opacity-80 leading-tight block mt-0.5">Higienização e PMOC</span>
              </div>
              {tipoServico === 'MANUTENCAO_PREVENTIVA_6_MESES' && (
                <div className="w-2 h-2 rounded-full bg-amber-500 self-end mt-1" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectServiceType('INSTALACAO_NOVO_APARELHO')}
              className={`p-2.5 rounded-xl text-left border transition relative flex flex-col justify-between ${
                tipoServico === 'INSTALACAO_NOVO_APARELHO'
                  ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <Zap className={`w-4 h-4 mb-1.5 ${tipoServico === 'INSTALACAO_NOVO_APARELHO' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="font-bold text-[11px] block leading-tight">Instalação</span>
                <span className="text-[9px] opacity-80 leading-tight block mt-0.5">Novo Ponto</span>
              </div>
              {tipoServico === 'INSTALACAO_NOVO_APARELHO' && (
                <div className="w-2 h-2 rounded-full bg-blue-600 self-end mt-1" />
              )}
            </button>
          </div>
        </div>

        {/* Step 3: Quick Problem Shortcuts */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Toque para Adicionar o Sintoma Rápido:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {defectPresets.map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleApplyPreset(preset.text)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-900 transition active:scale-95 flex items-center gap-1 font-medium"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Description textarea */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-extrabold border border-blue-200">
                3
              </span>
              Relato do Problema ou Observações:
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {descricao.length} caracteres
            </span>
          </label>
          <textarea
            id="input-ticket-description"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: O ar condicionado foi ligado pela manhã e parou de resfriar, apresentando barulho na condensadora externa..."
            required
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none leading-relaxed"
          />
        </div>

        {/* Step 5: Urgency & Scheduling */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Priority */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Urgência:
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['BAIXA', 'MEDIA', 'ALTA_URGENCIA'] as OrderPriority[]).map((p) => {
                const isSelected = prioridade === p;
                let activeStyle = '';
                if (p === 'ALTA_URGENCIA') activeStyle = isSelected ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-xs' : '';
                else if (p === 'MEDIA') activeStyle = isSelected ? 'bg-amber-600 text-white font-bold border-amber-500 shadow-xs' : '';
                else activeStyle = isSelected ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-xs' : '';

                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPrioridade(p)}
                    className={`py-1.5 rounded-lg text-center text-[10px] border transition ${
                      isSelected
                        ? activeStyle
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p === 'ALTA_URGENCIA' ? 'Alta 🚨' : p === 'MEDIA' ? 'Média' : 'Baixa'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Date */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Data de Preferência:
            </label>
            <input
              type="date"
              value={preferenciaData}
              onChange={(e) => setPreferenciaData(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Turno / Shift Preference */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Melhor Turno para Receber o Técnico:
          </label>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setSelectedShift('MANHA')}
              className={`py-1.5 px-2 rounded-lg border transition ${
                selectedShift === 'MANHA'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Manhã (08h-12h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedShift('TARDE')}
              className={`py-1.5 px-2 rounded-lg border transition ${
                selectedShift === 'TARDE'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tarde (13h-18h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedShift('COMERCIAL')}
              className={`py-1.5 px-2 rounded-lg border transition ${
                selectedShift === 'COMERCIAL'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Dia Todo
            </button>
          </div>
        </div>

        {/* Simulated Photo Attachment */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setSimulatedPhoto(!simulatedPhoto)}
            className={`w-full p-2.5 rounded-xl border border-dashed transition flex items-center justify-between text-xs ${
              simulatedPhoto
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>
                {simulatedPhoto ? 'Foto anexada com sucesso (foto_defeito.jpg)' : 'Anexar Foto da Evaporadora / Defeito'}
              </span>
            </div>
            {simulatedPhoto ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Anexo OK
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Opcional</span>
            )}
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2 space-y-2">
          <button
            id="btn-submit-ticket"
            type="submit"
            disabled={isSubmitting || !descricao.trim()}
            className="w-full py-3 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-extrabold text-xs shadow-md transition transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Gerando Protocolo de O.S...</span>
            ) : (
              <>
                <Wrench className="w-4 h-4" />
                <span>Confirmar e Abrir Chamado</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500">
            Ao confirmar, uma nova O.S. será gerada no CRM e o fiscal/técnico será notificado.
          </p>
        </div>
      </form>
    </div>
  );
}
