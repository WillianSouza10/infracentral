import React, { useState } from 'react';
import { Domain, User, UserRole } from '../types';
import PasswordCell from './PasswordCell';
import { Globe, Plus, X, Check, Search, Filter, Calendar, ShieldCheck, AlertCircle, ArrowUpDown, Trash2, Edit } from 'lucide-react';

interface DomainManagementProps {
  domains: Domain[];
  user: User;
  onAddDomain: (domain: Domain) => void;
  onRemoveDomain: (id: string) => void;
  onUpdateDomain: (domain: Domain) => void;
}

const DomainManagement: React.FC<DomainManagementProps> = ({ domains, user, onAddDomain, onRemoveDomain, onUpdateDomain }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'renewal' | 'acquisition'>('renewal');

  // Form State
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('GoDaddy');
  const [customProvider, setCustomProvider] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [serverIp, setServerIp] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState<Domain['status']>('Active');

  const handleEditDomain = (domain: Domain) => {
    setEditingDomainId(domain.id);
    setUrl(domain.url);
    
    // Check if provider is in the standard list
    const standardProviders = ['GoDaddy', 'RegistroBR', 'AWS', 'Namecheap', 'Hostinger', 'Google Domains', 'Hostgator'];
    if (standardProviders.includes(domain.provider)) {
      setProvider(domain.provider);
      setCustomProvider('');
    } else {
      setProvider('Outros');
      setCustomProvider(domain.provider);
    }

    setLogin(domain.login || '');
    setPassword(domain.password || '');
    setServerIp(domain.serverIp || '');
    setAcquisitionDate(domain.acquisitionDate || '');
    setRenewalDate(domain.renewalDate);
    setCost(domain.cost.toString());
    setStatus(domain.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domainData: Domain = {
      id: editingDomainId || Math.random().toString(36).substr(2, 9),
      url,
      provider: provider === 'Outros' ? customProvider : provider,
      login,
      password,
      serverIp,
      acquisitionDate,
      renewalDate,
      cost: Number(cost),
      status: status,
    };
    
    if (editingDomainId) {
      onUpdateDomain(domainData);
    } else {
      onAddDomain(domainData);
    }
    
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setUrl('');
    setProvider('GoDaddy');
    setCustomProvider('');
    setLogin('');
    setPassword('');
    setServerIp('');
    setAcquisitionDate('');
    setRenewalDate('');
    setCost('');
    setStatus('Active');
    setEditingDomainId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este domínio? Esta ação não pode ser desfeita.')) {
      onRemoveDomain(id);
    }
  };

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-700">
            <ShieldCheck size={12} className="mr-1" /> Ativo
          </span>
        );
      case 'Expiring':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-400 border border-amber-700">
            <AlertCircle size={12} className="mr-1" /> Expirando
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-900/50 text-rose-400 border border-rose-700">
            Expirado
          </span>
        );
    }
  };

  const filteredDomains = domains
    .filter(d => {
      const matchesSearch = d.url.toLowerCase().includes(searchTerm.toLowerCase()) || d.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'renewal') {
        return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
      } else {
        const dateA = a.acquisitionDate ? new Date(a.acquisitionDate).getTime() : 0;
        const dateB = b.acquisitionDate ? new Date(b.acquisitionDate).getTime() : 0;
        return dateB - dateA; // Newest first for acquisition
      }
    });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <Globe className="mr-3 text-primary" size={24} />
            Gerenciamento de Domínios
          </h2>
          <p className="text-sm text-slate-500">Controle de vencimentos, provedores e credenciais de acesso.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-primary/25"
          >
            <Plus size={18} className="mr-2" />
            Novo Domínio
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-surface border border-slate-700 rounded-xl">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por URL ou Provedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none text-sm"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none appearance-none text-sm"
          >
            <option value="All">Todos os Status</option>
            <option value="Active">Ativos</option>
            <option value="Expiring">Expirando</option>
            <option value="Expired">Expirados</option>
          </select>
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full pl-10 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none appearance-none text-sm"
          >
            <option value="renewal">Ordenar por Renovação</option>
            <option value="acquisition">Ordenar por Aquisição</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Domínio / Provedor</th>
                {isAdmin ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Acesso Provedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP Servidor</th>
                  </>
                ) : (
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Custo Anual</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" /> Datas
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-slate-700">
              {filteredDomains.map((domain, idx) => (
                <tr key={domain.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-slate-800/30 hover:bg-slate-800/50 transition-colors'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <a href={`https://${domain.url}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-200 hover:text-primary transition-colors flex items-center">
                        {domain.url}
                      </a>
                      <span className="text-xs text-slate-500 mt-0.5">{domain.provider}</span>
                    </div>
                  </td>
                  
                  {isAdmin ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-xs text-slate-400">
                            <span className="w-10">User:</span>
                            <span className="font-mono text-slate-300">{domain.login || '-'}</span>
                          </div>
                          <div className="flex items-center text-xs text-slate-400">
                            <span className="w-10">Pass:</span>
                            <PasswordCell value={domain.password} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="font-mono text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                           {domain.serverIp || 'Não vinculado'}
                         </span>
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">R$ {domain.cost.toFixed(2)}</td>
                  )}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs">
                        <span className="text-slate-500 mr-2">Renova:</span>
                        <span className="text-slate-200 font-medium">{domain.renewalDate}</span>
                      </div>
                      {domain.acquisitionDate && (
                        <div className="text-xs">
                          <span className="text-slate-500 mr-2">Adquirido:</span>
                          <span className="text-slate-400">{domain.acquisitionDate}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(domain.status)}
                  </td>

                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditDomain(domain)}
                          className="p-1 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          title="Editar Domínio"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(domain.id)}
                          className="p-1 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                          title="Remover Domínio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Domain */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">{editingDomainId ? 'Editar Domínio' : 'Adicionar Novo Domínio'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">URL do Domínio</label>
                  <input 
                    type="text" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="exemplo.com.br"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Provedor</label>
                  <select 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  >
                    <option value="GoDaddy">GoDaddy</option>
                    <option value="RegistroBR">Registro.br</option>
                    <option value="AWS">AWS Route53</option>
                    <option value="Namecheap">Namecheap</option>
                    <option value="Hostinger">Hostinger</option>
                    <option value="Google Domains">Google Domains</option>
                    <option value="Hostgator">Hostgator</option>
                    <option value="Outros">Outros</option>
                  </select>
                  
                  {provider === 'Outros' && (
                    <div className="mt-2 animate-fade-in-up">
                      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome do Provedor</label>
                      <input 
                        type="text" 
                        required
                        value={customProvider}
                        onChange={(e) => setCustomProvider(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                        placeholder="Digite o nome do provedor"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Domain['status'])}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  >
                    <option value="Active">Ativo</option>
                    <option value="Expiring">Expirando</option>
                    <option value="Expired">Expirado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">IP do Servidor (Opcional)</label>
                  <input 
                    type="text" 
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none font-mono"
                    placeholder="192.168.0.1"
                  />
                </div>

                <div className="md:col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-3 block">ACESSO AO PROVEDOR</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Login / Email</label>
                  <input 
                    type="text" 
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Senha</label>
                  <input 
                    type="text" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-3 block">DETALHES FINANCEIROS</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Data de Aquisição</label>
                  <input 
                    type="date" 
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Próxima Renovação</label>
                  <input 
                    type="date" 
                    required
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Custo Anual (R$)</label>
                   <input 
                    type="number" 
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
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
                  Salvar Domínio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainManagement;