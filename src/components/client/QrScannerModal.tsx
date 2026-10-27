'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Camera, Flashlight, RefreshCw, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { Equipment } from '@/types';

export default function QrScannerModal() {
  const {
    isScannerOpen,
    setIsScannerOpen,
    equipments,
    setSelectedEquipment,
    setIsDetailModalOpen,
    showToast,
  } = useApp();

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  if (!isScannerOpen) return null;

  const handleSimulateScan = (equipment: Equipment) => {
    setScannedFeedback(equipment.id);
    
    // Simulate beep and slight delay
    setTimeout(() => {
      setSelectedEquipment(equipment);
      setIsScannerOpen(false);
      setIsDetailModalOpen(true);
      setScannedFeedback(null);
      showToast(
        'QR Code Identificado!',
        `Aparelho ${equipment.id} localizado com sucesso. Abrindo ficha técnica...`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scanner de QR Code PMOC</h3>
              <p className="text-[11px] text-slate-400">Aponte a câmera para a etiqueta física do aparelho</p>
            </div>
          </div>
          <button
            onClick={() => setIsScannerOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black h-72 flex items-center justify-center overflow-hidden">
          {/* Subtle camera background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/70" />

          {/* Scanner Target Frame */}
          <div className="relative w-52 h-52 rounded-2xl border-2 border-dashed border-sky-400/70 flex items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.2)]">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-lg" />

            {/* Laser scanning line */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan" />

            {scannedFeedback ? (
              <div className="flex flex-col items-center gap-2 text-emerald-400 animate-in zoom-in-50">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
                <span className="text-xs font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                  {scannedFeedback} Lido!
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <QrCode className="w-10 h-10 opacity-40 animate-pulse" />
                <span className="text-[11px] text-slate-400 font-medium">Posicione o QR Code no centro</span>
              </div>
            )}
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border transition ${
                flashlightOn
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-black/50 border-slate-700 text-slate-300'
              }`}
            >
              <Flashlight className="w-3.5 h-3.5" />
              <span>{flashlightOn ? 'Lanterna Ligada' : 'Lanterna'}</span>
            </button>
            <span className="text-[10px] text-slate-400 bg-black/60 px-2.5 py-1 rounded-full">
              60 FPS • Autofoco Ativo
            </span>
          </div>
        </div>

        {/* Quick Demo Simulator Buttons */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Simulação Comercial de Leitura Rápida:
            </span>
            <span className="text-[10px] text-slate-500">Clique para simular tag</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
            {equipments.map((eq) => {
              const isOverdue = eq.status === 'overdue';
              const isWarning = eq.status === 'warning';

              return (
                <button
                  key={eq.id}
                  onClick={() => handleSimulateScan(eq)}
                  className="flex flex-col text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-sky-500/50 transition group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white group-hover:text-sky-300">
                      {eq.id}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOverdue
                          ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
                          : isWarning
                          ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                          : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-300 truncate mt-0.5">{eq.name}</span>
                  <span className="text-[9px] text-slate-500 truncate mt-0.5">{eq.location}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
