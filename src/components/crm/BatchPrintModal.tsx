'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Printer, Filter, CheckCircle2, Scissors, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function BatchPrintModal() {
  const { isBatchPrintModalOpen, setIsBatchPrintModalOpen, equipments, clients } = useApp();
  const [selectedClientFilter, setSelectedClientFilter] = useState('Todos');

  if (!isBatchPrintModalOpen) return null;

  const filtered = equipments.filter((eq) => {
    if (selectedClientFilter === 'Todos') return true;
    return eq.cliente_id === selectedClientFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Top Floating Control Bar (Hidden during print) */}
      <header className="sticky top-0 z-50 bg-[#0a192f] border-b border-blue-900/40 p-4 flex items-center justify-between no-print shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Impressão em Lote de Etiquetas PMOC (Folha A4)</h3>
            <p className="text-xs text-blue-200">
              Grade pré-formatada para papel adesivo PIMACO / A4 • {filtered.length} etiquetas geradas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Client Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-200 font-medium hidden sm:inline">Cliente:</span>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="bg-[#0a2540] border border-blue-800 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400"
            >
              <option value="Todos">Todos os Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome_completo}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Folha A4 Agora</span>
          </button>

          <button
            onClick={() => setIsBatchPrintModalOpen(false)}
            className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Guide notice (hidden in print) */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 no-print">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between text-xs text-blue-900 shadow-sm">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Dica de Impressão:</strong> As linhas pontilhadas cinzas servem como guias de corte. O tipo de unidade (EVAPORADORA, CONDENSADORA ou CONJUNTO_SPLIT) está em destaque.
            </span>
          </div>
        </div>
      </div>

      {/* A4 Sheet Preview Canvas */}
      <div className="p-4 sm:p-8 flex items-center justify-center bg-slate-100">
        <div
          id="printable-a4-sheet"
          className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0"
        >
          {/* Printable Sheet Title Header */}
          <div className="border-b-2 border-slate-900 pb-2 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase text-slate-950">
                Folha Oficial de Etiquetas Adesivas PMOC • Big Arcondicionado
              </h1>
              <p className="text-[10px] text-slate-600">
                Engenharia Térmica & Manutenção Preventiva • Responsável Técnico: Eng. Carlos Eduardo Silva (CREA-SP 50698421-D)
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-slate-500">
              Lote Gerado: {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* 2-Columns Grid of Physical Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((eq) => (
              <div
                key={eq.id}
                className="bg-white rounded-xl p-3.5 border-2 border-dashed border-slate-400 relative select-none break-inside-avoid shadow-sm hover:border-sky-500 transition"
              >
                {/* Cutting line indicator */}
                <div className="absolute -top-2.5 -right-2 bg-slate-100 text-slate-400 text-[8px] px-1 rounded border border-slate-300 flex items-center gap-0.5 no-print">
                  <Scissors className="w-2.5 h-2.5" />
                  <span>corte</span>
                </div>

                {/* Sticker Header */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-[#0a192f] text-white font-black text-xs flex items-center justify-center">
                      BIG
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase leading-none text-slate-950">
                        BIG ARCONDICIONADO
                      </h4>
                      <span className="text-[7.5px] font-semibold text-blue-900 block">
                        PMOC LEI 13.589/2018
                      </span>
                    </div>
                  </div>

                  {/* Prominent Unit Type */}
                  <div className="text-right">
                    <span className="text-[8px] font-black uppercase bg-[#0a192f] text-white px-2 py-0.5 rounded tracking-wide">
                      {eq.tipo_unidade}
                    </span>
                    <p className="text-[7px] font-mono text-slate-600 font-semibold mt-0.5">PAT: {eq.tag_patrimonio}</p>
                  </div>
                </div>

                {/* Sticker Body */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 space-y-0.5 text-[9px]">
                    <div className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      <span className="text-[7px] uppercase font-bold text-slate-500 block">ID do Equipamento:</span>
                      <strong className="font-mono font-black text-xs text-slate-950">{eq.tag_patrimonio}</strong>
                    </div>

                    <div className="pt-0.5 text-[8px] text-slate-700 leading-tight">
                      <div>Marca: <strong>{eq.marca} {eq.modelo}</strong></div>
                      <div>Capacidade: <strong>{eq.capacidade_btu.toLocaleString('pt-BR')} BTUs ({eq.gasType})</strong></div>
                      <div className="truncate">Cliente: <strong>{eq.cliente_nome}</strong></div>
                      <div className="truncate text-slate-500">{eq.endereco_apelido}</div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center bg-white p-1 rounded-lg border border-slate-300 shrink-0">
                    <QRCodeSVG
                      value={`https://pmoc.bigar.com.br/equipamento/${eq.tag_patrimonio}`}
                      size={74}
                      level="M"
                      includeMargin={false}
                    />
                    <span className="text-[6.5px] font-mono font-bold text-slate-700 mt-0.5">LEITURA RÁPIDA</span>
                  </div>
                </div>

                {/* Bottom Legal Notice */}
                <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[7px] text-slate-500 font-medium">
                  <span>CREA-SP: 50698421</span>
                  <span>Última: {eq.data_ultima_manutencao}</span>
                  <span>Plantão: (13) 3317-0000</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of the sheet */}
          <div className="mt-6 pt-3 border-t border-slate-300 text-center text-[9px] text-slate-500 font-medium">
            BIG AR CONDICIONADO SISTEMAS TÉRMICOS • GESTÃO INTEGRADA PMOC • ATENDIMENTO LITORAL PAULISTA
          </div>
        </div>
      </div>
    </div>
  );
}
