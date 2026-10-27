'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Building,
  User,
  Phone,
  Mail,
  Home,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Client, ClientType } from '@/types';
import ClientDetailsDrawer from './ClientDetailsDrawer';
import NewClientModal from './NewClientModal';

export default function Client360View() {
  const {
    clients,
    equipments,
    setClient360Selected,
    setIsClient360DrawerOpen,
    setIsNewClientModalOpen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'TODOS' | 'PF' | 'PJ'>('TODOS');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf_cnpj.toLowerCase().includes(search.toLowerCase()) ||
      c.whatsapp.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'TODOS' || c.tipo_cliente === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpen360 = (client: Client) => {
    setClient360Selected(client);
    setIsClient360DrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Gestão de Clientes & Contratos (Visão 360°)</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {clients.length} Clientes Ativos
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastros unificados de Pessoa Física (Residencial) e Pessoa Jurídica (Empresas & Prefeituras com PMOC).
          </p>
        </div>

        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition transform active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, razão social, CPF/CNPJ, WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
          >
            <option value="TODOS">Todos os Tipos (PF e PJ)</option>
            <option value="PF">Pessoa Física (Residencial)</option>
            <option value="PJ">Pessoa Jurídica (Empresas / PMOC)</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Cliente / Razão Social</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">CPF / CNPJ</th>
                <th className="p-3.5">Contato WhatsApp</th>
                <th className="p-3.5">Imóveis / Recintos</th>
                <th className="p-3.5">Aparelhos</th>
                <th className="p-3.5 text-right">Ação 360°</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClients.map((client) => {
                const totalEqs = equipments.filter((e) => e.cliente_id === client.id).length;

                return (
                  <tr
                    key={client.id}
                    onClick={() => handleOpen360(client)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="p-3.5 font-bold text-white group-hover:text-sky-300 transition flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold text-sky-400">
                        {client.tipo_cliente}
                      </div>
                      <span>{client.nome_completo}</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          client.tipo_cliente === 'PF'
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        }`}
                      >
                        {client.tipo_cliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-400">{client.cpf_cnpj}</td>

                    <td className="p-3.5 text-emerald-400 font-semibold">{client.whatsapp}</td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200">
                        {client.enderecos.length} recinto(s)
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate max-w-[150px]">
                        {client.enderecos.map((r) => r.apelido).join(', ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                        {totalEqs} ar(es)
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen360(client);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition text-[11px] font-bold ml-auto"
                      >
                        <span>Visão 360°</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawers & Modals */}
      <ClientDetailsDrawer />
      <NewClientModal />
    </div>
  );
}
