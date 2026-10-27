'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Filter,
  Printer,
  QrCode,
  FileCheck2,
  AlertCircle,
  Tag,
  Building2,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Eye,
  SlidersHorizontal,
  Home,
  User,
  Zap,
} from 'lucide-react';
import { Equipment, UnitType, MaintenanceStatus } from '@/types';

export default function EquipmentTable() {
  const {
    equipments,
    clients,
    setSelectedEquipment,
    setIsDetailModalOpen,
    setIsReportModalOpen,
    setIsOpenTicketModalOpen,
    setQrTagEquipment,
    setIsQrTagModalOpen,
    setIsBatchPrintModalOpen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('Todos');
  const [selectedUnitType, setSelectedUnitType] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  // Filter logic
  const filteredEquipments = equipments.filter((eq) => {
    const matchesSearch =
      eq.tag_patrimonio.toLowerCase().includes(search.toLowerCase()) ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.location.toLowerCase().includes(search.toLowerCase()) ||
      eq.marca.toLowerCase().includes(search.toLowerCase()) ||
      eq.endereco_apelido.toLowerCase().includes(search.toLowerCase()) ||
      (eq.cliente_nome && eq.cliente_nome.toLowerCase().includes(search.toLowerCase()));

    const matchesClient = selectedClient === 'Todos' || eq.cliente_id === selectedClient;
    const matchesType = selectedUnitType === 'Todas' || eq.tipo_unidade === selectedUnitType;

    let matchesStatus = true;
    if (selectedStatus === 'ok') matchesStatus = eq.daysRemaining > 30;
    else if (selectedStatus === 'warning') matchesStatus = eq.daysRemaining <= 30 && eq.daysRemaining > 0;
    else if (selectedStatus === 'overdue') matchesStatus = eq.daysRemaining <= 0;

    return matchesSearch && matchesClient && matchesType && matchesStatus;
  });

  const handleOpenTag = (eq: Equipment) => {
    setQrTagEquipment(eq);
    setIsQrTagModalOpen(true);
  };

  const handleOpenReport = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setIsReportModalOpen(true);
  };

  const handleOpenTicket = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setIsOpenTicketModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Parque de Equipamentos & Gestão de Etiquetas QR Code</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Patrimônio PMOC
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Controle técnico de evaporadoras, condensadoras e splits instalados em clientes residenciais e corporativos.
          </p>
        </div>

        {/* Master Batch Print Button */}
        <button
          id="btn-print-batch"
          onClick={() => setIsBatchPrintModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition transform active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Folha de Etiquetas (Lote A4)</span>
        </button>
      </div>

      {/* Filter Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por tag, cliente, cômodo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
          />
        </div>

        {/* Cliente Filter */}
        <div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
          >
            <option value="Todos">Todos os Clientes</option>
            {clients.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli.nome_completo} ({cli.tipo_cliente})
              </option>
            ))}
          </select>
        </div>

        {/* Unit Type Filter */}
        <div>
          <select
            value={selectedUnitType}
            onChange={(e) => setSelectedUnitType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
          >
            <option value="Todas">Todos os Tipos de Unidade</option>
            <option value="EVAPORADORA">EVAPORADORA (Interna / Split)</option>
            <option value="CONDENSADORA">CONDENSADORA (Externa / VRF)</option>
            <option value="CONJUNTO_SPLIT">CONJUNTO_SPLIT (Cassete / Piso Teto)</option>
          </select>
        </div>

        {/* Status PMOC Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
          >
            <option value="Todos">Todos os Status PMOC</option>
            <option value="ok">Em Dia (Verde &gt; 30d)</option>
            <option value="warning">Atenção Vencendo (&lt; 30d)</option>
            <option value="overdue">Vencido / Crítico (Vermelho)</option>
          </select>
        </div>
      </div>

      {/* Equipment Table Container */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID / Patrimônio</th>
                <th className="p-3.5">Tipo de Unidade</th>
                <th className="p-3.5">Aparelho & Marca</th>
                <th className="p-3.5">Cliente & Recinto</th>
                <th className="p-3.5">Ciclo 6 Meses</th>
                <th className="p-3.5">Próx. Preventiva</th>
                <th className="p-3.5 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEquipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Nenhum equipamento encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredEquipments.map((eq) => {
                  const isOverdue = eq.daysRemaining <= 0;
                  const isWarning = eq.daysRemaining <= 30 && !isOverdue;
                  const isOk = !isOverdue && !isWarning;
                  const isPending = eq.status_instalacao !== 'INSTALADO_EM_OPERACAO';

                  return (
                    <tr
                      key={eq.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* ID & Patrimônio */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenTag(eq)}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition"
                            title="Ver Etiqueta Física"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="font-mono font-bold text-white text-xs block group-hover:text-sky-300 transition">
                              {eq.tag_patrimonio}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {eq.patrimonyCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Prominent Unit Type */}
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                            eq.tipo_unidade === 'EVAPORADORA'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : eq.tipo_unidade === 'CONDENSADORA'
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          }`}
                        >
                          {eq.tipo_unidade}
                        </span>
                      </td>

                      {/* Brand & Specs */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-200 line-clamp-1">{eq.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-white font-medium">{eq.marca}</span>
                          <span>•</span>
                          <span>{eq.capacidade_btu.toLocaleString('pt-BR')} BTUs</span>
                          <span>•</span>
                          <span>{eq.gasType}</span>
                        </div>
                      </td>

                      {/* Cliente & Recinto */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{eq.cliente_nome}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px] flex items-center gap-1">
                          <Home className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{eq.endereco_apelido}</span>
                        </div>
                      </td>

                      {/* Status PMOC 6 Meses */}
                      <td className="p-3.5">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            <Zap className="w-3.5 h-3.5 text-blue-400" />
                            <span>Instalação Agendada</span>
                          </span>
                        ) : isOk ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Em dia ({eq.daysRemaining}d)</span>
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Atenção: vence em {eq.daysRemaining}d</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            <span>Vencido há {Math.abs(eq.daysRemaining)}d</span>
                          </span>
                        )}
                      </td>

                      {/* Next Due Date */}
                      <td className="p-3.5">
                        <span className={`font-mono text-xs ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                          {eq.data_proxima_preventiva}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          Última: {eq.data_ultima_manutencao}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ver Etiqueta */}
                          <button
                            onClick={() => handleOpenTag(eq)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition text-[11px] font-medium"
                            title="Visualizar Etiqueta Física"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Etiqueta</span>
                          </button>

                          {/* Laudo PMOC */}
                          <button
                            onClick={() => handleOpenReport(eq)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-[11px] font-medium"
                            title="Visualizar Laudo PMOC"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Laudo</span>
                          </button>

                          {/* Abrir OS */}
                          <button
                            onClick={() => handleOpenTicket(eq)}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition"
                            title="Abrir Ordem de Serviço"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
