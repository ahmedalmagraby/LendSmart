
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { LoanResults, Language } from '../types';
import { formatCurrency } from '../utils';
import { translations } from '../translations';

interface VisualizationsProps {
  results: LoanResults;
  lang: Language;
  isDark: boolean;
}

const Visualizations: React.FC<VisualizationsProps> = ({ results, lang, isDark }) => {
  const t = translations[lang];
  const labelColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';

  const pieData = [
    { name: t.principal, value: results.totalPrincipal, color: isDark ? '#6366f1' : '#4f46e5' },
    { name: t.interest, value: results.totalInterest, color: '#f59e0b' }
  ];

  // Aggregate data by year for a simpler beginner-friendly view
  const yearlyData: { year: number; principal: number; interest: number }[] = [];
  let currentYear = { year: 1, principal: 0, interest: 0 };

  results.amortizationSchedule.forEach((row) => {
    const year = Math.ceil(row.month / 12);
    if (year !== currentYear.year) {
      yearlyData.push(currentYear);
      currentYear = { year, principal: 0, interest: 0 };
    }
    currentYear.principal += row.principal;
    currentYear.interest += row.interest;
  });
  if (currentYear.principal > 0 || currentYear.interest > 0) {
    yearlyData.push(currentYear);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="flex flex-col h-[380px]">
        <h3 className={`text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6 ${lang === Language.AR ? 'text-right' : ''}`}>{t.repaymentComp}</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value, lang)}
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  borderRadius: '12px', 
                  border: `1px solid ${tooltipBorder}`, 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  fontFamily: 'Space Grotesk, monospace',
                  fontWeight: 'bold',
                  direction: lang === Language.AR ? 'rtl' : 'ltr'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col h-[380px]">
        <h3 className={`text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6 ${lang === Language.AR ? 'text-right' : ''}`}>{t.loanEvolution}</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="year" 
                tick={{fontSize: 10, fill: labelColor, fontFamily: 'Space Grotesk, monospace', fontWeight: 'bold'}} 
                tickFormatter={(val) => `${t.year} ${val}`}
                tickLine={false} 
                axisLine={false}
                reversed={lang === Language.AR}
              />
              <YAxis 
                tick={{fontSize: 10, fill: labelColor, fontFamily: 'Space Grotesk, monospace', fontWeight: 'bold'}} 
                tickFormatter={(val) => `${val/1000}k`}
                tickLine={false} 
                axisLine={false}
                orientation={lang === Language.AR ? 'right' : 'left'}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value, lang)}
                labelFormatter={(label) => `${t.year} ${label}`}
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  borderRadius: '12px', 
                  border: `1px solid ${tooltipBorder}`, 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  fontFamily: 'Space Grotesk, monospace',
                  fontWeight: 'bold',
                  direction: lang === Language.AR ? 'rtl' : 'ltr'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar 
                dataKey="principal" 
                stackId="a" 
                fill={isDark ? '#6366f1' : '#4f46e5'} 
                name={t.principal} 
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="interest" 
                stackId="a" 
                fill="#f59e0b" 
                name={t.interest} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
