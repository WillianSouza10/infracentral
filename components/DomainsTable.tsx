import React from 'react';
import { Domain, User, UserRole } from '../types';
import PasswordCell from './PasswordCell';
import { Globe, ShieldCheck, AlertCircle } from 'lucide-react';

interface DomainsTableProps {
  domains: Domain[];
  user: User;
}

const DomainsTable: React.FC<DomainsTableProps> = ({ domains, user }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-700">
            <ShieldCheck size={12} className="mr-1" /> Ativo
          </span>
        );
      case 'Expiring':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-400 border border-amber-700">
            <AlertCircle size={12} className="mr-1" /> Expirando
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-900/50 text-rose-400 border border-rose-700">
            Expirado
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden shadow-sm mb-8">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center">
          <Globe className="mr-2 text-primary" size={20} />
          Gerenciamento de Domínios
        </h2>
        {!isAdmin && <span className="text-xs text-slate-500 italic">Modo de visualização restrito</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provedor</th>
              {isAdmin ? (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Login</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Senha</th>
                </>
              ) : (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Custo Anual</th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Renovação</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-slate-700">
            {domains.map((domain, idx) => (
              <tr key={domain.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-slate-800/30 hover:bg-slate-800/50 transition-colors'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{domain.url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{domain.provider}</td>
                
                {isAdmin ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">{domain.login}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <PasswordCell value={domain.password} />
                    </td>
                  </>
                ) : (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">R$ {domain.cost.toFixed(2)}</td>
                )}

                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{domain.renewalDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(domain.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainsTable;