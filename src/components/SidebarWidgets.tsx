import React, { useMemo } from 'react';
import { Flame, AlertTriangle, Smile, BarChart } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTrades } from '../context/TradeContext';
import { useDisplay } from '../context/DisplayContext';
import { motion } from 'motion/react';

const AssetRow = ({ label, winRate, trades, pnl, color, profitFactor }: { label: string, winRate: string, trades: string, pnl: string, color: string, profitFactor: string }) => (
  <div className="group relative p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-2 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-300`}>
          {label.substring(0, 2)}
        </div>
        <div>
          <p className="text-xs font-black text-slate-800 dark:text-white leading-none mb-1">{label}</p>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{trades} Trades</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xs font-black font-mono ${pnl.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{pnl}</p>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Net P&L</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Win Rate</span>
          <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 font-mono">{winRate}</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} rounded-full transition-all duration-1000`} 
            style={{ width: winRate }}
          />
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Profit Factor</span>
          <span className="text-[11px] font-black text-sky-500 font-mono">{profitFactor}</span>
        </div>
      </div>
    </div>
  </div>
);

interface MistakeProps {
  label: string;
  occurrences: string;
  impact: string;
  percentage: number;
  key?: any;
}

const MistakeRow = ({ label, occurrences, impact, percentage }: MistakeProps) => (
  <div className="group relative p-3 bg-rose-50/30 dark:bg-rose-500/5 rounded-xl border border-rose-100/50 dark:border-rose-500/10 mb-2 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:rotate-12 transition-transform">
          <AlertTriangle size={12} />
        </div>
        <div>
          <p className="text-[11px] font-black text-slate-800 dark:text-white leading-none mb-1">{label}</p>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{occurrences} Occurrences</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[11px] font-black font-mono text-rose-500">{impact}</p>
        <p className="text-[8px] text-rose-400/60 font-black uppercase tracking-tighter">Capital Leakage</p>
      </div>
    </div>
    
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Impact Weight</span>
        <span className="text-[10px] font-black text-rose-500 font-mono">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full relative"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  </div>
);


export const SidebarWidgets = ({ 
  showOnlyStreak, 
  hideStreak,
  showOnlyAsset,
  showOnlyMistakes,
  showOnlyReview
}: { 
  showOnlyStreak?: boolean, 
  hideStreak?: boolean,
  showOnlyAsset?: boolean,
  showOnlyMistakes?: boolean,
  showOnlyReview?: boolean
}) => {
  const { showToast } = useToast();
  const { trades } = useTrades();
  const { formatPnl } = useDisplay();

  const assetStats = useMemo(() => {
    const stats: Record<string, { trades: number, pnl: number, wins: number, grossWin: number, grossLoss: number }> = {};
    trades.forEach(t => {
      const cls = t.assetClass || 'Other';
      if (!stats[cls]) stats[cls] = { trades: 0, pnl: 0, wins: 0, grossWin: 0, grossLoss: 0 };
      stats[cls].trades++;
      stats[cls].pnl += t.pnl;
      if (t.pnl > 0) {
        stats[cls].wins++;
        stats[cls].grossWin += t.pnl;
      } else {
        stats[cls].grossLoss += Math.abs(t.pnl);
      }
    });

    return Object.entries(stats).map(([label, s]) => ({
      label,
      trades: s.trades.toString(),
      pnl: `${s.pnl >= 0 ? '+' : ''}${formatPnl(s.pnl)}`,
      winRate: s.trades > 0 ? `${((s.wins / s.trades) * 100).toFixed(0)}%` : '0%',
      profitFactor: s.grossLoss > 0 ? (s.grossWin / s.grossLoss).toFixed(2) : (s.grossWin > 0 ? '∞' : '0.00'),
      color: label === 'Equities' ? 'bg-sky-500' : label === 'Options' ? 'bg-purple-500' : 'bg-orange-500'
    }));
  }, [trades, formatPnl]);

  const streakInfo = useMemo(() => {
    if (trades.length === 0) return { current: 0, winRate7: 0, history7: [] };
    
    // Simple streak calculation based on chronological order of trades
    // (In a real app, this should be per day)
    let current = 0;
    const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const t of sortedTrades) {
      if (t.pnl > 0) current++;
      else break;
    }

    const last7 = sortedTrades.slice(0, 7);
    const wins7 = last7.filter(t => t.pnl > 0).length;
    const history7 = [...last7].reverse().map(t => t.pnl > 0);

    return {
      current,
      winRate7: last7.length > 0 ? (wins7 / last7.length) * 100 : 0,
      history7
    };
  }, [trades]);

  if (showOnlyAsset) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.15em] mb-1">Asset Performance</h3>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Portfolio Efficiency</p>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <BarChart size={14} className="text-slate-400" />
          </div>
        </div>
        
        {assetStats.length === 0 ? (
          <p className="text-[10px] text-slate-400 text-center py-8 font-black uppercase">No Data</p>
        ) : (
          assetStats.map(stat => (
            <AssetRow key={stat.label} {...stat} />
          ))
        )}

        <button className="w-full mt-2 py-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:border-sky-500/50 hover:text-sky-500">
          View Detailed Asset Breakdown
        </button>
      </div>
    );
  }

  if (showOnlyMistakes) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-5 opacity-[0.02] pointer-events-none">
          <AlertTriangle size={100} strokeWidth={1} className="text-rose-500" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/20">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1">Cost of Mistakes</h3>
              <p className="text-[9px] text-rose-500 font-black uppercase tracking-[0.2em]">Capital Leakage</p>
            </div>
          </div>
          <div className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-100 dark:border-rose-500/20">
            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Monthly</span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Total Leakage</p>
          <div className="flex items-end gap-2">
            <span className="text-xl font-black text-rose-500 font-mono tracking-tighter">-$2,510.00</span>
            <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest pb-1">Total Loss</span>
          </div>
        </div>

        <MistakeRow label="FOMO Entry" occurrences="5" impact="-$1,250.00" percentage={50} />
        <MistakeRow label="Oversized Position" occurrences="2" impact="-$840.00" percentage={33} />
        <MistakeRow label="Moved Stop Loss" occurrences="3" impact="-$420.00" percentage={17} />

        <button className="w-full mt-2 py-3 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]">
          Analyze Error Patterns
        </button>
      </div>
    );
  }

  if (showOnlyReview) {
    return (
      <div className="bg-white dark:bg-[#0F172A] p-5 rounded-2xl shadow-2xl shadow-sky-200/40 dark:shadow-sky-900/40 text-slate-800 dark:text-white relative overflow-hidden group h-full border border-slate-100 dark:border-white/5 transition-colors duration-500">
        {/* Modern Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-indigo-100/50 to-purple-100/50 dark:from-sky-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-[80px] group-hover:bg-sky-400/20 dark:group-hover:bg-sky-500/30 transition-all duration-700" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-400/20 dark:group-hover:bg-indigo-500/30 transition-all duration-700" />
        
        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-sm dark:shadow-xl">
                <Smile size={20} className="text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight leading-none mb-1 uppercase tracking-wider text-slate-800 dark:text-white">Session Review</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                  <p className="text-[8px] text-sky-600 dark:text-sky-300/80 font-black uppercase tracking-[0.2em]">Active Session</p>
                </div>
              </div>
            </div>
            <div className="px-2 py-1 bg-slate-100 dark:bg-white/5 backdrop-blur-md rounded-lg border border-slate-200 dark:border-white/10">
              <span className="text-[8px] font-black text-slate-500 dark:text-sky-200 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="p-4 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-colors cursor-default">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-slate-400 dark:text-sky-200/60 uppercase tracking-widest">Trading Activity</span>
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">4 / 4 Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -2, scale: 1.1 }}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0F172A] bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[9px] font-black text-white shadow-lg cursor-pointer"
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
                <div className="flex-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden ml-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-sky-500 dark:bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-100 dark:border-white/10">
                <p className="text-[8px] text-slate-400 dark:text-sky-200/40 font-black uppercase tracking-widest mb-1">Discipline</p>
                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">A+</p>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-100 dark:border-white/10">
                <p className="text-[8px] text-slate-400 dark:text-sky-200/40 font-black uppercase tracking-widest mb-1">Focus</p>
                <p className="text-xs font-black text-sky-600 dark:text-sky-400 font-mono">High</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-sky-200/40 uppercase tracking-widest mb-3 text-center">How was your mental state?</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { emoji: '🙁', label: 'Poor', color: 'hover:bg-rose-500/10 dark:hover:bg-rose-500/20 hover:border-rose-500/20 dark:hover:border-rose-500/40' },
                { emoji: '😐', label: 'Okay', color: 'hover:bg-amber-500/10 dark:hover:bg-amber-500/20 hover:border-amber-500/20 dark:hover:border-amber-500/40' },
                { emoji: '😊', label: 'Great', color: 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 hover:border-emerald-500/20 dark:hover:border-emerald-500/40' }
              ].map((rating) => (
                <motion.button 
                  key={rating.label}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showToast(`Session rating: ${rating.label}`, 'info')}
                  className={`bg-slate-50/50 dark:bg-white/5 backdrop-blur-md border border-slate-100 dark:border-white/10 p-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 group/btn ${rating.color}`}
                >
                  <span className="text-xl group-hover/btn:scale-125 transition-transform duration-300">{rating.emoji}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-sky-200/60 group-hover/btn:text-slate-800 dark:group-hover/btn:text-white">{rating.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast('Opening full session review...', 'info')}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(14,165,233,0.2)] dark:shadow-[0_10px_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2 mt-auto border border-white/20"
          >
            Complete Daily Debrief
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Streak */}
      {(!hideStreak || showOnlyStreak) && (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden group ${
          showOnlyStreak ? 'p-4 flex-1' : 'p-4'
        }`}>
          <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110 dark:text-white">
            <Flame size={100} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Flame size={14} className="text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none mb-0.5">Current Streak</h3>
                  <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">Winning Momentum</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest">Active</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-slate-800 dark:text-white font-mono tracking-tighter leading-none">{streakInfo.current}</span>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest pb-0.5">Trades</span>
              </div>
              
              <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Momentum</span>
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Target: 5</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((streakInfo.current / 5) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Total Wins</p>
                <p className="text-xs font-black text-slate-800 dark:text-white font-mono">{trades.filter(t => t.pnl > 0).length}</p>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Total Losses</p>
                <p className="text-xs font-black text-slate-800 dark:text-white font-mono">{trades.filter(t => t.pnl < 0).length}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last 7 Trades</span>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{streakInfo.winRate7.toFixed(0)}% Win</span>
              </div>
              <div className="flex gap-1">
                {streakInfo.history7.map((win, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-1 rounded-full ${
                      win ? 'bg-emerald-500 shadow-sm shadow-emerald-500/10' : 'bg-rose-500 shadow-sm shadow-rose-500/10'
                    }`} 
                  />
                ))}
                {[...Array(Math.max(0, 7 - streakInfo.history7.length))].map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Performance */}
      {!showOnlyStreak && !hideStreak && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.15em] mb-1">Asset Performance</h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Portfolio Efficiency</p>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <BarChart size={16} className="text-slate-400" />
            </div>
          </div>
          
          {assetStats.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-12 font-black uppercase tracking-[0.2em]">No Data Available</p>
          ) : (
            assetStats.map(stat => (
              <AssetRow key={stat.label} {...stat} />
            ))
          )}

          <button className="w-full mt-4 py-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:border-sky-500/50 hover:text-sky-500">
            View Detailed Asset Breakdown
          </button>
        </div>
      )}

      {/* Cost of Mistakes */}
      {!showOnlyStreak && !hideStreak && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <AlertTriangle size={120} strokeWidth={1} className="text-rose-500" />
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500 rounded-2xl shadow-lg shadow-rose-500/20">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1">Cost of Mistakes</h3>
                <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em]">Capital Leakage</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-100 dark:border-rose-500/20">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Monthly</span>
            </div>
          </div>

          <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Leakage</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-rose-500 font-mono tracking-tighter">
                {formatPnl(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + Math.abs(t.pnl), 0) * -0.15)}
              </span>
              <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest pb-1.5">Estimated Impact</span>
            </div>
          </div>

          {[
            { label: 'FOMO Entry', occurrences: '0', impact: '$0.00', percentage: 0 },
            { label: 'Oversized Position', occurrences: '0', impact: '$0.00', percentage: 0 },
            { label: 'Moved Stop Loss', occurrences: '0', impact: '$0.00', percentage: 0 }
          ].map((m, i) => (
            <MistakeRow 
              key={i} 
              label={m.label} 
              occurrences={m.occurrences} 
              impact={m.impact} 
              percentage={m.percentage} 
            />
          ))}

          <button className="w-full mt-4 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]">
            Analyze Error Patterns
          </button>
        </div>
      )}

      {/* Session Review Pending */}
      {!showOnlyStreak && !hideStreak && (
        <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-sky-500/20 text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Smile size={200} strokeWidth={0.5} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
                <Smile size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight leading-none mb-1">Session Review</h3>
                <p className="text-[10px] text-sky-100 font-black uppercase tracking-[0.2em]">Daily Debrief</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-medium text-sky-50 mb-5 leading-relaxed">
                You have <span className="font-black underline decoration-sky-300 underline-offset-4">{trades.length} trades</span> logged. 
                Self-reflection is the key to long-term consistency.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex -space-x-2">
                  {trades.length === 0 ? (
                    <div className="w-7 h-7 rounded-full border-2 border-sky-500 bg-sky-200 flex items-center justify-center text-[9px] font-black shadow-lg">0</div>
                  ) : (
                    trades.slice(0, 4).map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-sky-500 bg-sky-400 flex items-center justify-center text-[9px] font-black shadow-lg">
                        {i + 1}
                      </div>
                    ))
                  )}
                </div>
                <div className="h-4 w-px bg-white/20 mx-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-100">Trade Logs</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { emoji: '🙁', label: 'Poor', color: 'hover:bg-rose-500/40' },
                { emoji: '😐', label: 'Okay', color: 'hover:bg-amber-500/40' },
                { emoji: '😊', label: 'Great', color: 'hover:bg-emerald-500/40' }
              ].map((rating) => (
                <motion.button 
                  key={rating.label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showToast(`Session rating: ${rating.label}`, 'info')}
                  className={`bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${rating.color}`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{rating.emoji}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">{rating.label}</span>
                </motion.button>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast('Opening full session review...', 'info')}
              className="w-full bg-white text-sky-600 hover:bg-sky-50 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-sky-900/30 flex items-center justify-center gap-2"
            >
              Complete Full Review
            </motion.button>
          </div>

          {/* Animated background glow */}
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
