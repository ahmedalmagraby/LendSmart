
import React from 'react';
import { LoanResults, Language, CalculationGoal } from '../types';
import { formatCurrency } from '../utils';
import { translations } from '../translations';
import { Wallet, Landmark, HandCoins, Info } from 'lucide-react';

interface SummaryCardsProps {
  results: LoanResults;
  lang: Language;
  goal: CalculationGoal;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ results, lang, goal }) => {
  const t = translations[lang];
  const isRTL = lang === Language.AR;

  const cards = [
    {
      title: t.monthlyInstallment,
      value: formatCurrency(results.monthlyPayment, lang),
      icon: <Wallet className="text-indigo-600" size={20} />,
      color: 'bg-indigo-50 dark:bg-indigo-500/10',
      description: t.installmentDesc,
      priority: true
    },
    {
      title: t.loanPrincipal,
      value: formatCurrency(results.totalPrincipal, lang),
      icon: <Landmark className="text-emerald-600" size={20} />,
      color: 'bg-emerald-50 dark:bg-emerald-500/10',
      description: t.principalDesc
    },
    {
      title: t.totalInterest,
      value: formatCurrency(results.totalInterest, lang),
      icon: <Info className="text-amber-600" size={20} />,
      color: 'bg-amber-50 dark:bg-amber-500/10',
      description: t.interestDesc
    },
    {
      title: t.totalRepayment,
      value: formatCurrency(results.totalPayment, lang),
      icon: <HandCoins className="text-blue-600" size={20} />,
      color: 'bg-blue-50 dark:bg-blue-500/10',
      description: t.repaymentDesc
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-500/20"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shadow-inner transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
          </div>
          
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{card.title}</p>
            <h3 className={`font-black font-mono text-slate-900 dark:text-white leading-none tracking-tight transition-all ${card.priority ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {card.value}
            </h3>
          </div>
          
          <p className={`text-[9px] font-medium text-slate-400 dark:text-slate-600 mt-4 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
