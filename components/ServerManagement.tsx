import React, { useState } from 'react';
import { Server, User, UserRole, Application } from '../types';
import PasswordCell from './PasswordCell';
import { Server as ServerIcon, Plus, X, Check, Terminal, Copy, Globe, Trash2, Search, Filter, AppWindow, Database, Edit, Eye, ArrowLeft, AlertTriangle, ChevronDown } from 'lucide-react';

interface ServerManagementProps {
  servers: Server[];
  user: User;
  onAddServer: (server: Server) => void;
  onRemoveServer: (id: string) => void;
  onUpdateServer?: (server: Server) => void;
}

const ServerManagement: React.FC<ServerManagementProps> = ({ servers, user, onAddServer, onRemoveServer, onUpdateServer }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServerFullScreen, setSelectedServerFullScreen] = useState<Server | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);

  // App Search in Details
  const [appSearchTerm, setAppSearchTerm] = useState('');

  // Form State for New Server
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newIpExternal, setNewIpExternal] = useState('');
  const [newIpInternal, setNewIpInternal] = useState('');
  const [newUsername, setNewUsername] = useState('root');
  const [newPassword, setNewPassword] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newCpu, setNewCpu] = useState('');
  const [newRam, setNewRam] = useState('');
  const [newStorage, setNewStorage] = useState('');
  const [newStatus, setNewStatus] = useState<Server['status']>('Online');
  const [editingServerId, setEditingServerId] = useState<string | null>(null);

  // Form State for New Application
  const [newAppName, setNewAppName] = useState('');
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  const providers = Array.from(new Set(servers.map(s => s.provider)));
  const appCompanies = Array.from(new Set(servers.flatMap(s => s.applications || []).map(a => a.company)));

  const filteredServers = servers.filter(server => {
    // Skip servers with incomplete data to prevent rendering errors
    if (!server || !server.id || !server.name || !server.ipExternal || !server.ipInternal) {
      return false;
    }

    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.ipExternal?.includes(searchTerm) ||
      server.ipInternal?.includes(searchTerm) ||
      server.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = providerFilter ? server.provider === providerFilter : true;
    return matchesSearch && matchesProvider;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const confirmDeleteServer = () => {
    if (serverToDelete) {
      onRemoveServer(serverToDelete);
      if (selectedServerFullScreen?.id === serverToDelete) {
        setSelectedServerFullScreen(null);
      }
      setServerToDelete(null);
    }
  };

  const handleEditServer = (server: Server) => {
    setEditingServerId(server.id);
    setNewName(server.name);
    setNewProvider(server.provider);
    setNewIpExternal(server.ipExternal || '');
    setNewIpInternal(server.ipInternal || '');
    setNewUsername(server.username || 'root');
    setNewPassword(server.password || '');
    setNewCost(server.cost.toString());
    setNewCpu(server.hardware?.cpu || '');
    setNewRam(server.hardware?.ram || '');
    setNewStorage(server.hardware?.storage || '');
    setNewStatus(server.status);
    setIsModalOpen(true);
  };

  const handleSubmitServer = (e: React.FormEvent) => {
    e.preventDefault();

    const serverData: Server = {
      id: editingServerId || `srv-${Math.random().toString(36).substr(2, 6)}`,
      name: newName,
      provider: newProvider,
      ipReal: newIpExternal, // Keep for backward compatibility if needed
      ipExternal: newIpExternal,
      ipInternal: newIpInternal,
      username: newUsername,
      password: newPassword,
      status: newStatus,
      region: 'us-east-1',
      cost: parseFloat(newCost) || 0,
      uptime: '100%',
      applications: editingServerId ? servers.find(s => s.id === editingServerId)?.applications : [],
      hardware: {
        cpu: newCpu,
        ram: newRam,
        storage: newStorage
      }
    };

    if (editingServerId && onUpdateServer) {
      onUpdateServer(serverData);
      if (selectedServerFullScreen?.id === editingServerId) {
        setSelectedServerFullScreen(serverData);
      }
    } else {
      onAddServer(serverData);
    }

    resetServerForm();
  };

  const resetServerForm = () => {
    setNewName('');
    setNewProvider('');
    setNewIpExternal('');
    setNewIpInternal('');
    setNewUsername('root');
    setNewPassword('');
    setNewCost('');
    setNewCpu('');
    setNewRam('');
    setNewStorage('');
    setNewStatus('Online');
    setEditingServerId(null);
    setIsModalOpen(false);
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServerFullScreen || !onUpdateServer) return;

    const newApp: Application = {
      id: `app-${Math.random().toString(36).substr(2, 6)}`,
      name: newAppName,
      company: newAppCompany,
      description: newAppDescription
    };

    const updatedServer = {
      ...selectedServerFullScreen,
      applications: [...(selectedServerFullScreen.applications || []), newApp]
    };

    onUpdateServer(updatedServer);
    setSelectedServerFullScreen(updatedServer); // Update local view immediately

    setNewAppName('');
    setNewAppCompany('');
    setNewAppDescription('');
    setIsAppModalOpen(false);
  };

  const handleRemoveApplication = (appId: string) => {
    if (!selectedServerFullScreen || !onUpdateServer) return;

    if (confirm('Tem certeza que deseja remover esta aplicação do servidor?')) {
      const updatedServer = {
        ...selectedServerFullScreen,
        applications: (selectedServerFullScreen.applications || []).filter(app => app.id !== appId)
      };

      onUpdateServer(updatedServer);
      setSelectedServerFullScreen(updatedServer);
    }
  };

  const getStatusIndicator = (status: Server['status']) => {
    switch (status) {
      case 'Online':
        return <span className="flex items-center text-emerald-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Online</span>;
      case 'Offline':
        return <span className="flex items-center text-rose-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div> Offline</span>;
      case 'Maintenance':
        return <span className="flex items-center text-amber-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Manutenção</span>;
      case 'Deactivated':
        return <span className="flex items-center text-slate-500 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-slate-600 mr-2"></div> Desativado</span>;
    }
  };

  if (selectedServerFullScreen) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedServerFullScreen(null)}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para a lista de servidores
          </button>

          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => handleEditServer(selectedServerFullScreen)}
                className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                <Edit size={16} className="mr-2" />
                Editar Servidor
              </button>
              <button
                onClick={() => setServerToDelete(selectedServerFullScreen.id)}
                className="flex items-center px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors border border-rose-500/20"
              >
                <Trash2 size={16} className="mr-2" />
                Excluir Servidor
              </button>
            </div>
          )}
        </div>

        {/* Macro Information Section */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <ServerIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedServerFullScreen.name}</h2>
                  <div className="flex items-center text-sm text-slate-400 mt-1">
                    <Globe size={14} className="mr-1.5" />
                    {selectedServerFullScreen.provider} • {selectedServerFullScreen.region}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-end">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 min-w-[140px]">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Custo Mensal</span>
                <span className="text-xl font-bold text-slate-200">R$ {selectedServerFullScreen.cost.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 min-w-[140px]">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Status</span>
                <div className="mt-1">{getStatusIndicator(selectedServerFullScreen.status)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rede</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">IP Externo</span>
                  <div className="flex items-center group">
                    <span className="font-mono text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 select-all">{selectedServerFullScreen.ipExternal || 'N/A'}</span>
                    {selectedServerFullScreen.ipExternal && (
                      <button onClick={() => handleCopy(selectedServerFullScreen.ipExternal)} className="ml-2 text-slate-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">IP Interno</span>
                  <div className="flex items-center group">
                    <span className="font-mono text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 select-all">{selectedServerFullScreen.ipInternal || 'N/A'}</span>
                    {selectedServerFullScreen.ipInternal && (
                      <button onClick={() => handleCopy(selectedServerFullScreen.ipInternal)} className="ml-2 text-slate-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Hardware</h4>
              {selectedServerFullScreen.hardware ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-800">
                    <span className="text-xs text-slate-400">CPU</span>
                    <span className="text-sm font-medium text-slate-200">{selectedServerFullScreen.hardware.cpu}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-800">
                    <span className="text-xs text-slate-400">RAM</span>
                    <span className="text-sm font-medium text-slate-200">{selectedServerFullScreen.hardware.ram}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-800">
                    <span className="text-xs text-slate-400">Storage</span>
                    <span className="text-sm font-medium text-slate-200">{selectedServerFullScreen.hardware.storage}</span>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-slate-500 italic">Informações não disponíveis</span>
              )}
            </div>

            {isAdmin && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Acesso Administrativo</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">User:</span>
                    <span className="font-mono text-slate-200">{selectedServerFullScreen.username}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">Pass:</span>
                    <PasswordCell value={selectedServerFullScreen.password} />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center px-3 py-2 bg-black/40 rounded border border-slate-700/50 font-mono text-xs text-green-400 break-all">
                      <Terminal size={12} className="mr-2 text-slate-500 flex-shrink-0" />
                      ssh {selectedServerFullScreen.username}@{selectedServerFullScreen.ipExternal || selectedServerFullScreen.ipReal}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-surface border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center">
              <AppWindow size={20} className="mr-2 text-primary" />
              Aplicações Instaladas
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Buscar aplicação..."
                  className="w-full sm:w-64 bg-slate-900 border border-slate-700 text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  value={appSearchTerm}
                  onChange={(e) => setAppSearchTerm(e.target.value)}
                />
              </div>
              {isAdmin && (
                <button
                  onClick={() => setIsAppModalOpen(true)}
                  className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Aplicação
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedServerFullScreen.applications && selectedServerFullScreen.applications.length > 0 ? (
              selectedServerFullScreen.applications
                .filter(app => app.name.toLowerCase().includes(appSearchTerm.toLowerCase()) || app.company.toLowerCase().includes(appSearchTerm.toLowerCase()))
                .map(app => (
                  <div key={app.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors relative group">
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveApplication(app.id)}
                        className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Remover Aplicação"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="flex items-start justify-between mb-2 pr-8">
                      <h4 className="text-base font-bold text-slate-200">{app.name}</h4>
                      <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400">
                        <Database size={14} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center mb-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {app.company}
                    </p>
                    {app.description && (
                      <p className="text-sm text-slate-400 border-t border-slate-700/50 pt-3">
                        {app.description}
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                <AppWindow size={32} className="mx-auto mb-3 opacity-20" />
                <p>Nenhum aplicação cadastrada neste servidor.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modals for Full Screen View */}
        {/* Delete Confirmation Modal */}
        {serverToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-surface border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-fade-in p-6 text-center">
              <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Excluir Servidor?</h3>
              <p className="text-slate-400 mb-6">
                Tem certeza que deseja remover este servidor? Esta ação não pode ser desfeita e afetará os relatórios.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setServerToDelete(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteServer}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg shadow-rose-500/20 transition-colors"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Application Modal */}
        {isAppModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAppModalOpen(false)}></div>
            <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
              <div className="flex justify-between items-center p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">Adicionar Aplicação</h3>
                <button onClick={() => setIsAppModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddApplication} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome da Aplicação</label>
                  <input
                    type="text"
                    required
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: E-commerce Site"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Empresa / Cliente</label>
                  <input
                    list="company-options"
                    type="text"
                    required
                    value={newAppCompany}
                    onChange={(e) => setNewAppCompany(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: Cliente XYZ ou digite um novo"
                  />
                  <datalist id="company-options">
                    {appCompanies.map(company => (
                      <option key={company} value={company} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Descrição</label>
                  <textarea
                    value={newAppDescription}
                    onChange={(e) => setNewAppDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                    placeholder="Descreva a aplicação..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAppModalOpen(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                  >
                    <Check size={16} className="mr-2" />
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Server Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg relative z-10 animate-fade-in-up max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-surface z-10">
                <h3 className="text-lg font-semibold text-slate-100">Editar Servidor</h3>
                <button onClick={resetServerForm} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitServer} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome do Servidor</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: Production-DB-01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Provedor</label>
                    <input
                      type="text"
                      required
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: AWS"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Custo Mensal (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Status</label>
                    <div className="relative">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as Server['status'])}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Maintenance">Manutenção</option>
                        <option value="Deactivated">Desativado</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                    <span className="text-xs font-semibold text-slate-500 mb-3 block">HARDWARE</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 col-span-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">CPU</label>
                      <input
                        type="text"
                        value={newCpu}
                        onChange={(e) => setNewCpu(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        placeholder="Ex: 4 vCPU"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">RAM</label>
                      <input
                        type="text"
                        value={newRam}
                        onChange={(e) => setNewRam(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        placeholder="Ex: 16GB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Storage</label>
                      <input
                        type="text"
                        value={newStorage}
                        onChange={(e) => setNewStorage(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        placeholder="Ex: 100GB SSD"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                    <span className="text-xs font-semibold text-slate-500 mb-3 block">REDE</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">IP Externo</label>
                    <input
                      type="text"
                      required
                      value={newIpExternal}
                      onChange={(e) => setNewIpExternal(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      placeholder="Ex: 203.0.113.10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">IP Interno</label>
                    <input
                      type="text"
                      required
                      value={newIpInternal}
                      onChange={(e) => setNewIpInternal(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      placeholder="Ex: 10.0.1.10"
                    />
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                    <span className="text-xs font-semibold text-slate-500 mb-3 block">CREDENCIAIS DE ACESSO</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Usuário SSH</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      placeholder="root"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Senha Root</label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={resetServerForm}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                  >
                    <Check size={16} className="mr-2" />
                    Salvar Servidor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <ServerIcon className="mr-3 text-primary" size={24} />
            Infraestrutura de Servidores
          </h2>
          <p className="text-sm text-slate-500">Gerenciamento completo de VPS, Dedicados e Instâncias Cloud.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-primary/25"
          >
            <Plus size={18} className="mr-2" />
            Adicionar Servidor
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Buscar servidor por nome, IP ou provedor..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <select
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
          >
            <option value="">Todos os Provedores</option>
            {providers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Servers List */}
        <div className="w-full transition-all duration-300">
          <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Servidor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Hardware</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IPs</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Custo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-slate-700">
                  {filteredServers.map((server, idx) => (
                    <tr
                      key={server.id}
                      onClick={() => setSelectedServerFullScreen(server)}
                      className={`cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-surface hover:bg-slate-800/50' : 'bg-slate-800/30 hover:bg-slate-800/50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-200">{server.name}</span>
                          <span className="text-xs text-slate-500 flex items-center mt-1">
                            <Globe size={10} className="mr-1" /> {server.provider} • {server.region}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-xs text-slate-400">
                          {server.hardware ? (
                            <>
                              <span className="font-mono text-slate-300">{server.hardware.cpu}</span>
                              <span>{server.hardware.ram} • {server.hardware.storage}</span>
                            </>
                          ) : (
                            <span className="italic opacity-50">N/A</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-xs">
                            <span className="text-slate-500 w-8">Ext:</span>
                            <span className="font-mono text-slate-300">{server.ipExternal || server.ipReal || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="text-slate-500 w-8">Int:</span>
                            <span className="font-mono text-slate-400">{server.ipInternal || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        R$ {server.cost.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIndicator(server.status)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedServerFullScreen(server);
                          }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Servidor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg relative z-10 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-surface z-10">
              <h3 className="text-lg font-semibold text-slate-100">{editingServerId ? 'Editar Servidor' : 'Adicionar Novo Servidor'}</h3>
              <button onClick={resetServerForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitServer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome do Servidor</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: Production-DB-01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Provedor</label>
                  <input
                    type="text"
                    required
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ex: AWS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Custo Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-3 block">HARDWARE</span>
                </div>

                <div className="grid grid-cols-3 gap-3 col-span-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">CPU</label>
                    <input
                      type="text"
                      value={newCpu}
                      onChange={(e) => setNewCpu(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Ex: 4 vCPU"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">RAM</label>
                    <input
                      type="text"
                      value={newRam}
                      onChange={(e) => setNewRam(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Ex: 16GB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Storage</label>
                    <input
                      type="text"
                      value={newStorage}
                      onChange={(e) => setNewStorage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      placeholder="Ex: 100GB SSD"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Status</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Server['status'])}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Maintenance">Manutenção</option>
                      <option value="Deactivated">Desativado</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-3 block">REDE</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">IP Externo</label>
                  <input
                    type="text"
                    required
                    value={newIpExternal}
                    onChange={(e) => setNewIpExternal(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    placeholder="Ex: 203.0.113.10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">IP Interno</label>
                  <input
                    type="text"
                    required
                    value={newIpInternal}
                    onChange={(e) => setNewIpInternal(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    placeholder="Ex: 10.0.1.10"
                  />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-700/50 mt-2">
                  <span className="text-xs font-semibold text-slate-500 mb-3 block">CREDENCIAIS DE ACESSO</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Usuário SSH</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    placeholder="root"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Senha Root</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetServerForm}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Salvar Servidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Aplicação */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAppModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">Adicionar Aplicação</h3>
              <button onClick={() => setIsAppModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome da Aplicação</label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: E-commerce Site"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Empresa / Cliente</label>
                <input
                  type="text"
                  required
                  value={newAppCompany}
                  onChange={(e) => setNewAppCompany(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Cliente XYZ"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Descrição</label>
                <textarea
                  value={newAppDescription}
                  onChange={(e) => setNewAppDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                  placeholder="Descreva a aplicação..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerManagement;
