'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Camera,
  Flashlight,
  RefreshCw,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Equipment } from '@/types';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScannerModal() {
  const {
    isScannerOpen,
    setIsScannerOpen,
    equipments,
    setSelectedEquipment,
    setIsDetailModalOpen,
    showToast,
  } = useApp();

  const [cameraStatus, setCameraStatus] = useState<
    'initializing' | 'scanning' | 'permission_denied' | 'error' | 'success'
  >('initializing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play crisp scanner beep sound via Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz (A5)
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  // Process decoded QR text
  const handleDecodedText = (decodedText: string) => {
    if (!decodedText || cameraStatus === 'success') return;

    playBeep();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {}
    }

    setCameraStatus('success');
    setScannedResult(decodedText);

    // Stop camera immediately
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }

    const clean = decodedText.trim();

    // 1. Match equipment
    let found = equipments.find(
      (eq) =>
        eq.id.toUpperCase() === clean.toUpperCase() ||
        eq.tag_patrimonio.toUpperCase() === clean.toUpperCase() ||
        eq.patrimonyCode?.toUpperCase() === clean.toUpperCase() ||
        eq.qrPayload?.toUpperCase() === clean.toUpperCase()
    );

    // 2. URL slug match if QR contains URL
    if (!found && clean.includes('/')) {
      const slug = clean.split('/').pop()?.trim() || '';
      found = equipments.find(
        (eq) =>
          eq.id.toUpperCase() === slug.toUpperCase() ||
          eq.tag_patrimonio.toUpperCase() === slug.toUpperCase()
      );
    }

    // 3. Partial match
    if (!found) {
      found = equipments.find(
        (eq) =>
          clean.toUpperCase().includes(eq.id.toUpperCase()) ||
          clean.toUpperCase().includes(eq.tag_patrimonio.toUpperCase())
      );
    }

    setTimeout(() => {
      if (found) {
        setSelectedEquipment(found);
        setIsScannerOpen(false);
        setIsDetailModalOpen(true);
        showToast(
          'QR Code Identificado!',
          `${found.name} localizado com sucesso. Abrindo ficha do aparelho...`,
          'success'
        );
      } else {
        showToast(
          'Código Lido com Sucesso!',
          `QR Code "${clean}" detectado, mas não está cadastrado neste perfil.`,
          'info'
        );
        setCameraStatus('scanning');
      }
    }, 700);
  };

  // Start Html5Qrcode Scanner
  const startCamera = async (cameraIdOrFacing?: string | { facingMode: string }) => {
    try {
      setCameraStatus('initializing');
      setErrorMessage(null);

      // Stop previous instance if running
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      }

      // Check available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
        }
      } catch {
        // ignore device listing error
      }

      const html5QrCode = new Html5Qrcode('qr-reader-viewport');
      scannerRef.current = html5QrCode;

      const cameraParam = cameraIdOrFacing || { facingMode: 'environment' };

      await html5QrCode.start(
        cameraParam,
        {
          fps: 15,
          qrbox: { width: 230, height: 230 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        () => {
          // Frame error (no QR detected in frame) - safe to ignore
        }
      );

      setCameraStatus('scanning');
    } catch (err: any) {
      console.warn('Erro ao inicializar câmera do scanner:', err);
      const msg = err?.message || String(err);

      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        setCameraStatus('permission_denied');
        setErrorMessage('Permissão de acesso à câmera negada. Permita o uso da câmera nas configurações do navegador.');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
        setCameraStatus('error');
        setErrorMessage('Nenhuma câmera encontrada neste dispositivo.');
      } else {
        setCameraStatus('error');
        setErrorMessage('Não foi possível iniciar o feed de vídeo. Verifique se a câmera não está em uso por outro aplicativo.');
      }
    }
  };

  // Switch between available cameras
  const handleSwitchCamera = () => {
    if (availableCameras.length <= 1) return;
    const currentIndex = availableCameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    setSelectedCameraId(nextCamera.id);
    startCamera(nextCamera.id);
  };

  // Toggle flashlight / torch
  const handleToggleTorch = async () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !flashlightOn } as any],
      });
      setFlashlightOn(!flashlightOn);
    } catch {
      showToast('Lanterna Indisponível', 'Seu dispositivo ou câmera não suporta controle de flash.', 'info');
    }
  };

  // Scan from uploaded file
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCameraStatus('initializing');
      const html5QrCode = scannerRef.current || new Html5Qrcode('qr-reader-viewport');
      scannerRef.current = html5QrCode;

      const result = await html5QrCode.scanFile(file, true);
      handleDecodedText(result);
    } catch (err: any) {
      showToast(
        'QR Code Não Detectado na Imagem',
        'Não foi possível encontrar um QR Code válido na foto enviada. Tente com melhor iluminação.',
        'error'
      );
      setCameraStatus('scanning');
    }
  };

  // Manual code submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDecodedText(manualCode.trim());
    setManualCode('');
  };

  // Initialize camera when modal opens
  useEffect(() => {
    if (isScannerOpen) {
      // Short delay to ensure container element '#qr-reader-viewport' is in DOM
      const timer = setTimeout(() => {
        startCamera();
      }, 150);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
          scannerRef.current.clear();
        }
      };
    }
  }, [isScannerOpen]);

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#0a192f] border-b border-blue-900 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Leitor de QR Code</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-400/40">
                  Câmera Ativa
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                Aponte a câmera para a etiqueta no ar-condicionado
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScannerOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative bg-black h-80 flex items-center justify-center overflow-hidden">
          {/* HTML5 QR Code Video Target */}
          <div
            id="qr-reader-viewport"
            className="w-full h-full flex items-center justify-center overflow-hidden [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
          />

          {/* Scanner Overlay Frame */}
          {cameraStatus === 'scanning' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Outer darkened vignette */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Target Square */}
              <div className="relative w-56 h-56 rounded-3xl border-2 border-dashed border-sky-400/80 shadow-[0_0_60px_rgba(14,165,233,0.3)]">
                {/* 4 Neon corner brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-xl shadow-[0_0_10px_#38bdf8]" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-xl shadow-[0_0_10px_#38bdf8]" />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-xl shadow-[0_0_10px_#38bdf8]" />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-xl shadow-[0_0_10px_#38bdf8]" />

                {/* Laser scanning beam */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-scan" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] text-sky-200/80 bg-slate-950/70 px-2.5 py-1 rounded-full font-semibold border border-sky-500/20 backdrop-blur-sm">
                    Alinhe o QR Code aqui
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status: Success Animation */}
          {cameraStatus === 'success' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 animate-in zoom-in-75">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_#10b981]">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="text-center px-4">
                <span className="text-sm font-extrabold text-white block">QR Code Reconhecido!</span>
                <span className="text-xs text-emerald-400 font-mono mt-1 block">
                  {scannedResult}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Carregando dados do aparelho...</p>
              </div>
            </div>
          )}

          {/* Status: Initializing */}
          {cameraStatus === 'initializing' && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Iniciando câmera...</span>
              <p className="text-[10px] text-slate-500">Solicitando acesso ao feed de vídeo</p>
            </div>
          )}

          {/* Status: Permission Denied or Error */}
          {(cameraStatus === 'permission_denied' || cameraStatus === 'error') && (
            <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">
                  {cameraStatus === 'permission_denied'
                    ? 'Acesso à Câmera Bloqueado'
                    : 'Câmera Não Disponível'}
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  {errorMessage || 'Permita o acesso à câmera para escanear a etiqueta do aparelho.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => startCamera()}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/30 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Enviar Foto</span>
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder Controls Bar */}
          {cameraStatus === 'scanning' && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <button
                type="button"
                onClick={handleToggleTorch}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md border transition ${
                  flashlightOn
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_#fbbf24]'
                    : 'bg-black/60 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Flashlight className="w-3.5 h-3.5" />
                <span>{flashlightOn ? 'Lanterna Ligada' : 'Lanterna'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {availableCameras.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="p-1.5 rounded-full bg-black/60 border border-slate-700 text-slate-300 hover:text-white transition"
                    title="Alternar Câmera"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition"
                  title="Escanear a partir de foto"
                >
                  <Upload className="w-3 h-3 text-sky-400" />
                  <span>Foto</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden File Input for Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileScan}
            className="hidden"
          />
        </div>

        {/* Manual Code Input & Quick Simulator */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Manual Digitation Fallback */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Digitar código manual (ex: AR-BER-001)"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#0a2540] hover:bg-blue-900 disabled:opacity-40 text-white font-bold text-xs transition shadow-sm"
            >
              Buscar
            </button>
          </form>

          {/* Quick Simulation Chips */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Simular leitura rápida (Demonstração):
              </span>
              <span className="text-[10px] text-slate-400">1-clique</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-0.5 no-scrollbar">
              {equipments.slice(0, 6).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleDecodedText(eq.id)}
                  className="p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-500 text-left transition group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-slate-900 group-hover:text-blue-900 truncate">
                      {eq.tag_patrimonio}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        eq.status === 'overdue'
                          ? 'bg-rose-500'
                          : eq.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {eq.nome_aparelho || eq.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
