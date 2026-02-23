import React from 'react';
import { User, UserRole } from '../types';
import { LayoutDashboard, Server, Globe, Settings, Users, Shield, BarChart3, LogOut, ShoppingCart, Briefcase } from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeTab, setActiveTab }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isDirector = user.role === UserRole.DIRECTOR;
  const isLucca = user.name === 'Lucca Alves';

  const canViewAcquisitions = isAdmin || isManager || isDirector;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'servers', icon: Server, label: 'Servidores' },
    { id: 'domains', icon: Globe, label: 'Domínios' },
    { id: 'services', icon: Briefcase, label: 'Serviços' },
    ...(canViewAcquisitions ? [{ id: 'acquisitions', icon: ShoppingCart, label: 'Aquisições' }] : []),
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    // Time and Security only for Lucca Alves per requirements
    ...(isLucca ? [
      { id: 'team', icon: Users, label: 'Time' },
      { id: 'security', icon: Shield, label: 'Segurança' }
    ] : []),
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-slate-800 flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Shield className="w-8 h-8 text-primary mr-3" />
        <span className="text-xl font-bold text-slate-100 tracking-tight">InfraCentral</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-100'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center mb-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-600" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.title}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <LogOut size={14} className="mr-2" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;