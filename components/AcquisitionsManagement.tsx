import React, { useState } from 'react';
import { Acquisition, User, UserRole } from '../types';
import { ShoppingCart, Plus, Search, Filter, Check, X, CreditCard, UserCheck, Calendar, Trash2 } from 'lucide-react';

interface AcquisitionsManagementProps {
  acquisitions: Acquisition[];
  user: User;
  onAddAcquisition: (item: Acquisition) => void;
  onRemoveAcquisition: (id: string) => void;
}

const COST_CENTERS = [
  "Busca Clientes",
  "Doutores da Web",
  "Soluções Industriais",
  "MPI Solutions",
  "Clinica Ideal",
  "Ideal Odonto",
  "Ideal Business School",
  "Ideal Multi Business",
  "Grupo Ideal Trends",
  "Vue Odontologia",
  "Ideal Marketing",
  "Ideal Sales",
  "Ideal English School BR"
];

const AcquisitionsManagement: React.FC<AcquisitionsManagementProps> = ({ acquisitions, user, onAddAcquisition, onRemoveAcquisition }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [itemName, setItemName] = useState('');
  const [requester, setRequester] = useState('');
  const [approver, setApprover] = useState('');
  const [installments, setInstallments] = useState(1);
  const [costCenter, setCostCenter] = useState(COST_CENTERS[0]);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Acquisition = {
      id: `acq-${Math.random().toString(36).substr(2, 6)}`,
      itemName,
      requester,
      approver: approver || 'Pendente',
      installments: Number(installments),
      costCenter,
      value: Number(value),
      status: approver ? 'Approved' : 'Pending',
      date,
      category: 'Infra',
    };

    onAddAcquisition(newItem);
    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta requisição?')) {
      onRemoveAcquisition(id);
    }
  };

  const resetForm = () => {
    setItemName('');
    setRequester('');
    setApprover('');
    setInstallments(1);
    setCostCenter(COST_CENTERS[0]);
    setValue('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const getStatusBadge = (status: Acquisition['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-700">
            <Check size={12} className="mr-1" /> Aprovado
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-400 border border-amber-700">
            <CreditCard size={12} className="mr-1" /> Pendente
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-900/50 text-rose-400 border border-rose-700">
            <X size={12} className="mr-1" /> Rejeitado
          </span>
        );
    }
  };

  const filteredItems = acquisitions.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.costCenter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <ShoppingCart className="mr-3 text-primary" size={24} />
            Gestão de Aquisições
          </h2>
          <p className="text-sm text-slate-500">Controle de compras de infraestrutura, hardware e licenças.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-primary/25"
          >
            <Plus size={18} className="mr-2" />
            Nova Aquisição
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-surface border border-slate-700 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Buscar por Item, Solicitante ou Centro de Custo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none text-sm"
          />
        </div>

        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none appearance-none text-sm"
          >
            <option value="All">Todos os Status</option>
            <option value="Approved">Aprovados</option>
            <option value="Pending">Pendentes</option>
            <option value="Rejected">Rejeitados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Item / Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Solicitação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Centro de Custo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Financeiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-slate-700">
              {filteredItems.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-slate-800/30 hover:bg-slate-800/50 transition-colors'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{item.itemName}</span>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5">
                        <Calendar size={10} className="mr-1" /> {item.date}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-slate-400 flex items-center">
                        <span className="text-slate-500 w-16">Solicitante:</span>
                        <span className="text-slate-300 font-medium">{item.requester}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center">
                        <span className="text-slate-500 w-16">Aprovador:</span>
                        <span className={`font-medium ${item.approver === 'Pendente' ? 'text-amber-400' : 'text-slate-300'}`}>
                          {item.approver}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-700/50 text-xs text-slate-300 border border-slate-600">
                      {item.costCenter}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="text-xs text-slate-500">{item.installments}x de R$ {(item.value / item.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                        title="Remover Requisição"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Acquisition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">Nova Requisição de Compra</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Item / Descrição da Compra</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: Novo Notebook para Designer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Solicitante</label>
                  <input
                    type="text"
                    required
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                    placeholder="Nome do solicitante"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Aprovador (Opcional)</label>
                  <input
                    type="text"
                    value={approver}
                    onChange={(e) => setApprover(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                    placeholder="Deixe em branco se pendente"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Centro de Custo</label>
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  >
                    {COST_CENTERS.map(cc => (
                      <option key={cc} value={cc}>{cc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Valor Total (R$)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Parcelas</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 10, 12, 18, 24].map(n => (
                      <option key={n} value={n}>{n}x</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Data da Requisição</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Salvar Requisição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcquisitionsManagement;