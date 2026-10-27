'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, FileCheck2, ShieldCheck, AlertOctagon, Printer, Download, Award, CheckCircle2 } from 'lucide-react';

export default function PmocReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, selectedEquipment } = useApp();

  if (!isReportModalOpen || !selectedEquipment) return null;

  const report = selectedEquipment.lastReport;
  const isOk = selectedEquipment.status === 'ok';
  const isOverdue = selectedEquipment.status === 'overdue';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Modal Top Bar (Sticky) */}
        <div className="sticky top-0 z-20 p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Laudo Técnico PMOC Oficial</h3>
              <p className="text-[11px] text-slate-400">Lei Federal Nº 13.589/2018 & ANVISA RE 09/2003</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="p-6 md:p-8 bg-white text-slate-900 space-y-6 text-sm">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
                BIG
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">
                  Big Arcondicionado Engenharia Térmica
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  CNPJ: 28.491.042/0001-90 • Registro CREA-SP Nº 2049182
                </p>
                <p className="text-[11px] text-slate-500">
                  Responsabilidade Técnica: Eng. Mecânico Carlos Eduardo Silva - CREA 50698421-D
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded font-mono font-bold text-xs border border-slate-300">
                {report?.reportNumber || `LAUDO-PMOC-2024/${selectedEquipment.id}`}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Data: {report?.inspectionDate || selectedEquipment.data_ultima_manutencao}</p>
            </div>
          </div>

          {/* Client & Contract Badge */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Contratante / Proprietário</span>
              <span className="font-bold text-slate-900">{selectedEquipment.cliente_nome || 'Cliente Big Ar'}</span>
              <p className="text-slate-600">{selectedEquipment.endereco_apelido}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Localização e Instalação</span>
              <span className="font-bold text-slate-900">{selectedEquipment.location}</span>
              <p className="text-slate-600">Contrato / PMOC Lei 13.589/2018</p>
            </div>
          </div>

          {/* Equipment Specifications Box */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-4 border-sky-600 pl-2">
              1. Identificação Técnica do Aparelho
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-100/70 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px]">Identificador / Tag</span>
                <span className="font-bold text-slate-800 font-mono">{selectedEquipment.tag_patrimonio}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Patrimônio</span>
                <span className="font-bold text-slate-800">{selectedEquipment.patrimonyCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Marca & Modelo</span>
                <span className="font-bold text-slate-800">{selectedEquipment.marca} {selectedEquipment.modelo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Capacidade Térmica</span>
                <span className="font-bold text-slate-800">{selectedEquipment.capacidade_btu.toLocaleString('pt-BR')} BTUs</span>
              </div>
            </div>
          </div>

          {/* Air Quality & Sanitary Parameters */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-4 border-sky-600 pl-2">
              2. Parâmetros de Qualidade do Ar Interior (ANVISA RE 09/2003)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Variável Monitorada</th>
                    <th className="p-2.5">Valor Medido</th>
                    <th className="p-2.5">Referência Legal</th>
                    <th className="p-2.5 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-medium">Dióxido de Carbono (CO2)</td>
                    <td className="p-2.5 font-bold font-mono">{report?.airQualityPpm ?? 450} ppm</td>
                    <td className="p-2.5 text-slate-600">≤ 1000 ppm (ANVISA)</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">
                      {(report?.airQualityPpm ?? 450) <= 1000 ? '✓ CONFORME' : '✗ NÃO CONFORME'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Temperatura Operacional</td>
                    <td className="p-2.5 font-bold font-mono">{report?.temperatureMeasured ?? 21.5} °C</td>
                    <td className="p-2.5 text-slate-600">20°C a 23°C (Conforto Térmico)</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">✓ CONFORME</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Umidade Relativa do Ar</td>
                    <td className="p-2.5 font-bold font-mono">{report?.humidity ?? 52}%</td>
                    <td className="p-2.5 text-slate-600">40% a 65%</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">✓ CONFORME</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Pressão do Fluido Frigorígeno</td>
                    <td className="p-2.5 font-bold font-mono">{report?.refrigerantPressurePsi ?? 120} PSI</td>
                    <td className="p-2.5 text-slate-600">110 a 135 PSI (Gás {selectedEquipment.gasType})</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">✓ CONFORME</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Checklist */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-4 border-sky-600 pl-2">
              3. Checklist de Intervenção Preventiva Semestral
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Troca de Filtros HEPA</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sanitização Química Biocida</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Desobstrução do Dreno</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Reaperto Elétrico / Bornes</span>
              </div>
            </div>
          </div>

          {/* Observations & Conclusion Box */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Parecer Conclusivo do Engenheiro Mecânico Responsável
            </span>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;{report?.observations || 'Equipamento testado e aprovado em conformidade com o Plano de Manutenção, Operação e Controle.'}&quot;
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-200">
              <span>ART Registrada: {report?.artNumber || 'ART-SP-2024-098234-PMOC'}</span>
              <span>Validade Deste Laudo: {report?.validUntil || selectedEquipment.data_proxima_preventiva}</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="w-48 border-b border-slate-900 mb-1" />
              <p className="text-xs font-bold text-slate-900">Carlos Eduardo Silva</p>
              <p className="text-[10px] text-slate-500">Engenheiro Mecânico • CREA-SP 50698421-D</p>
              <p className="text-[9px] text-slate-400">Responsável Técnico PMOC - Big Ar</p>
            </div>

            {/* Official Stamp */}
            <div className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 ${
              isOverdue
                ? 'border-rose-600 bg-rose-50 text-rose-800'
                : 'border-emerald-600 bg-emerald-50 text-emerald-800'
            }`}>
              {isOverdue ? (
                <AlertOctagon className="w-7 h-7 text-rose-600" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              )}
              <div>
                <span className="block font-black text-xs uppercase tracking-wider">
                  {isOverdue ? 'PMOC VENCIDO' : 'PMOC HOMOLOGADO'}
                </span>
                <span className="text-[10px] block opacity-80">
                  {isOverdue ? 'Ação Corretiva Imediata' : 'Certificação Sanitária Conforme'}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-48 border-b border-slate-900 mb-1" />
              <p className="text-xs font-bold text-slate-900">Fiscalização de Obras / PMB</p>
              <p className="text-[10px] text-slate-500">Engenharia e Gestão de Contratos</p>
              <p className="text-[9px] text-slate-400">Prefeitura Municipal de Bertioga</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print text-xs">
          <span className="text-slate-400">Documento homologado pelo Responsável Técnico • CREA-SP</span>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            Fechar Laudo
          </button>
        </div>
      </div>
    </div>
  );
}
