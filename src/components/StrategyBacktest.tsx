import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { Target, TrendingUp, Zap, Shield, Info } from 'lucide-react';
import { useDisplay } from '../context/DisplayContext';

const strategyData = [
  { name: 'Bull Flag', winRate: 72, avgR: 2.4, trades: 45, profit: 4200 },
  { name: 'VWAP Reclaim', winRate: 65, avgR: 3.1, trades: 32, profit: 3800 },
  { name: 'ORB Breakout', winRate: 58, avgR: 1.8, trades: 58, profit: 2100 },
  { name: 'Mean Reversion', winRate: 45, avgR: 4.2, trades: 24, profit: 1500 },
  { name: 'Double Bottom', winRate: 68, avgR: 2.1, trades: 18, profit: 1200 },
];

import { useToast } from '../context/ToastContext';

export const StrategyBacktest = () => {
  const { formatPnl, pnlUnit } = useDisplay();
  const { showToast } = useToast();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white font-display tracking-tight">Strategy Comparison</h2>
          <p className="text-slate-500 font-medium mt-1">Side-by-side performance analysis of your trading setups</p>
        </div>
        <button 
          onClick={() => showToast('Strategy analysis info opened', 'info')}
          className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-100 dark:border-sky-500/20 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors"
        >
          <Info size={14} />
          Based on last 180 trades
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Best Win Rate</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-white">Bull Flag</p>
          <p className="text-sm font-bold text-emerald-500 mt-1">72% Accuracy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highest Reward</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-white">Mean Reversion</p>
          <p className="text-sm font-bold text-sky-500 mt-1">4.2R Avg Profit</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Shield size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Most Consistent</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-white">VWAP Reclaim</p>
          <p className="text-sm font-bold text-orange-500 mt-1">3.1 Profit Factor</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Win Rate Comparison */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Target size={18} className="text-sky-500" />
              Win Rate by Strategy
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl">
                          <p className="text-xs font-black text-slate-800 dark:text-white mb-1">{payload[0].payload.name}</p>
                          <p className="text-lg font-black text-sky-500">{payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="winRate" radius={[0, 8, 8, 0]} barSize={24}>
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.winRate > 60 ? '#10B981' : entry.winRate > 50 ? '#0EA5E9' : '#F59E0B'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Comparison */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Total Profit ({pnlUnit})
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
                  tickFormatter={(val) => pnlUnit === 'R' ? `${(val / 500).toFixed(0)}R` : `$${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl">
                          <p className="text-xs font-black text-slate-800 dark:text-white mb-1">{payload[0].payload.name}</p>
                          <p className="text-lg font-black text-emerald-500">{formatPnl(payload[0].value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="profit" radius={[8, 8, 0, 0]} barSize={40}>
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10B981" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Strategy Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Strategy Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategy Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Trades</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Win Rate</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg R-Multiple</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {strategyData.map((strat, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-500 transition-colors">{strat.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{strat.trades}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[60px]">
                        <div 
                          className={`h-full rounded-full ${strat.winRate > 60 ? 'bg-emerald-500' : strat.winRate > 50 ? 'bg-sky-500' : 'bg-orange-500'}`}
                          style={{ width: `${strat.winRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{strat.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-sky-500 font-mono">{strat.avgR}R</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-emerald-500 font-mono">{formatPnl(strat.profit)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
