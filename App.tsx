
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  CircleDollarSign, 
  BarChart3, 
  TableProperties,
  ArrowRightLeft,
  Languages,
  BadgeDollarSign,
  Sun,
  Moon,
  Home,
  Settings2,
  ChevronRight
} from 'lucide-react';
import { LoanInputs, InterestType, CalculationGoal, Language } from './types';
import { calculateLoan } from './utils';
import { translations } from './translations';
import SummaryCards from './components/SummaryCards';
import Visualizations from './components/Visualizations';
import AmortizationTable from './components/AmortizationTable';
import InfoTooltip from './components/InfoTooltip';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const t = translations[lang];

  const [inputs, setInputs] = useState<LoanInputs>({
    principal: 600000,
    downPayment: 0,
    downPaymentType: 'amount',
    interestRate: 12,
    termMonths: 240,
    interestType: InterestType.REDUCING,
    goal: CalculationGoal.INSTALLMENT,
    targetInstallment: 5000
  });

  const [termUnit, setTermUnit] = useState<'months' | 'years'>('years');
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts');

  const results = useMemo(() => calculateLoan(inputs), [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'termDisplay') {
      const numVal = value === '' ? '' : Number(value);
      setInputs(prev => ({
        ...prev,
        termMonths: numVal === '' ? '' : termUnit === 'years' ? numVal * 12 : numVal
      }));
      return;
    }

    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleLang = () => {
    setLang(prev => prev === Language.EN ? Language.AR : Language.EN);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [lang, isDark]);

  const isRTL = lang === Language.AR;

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isRTL ? 'font-[Cairo,sans-serif]' : ''}`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Calculator size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{t.title}</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm"
            >
              <Languages size={18} />
              <span className="hidden sm:inline uppercase">{lang === Language.EN ? 'العربية' : 'EN'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Sidebar - Controls */}
        <section className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white tracking-tight">
                <Settings2 size={22} className="text-indigo-600" />
                {t.configLoan}
              </h2>
            </div>
            
            <div className="space-y-8">
              {/* Group: Goal */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-2 rounded-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {[CalculationGoal.INSTALLMENT, CalculationGoal.LOAN_AMOUNT].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setInputs(p => ({ ...p, goal }))}
                      className={`py-2.5 px-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wide ${inputs.goal === goal ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                      {goal === CalculationGoal.INSTALLMENT ? t.calcPayment : t.findLoan}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group: Loan Basics */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{t.loanBasics}</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
                    <span className="flex items-center">
                      {inputs.goal === CalculationGoal.LOAN_AMOUNT ? t.targetPayment : t.loanAmount}
                      <InfoTooltip text={inputs.goal === CalculationGoal.LOAN_AMOUNT ? t.targetPaymentTooltip : t.principalTooltip} isRTL={isRTL} />
                    </span>
                  </label>
                  <input
                    type="number"
                    name={inputs.goal === CalculationGoal.LOAN_AMOUNT ? "targetInstallment" : "principal"}
                    value={inputs.goal === CalculationGoal.LOAN_AMOUNT ? inputs.targetInstallment : inputs.principal}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold font-mono text-lg ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                {inputs.goal !== CalculationGoal.LOAN_AMOUNT && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t.downPayment}
                      </label>
                      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                        <button
                          onClick={() => setInputs(p => ({ ...p, downPaymentType: 'amount' }))}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${inputs.downPaymentType !== 'percentage' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                          123
                        </button>
                        <button
                          onClick={() => setInputs(p => ({ ...p, downPaymentType: 'percentage' }))}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${inputs.downPaymentType === 'percentage' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                          %
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="downPayment"
                        value={inputs.downPayment}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold font-mono text-lg ${isRTL ? (inputs.downPaymentType === 'percentage' ? 'pr-5 pl-10 text-right' : 'text-right') : (inputs.downPaymentType === 'percentage' ? 'pl-5 pr-10' : '')}`}
                      />
                      {inputs.downPaymentType === 'percentage' && (
                        <span className={`absolute ${isRTL ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-slate-400 text-sm font-black`}>%</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider flex items-center">
                      {t.interestRate}
                      <InfoTooltip text={t.interestRateTooltip} isRTL={isRTL} />
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        name="interestRate"
                        value={inputs.interestRate}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold font-mono dark:text-white ${isRTL ? 'pr-5 pl-10 text-right' : 'pl-5 pr-10'}`}
                      />
                      <span className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black`}>%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.termMonths}</label>
                      <button 
                        onClick={() => setTermUnit(u => u === 'months' ? 'years' : 'months')}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md"
                      >
                        {termUnit === 'months' ? t.months : t.yrs}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="termDisplay"
                        value={inputs.termMonths === '' ? '' : termUnit === 'years' ? Number(inputs.termMonths) / 12 : inputs.termMonths}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold font-mono dark:text-white ${isRTL ? 'text-right' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Group */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{t.strategy}</h3>
                 <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  <button
                    onClick={() => setInputs(p => ({ ...p, interestType: InterestType.REDUCING }))}
                    className={`py-3 px-2 text-[10px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all relative ${inputs.interestType === InterestType.REDUCING ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 opacity-60'}`}
                  >
                    <div className="absolute top-1 right-1"><InfoTooltip text={t.reducingTooltip} isRTL={isRTL} /></div>
                    <TrendingDown size={14} /> {t.reducing}
                  </button>
                  <button
                    onClick={() => setInputs(p => ({ ...p, interestType: InterestType.FIXED }))}
                    className={`py-3 px-2 text-[10px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all relative ${inputs.interestType === InterestType.FIXED ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 opacity-60'}`}
                  >
                    <div className="absolute top-1 right-1"><InfoTooltip text={t.fixedTooltip} isRTL={isRTL} /></div>
                    <ArrowRightLeft size={14} /> {t.fixed}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="lg:col-span-8 flex flex-col gap-10">
          <SummaryCards results={results} lang={lang} goal={inputs.goal} />

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex-1 min-h-[600px] flex flex-col">
            <div className="flex border-b border-slate-100 dark:border-slate-800 p-2">
              <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-1 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'charts' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <BarChart3 size={16} /> {t.analysisCharts}
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <TableProperties size={16} /> {t.amortSchedule}
                </button>
              </div>
            </div>

            <div className="p-8 flex-1 animate-in fade-in zoom-in-95 duration-500">
              {activeTab === 'charts' && (
                <Visualizations 
                  results={results} 
                  lang={lang} 
                  isDark={isDark} 
                />
              )}
              {activeTab === 'table' && (
                <AmortizationTable 
                  schedule={results.amortizationSchedule} 
                  lang={lang} 
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
