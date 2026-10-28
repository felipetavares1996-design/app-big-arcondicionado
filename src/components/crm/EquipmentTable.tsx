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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Parque de Equipamentos & Gestão de Etiquetas QR Code</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Patrimônio PMOC
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle técnico de evaporadoras, condensadoras e splits instalados em clientes residenciais e corporativos.
          </p>
        </div>

        {/* Master Batch Print Button */}
        <button
          id="btn-print-batch"
          onClick={() => setIsBatchPrintModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a2540] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition transform active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Folha de Etiquetas (Lote A4)</span>
        </button>
      </div>

      {/* Filter Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-100 p-3 rounded-2xl border border-slate-200 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tag, cliente, cômodo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs"
          />
        </div>

        {/* Cliente Filter */}
        <div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs"
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
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs"
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
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 text-xs"
          >
            <option value="Todos">Todos os Status PMOC</option>
            <option value="ok">Em Dia (Verde &gt; 30d)</option>
            <option value="warning">Atenção Vencendo (&lt; 30d)</option>
            <option value="overdue">Vencido / Crítico (Vermelho)</option>
          </select>
        </div>
      </div>

      {/* Equipment Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
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
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* ID & Patrimônio */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenTag(eq)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
                            title="Ver Etiqueta Física"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="font-mono font-bold text-slate-900 text-xs block group-hover:text-blue-900 transition">
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
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : eq.tipo_unidade === 'CONDENSADORA'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}
                        >
                          {eq.tipo_unidade}
                        </span>
                      </td>

                      {/* Brand & Specs */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 line-clamp-1">{eq.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-800 font-medium">{eq.marca}</span>
                          <span>•</span>
                          <span>{eq.capacidade_btu.toLocaleString('pt-BR')} BTUs</span>
                          <span>•</span>
                          <span>{eq.gasType}</span>
                        </div>
                      </td>

                      {/* Cliente & Recinto */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{eq.cliente_nome}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px] flex items-center gap-1">
                          <Home className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{eq.endereco_apelido}</span>
                        </div>
                      </td>

                      {/* Status PMOC 6 Meses */}
                      <td className="p-3.5">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span>Instalação Agendada</span>
                          </span>
                        ) : isOk ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Em dia ({eq.daysRemaining}d)</span>
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Atenção: vence em {eq.daysRemaining}d</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                            <span>Vencido há {Math.abs(eq.daysRemaining)}d</span>
                          </span>
                        )}
                      </td>

                      {/* Next Due Date */}
                      <td className="p-3.5">
                        <span className={`font-mono text-xs ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800 font-medium'}`}>
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
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-700 hover:text-blue-900 border border-slate-300 transition text-[11px] font-semibold shadow-2xs"
                            title="Visualizar Etiqueta Física"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Etiqueta</span>
                          </button>

                          {/* Laudo PMOC */}
                          <button
                            onClick={() => handleOpenReport(eq)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-emerald-700 hover:text-emerald-900 border border-slate-300 transition text-[11px] font-semibold shadow-2xs"
                            title="Visualizar Laudo PMOC"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">Laudo</span>
                          </button>

                          {/* Abrir OS */}
                          <button
                            onClick={() => handleOpenTicket(eq)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
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
