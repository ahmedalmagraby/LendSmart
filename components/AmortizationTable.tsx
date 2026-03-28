
import React, { useState } from 'react';
import { AmortizationRow, Language } from '../types';
import { formatCurrency } from '../utils';
import { translations } from '../translations';
import { ChevronLeft, ChevronRight, ArrowDownToLine } from 'lucide-react';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  lang: Language;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule, lang }) => {
  const t = translations[lang];
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; 
  
  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const currentRows = schedule.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const isRTL = lang === Language.AR;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'} border-separate border-spacing-0`}>
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className={`px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700 ${isRTL ? 'rounded-tr-2xl' : 'rounded-tl-2xl'}`}>
                {t.month}
              </th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700">
                {t.monthlyInstallment}
              </th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700">
                {t.principal}
              </th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700">
                {t.interest}
              </th>
              <th className={`px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700 ${isRTL ? 'rounded-tl-2xl' : 'rounded-tr-2xl'}`}>
                {t.remaining}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {currentRows.map((row) => (
              <tr key={row.month} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200">
                <td className="px-6 py-5 font-black font-mono text-slate-400 dark:text-slate-600 text-xs">
                  {row.month}
                </td>
                <td className="px-6 py-5 text-slate-900 dark:text-white font-bold font-mono">
                  {formatCurrency(row.payment, lang)}
                </td>
                <td className="px-6 py-5 text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                  {formatCurrency(row.principal, lang)}
                </td>
                <td className="px-6 py-5 text-amber-600 dark:text-amber-400 font-medium font-mono">
                  {formatCurrency(row.interest, lang)}
                </td>
                <td className="px-6 py-5">
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-black font-mono text-slate-900 dark:text-white text-xs shadow-sm">
                    {formatCurrency(row.remainingBalance, lang)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`flex flex-col sm:flex-row items-center justify-between mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          {t.showingYear} {currentPage} {t.of} {Math.ceil(totalPages)}
        </p>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm"
          >
            {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               let pageNum = currentPage;
               if (totalPages <= 5) {
                 pageNum = i + 1;
               } else if (currentPage <= 3) {
                 pageNum = i + 1;
               } else if (currentPage >= totalPages - 2) {
                 pageNum = totalPages - 4 + i;
               } else {
                 pageNum = currentPage - 2 + i;
               }
               
               return (
                 <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                 >
                   {pageNum}
                 </button>
               )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm"
          >
            {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmortizationTable;
