'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  AlertCircle,
  Truck,
  Clock,
  ShieldCheck,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Award,
  Zap,
  Users,
} from 'lucide-react';

export default function CrmDashboard({
  onNavigate,
}: {
  onNavigate: (tab: 'kanban' | 'equipamentos' | 'clientes') => void;
}) {
  const { equipments, tickets, clients } = useApp();

  // Metrics
  const totalEquipments = equipments.length;
  const chamadosAbertos = tickets.filter(
    (t) => t.status === 'RECEBIDO_TRIAGEM' || t.status === 'TECNICO_ATRIBUIDO'
  ).length;

  const instalacoesPendentes =
    equipments.filter((e) => e.status_instalacao !== 'INSTALADO_EM_OPERACAO').length +
    tickets.filter(
      (t) => t.tipo_servico === 'INSTALACAO_NOVO_APARELHO' && t.status !== 'CONCLUIDO'
    ).length;

  const preventivasAVencer = equipments.filter(
    (e) => e.daysRemaining <= 30 && e.status_instalacao === 'INSTALADO_EM_OPERACAO'
  ).length;

  const emDiaCount = equipments.filter((e) => e.daysRemaining > 30).length;
  const complianceRate = Math.round((emDiaCount / totalEquipments) * 100);

  return (
    <div className="space-y-6">
      {/* 4 Required Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Aparelhos Monitorados */}
        <div
          onClick={() => onNavigate('equipamentos')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Aparelhos Monitorados</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{totalEquipments}</span>
            <span className="text-xs text-blue-700 font-semibold">{clients.length} Clientes Ativos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">PF Residencial & PJ Corporativo/PMOC</p>
        </div>

        {/* Metric 2: Chamados Abertos */}
        <div
          onClick={() => onNavigate('kanban')}
          className="p-5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 transition cursor-pointer shadow-xs group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chamados Abertos</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 group-hover:scale-105 transition">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 font-mono">{chamadosAbertos}</span>
            <span className="text-xs font-semibold text-rose-700">Triagem & Atribuição</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">SLA técnico prioritário em andamento</p>
        </div>

        {/* Metric 3: Instalações Pendentes */}
        <div
          onClick={() => onNavigate('equipamentos')}
          className="p-5 rounded-2xl bg-white border border-blue-200 hover:border-blue-400 transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Instalações Pendentes</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0a2540] font-mono">{instalacoesPendentes}</span>
            <span className="text-xs text-blue-700 font-semibold">Novos Aparelhos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Agendamento & Passagem de Tubulação</p>
        </div>

        {/* Metric 4: Preventivas a Vencer (< 30 dias) */}
        <div
          onClick={() => onNavigate('equipamentos')}
          className="p-5 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Preventivas a Vencer (&lt; 30d)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">{preventivasAVencer}</span>
            <span className="text-xs text-amber-700 font-semibold">Ciclo de 6 Meses</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disparo de pop-up preventivo ativo</p>
        </div>
      </div>

      {/* Contract Sanitary Health & Client Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Gauge Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Índice Sanitário PMOC Geral</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Lei 13.589/2018
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-200 stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-blue-700 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - complianceRate / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 font-mono">{complianceRate}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Em Conformidade</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              {emDiaCount} de {totalEquipments} aparelhos com ciclo de manutenção semestral e laudo de qualidade do ar 100% vigentes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('equipamentos')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            Ver Detalhes dos Aparelhos ➔
          </button>
        </div>

        {/* Clients Overview Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Carteira de Clientes & Recintos</span>
              </h3>
              <button
                onClick={() => onNavigate('clientes')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
              >
                Abrir Gestão 360° ➔
              </button>
            </div>

            <div className="space-y-3">
              {clients.map((cli) => {
                const clientEqs = equipments.filter((e) => e.cliente_id === cli.id);
                const hasCritical = clientEqs.some((e) => e.daysRemaining <= 30);

                return (
                  <div
                    key={cli.id}
                    onClick={() => onNavigate('clientes')}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{cli.nome_completo}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            cli.tipo_cliente === 'PF'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {cli.tipo_cliente}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cli.enderecos.length} recinto(s) cadastrado(s) • WhatsApp: {cli.whatsapp}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-blue-700">
                        {clientEqs.length} ar(es)
                      </span>
                      {hasCritical && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Preventiva &lt; 30d
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-700" />
              Gestão Unificada PF Residencial e PMOC Jurídico
            </span>
            <button
              onClick={() => onNavigate('kanban')}
              className="text-blue-700 hover:text-blue-900 font-semibold"
            >
              Abrir Kanban de OS ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
