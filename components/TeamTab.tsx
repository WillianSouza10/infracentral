
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../mockData';
import { UserPlus, X, Lock, ShieldAlert } from 'lucide-react';

const TeamTab: React.FC = () => {
  const [members, setMembers] = useState<User[]>(USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New member form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.MANAGER
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      title: formData.role === UserRole.ADMIN ? 'Administrador' : 
             formData.role === UserRole.MANAGER ? 'Gerente' : 
             formData.role === UserRole.DIRECTOR ? 'Diretor' : 'Analista',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
      invitationStatus: 'Ativo', // Created directly as active
      twoFactorEnabled: false
    };
    setMembers([...members, newMember]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', role: UserRole.MANAGER });
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'ADMIN';
      case UserRole.MANAGER: return 'GERENTE';
      case UserRole.DIRECTOR: return 'DIRETOR';
      case UserRole.ANALYST: return 'ANALISTA';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Time / Gestão de Acessos</h2>
          <p className="text-sm text-slate-500">Membros da equipe e controle de acessos diretos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 flex items-center transition-all"
        >
          <UserPlus size={18} className="mr-2" />
          Novo Acesso
        </button>
      </div>

      <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Membro</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">E-mail</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Função</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={m.avatar} className="w-9 h-9 rounded-full border border-slate-600 mr-3" />
                      <div>
                        <p className="text-sm font-bold text-slate-100">{m.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{m.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{m.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      m.role === UserRole.ADMIN ? 'bg-rose-500/10 text-rose-400' : 
                      m.role === UserRole.MANAGER ? 'bg-emerald-500/10 text-emerald-400' : 
                      m.role === UserRole.DIRECTOR ? 'bg-amber-500/10 text-amber-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {getRoleLabel(m.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit ${
                      m.invitationStatus === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${m.invitationStatus === 'Ativo' ? 'bg-emerald-400' : 'bg-slate-500'}`}></div>
                      {m.invitationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <button className="text-slate-500 hover:text-white transition-colors mr-3">Editar</button>
                    {m.name !== 'Lucca Alves' && <button className="text-rose-500 hover:text-rose-400 font-bold transition-colors">Excluir</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-100">Criar Novo Acesso Direto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary"
                  placeholder="Nome do membro"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail Corporativo</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary"
                  placeholder="email@empresa.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Definir Senha de Acesso</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                   <input 
                    type="password" required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 outline-none focus:border-primary"
                    placeholder="Senha segura"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Função do Acesso</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary"
                >
                  <option value={UserRole.ADMIN}>ADMIN</option>
                  <option value={UserRole.MANAGER}>GERENTE</option>
                  <option value={UserRole.DIRECTOR}>DIRETOR</option>
                  <option value={UserRole.ANALYST}>ANALISTA</option>
                </select>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
                 <ShieldAlert className="text-blue-500 shrink-0" size={20} />
                 <p className="text-[10px] text-blue-200/70">O acesso será criado imediatamente. O usuário poderá logar utilizando o e-mail e a senha definidos acima.</p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20">Criar Acesso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;
