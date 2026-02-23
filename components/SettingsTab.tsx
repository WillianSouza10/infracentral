
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Bell, Monitor, Download, Check, Save } from 'lucide-react';

interface SettingsTabProps {
  user: User;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ user }) => {
  const isLucca = user.name === 'Lucca Alves';
  const [activeMode, setActiveMode] = useState<'dark' | 'light'>('dark');
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email || 'admin@infracentral.com'
  });

  const handleExport = () => {
    alert('Exportando base de dados em JSON/CSV... O download iniciará em breve.');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      {/* Profile Section */}
      <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center">
            <UserIcon className="mr-2 text-primary" size={20} />
            Meu Perfil
          </h3>
          <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center">
            <Save size={14} className="mr-1.5" /> Salvar Perfil
          </button>
        </div>
        <div className="p-8">
           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <img src={user.avatar} className="w-24 h-24 rounded-2xl border-2 border-slate-700 group-hover:border-primary transition-colors" />
                <button className="absolute -bottom-2 -right-2 bg-primary p-1.5 rounded-lg text-white shadow-lg"><Monitor size={14} /></button>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nome Completo</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">E-mail de Login</label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-xs">Alterar Senha</label>
                    <button className="block text-xs text-primary hover:underline">Solicitar troca de senha por e-mail</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* System Preferences */}
        <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-slate-100 flex items-center">
              <Bell className="mr-2 text-primary" size={20} />
              Preferências do Sistema
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-400 font-bold mb-2">Alertas de Vencimento (Domínios):</p>
            <div className="space-y-3">
              {[30, 15, 7].map(days => (
                <label key={days} className="flex items-center group cursor-pointer">
                  <div className="w-5 h-5 bg-slate-900 border border-slate-700 rounded flex items-center justify-center mr-3 group-hover:border-primary transition-colors">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-slate-300">Notificar com {days} dias de antecedência</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-slate-100 flex items-center">
              <Monitor className="mr-2 text-primary" size={20} />
              Aparência
            </h3>
          </div>
          <div className="p-6">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveMode('dark')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeMode === 'dark' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                MODO ESCURO
              </button>
              <button 
                onClick={() => setActiveMode('light')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeMode === 'light' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                MODO CLARO
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">A alteração afetará apenas esta sessão do dispositivo.</p>
          </div>
        </div>
      </div>

      {/* Backup - Admin Only */}
      {isLucca && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-emerald-400 flex items-center">
              <Download className="mr-2" size={20} />
              Backup de Dados (Admin)
            </h3>
            <p className="text-sm text-slate-500">Exporte todos os domínios, servidores e logs para processamento externo.</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleExport}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center"
             >
               <Download size={16} className="mr-2" /> EXPORTAR JSON/CSV
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
