import React from 'react';
import { DollarSign, Server, Activity, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { KpiData } from '../types';

interface KPICardsProps {
  data: KpiData[];
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar-sign': return <DollarSign className="w-6 h-6 text-emerald-400" />;
      case 'server': return <Server className="w-6 h-6 text-blue-400" />;
      case 'activity': return <Activity className="w-6 h-6 text-purple-400" />;
      case 'alert-triangle': return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      default: return <Activity className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {data.map((kpi, index) => (
        <div key={index} className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-800 rounded-lg">
              {getIcon(kpi.icon)}
            </div>
            <div className={`flex items-center text-sm font-medium ${kpi.trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {kpi.trend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(kpi.trend)}%
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</h3>
          <p className="text-2xl font-bold text-slate-100">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;