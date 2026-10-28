'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  PlusCircle,
  Calculator,
  Home,
  Snowflake,
  Flame,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CicloType, TecnologiaType } from '@/types';

const POPULAR_BRANDS = [
  'Daikin',
  'LG',
  'Midea',
  'Samsung',
  'Gree',
  'Fujitsu',
  'Electrolux',
  'Consul',
  'Elgin',
  'Carrier',
  'Outra',
];

const ROOM_OPTIONS = [
  'Quarto Casal',
  'Sala de Estar',
  'Quarto dos Filhos',
  'Escritório / Home Office',
  'Varanda Gourmet',
  'Suíte Hóspedes',
  'Cozinha / Copa',
  'Outro Cômodo',
];

const BTU_OPTIONS = [9000, 12000, 18000, 24000, 30000, 36000];

export default function NewPointModal() {
  const {
    isNewPointModalOpen,
    setIsNewPointModalOpen,
    activeClient,
    addNewEquipment,
    showToast,
  } = useApp();

  // Form states - Strictly B2C & Residential
  const [nomeAparelho, setNomeAparelho] = useState('');
  const [comodo, setComodo] = useState('Quarto Casal');
  const [marca, setMarca] = useState('Daikin');
  const [capacidadeBtu, setCapacidadeBtu] = useState<number>(12000);
  const [tecnologia, setTecnologia] = useState<TecnologiaType>('INVERTER');
  const [ciclo, setCiclo] = useState<CicloType>('FRIO');
  const [enderecoApelido, setEnderecoApelido] = useState(
    activeClient.enderecos[0]?.apelido || 'Residência Principal'
  );
  const [observacoes, setObservacoes] = useState('');

  // Sizing & Thermal Calculator accordion
  const [showCalculator, setShowCalculator] = useState(false);
  const [roomSizeM2, setRoomSizeM2] = useState(20);
  const [peopleCount, setPeopleCount] = useState(2);
  const [sunExposure, setSunExposure] = useState<'Manhã' | 'Tarde' | 'Dia todo' | 'Sombra'>('Tarde');

  if (!isNewPointModalOpen) return null;

  // Real-time calculation for room size
  const baseBtu = roomSizeM2 * 600 + peopleCount * 600;
  const sunFactor = sunExposure === 'Tarde' || sunExposure === 'Dia todo' ? 1.25 : 1.0;
  const calculatedBtu = Math.round((baseBtu * sunFactor) / 1000) * 1000;
  
  const recommendedBtu =
    calculatedBtu <= 9000
      ? 9000
      : calculatedBtu <= 12000
      ? 12000
      : calculatedBtu <= 18000
      ? 18000
      : calculatedBtu <= 24000
      ? 24000
      : calculatedBtu <= 30000
      ? 30000
      : 36000;

  const handleApplyCalculatedBtu = () => {
    setCapacidadeBtu(recommendedBtu);
    showToast(
      'Capacidade Aplicada!',
      `${recommendedBtu.toLocaleString('pt-BR')} BTUs selecionado com base em ${roomSizeM2}m² e sol da ${sunExposure}.`,
      'info'
    );
  };

  const handleQuickRoomPick = (room: string) => {
    setComodo(room);
    if (!nomeAparelho || ROOM_OPTIONS.some((r) => nomeAparelho.includes(r))) {
      setNomeAparelho(`Split ${room}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalNome = nomeAparelho.trim() || `Ar-Condicionado ${comodo}`;

    addNewEquipment({
      nome_aparelho: finalNome,
      comodo: comodo.trim() || 'Ambiente',
      marca,
      capacidade_btu: capacidadeBtu,
      ciclo,
      tecnologia,
      endereco_apelido: enderecoApelido,
      observacoes: observacoes.trim() || undefined,
    });

    setIsNewPointModalOpen(false);

    // Reset default form values
    setNomeAparelho('');
    setObservacoes('');
    setShowCalculator(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-800">
        {/* Header - Deep Navy Blue */}
        <div className="p-4 bg-[#0a192f] border-b border-blue-950 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Cadastrar Novo Ar-Condicionado
                </h3>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-400/30">
                  Residencial / B2C
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Adicione o aparelho da sua casa para histórico, manutenção e QR Code
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewPointModalOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">
            {/* Imóvel Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-800" />
              Imóvel / Endereço:
            </label>
            <select
              value={enderecoApelido}
              onChange={(e) => setEnderecoApelido(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600 text-xs shadow-2xs font-medium"
            >
              {activeClient.enderecos.map((end) => (
                <option key={end.id} value={end.apelido}>
                  🏠 {end.apelido} ({end.cidade})
                </option>
              ))}
            </select>
          </div>

          {/* Cômodo e Apelido */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold">
              Cômodo / Ambiente onde está instalado:
            </label>
            
            {/* Quick Room Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {ROOM_OPTIONS.slice(0, 5).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleQuickRoomPick(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    comodo === r
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1 font-medium">Selecionar Cômodo:</span>
                <select
                  value={comodo}
                  onChange={(e) => handleQuickRoomPick(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs shadow-2xs"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] text-slate-500 mb-1 font-medium">
                  Identificação / Apelido do Aparelho:
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex: Split Quarto Casal, Ar da Sala"
                  value={nomeAparelho}
                  onChange={(e) => setNomeAparelho(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Marca e Capacidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Marca / Fabricante:
              </label>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs shadow-2xs font-medium"
              >
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Capacidade (BTUs):
              </label>
              <select
                value={capacidadeBtu}
                onChange={(e) => setCapacidadeBtu(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs shadow-2xs font-medium"
              >
                {BTU_OPTIONS.map((btu) => (
                  <option key={btu} value={btu}>
                    {btu.toLocaleString('pt-BR')} BTUs
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BTU Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {BTU_OPTIONS.map((btu) => (
              <button
                type="button"
                key={btu}
                onClick={() => setCapacidadeBtu(btu)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition text-center whitespace-nowrap ${
                  capacidadeBtu === btu
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {btu.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>

          {/* Collapsible BTU Sizing Calculator */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full p-2.5 flex items-center justify-between text-slate-700 hover:bg-slate-100 transition"
            >
              <span className="flex items-center gap-2 text-[11px] font-bold text-blue-900">
                <Calculator className="w-3.5 h-3.5 text-blue-700" />
                Não sabe a capacidade? Calcular BTUs pelo tamanho do cômodo
              </span>
              {showCalculator ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showCalculator && (
              <div className="p-3.5 border-t border-slate-200 space-y-3 bg-white animate-in fade-in duration-200">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">
                      Área do Cômodo: <strong className="text-slate-900">{roomSizeM2} m²</strong>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="80"
                      step="2"
                      value={roomSizeM2}
                      onChange={(e) => setRoomSizeM2(Number(e.target.value))}
                      className="w-full accent-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">
                      Pessoas: <strong className="text-slate-900">{peopleCount}</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Number(e.target.value))}
                      className="w-full accent-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">Incidência de Sol:</label>
                    <select
                      value={sunExposure}
                      onChange={(e) => setSunExposure(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1 text-slate-800 text-[11px]"
                    >
                      <option value="Manhã">Sol da Manhã</option>
                      <option value="Tarde">Sol da Tarde (Forte)</option>
                      <option value="Dia todo">Dia Todo</option>
                      <option value="Sombra">Sombra / Fresco</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-600">
                    Sugerido: <strong className="text-blue-900 font-bold">{recommendedBtu.toLocaleString('pt-BR')} BTUs</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyCalculatedBtu}
                    className="px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-[11px] border border-blue-300 transition"
                  >
                    Usar {recommendedBtu.toLocaleString('pt-BR')} BTUs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tecnologia e Ciclo - Cards Visuais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tecnologia */}
            <div>
              <span className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Tecnologia do Motor:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTecnologia('INVERTER')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    tecnologia === 'INVERTER'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Inverter</span>
                    {tecnologia === 'INVERTER' && <Check className="w-3 h-3 text-blue-700" />}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">Econômico e silencioso</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTecnologia('CONVENCIONAL')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    tecnologia === 'CONVENCIONAL'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Convencional</span>
                    {tecnologia === 'CONVENCIONAL' && <Check className="w-3 h-3 text-blue-700" />}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">On / Off padrão</span>
                </button>
              </div>
            </div>

            {/* Ciclo */}
            <div>
              <span className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                Ciclo de Climatização:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCiclo('FRIO')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    ciclo === 'FRIO'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-blue-600" /> Frio
                    </span>
                    {ciclo === 'FRIO' && <Check className="w-3 h-3 text-blue-700" />}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">Somente resfriamento</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCiclo('QUENTE_FRIO')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    ciclo === 'QUENTE_FRIO'
                      ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" /> Quente/Frio
                    </span>
                    {ciclo === 'QUENTE_FRIO' && <Check className="w-3 h-3 text-amber-700" />}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">Verão e inverno</span>
                </button>
              </div>
            </div>
          </div>

          {/* Observações Adicionais */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Observações Adicionais (Opcional):
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Condensadora na sacada técnica, tomada 220V, aparelho faz ruído ao desarmar..."
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none text-xs shadow-2xs"
            />
          </div>

          </div>

          {/* Action Buttons - Pinned at Bottom */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewPointModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold transition text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-bold shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 transition transform active:scale-95 text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Salvar Aparelho</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
