import React from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
}

import { useDisplay } from '../context/DisplayContext';

export const ChartTooltip = ({ active, payload, label, prefix = '', suffix = '', color = '#0EA5E9' }: ChartTooltipProps) => {
  const { formatPnl, pnlUnit } = useDisplay();
  
  if (active && payload && payload.length) {
    // Mock trade data for the "Mini Trade Card" feature
    const mockTrade = label === 'Oct 25' ? {
      ticker: 'TSLA',
      pnl: 600,
      type: 'Long',
      setup: 'Bull Flag'
    } : label === 'Oct 11' ? {
      ticker: 'NVDA',
      pnl: 840,
      type: 'Long',
      setup: 'VWAP Reclaim'
    } : null;

    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-slate-800/50 layered-shadow min-w-[180px] animate-in fade-in zoom-in duration-200 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <div 
            className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(var(--glow-color),0.5)]" 
            style={{ 
              backgroundColor: color,
              // @ts-ignore
              '--glow-color': color === '#0EA5E9' ? '14,165,233' : color === '#10B981' ? '16,185,129' : '239,68,68'
            } as React.CSSProperties}
          />
        </div>
        <div className="space-y-3">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex flex-col">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.name || 'Equity'}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tight">
                {pnlUnit === 'R' ? `${(item.value / 500).toFixed(1)}R` : `$${item.value.toLocaleString()}`}
              </p>
            </div>
          ))}

          {/* Mini Trade Card Integration */}
          {mockTrade && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Trade</p>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center text-[8px] font-bold text-white">
                    {mockTrade.ticker.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-none">{mockTrade.ticker}</p>
                    <p className="text-[8px] text-slate-400 font-medium">{mockTrade.setup}</p>
                  </div>
                </div>
                <p className={`text-[10px] font-bold ${mockTrade.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatPnl(mockTrade.pnl)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
