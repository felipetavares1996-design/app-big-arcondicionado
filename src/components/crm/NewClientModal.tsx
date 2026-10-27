'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, UserPlus, Building, User, Plus, Trash2, Check } from 'lucide-react';
import { ClientType, AddressRecinto } from '@/types';

export default function NewClientModal() {
  const { isNewClientModalOpen, setIsNewClientModalOpen, addNewClient } = useApp();

  const [tipoCliente, setTipoCliente] = useState<ClientType>('PF');
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Dynamic recintos
  const [recintos, setRecintos] = useState<Omit<AddressRecinto, 'id'>[]>([
    {
      apelido: 'Residência Principal',
      logradouro: 'Av. Anchieta',
      numero: '1200',
      bairro: 'Centro',
      cidade: 'Bertioga - SP',
    },
  ]);

  if (!isNewClientModalOpen) return null;

  const handleAddRecinto = () => {
    setRecintos((prev) => [
      ...prev,
      {
        apelido: `Novo Recinto ${prev.length + 1}`,
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: 'Bertioga - SP',
      },
    ]);
  };

  const handleRemoveRecinto = (index: number) => {
    if (recintos.length <= 1) return;
    setRecintos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRecintoChange = (index: number, field: keyof Omit<AddressRecinto, 'id'>, value: string) => {
    setRecintos((prev) =>
      prev.map((rec, i) => (i === index ? { ...rec, [field]: value } : rec))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    addNewClient({
      nome_completo: nome,
      tipo_cliente: tipoCliente,
      cpf_cnpj: cpfCnpj || '000.000.000-00',
      whatsapp: whatsapp || '(13) 99999-0000',
      email: email || 'cliente@exemplo.com.br',
      enderecos: recintos.map((r, i) => ({
        ...r,
        id: `rec-new-${Date.now()}-${i}`,
      })),
    });

    setIsNewClientModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-6">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <UserPlus className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cadastrar Novo Cliente</h3>
              <p className="text-[11px] text-slate-400">Pessoa Física ou Jurídica com Múltiplos Recintos</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewClientModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Tipo de Cliente (PF ou PJ) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Tipo de Cadastro:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoCliente('PF')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                  tipoCliente === 'PF'
                    ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Pessoa Física (Residencial)</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoCliente('PJ')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                  tipoCliente === 'PJ'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Pessoa Jurídica (Empresa / PMOC)</span>
              </button>
            </div>
          </div>

          {/* Nome e CPF/CNPJ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {tipoCliente === 'PF' ? 'Nome Completo:' : 'Razão Social / Órgão:'}
              </label>
              <input
                type="text"
                required
                placeholder={tipoCliente === 'PF' ? 'Ex: Marcelo Albuquerque' : 'Ex: Clínica Odontológica Sorriso'}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {tipoCliente === 'PF' ? 'CPF:' : 'CNPJ:'}
              </label>
              <input
                type="text"
                placeholder={tipoCliente === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>

          {/* Contato (WhatsApp & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp de Contato:</label>
              <input
                type="text"
                placeholder="(13) 99999-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">E-mail Corporativo/Pessoal:</label>
              <input
                type="email"
                placeholder="contato@cliente.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>

          {/* Recintos / Imóveis Dinâmicos */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs">
                Recintos & Endereços ({recintos.length}):
              </span>
              <button
                type="button"
                onClick={handleAddRecinto}
                className="flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Recinto</span>
              </button>
            </div>

            {recintos.map((rec, index) => (
              <div key={index} className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    required
                    placeholder="Apelido (ex: Casa de Praia, Sítio, Sala 1)"
                    value={rec.apelido}
                    onChange={(e) => handleRecintoChange(index, 'apelido', e.target.value)}
                    className="font-bold text-white bg-transparent border-b border-slate-700 focus:border-sky-500 text-xs pb-0.5 focus:outline-none w-2/3"
                  />
                  {recintos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecinto(index)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Logradouro"
                      value={rec.logradouro}
                      onChange={(e) => handleRecintoChange(index, 'logradouro', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Nº"
                      value={rec.numero}
                      onChange={(e) => handleRecintoChange(index, 'numero', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={rec.bairro}
                    onChange={(e) => handleRecintoChange(index, 'bairro', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={rec.cidade}
                    onChange={(e) => handleRecintoChange(index, 'cidade', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNewClientModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Novo Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
