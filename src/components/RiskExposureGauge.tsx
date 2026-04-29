import React from 'react';
import { ShieldAlert, Activity, Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

interface GaugeProps {
  current: number;
  limit: number;
  label: string;
}

const SafetyGauge = ({ current, limit, label }: GaugeProps) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isWarning = percentage > 60;
  const isCritical = percentage > 85;

  const getColor = () => {
    if (isCritical) return 'from-rose-500 to-rose-600';
    if (isWarning) return 'from-orange-500 to-orange-600';
    return 'from-emerald-500 to-emerald-600';
  };

  const getShadow = () => {
    if (isCritical) return 'shadow-rose-500/20';
    if (isWarning) return 'shadow-orange-500/20';
    return 'shadow-emerald-500/20';
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] font-black font-mono ${isCritical ? 'text-rose-500' : isWarning ? 'text-orange-500' : 'text-emerald-500'}`}>
          ${current.toLocaleString()} / ${limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} shadow-lg ${getShadow()}`}
        />
        {/* Threshold Marker */}
        <div className="absolute left-[85%] top-0 bottom-0 w-0.5 bg-rose-500/30 border-l border-rose-500/10" />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[9px] text-slate-400 font-bold uppercase">Safe</span>
        <span className="text-[9px] text-rose-500 font-bold uppercase">Stop Point</span>
      </div>
    </div>
  );
};

export const RiskExposureGauge = () => {
  const openTrades = [
    { ticker: 'NVDA', risk: 450, color: 'bg-sky-500' },
    { ticker: 'AMD', risk: 200, color: 'bg-indigo-500' },
    { ticker: 'SPY', risk: 350, color: 'bg-emerald-500' },
  ];

  const totalRisk = openTrades.reduce((acc, trade) => acc + trade.risk, 0);
  const maxRisk = 2000;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 dark:border-slate-800/50 layered-shadow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-500">
            <ShieldAlert size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white">Risk & Exposure</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Safety Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-tighter">
          <Unlock size={10} />
          Trading Enabled
        </div>
      </div>

      <div className="space-y-4">
        {/* Drawdown Visualizer */}
        <SafetyGauge current={850} limit={1500} label="Daily Drawdown Limit" />

        {/* Open Risk Heatmap */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-slate-400" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Open Risk Heatmap</span>
            </div>
            <span className="text-[11px] font-black text-slate-800 dark:text-white font-mono">${totalRisk.toLocaleString()} Total</span>
          </div>
          
          <div className="flex h-8 gap-1 rounded-lg overflow-hidden shadow-sm">
            {openTrades.map((trade, idx) => (
              <motion.div
                key={idx}
                initial={{ flex: 0 }}
                animate={{ flex: trade.risk }}
                className={`${trade.color} relative group cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                  <span className="text-[8px] font-black text-white">${trade.risk}</span>
                </div>
              </motion.div>
            ))}
            <div className="flex-[1000] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Available: ${(maxRisk - totalRisk).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {openTrades.map((trade, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className={`w-1 h-1 rounded-full ${trade.color}`} />
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">{trade.ticker}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Lock size={12} />
          </div>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
            You are <span className="text-emerald-500 font-bold">$650 away</span> from your daily stop point. Maintain discipline.
          </p>
        </div>
      </div>
    </div>
  );
};
