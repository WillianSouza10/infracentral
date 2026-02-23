
import React, { useState, useEffect } from 'react';
import { User, UserRole, Server, Domain, Acquisition, ServiceContract } from '../types';
import Sidebar from './Sidebar';
import KPICards from './KPICards';
import DomainManagement from './DomainManagement';
import ServersTable from './ServersTable';
import ServerManagement from './ServerManagement';
import AcquisitionsManagement from './AcquisitionsManagement';
import ServicesTab from './ServicesTab';
import Analytics from './Analytics';
import SecurityTab from './SecurityTab';
import TeamTab from './TeamTab';
import SettingsTab from './SettingsTab';
import { DOMAINS, KPIS, USERS, ACQUISITIONS, SERVICES } from '../mockData';
import { api } from '../api';
import { Clock, AlertTriangle, CreditCard, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  servicesList: ServiceContract[];
  onAddService: (service: ServiceContract) => void;
  onRemoveService: (id: string) => void;
  onUpdateService: (service: ServiceContract) => void;
}

const AdminDashboardWidgets: React.FC<{ domains: Domain[], servers: Server[], acquisitions: Acquisition[] }> = ({ domains, servers, acquisitions }) => {
  const expiringDomains = domains
    .filter(d => d.status === 'Expiring' || d.status === 'Active')
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 3);

  const offlineServers = servers.filter(s => s.status === 'Offline');

  const pendingAcquisitions = acquisitions.filter(a => a.status === 'Pending').slice(0, 4);

  const costsData = [40, 65, 45, 80, 55, 90];
  const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const getDaysLeft = (dateStr: string) => {
    const days = Math.floor((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} dias` : 'Vencendo';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <Clock className="w-5 h-5 text-amber-500 mr-2" />
            Próximas Renovações
          </h3>
          <span className="text-xs text-slate-500 cursor-pointer hover:text-primary transition-colors">Ver todos</span>
        </div>
        <div className="space-y-4">
          {expiringDomains.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${d.status === 'Expiring' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{d.url}</p>
                  <p className="text-xs text-slate-500">{d.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-200">{getDaysLeft(d.renewalDate)}</p>
                <p className="text-xs text-slate-500">Restantes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />
            Servidores Críticos
          </h3>
          <span className="text-xs text-slate-500 cursor-pointer hover:text-primary transition-colors">Ver log</span>
        </div>
        {offlineServers.length > 0 ? (
          <div className="space-y-4">
            {offlineServers.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-rose-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-rose-200">{s.name}</p>
                    <p className="text-xs text-rose-300/70">{s.ipReal}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">OFFLINE</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
            <p>Todos os sistemas operacionais.</p>
          </div>
        )}
      </div>

      <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
            Aprovações Pendentes
          </h3>
          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{acquisitions.filter(a => a.status === 'Pending').length}</span>
        </div>
        <div className="space-y-3">
          {pendingAcquisitions.length > 0 ? pendingAcquisitions.map(item => (
            <div key={item.id} className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{item.itemName}</h4>
                <span className="text-xs font-bold text-slate-300">R$ {item.value.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Req: {item.requester}</span>
                <span className={`px-1.5 py-0.5 rounded bg-slate-700 text-slate-400`}>{item.status}</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-500 text-sm italic">Nenhuma aquisição pendente.</div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
            Custos de Infraestrutura
          </h3>
        </div>
        <div className="flex items-end justify-between h-48 pt-4">
          {costsData.map((height, idx) => (
            <div key={idx} className="flex flex-col items-center w-1/6 group cursor-pointer">
              <div className="w-full px-1 relative h-full flex items-end">
                <div
                  className="w-full bg-slate-700/50 rounded-t-md relative overflow-hidden group-hover:bg-emerald-500/20 transition-all duration-300"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-medium">{months[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PendingAcquisitionsWidget: React.FC<{ acquisitions: Acquisition[] }> = ({ acquisitions }) => {
  const pending = acquisitions.filter(a => a.status === 'Pending');
  if (pending.length === 0) return null;

  return (
    <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg mb-8">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center">
          <CreditCard className="mr-2 text-amber-500" size={16} />
          Aquisições Pendentes para Aprovação
        </h3>
        <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {pending.length}
        </span>
      </div>
      <div className="divide-y divide-slate-700">
        {pending.map(item => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-200">{item.itemName}</p>
              <p className="text-xs text-slate-500">Solicitado por: {item.requester} • {item.costCenter}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-100">R$ {item.value.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-slate-500 uppercase">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, servicesList, onAddService, onRemoveService, onUpdateService }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [serversList, setServersList] = useState<Server[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [domainsList, setDomainsList] = useState<Domain[]>(DOMAINS);
  const [acquisitionsList, setAcquisitionsList] = useState<Acquisition[]>(ACQUISITIONS);

  // Fetch servers from the database
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await api.servers.getAll();
        // Validate that servers have all required fields
        const validServers = data.filter(server =>
          server.id && server.name && server.ipExternal && server.ipInternal
        );
        setServersList(validServers);
      } catch (error) {
        console.error('Failed to load servers:', error);
      } finally {
        setIsLoadingServers(false);
      }
    };
    fetchServers();
  }, []);

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isDirector = user.role === UserRole.DIRECTOR;
  const isLucca = user.name === 'Lucca Alves';

  // Unified showKPIs for both Manager and Director
  const showKPIs = isDirector || isManager;

  const handleAddServer = async (newServer: Server) => {
    try {
      const saved = await api.servers.create(newServer);
      // Validate that saved server has all required fields
      if (saved && saved.id) {
        setServersList([...serversList, saved]);
        // Reload servers from database to ensure consistency
        const freshData = await api.servers.getAll();
        setServersList(freshData);
      } else {
        throw new Error('Servidor salvo está incompleto');
      }
    } catch (error) {
      console.error('Failed to create server:', error);
      alert('Erro ao criar servidor no banco de dados.');
    }
  };

  const handleRemoveServer = async (id: string) => {
    try {
      await api.servers.delete(id);
      setServersList(serversList.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete server:', error);
      alert('Erro ao excluir servidor do banco de dados.');
    }
  };

  const handleUpdateServer = async (updatedServer: Server) => {
    try {
      // Infracentral-api handles updating the server properties + related applications
      const saved = await api.servers.update(updatedServer.id, updatedServer);
      setServersList(serversList.map(s => s.id === saved.id ? saved : s));
    } catch (error) {
      console.error('Failed to update server:', error);
      alert('Erro ao atualizar servidor no banco de dados.');
    }
  };

  const handleAddDomain = (newDomain: Domain) => {
    setDomainsList([...domainsList, newDomain]);
  };

  const handleRemoveDomain = (id: string) => {
    setDomainsList(domainsList.filter(d => d.id !== id));
  };

  const handleUpdateDomain = (updatedDomain: Domain) => {
    setDomainsList(domainsList.map(d => d.id === updatedDomain.id ? updatedDomain : d));
  };

  const handleAddAcquisition = (newAcquisition: Acquisition) => {
    setAcquisitionsList([newAcquisition, ...acquisitionsList]);
  };

  const handleRemoveAcquisition = (id: string) => {
    setAcquisitionsList(acquisitionsList.filter(a => a.id !== id));
  };

  const renderContent = () => {
    if (activeTab === 'team' && isLucca) {
      return (
        <section className="animate-fade-in">
          <TeamTab />
        </section>
      );
    }

    if (activeTab === 'security' && isLucca) {
      return (
        <section className="animate-fade-in">
          <SecurityTab />
        </section>
      );
    }

    if (activeTab === 'settings') {
      return (
        <section className="animate-fade-in">
          <SettingsTab user={user} />
        </section>
      );
    }

    if (activeTab === 'acquisitions' && (isAdmin || isManager || isDirector)) {
      return (
        <section className="animate-fade-in">
          <AcquisitionsManagement
            acquisitions={acquisitionsList}
            user={user}
            onAddAcquisition={handleAddAcquisition}
            onRemoveAcquisition={handleRemoveAcquisition}
          />
        </section>
      );
    }

    if (activeTab === 'analytics') {
      return (
        <section className="animate-fade-in">
          <Analytics
            servers={serversList}
            domains={domainsList}
            acquisitions={acquisitionsList}
          />
        </section>
      );
    }

    if (activeTab === 'servers') {
      return (
        <section className="animate-fade-in">
          <ServerManagement
            servers={serversList}
            user={user}
            onAddServer={handleAddServer}
            onRemoveServer={handleRemoveServer}
            onUpdateServer={handleUpdateServer}
          />
        </section>
      );
    }

    if (activeTab === 'domains') {
      return (
        <section className="animate-fade-in">
          <DomainManagement
            domains={domainsList}
            user={user}
            onAddDomain={handleAddDomain}
            onRemoveDomain={handleRemoveDomain}
            onUpdateDomain={handleUpdateDomain}
          />
        </section>
      );
    }

    if (activeTab === 'services') {
      return (
        <section className="animate-fade-in">
          <ServicesTab
            services={servicesList}
            user={user}
            onAddService={onAddService}
            onRemoveService={onRemoveService}
            onUpdateService={onUpdateService}
          />
        </section>
      );
    }

    if (activeTab === 'dashboard') {
      if (isAdmin) {
        return <AdminDashboardWidgets domains={domainsList} servers={serversList} acquisitions={acquisitionsList} />;
      }

      return (
        <>
          {showKPIs && (
            <section className="animate-fade-in-up mb-8">
              <KPICards data={KPIS} />
            </section>
          )}

          <div className="space-y-8 animate-fade-in">
            {(isManager || isDirector) && <PendingAcquisitionsWidget acquisitions={acquisitionsList} />}
            <DomainManagement domains={domainsList} user={user} onAddDomain={handleAddDomain} onRemoveDomain={handleRemoveDomain} onUpdateDomain={handleUpdateDomain} />
            <ServersTable servers={serversList} user={user} />
          </div>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-fade-in">
        <h3 className="text-lg font-medium text-slate-300">Acesso Restrito</h3>
        <p className="text-sm">Você não tem permissão para visualizar esta aba.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex">
      <Sidebar user={user} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">InfraCentral</h1>
            <p className="text-sm text-slate-500">Logado como: {user.name}</p>
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
