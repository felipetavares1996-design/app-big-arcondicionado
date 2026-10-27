'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, PlusCircle, Calculator, Sparkles, Building2, User } from 'lucide-react';

export default function NewPointModal() {
  const { isNewPointModalOpen, setIsNewPointModalOpen, addNewPointRequest } = useApp();

  const [secretaria, setSecretaria] = useState('Secretaria de Educação');
  const [unitLocation, setUnitLocation] = useState('');
  const [roomSizeM2, setRoomSizeM2] = useState(25);
  const [peopleCount, setPeopleCount] = useState(6);
  const [sunExposure, setSunExposure] = useState<'Manhã' | 'Tarde' | 'Dia todo' | 'Sombra'>('Tarde');
  const [justification, setJustification] = useState('');
  const [requesterName, setRequesterName] = useState('Fiscalização de Contratos PMB');
  const [requesterRole, setRequesterRole] = useState('Engenheiro / Fiscal');

  if (!isNewPointModalOpen) return null;

  // Real-time BTU calculation
  // Basic rule: 600 BTU/m² + 600 BTU per additional person + sun factor
  const baseBtu = roomSizeM2 * 600 + peopleCount * 600;
  const sunFactor = sunExposure === 'Tarde' || sunExposure === 'Dia todo' ? 1.25 : 1.0;
  const calculatedBtu = Math.round((baseBtu * sunFactor) / 1000) * 1000;
  
  // Standard commercial capacities
  const recommendedBtu =
    calculatedBtu <= 9000
      ? 9000
      : calculatedBtu <= 12000
      ? 12000
      : calculatedBtu <= 18000
      ? 18000
      : calculatedBtu <= 24000
      ? 24000
      : calculatedBtu <= 36000
      ? 36000
      : 60000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitLocation.trim()) return;

    addNewPointRequest({
      secretaria,
      unitLocation,
      roomSizeM2,
      peopleCount,
      sunExposure,
      estimatedBtu: recommendedBtu,
      justification: justification || 'Demanda por climatização em ambiente público.',
      requesterName,
      requesterRole,
    });

    setIsNewPointModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-sky-950/40 border-b border-sky-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <PlusCircle className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Solicitar Novo Ponto de Climatização</h3>
              <p className="text-[11px] text-sky-300/80">Vistoria e dimensionamento térmico para ampliação de contrato</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewPointModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Secretaria & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Secretaria Municipal:</label>
              <select
                value={secretaria}
                onChange={(e) => setSecretaria(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              >
                <option value="Secretaria de Educação">Secretaria de Educação</option>
                <option value="Secretaria de Saúde">Secretaria de Saúde</option>
                <option value="Gabinete & Administração">Gabinete & Administração</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unidade / Prédio:</label>
              <input
                type="text"
                required
                placeholder="Ex: E.M. Vista Linda - Sala 04"
                value={unitLocation}
                onChange={(e) => setUnitLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>

          {/* Sizing & BTU Calculator Box */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sky-400 font-semibold">
              <span className="flex items-center gap-1.5 text-xs">
                <Calculator className="w-4 h-4 text-sky-400" />
                Simulador de Carga Térmica Automático
              </span>
              <span className="text-[11px] bg-sky-500/10 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/20 font-bold">
                Capacidade Sugerida: {recommendedBtu.toLocaleString('pt-BR')} BTUs
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Área da Sala: <strong className="text-white">{roomSizeM2} m²</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={roomSizeM2}
                  onChange={(e) => setRoomSizeM2(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Ocupantes: <strong className="text-white">{peopleCount} pessoas</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Sol:</label>
                <select
                  value={sunExposure}
                  onChange={(e) => setSunExposure(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs"
                >
                  <option value="Manhã">Sol da Manhã</option>
                  <option value="Tarde">Sol da Tarde (Forte)</option>
                  <option value="Dia todo">Dia Todo</option>
                  <option value="Sombra">Sombra / Fresco</option>
                </select>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Justificativa de Interesse Público:
            </label>
            <textarea
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Ex: Instalação de novo laboratório com computadores que geram alta dissipação de calor..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none text-xs"
            />
          </div>

          {/* Requester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Nome do Solicitante:</label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Cargo / Função:</label>
              <input
                type="text"
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Submit */}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enviar Pedido de Vistoria</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
