'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Printer, Download, QrCode, Shield, CheckCircle, Tag } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrTagModal() {
  const { isQrTagModalOpen, setIsQrTagModalOpen, qrTagEquipment } = useApp();

  if (!isQrTagModalOpen || !qrTagEquipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Etiqueta Física & QR Code do Equipamento</h3>
              <p className="text-[11px] text-slate-400">Padronização técnica para fixação na carcaça</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition shadow-md shadow-sky-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Etiqueta</span>
            </button>
            <button
              onClick={() => setIsQrTagModalOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Physical Sticker Presentation Canvas */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center">
          {/* Realistic Metallic Physical Label (90mm x 55mm standard proportion) */}
          <div
            id="physical-sticker"
            className="w-full max-w-md bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 rounded-2xl p-4 border-2 border-slate-400 shadow-2xl relative select-none"
          >
            {/* Top Security Stripe */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-black text-lg flex items-center justify-center shadow-sm">
                  BIG
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight uppercase leading-none text-slate-950">
                    BIG ARCONDICIONADO
                  </h4>
                  <span className="text-[9px] font-bold text-sky-800 block mt-0.5">
                    SISTEMAS TÉRMICOS & PMOC • CREA 2049182
                  </span>
                </div>
              </div>

              {/* Prominent Unit Type in Header */}
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-950 text-sky-300 px-2.5 py-1 rounded border border-sky-800 shadow-sm">
                  {qrTagEquipment.tipo_unidade}
                </span>
                <p className="text-[8px] font-mono text-slate-600 font-semibold mt-1">
                  PAT: {qrTagEquipment.tag_patrimonio}
                </p>
              </div>
            </div>

            {/* Middle Section: Specs & Real QR Code */}
            <div className="flex items-center justify-between gap-3">
              {/* Left Details */}
              <div className="flex-1 space-y-1 text-[10px]">
                <div className="bg-slate-200/90 px-2 py-1 rounded border border-slate-300">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">Identificador Patrimonial:</span>
                  <span className="font-mono font-black text-sm text-slate-950">{qrTagEquipment.tag_patrimonio}</span>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Marca / Modelo:</span>
                    <strong className="text-slate-900 text-[9px] truncate block">{qrTagEquipment.marca} {qrTagEquipment.modelo}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Capacidade:</span>
                    <strong className="text-slate-900 text-[9px]">{qrTagEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Cliente:</span>
                    <strong className="text-slate-900 text-[9px] truncate block">{qrTagEquipment.cliente_nome || 'Cliente Big Ar'}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-slate-500 block">Fluido:</span>
                    <strong className="text-slate-900 text-[9px]">{qrTagEquipment.gasType}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] uppercase text-slate-500 block">Recinto / Imóvel:</span>
                  <span className="text-slate-800 text-[9px] font-medium line-clamp-1">
                    {qrTagEquipment.endereco_apelido}
                  </span>
                </div>
              </div>

              {/* Right: High contrast QR Code */}
              <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-slate-300 shadow-sm shrink-0">
                <QRCodeSVG
                  value={`https://pmoc.bigar.com.br/equipamento/${qrTagEquipment.tag_patrimonio}`}
                  size={95}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[7.5px] font-mono font-bold text-slate-700 mt-1">LEITURA RÁPIDA</span>
              </div>
            </div>

            {/* Bottom Legal & Technician Notice */}
            <div className="mt-2.5 pt-1.5 border-t border-slate-300 flex items-center justify-between text-[8px] text-slate-600 font-medium">
              <span>LEI FEDERAL Nº 13.589/2018</span>
              <span>Eng. Carlos Silva • CREA 50698421</span>
              <span>Plantão: (13) 3317-0000</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Padrão 90mm x 55mm • Vinil Adesivo Bopp resistente a intempéries</span>
          <button
            onClick={() => setIsQrTagModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
