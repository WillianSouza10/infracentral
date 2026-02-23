import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Search, X, Check, Trash2 } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onRemoveUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.MANAGER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      title: newTitle,
      role: newRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random&color=fff`
    };
    onAddUser(newUser);
    
    // Reset and Close
    setNewName('');
    setNewTitle('');
    setNewRole(UserRole.MANAGER);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o acesso de ${name}? Esta ação removerá o usuário permanentemente do sistema.`)) {
      onRemoveUser(id);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">ADMIN</span>;
      case UserRole.MANAGER:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">MANAGER</span>;
      case UserRole.DIRECTOR:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">DIRECTOR</span>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Gestão de Acessos</h2>
          <p className="text-sm text-slate-500">Gerencie permissões e crie novos usuários para o sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <UserPlus size={18} className="mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Buscar usuários..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-600"
        />
      </div>

      {/* Users Grid/List */}
      <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Cargo / Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Permissão</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full border border-slate-600" src={user.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{user.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">Criar Novo Usuário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Cargo / Título</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Desenvolvedor Frontend"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Nível de Permissão</label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.ADMIN, UserRole.MANAGER, UserRole.DIRECTOR].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewRole(role)}
                      className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all ${
                        newRole === role 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
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
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;