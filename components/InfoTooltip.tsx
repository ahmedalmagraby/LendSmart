import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  isRTL: boolean;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, isRTL }) => {
  return (
    <div className="group relative inline-flex items-center justify-center mx-1.5 cursor-help">
      <HelpCircle size={14} className="text-slate-400 hover:text-indigo-500 transition-colors" />
      <div 
        className={`absolute bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-medium leading-relaxed rounded-xl shadow-xl z-50 ${
          isRTL ? 'right-1/2 translate-x-1/2 text-right' : 'left-1/2 -translate-x-1/2 text-left'
        }`}
      >
        {text}
        <div 
          className={`absolute top-full border-[6px] border-transparent border-t-slate-800 dark:border-t-slate-700 ${
            isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
