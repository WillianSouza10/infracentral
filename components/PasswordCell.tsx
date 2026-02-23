import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordCellProps {
  value?: string;
}

const PasswordCell: React.FC<PasswordCellProps> = ({ value }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!value) return <span className="text-slate-500 italic">N/A</span>;

  return (
    <div className="flex items-center space-x-2">
      <div className={`font-mono text-sm px-2 py-1 bg-slate-900 rounded border border-slate-700 w-32 truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>
        {isVisible ? value : '••••••••••••'}
      </div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-slate-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-slate-700"
        title={isVisible ? "Hide Password" : "Show Password"}
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordCell;