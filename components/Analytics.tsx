import React from 'react';
import { Server, Domain, Acquisition, UserRole } from '../types';
import { BarChart3, Download, PieChart, Activity, Globe, ShoppingCart, DollarSign, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AnalyticsProps {
  servers: Server[];
  domains: Domain[];
  acquisitions: Acquisition[];
}

const Analytics: React.FC<AnalyticsProps> = ({ servers, domains, acquisitions }) => {
  // --- Calculations ---
  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'Online').length;
  const offlineServers = servers.filter(s => s.status === 'Offline').length;
  const maintenanceServers = servers.filter(s => s.status === 'Maintenance').length;

  const totalDomains = domains.length;
  const activeDomains = domains.filter(d => d.status === 'Active').length;
  const expiringDomains = domains.filter(d => d.status === 'Expiring').length;
  const expiredDomains = domains.filter(d => d.status === 'Expired').length;

  const totalAcqValue = acquisitions.reduce((sum, item) => sum + item.value, 0);
  const totalServerCost = servers.reduce((sum, s) => sum + s.cost, 0);
  
  const approvedAcq = acquisitions.filter(a => a.status === 'Approved');
  const pendingAcq = acquisitions.filter(a => a.status === 'Pending');
  const rejectedAcq = acquisitions.filter(a => a.status === 'Rejected');
  
  const approvedValue = approvedAcq.reduce((sum, item) => sum + item.value, 0);
  const pendingValue = pendingAcq.reduce((sum, item) => sum + item.value, 0);

  // --- CSV Export Logic ---
  const exportToCSV = (data: any[], fileName: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => `"${val}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = () => {
    // Basic export for this demo - could be more complex
    exportToCSV(acquisitions, 'Relatorio_Aquisicoes');
    exportToCSV(servers, 'Relatorio_Servidores');
    exportToCSV(domains, 'Relatorio_Dominios');
  };

  // --- Custom Chart Component ---
  const ProgressBar = ({ label, count, total, colorClass }: { label: string, count: number, total: number, colorClass: string }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className="text-slate-200 font-medium">{count} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <BarChart3 className="mr-3 text-primary" size={28} />
            Analytics & Relatórios
          </h2>
          <p className="text-sm text-slate-500">Visão consolidada de ativos, saúde operacional e fluxo financeiro.</p>
        </div>
        <button 
          onClick={handleExportAll}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all font-bold text-sm shadow-lg shadow-emerald-900/20"
        >
          <Download size={18} className="mr-2" />
          Exportar Dados (CSV)
        </button>
      </div>

      {/* Numerical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Globe size={24} /></div>
            <span className="text-xs text-emerald-400 font-bold flex items-center"><TrendingUp size={12} className="mr-1" /> Ativos</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total de Domínios</p>
          <h4 className="text-3xl font-bold text-slate-100">{totalDomains}</h4>
        </div>
        
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Activity size={24} /></div>
            <span className="text-xs text-blue-400 font-bold flex items-center">Monitorando</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Servidores na Rede</p>
          <h4 className="text-3xl font-bold text-slate-100">{totalServers}</h4>
        </div>

        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><DollarSign size={24} /></div>
            <span className="text-xs text-slate-400 font-bold">Recorrente Mensal</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Custo Servidores</p>
          <h4 className="text-3xl font-bold text-slate-100">R$ {totalServerCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
        </div>

        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><ShoppingCart size={24} /></div>
            <span className="text-xs text-amber-400 font-bold flex items-center">Pendente</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Aquisições Pendentes</p>
          <h4 className="text-3xl font-bold text-slate-100">{pendingAcq.length}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution - Servers */}
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
            <Activity className="mr-2 text-primary" size={20} />
            Saúde dos Servidores
          </h3>
          <div className="space-y-6">
            <ProgressBar label="Online" count={onlineServers} total={totalServers} colorClass="bg-emerald-500" />
            <ProgressBar label="Offline" count={offlineServers} total={totalServers} colorClass="bg-rose-500" />
            <ProgressBar label="Manutenção" count={maintenanceServers} total={totalServers} colorClass="bg-amber-500" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
               Uptime Médio: <span className="text-emerald-400 font-bold ml-1">99.2%</span>
            </div>
          </div>
        </div>

        {/* Status Distribution - Domains */}
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
            <Globe className="mr-2 text-primary" size={20} />
            Vigência de Domínios
          </h3>
          <div className="space-y-6">
            <ProgressBar label="Válidos" count={activeDomains} total={totalDomains} colorClass="bg-emerald-500" />
            <ProgressBar label="Próximos ao Vencimento" count={expiringDomains} total={totalDomains} colorClass="bg-amber-500" />
            <ProgressBar label="Expirados" count={expiredDomains} total={totalDomains} colorClass="bg-rose-500" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700 text-center text-xs text-slate-500">
             Próxima renovação crítica em <span className="text-slate-300 font-bold">12 dias</span>
          </div>
        </div>

        {/* Status Distribution - Acquisitions */}
        <div className="bg-surface border border-slate-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
            <ShoppingCart className="mr-2 text-primary" size={20} />
            Aprovações de Compras
          </h3>
          <div className="space-y-6">
            <ProgressBar label="Aprovadas" count={approvedAcq.length} total={acquisitions.length} colorClass="bg-emerald-500" />
            <ProgressBar label="Pendentes" count={pendingAcq.length} total={acquisitions.length} colorClass="bg-amber-500" />
            <ProgressBar label="Rejeitadas" count={rejectedAcq.length} total={acquisitions.length} colorClass="bg-rose-500" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700">
             <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Valor em Aprovação:</span>
                <span className="text-amber-400 font-bold">R$ {pendingValue.toLocaleString('pt-BR')}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Financial Insight Section */}
      <div className="bg-surface border border-slate-700 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-start mb-8">
           <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <DollarSign className="mr-2 text-emerald-400" size={22} />
                Insights Financeiros
              </h3>
              <p className="text-sm text-slate-500">Fluxo de caixa de infraestrutura aprovado vs pendente.</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center">
                 <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                 <span className="text-xs text-slate-400">Aprovado</span>
              </div>
              <div className="flex items-center">
                 <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
                 <span className="text-xs text-slate-400">Pendente</span>
              </div>
           </div>
        </div>

        <div className="flex items-end gap-1 h-32 w-full">
           {/* Visual comparison bar */}
           <div className="flex-1 flex flex-col justify-end">
              <div 
                className="bg-emerald-500/20 border-t-2 border-emerald-500 rounded-t-lg transition-all duration-1000 flex items-center justify-center overflow-hidden" 
                style={{ height: `${(approvedValue / (approvedValue + pendingValue)) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-emerald-400 rotate-0">INVESTIDO</span>
              </div>
           </div>
           <div className="flex-1 flex flex-col justify-end">
              <div 
                className="bg-amber-500/20 border-t-2 border-amber-500 rounded-t-lg transition-all duration-1000 flex items-center justify-center overflow-hidden" 
                style={{ height: `${(pendingValue / (approvedValue + pendingValue)) * 100}%` }}
              >
                 <span className="text-[10px] font-bold text-amber-400">AGUARDANDO</span>
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 mt-4 text-center">
           <div>
              <p className="text-xl font-bold text-emerald-400">R$ {approvedValue.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Comprometido</p>
           </div>
           <div>
              <p className="text-xl font-bold text-amber-400">R$ {pendingValue.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Previsão</p>
           </div>
        </div>
      </div>

      {/* Summary Table for Quick View */}
      <div className="bg-surface border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
           <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Top Alertas Operacionais</h3>
        </div>
        <div className="divide-y divide-slate-700">
           {offlineServers > 0 && (
             <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mr-4"><AlertCircle size={20} /></div>
                   <div>
                      <p className="text-sm font-bold text-slate-200">Servidores Fora do Ar</p>
                      <p className="text-xs text-slate-500">{offlineServers} ativos necessitam atenção imediata.</p>
                   </div>
                </div>
                <button className="text-xs text-primary font-bold hover:underline">Resolver</button>
             </div>
           )}
           {expiringDomains > 0 && (
             <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mr-4"><Clock size={20} /></div>
                   <div>
                      <p className="text-sm font-bold text-slate-200">Vencimento de Domínios</p>
                      <p className="text-xs text-slate-500">{expiringDomains} domínios expiram nos próximos 30 dias.</p>
                   </div>
                </div>
                <button className="text-xs text-primary font-bold hover:underline">Renovar</button>
             </div>
           )}
           {pendingAcq.length > 0 && (
             <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mr-4"><ShoppingCart size={20} /></div>
                   <div>
                      <p className="text-sm font-bold text-slate-200">Compras Aguardando</p>
                      <p className="text-xs text-slate-500">{pendingAcq.length} requisições pendentes de aprovação.</p>
                   </div>
                </div>
                <button className="text-xs text-primary font-bold hover:underline">Aprovar</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;