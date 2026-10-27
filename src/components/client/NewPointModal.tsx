'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  PlusCircle,
  Calculator,
  Sparkles,
  Home,
  Snowflake,
  Flame,
  Zap,
  Info,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 border-b border-sky-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Cadastrar Novo Ar-Condicionado
                </h3>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-500/30">
                  Residencial / B2C
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adicione o aparelho da sua casa para histórico, manutenção e QR Code
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewPointModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
          {/* Imóvel Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-sky-400" />
              Imóvel / Endereço:
            </label>
            <select
              value={enderecoApelido}
              onChange={(e) => setEnderecoApelido(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
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
            <label className="block text-slate-300 font-semibold">
              Cômodo / Ambiente onde está instalado:
            </label>
            
            {/* Quick Room Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {ROOM_OPTIONS.slice(0, 5).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleQuickRoomPick(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    comodo === r
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Selecionar Cômodo:</span>
                <select
                  value={comodo}
                  onChange={(e) => handleQuickRoomPick(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">
                  Identificação / Apelido do Aparelho:
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex: Split Quarto Casal, Ar da Sala"
                  value={nomeAparelho}
                  onChange={(e) => setNomeAparelho(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Marca e Capacidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Marca / Fabricante:
              </label>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              >
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Capacidade (BTUs):
              </label>
              <select
                value={capacidadeBtu}
                onChange={(e) => setCapacidadeBtu(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
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
                    ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {btu.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>

          {/* Collapsible BTU Sizing Calculator */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <button
              type="button"
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full p-2.5 flex items-center justify-between text-slate-300 hover:bg-slate-900/60 transition"
            >
              <span className="flex items-center gap-2 text-[11px] font-semibold text-sky-400">
                <Calculator className="w-3.5 h-3.5 text-sky-400" />
                Não sabe a capacidade? Calcular BTUs pelo tamanho do cômodo
              </span>
              {showCalculator ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showCalculator && (
              <div className="p-3.5 border-t border-slate-800 space-y-3 bg-slate-950/90 animate-in fade-in duration-200">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">
                      Área do Cômodo: <strong className="text-white">{roomSizeM2} m²</strong>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="80"
                      step="2"
                      value={roomSizeM2}
                      onChange={(e) => setRoomSizeM2(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">
                      Pessoas: <strong className="text-white">{peopleCount}</strong>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Incidência de Sol:</label>
                    <select
                      value={sunExposure}
                      onChange={(e) => setSunExposure(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-slate-200 text-[11px]"
                    >
                      <option value="Manhã">Sol da Manhã</option>
                      <option value="Tarde">Sol da Tarde (Forte)</option>
                      <option value="Dia todo">Dia Todo</option>
                      <option value="Sombra">Sombra / Fresco</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-300">
                    Sugerido: <strong className="text-sky-400 font-bold">{recommendedBtu.toLocaleString('pt-BR')} BTUs</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyCalculatedBtu}
                    className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[11px] border border-sky-500/40 transition"
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
              <span className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Tecnologia do Motor:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTecnologia('INVERTER')}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    tecnologia === 'INVERTER'
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Inverter</span>
                    {tecnologia === 'INVERTER' && <Check className="w-3 h-3 text-sky-400" />}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Econômico e silencioso</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTecnologia('CONVENCIONAL')}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    tecnologia === 'CONVENCIONAL'
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">Convencional</span>
                    {tecnologia === 'CONVENCIONAL' && <Check className="w-3 h-3 text-sky-400" />}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">On / Off padrão</span>
                </button>
              </div>
            </div>

            {/* Ciclo */}
            <div>
              <span className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                Ciclo de Climatização:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCiclo('FRIO')}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    ciclo === 'FRIO'
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-sky-400" /> Frio
                    </span>
                    {ciclo === 'FRIO' && <Check className="w-3 h-3 text-sky-400" />}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Somente resfriamento</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCiclo('QUENTE_FRIO')}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    ciclo === 'QUENTE_FRIO'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Quente/Frio
                    </span>
                    {ciclo === 'QUENTE_FRIO' && <Check className="w-3 h-3 text-amber-400" />}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Verão e inverno</span>
                </button>
              </div>
            </div>
          </div>

          {/* Observações Adicionais */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Observações Adicionais (Opcional):
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Condensadora na sacada técnica, tomada 220V, aparelho faz ruído ao desarmar..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNewPointModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
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
