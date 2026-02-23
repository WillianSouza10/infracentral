import React from 'react';
import { Server, User, UserRole } from '../types';
import PasswordCell from './PasswordCell';
import { Server as ServerIcon, Circle } from 'lucide-react';

interface ServersTableProps {
  servers: Server[];
  user: User;
}

const ServersTable: React.FC<ServersTableProps> = ({ servers, user }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const getStatusIndicator = (status: Server['status']) => {
    switch (status) {
      case 'Online':
        return <span className="flex items-center text-emerald-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Online</span>;
      case 'Offline':
        return <span className="flex items-center text-rose-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div> Offline</span>;
      case 'Maintenance':
        return <span className="flex items-center text-amber-400 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Manutenção</span>;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center">
          <ServerIcon className="mr-2 text-primary" size={20} />
          Infraestrutura de Servidores
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Hostname</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Região</th>
              
              {isAdmin ? (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP Real</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Credenciais</th>
                </>
              ) : (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Uptime</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Custo/Mês</th>
                </>
              )}
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-slate-700">
            {servers.map((server, idx) => (
              <tr key={server.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-slate-800/30 hover:bg-slate-800/50 transition-colors'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{server.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{server.region}</td>
                
                {isAdmin ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">{server.ipReal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500">User: <span className="text-slate-300 font-mono">{server.username}</span></span>
                        <PasswordCell value={server.password} />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{server.uptime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">R$ {server.cost.toFixed(2)}</td>
                  </>
                )}

                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusIndicator(server.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServersTable;