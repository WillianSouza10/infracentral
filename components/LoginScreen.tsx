
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../mockData';
import { Shield, ChevronRight, Lock, Eye, EyeOff, UserCheck, Mail, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'activate'>('login');
  
  // Activation form
  const [activationData, setActivationData] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin(selectedUser);
      setIsLoading(false);
    }, 800);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert('Acesso ativado com sucesso! Você já pode realizar o login.');
      setView('login');
      setIsLoading(false);
    }, 1200);
  };

  if (view === 'activate') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-fade-in">
          <button onClick={() => setView('login')} className="flex items-center text-xs text-slate-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Voltar ao Login
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 mb-4 shadow-lg shadow-emerald-500/20">
              <UserCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Ativar Novo Acesso</h1>
            <p className="text-sm text-slate-400">Insira as informações enviadas no convite para ativar sua conta.</p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="email" required
                  value={activationData.email}
                  onChange={e => setActivationData({...activationData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 outline-none focus:border-primary"
                  placeholder="Seu e-mail corporativo"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Definir Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="password" required
                  value={activationData.password}
                  onChange={e => setActivationData({...activationData, password: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 outline-none focus:border-primary"
                  placeholder="Min. 8 caracteres"
                />
              </div>
            </div>
            <button
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-900/40 transition-all flex justify-center items-center"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ATIVAR CONTA'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4 shadow-lg shadow-primary/20">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InfraCentral</h1>
          <p className="text-slate-400">Portal de Acesso Seguro</p>
        </div>

        {!selectedUser ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Selecione um Perfil para Demo</p>
            {USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="w-full flex items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary hover:bg-slate-800 transition-all group"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-600" />
                <div className="ml-3 text-left flex-1">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.title}</p>
                </div>
                <ChevronRight className="ml-2 text-slate-600 group-hover:text-primary transition-colors" size={16} />
              </button>
            ))}
            
            <button 
              onClick={() => setView('activate')}
              className="w-full text-center mt-6 text-sm text-primary hover:underline font-bold transition-all"
            >
              Ativar novo acesso
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700 mb-6">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full border border-slate-600" />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-slate-200">{selectedUser.name}</p>
                <p className="text-xs text-slate-500">{selectedUser.title}</p>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="text-xs text-primary hover:underline">Alterar</button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  defaultValue="demo123"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Digite sua senha"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-lg shadow-primary/25 text-sm font-bold text-white bg-primary hover:bg-blue-600 transition-all disabled:opacity-70"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ACESSAR SISTEMA'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
