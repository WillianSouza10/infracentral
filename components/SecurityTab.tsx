
import React, { useState } from 'react';
import { AuditLog, UserSession, User } from '../types';
import { AUDIT_LOGS, USER_SESSIONS, USERS } from '../mockData';
import { Shield, Clock, Smartphone, Power, Monitor, MapPin } from 'lucide-react';

const SecurityTab: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>(USER_SESSIONS);

  const handleTerminateSession = (id: string) => {
    if (window.confirm('Deseja realmente derrubar esta sessão?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const users2FA = USERS.filter(u => u.name === 'Marcus Simei' || u.name === 'William Souza');
  const enabledCount = users2FA.filter(u => u.twoFactorEnabled).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 2FA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 flex items-center mb-6">
            <Smartphone className="mr-2 text-primary" size={20} />
            Status de Autenticação 2FA
          </h3>
          <div className="flex items-center justify-between mb-4">
             <div className="text-sm text-slate-400">Usuários Monitorados: <span className="text-slate-100 font-bold">2</span></div>
             <div className="text-sm text-slate-400">Ativados: <span className="text-emerald-400 font-bold">{enabledCount}</span></div>
          </div>
          <div className="space-y-3">
             {users2FA.map(u => (
               <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center">
                    <img src={u.avatar} className="w-8 h-8 rounded-full mr-3" />
                    <span className="text-sm text-slate-200">{u.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {u.twoFactorEnabled ? 'ATIVO' : 'DESATIVADO'}
                  </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 flex items-center mb-6">
            <Monitor className="mr-2 text-primary" size={20} />
            Gestão de Sessões
          </h3>
          <div className="space-y-4">
             {sessions.map(s => (
               <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
                      <Monitor size={16} />
                    </div>
                    <div>
                       <div className="flex items-center">
                         <p className="text-xs font-bold text-slate-100">{s.device}</p>
                         {s.current && <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500 text-[8px] font-bold">ESTA</span>}
                       </div>
                       <p className="text-[10px] text-slate-500 flex items-center mt-1">
                         <MapPin size={10} className="mr-1" /> {s.location} • {s.lastActive}
                       </p>
                    </div>
                 </div>
                 {!s.current && (
                   <button 
                    onClick={() => handleTerminateSession(s.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors"
                    title="Derrubar Sessão"
                   >
                     <Power size={14} />
                   </button>
                 )}
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-slate-100 flex items-center">
            <Clock className="mr-2 text-primary" size={20} />
            Logs de Auditoria
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Ação Realizada</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">IP Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {AUDIT_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-200">{log.user}</td>
                  <td className="px-6 py-4 text-xs text-slate-300">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
