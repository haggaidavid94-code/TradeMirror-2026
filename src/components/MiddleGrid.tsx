import React from 'react';
import { Shield, CheckCircle2, BarChart, Target } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { useTrades } from '../context/TradeContext';
import { parseTradeDate, isDateInRange } from '../lib/dateUtils';

const winRateData = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 55 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 40 },
];

const ProgressBar = ({ label, current, total, color, subtext }: { label: string, current: string, total: string, color: string, subtext?: string }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-end mb-1.5">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{current} / {total}</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out shadow-sm`} 
        style={{ width: `${(parseFloat(current) / parseFloat(total)) * 100}%` }}
      />
    </div>
    {subtext && (
      <div className="flex justify-between mt-1.5">
        <span className="text-[9px] font-bold text-slate-400">{subtext.split('|')[0]}</span>
        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 font-mono">{subtext.split('|')[1]}</span>
      </div>
    )}
  </div>
);

interface MiddleGridProps {
  filters?: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  };
}

export const MonthlyObjectives = ({ totalPnlR }: { totalPnlR: number }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow h-full">
    <h3 className="text-[11px] font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
      <div className="p-1.5 bg-sky-500 text-white rounded-lg shadow-md shadow-sky-500/20">
        <Target size={12} />
      </div>
      Monthly Objectives
    </h3>
    <ProgressBar 
      label="Profit Goal (20 R)" 
      current={`${totalPnlR.toFixed(1)} R`} 
      total="20 R" 
      color="bg-gradient-to-r from-sky-400 to-sky-600" 
    />
    <ProgressBar label="Max Drawdown Limit" current="-2.4%" total="-10%" color="bg-gradient-to-r from-rose-400 to-rose-600" />
    <ProgressBar label="Trade Quality Score" current="8.5" total="10" color="bg-gradient-to-r from-emerald-400 to-emerald-600" />
  </div>
);

export const DailyRiskLimits = () => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow h-full">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-[11px] font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-[0.15em]">
        <div className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-500/20">
          <Shield size={12} />
        </div>
        Daily Risk Limits
      </h3>
      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-sm">
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[7px] font-black uppercase tracking-widest">Safe</span>
      </div>
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
        <Shield size={20} />
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Daily Loss Limit ($1,000)</p>
        <p className="text-xl font-black text-slate-800 dark:text-white font-mono tracking-tighter">$0.00 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest ml-1">at risk</span></p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Risk / Trade</p>
        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 font-mono">1.2% <span className="text-[8px] text-slate-400 font-black ml-1">($514)</span></p>
      </div>
      <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Exposure</p>
        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 font-mono">0.0% <span className="text-[8px] text-slate-400 font-black ml-1">($0)</span></p>
      </div>
    </div>
  </div>
);

export const WinRateByDay = ({ winRateByDay }: { winRateByDay: any[] }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow h-full">
    <h3 className="text-[11px] font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
      <div className="p-1.5 bg-sky-500 text-white rounded-lg shadow-md shadow-sky-500/20">
        <BarChart size={12} />
      </div>
      Win Rate by Day
    </h3>
    <div className="h-[120px] w-full relative">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <ReBarChart data={winRateByDay} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 900, fontFamily: 'monospace' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 900, fontFamily: 'monospace' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            content={<ChartTooltip suffix="%" />}
            cursor={{ 
              fill: 'rgba(14, 165, 233, 0.05)', 
              radius: 12 
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={36} animationDuration={1500}>
            {winRateByDay.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value > 50 ? 'url(#barGradientActive)' : 'url(#barGradientInactive)'} 
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="barGradientInactive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
          </defs>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
);

export const TopSetups = () => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow h-full">
    <h3 className="text-[11px] font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
      <div className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-500/20">
        <CheckCircle2 size={12} />
      </div>
      Top Setups (Win Rate)
    </h3>
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bull Flag Breakout</span>
          <span className="text-[10px] font-black text-emerald-500 font-mono">72%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner p-0.5">
          <div className="h-full w-[72%] bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VWAP Bounce</span>
          <span className="text-[10px] font-black text-sky-500 font-mono">64%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner p-0.5">
          <div className="h-full w-[64%] bg-gradient-to-r from-sky-400 to-sky-600 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ORB (Opening Range)</span>
          <span className="text-[10px] font-black text-slate-400 font-mono">48%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner p-0.5">
          <div className="h-full w-[48%] bg-gradient-to-r from-slate-300 to-slate-500 rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  </div>
);

export const MiddleGrid = ({ filters }: MiddleGridProps) => {
  const { trades } = useTrades();
  const filteredTrades = trades.filter(trade => {
    const tradeDate = parseTradeDate(trade.date);
    const dateMatch = !filters?.dateRange || isDateInRange(tradeDate, filters.dateRange);

    const assetClassMatch = !filters?.assetClass || 
      filters.assetClass === 'All Assets' || 
      filters.assetClass === '' ||
      trade.assetClass === filters.assetClass;
    const strategyMatch = !filters?.strategy || 
      filters.strategy === 'All Setups' || 
      filters.strategy === '' ||
      trade.strategy === filters.strategy;
    const timeframeMatch = !filters?.timeframe ||
      filters.timeframe === 'All Timeframes' ||
      filters.timeframe === '' ||
      (trade as any).timeframe === filters.timeframe;
    const searchMatch = !filters?.search || 
      trade.asset.toLowerCase().includes(filters.search.toLowerCase()) ||
      trade.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    return dateMatch && assetClassMatch && strategyMatch && timeframeMatch && searchMatch;
  });

  const totalPnlR = filteredTrades.reduce((acc, t) => acc + (t.pnl / 250), 0);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const winRateByDayData = days.map(day => {
    const tradesOnDay = filteredTrades.filter(t => {
      if (day === 'Tue' && t.date.includes('24')) return true;
      if (day === 'Mon' && t.date.includes('23')) return true;
      return false;
    });
    const wins = tradesOnDay.filter(t => t.pnl > 0).length;
    const rate = tradesOnDay.length > 0 ? (wins / tradesOnDay.length) * 100 : 0;
    return { day, value: rate };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <MonthlyObjectives totalPnlR={totalPnlR} />
      <DailyRiskLimits />
      <WinRateByDay winRateByDay={winRateByDayData} />
      <TopSetups />
    </div>
  );
};
