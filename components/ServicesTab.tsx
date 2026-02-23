import React, { useState } from 'react';
import { ServiceContract, User, UserRole } from '../types';
import { Plus, FileText, Phone, Mail, Calendar, Search, X, Upload, Smartphone, User as UserIcon, Filter, Settings, Trash2, AlertTriangle, Edit } from 'lucide-react';

interface ServicesTabProps {
  services: ServiceContract[];
  user: User;
  onAddService: (service: ServiceContract) => void;
  onRemoveService: (id: string) => void;
  onUpdateService: (service: ServiceContract) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, user, onAddService, onRemoveService, onUpdateService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const isAdmin = user.role === UserRole.ADMIN;

  // Category State
  const [categories, setCategories] = useState(['Links de Internet', 'Infraestrutura', 'Segurança', 'Licenciamento', 'Suporte']);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State
  const [providerName, setProviderName] = useState('');
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [email, setEmail] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [category, setCategory] = useState('Infraestrutura');

  // New Cost Structure State
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringValue, setRecurringValue] = useState('');
  const [hasSetup, setHasSetup] = useState(false);
  const [setupValue, setSetupValue] = useState('');
  const [hasPenalty, setHasPenalty] = useState(false);
  const [penaltyValue, setPenaltyValue] = useState('');
  const [durationMonths, setDurationMonths] = useState('');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    const isUsed = services.some(service => service.category === catToDelete);
    if (isUsed) {
      alert(`Impossível excluir. Existem contratos ativos nesta categoria. Reatribua-os para continuar.`);
      return;
    }
    setCategories(categories.filter(c => c !== catToDelete));
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      onRemoveService(serviceToDelete);
      setServiceToDelete(null);
    }
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ServiceContract | null>(null);
  const [isAutoRenew, setIsAutoRenew] = useState(false);
  const [contractPdf, setContractPdf] = useState<File | null>(null);

  const handleDetailsClick = (service: ServiceContract) => {
    setSelectedContract(service);
    setIsDetailsModalOpen(true);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractPdf(e.target.files[0]);
    }
  };

  const handleEditService = (service: ServiceContract) => {
    setEditingServiceId(service.id);
    setProviderName(service.providerName);
    setAcquisitionDate(service.acquisitionDate);
    setExpirationDate(service.expirationDate || '');
    setPhoneNumber(service.phoneNumber);
    setCellNumber(service.cellNumber);
    setEmail(service.email);
    setSupportEmail(service.supportEmail);
    setCategory(service.category);
    
    // Set Costs
    setIsRecurring(service.costs.recurring > 0);
    setRecurringValue(service.costs.recurring > 0 ? service.costs.recurring.toString() : '');
    setHasSetup(service.costs.setup > 0);
    setSetupValue(service.costs.setup > 0 ? service.costs.setup.toString() : '');
    setHasPenalty(service.costs.penalty > 0);
    setPenaltyValue(service.costs.penalty > 0 ? service.costs.penalty.toString() : '');
    setDurationMonths(service.durationMonths.toString());
    setIsAutoRenew(service.autoRenew);

    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: ServiceContract = {
      id: editingServiceId || Math.random().toString(36).substr(2, 9),
      providerName,
      contractFile: contractFile ? contractFile.name : 'contrato_generico.pdf', // Mocking file upload
      contractPdf: contractPdf ? contractPdf.name : null,
      acquisitionDate,
      expirationDate: isAutoRenew ? undefined : expirationDate,
      phoneNumber,
      cellNumber,
      email,
      supportEmail,
      category,
      costs: {
        recurring: isRecurring ? parseFloat(recurringValue) || 0 : 0,
        setup: hasSetup ? parseFloat(setupValue) || 0 : 0,
        penalty: hasPenalty ? parseFloat(penaltyValue) || 0 : 0
      },
      durationMonths: parseInt(durationMonths) || 0,
      autoRenew: isAutoRenew
    };

    if (editingServiceId && onUpdateService) {
      onUpdateService(serviceData);
    } else {
      onAddService(serviceData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProviderName('');
    setContractFile(null);
    setContractPdf(null);
    setAcquisitionDate('');
    setExpirationDate('');
    setPhoneNumber('');
    setCellNumber('');
    setEmail('');
    setSupportEmail('');
    setCategory('Infraestrutura');
    setEditingServiceId(null);
    setIsRecurring(false);
    setRecurringValue('');
    setHasSetup(false);
    setSetupValue('');
    setHasPenalty(false);
    setPenaltyValue('');
    setDurationMonths('');
    setIsAutoRenew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Gestão de Serviços</h2>
          <p className="text-slate-400">Contratos e contatos de prestadores de serviço</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors border border-slate-700"
              title="Gerenciar Categorias"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} className="mr-2" />
              Novo Serviço
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por prestador ou email..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <select
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-surface border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all shadow-lg group relative">
            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditService(service)}
                  className="p-2 bg-slate-900/80 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors z-10"
                  title="Editar Contrato"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => setServiceToDelete(service.id)}
                  className="p-2 bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors z-10"
                  title="Excluir Contrato"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <div className="p-5 border-b border-slate-700 bg-slate-800/30 flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{service.providerName}</h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">{service.category || 'Geral'}</span>
                </div>
              </div>
              <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                 <FileText size={16} className="text-slate-400" />
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Recorrente (Mensal)</span>
                  <div className="flex items-center text-slate-200 text-sm font-bold">
                    R$ {service.costs.recurring.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Implementação</span>
                  <div className="flex items-center text-slate-200 text-sm font-bold">
                    R$ {service.costs.setup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Aquisição</span>
                  <div className="flex items-center text-slate-300 text-sm">
                    <Calendar size={14} className="mr-1.5 text-emerald-500" />
                    {new Date(service.acquisitionDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Renovação</span>
                  <div className="flex items-center text-slate-300 text-sm">
                    <Calendar size={14} className="mr-1.5 text-amber-500" />
                    {service.autoRenew ? 'Automática' : (service.expirationDate ? new Date(service.expirationDate).toLocaleDateString('pt-BR') : 'N/A')}
                  </div>
                </div>
              </div>

              {/* Details Button */}
              <div className="pt-2">
                <button 
                  onClick={() => handleDetailsClick(service)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors border border-slate-700 group-hover:border-slate-600"
                >
                  <FileText size={16} className="mr-2" />
                  Informações de Contrato
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p>Nenhum serviço encontrado.</p>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-slate-100">Gerenciar Categorias</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newCategoryName}
                  className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <span className="text-slate-200">{cat}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-slate-500 hover:text-rose-500 transition-colors"
                      title="Excluir Categoria"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-surface z-10">
              <h3 className="text-xl font-bold text-slate-100">Detalhes do Contrato</h3>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Financial Details */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Financeiro</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 block mb-1">Valor Recorrente</span>
                    <span className="text-xl font-bold text-slate-100">R$ {selectedContract.costs.recurring.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 block mb-1">Taxa de Implementação</span>
                    <span className="text-xl font-bold text-slate-100">R$ {selectedContract.costs.setup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 block mb-1">Multa de Cancelamento</span>
                    <span className="text-xl font-bold text-rose-400">R$ {selectedContract.costs.penalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Contatos do Fornecedor</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-slate-400">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Fornecedor</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.providerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-slate-400">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Telefone</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-slate-400">
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Celular</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.cellNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-slate-400">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Email</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-rose-400/20 text-rose-400">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Email de Suporte</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.supportEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Status */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Status do Contrato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block">Duração</span>
                      <span className="text-sm font-medium text-slate-200">{selectedContract.durationMonths} meses</span>
                    </div>
                    <Calendar size={20} className="text-slate-600" />
                  </div>
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block">Renovação</span>
                      <span className={`text-sm font-medium ${selectedContract.autoRenew ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedContract.autoRenew ? 'Automática' : 'Manual'}
                      </span>
                    </div>
                    {selectedContract.autoRenew ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Download Actions */}
              <div className="pt-4 border-t border-slate-700 flex gap-4">
                <button className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700 group">
                  <Upload size={18} className="mr-2 rotate-180 group-hover:translate-y-1 transition-transform" />
                  Baixar PDF do Contrato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-surface border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-fade-in p-6 text-center">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Excluir Contrato?</h3>
            <p className="text-slate-400 mb-6">
              Deseja excluir este contrato? Esta ação afetará os relatórios financeiros do Diretor Willian Souza.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteService}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg shadow-rose-500/20 transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-surface z-10">
              <h3 className="text-xl font-bold text-slate-100">Adicionar Novo Serviço</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Provider Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Informações do Prestador</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Prestador</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                      placeholder="Ex: TechSupport Solutions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Categoria</label>
                    <select
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Arquivo do Contrato (PDF)</label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        id="contract-pdf-upload"
                        accept=".pdf"
                        onChange={handlePdfChange}
                      />
                      <label 
                        htmlFor="contract-pdf-upload"
                        className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 hover:border-slate-500 transition-colors text-slate-400 text-sm"
                      >
                        <Upload size={16} className="mr-2" />
                        {contractPdf ? contractPdf.name : (editingServiceId && services.find(s => s.id === editingServiceId)?.contractPdf ? services.find(s => s.id === editingServiceId)?.contractPdf : 'Anexar PDF...')}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Duração do Contrato (Meses)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                      placeholder="Ex: 12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Data de Aquisição</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={acquisitionDate}
                      onChange={(e) => setAcquisitionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-slate-300">Data de Renovação</label>
                      <div className="flex items-center">
                        <input
                          id="autoRenew"
                          type="checkbox"
                          checked={isAutoRenew}
                          onChange={(e) => setIsAutoRenew(e.target.checked)}
                          className="w-3 h-3 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary focus:ring-1 mr-1.5"
                        />
                        <label htmlFor="autoRenew" className="text-xs text-slate-400 cursor-pointer select-none">Renovação Automática</label>
                      </div>
                    </div>
                    {!isAutoRenew ? (
                      <input
                        type="date"
                        required={!isAutoRenew}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none animate-fade-in"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                      />
                    ) : (
                      <div className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2 text-slate-500 text-sm italic animate-fade-in cursor-not-allowed">
                        Renovação automática habilitada
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Detalhamento Financeiro</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center h-10">
                      <input
                        id="recurring"
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-4 h-4 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="recurring" className="ml-2 text-sm font-medium text-slate-300">Valor Recorrente (Mensal)</label>
                    </div>
                    {isRecurring && (
                      <input
                        type="number"
                        step="0.01"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none animate-fade-in"
                        value={recurringValue}
                        onChange={(e) => setRecurringValue(e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center h-10">
                      <input
                        id="setup"
                        type="checkbox"
                        checked={hasSetup}
                        onChange={(e) => setHasSetup(e.target.checked)}
                        className="w-4 h-4 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="setup" className="ml-2 text-sm font-medium text-slate-300">Taxa de Implementação (Setup)</label>
                    </div>
                    {hasSetup && (
                      <input
                        type="number"
                        step="0.01"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none animate-fade-in"
                        value={setupValue}
                        onChange={(e) => setSetupValue(e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center h-10">
                      <input
                        id="penalty"
                        type="checkbox"
                        checked={hasPenalty}
                        onChange={(e) => setHasPenalty(e.target.checked)}
                        className="w-4 h-4 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="penalty" className="ml-2 text-sm font-medium text-slate-300">Multa de Cancelamento</label>
                    </div>
                    {hasPenalty && (
                      <input
                        type="number"
                        step="0.01"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none animate-fade-in"
                        value={penaltyValue}
                        onChange={(e) => setPenaltyValue(e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Contatos</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Telefone Fixo</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Celular</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={cellNumber}
                      onChange={(e) => setCellNumber(e.target.value)}
                      placeholder="(00) 90000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email do Prestador</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email de Suporte</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="suporte@empresa.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
