import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useDisplay } from '../context/DisplayContext';
import { ChartTooltip } from './ChartTooltip';
import { useTrades } from '../context/TradeContext';
import { useToast } from '../context/ToastContext';
import { parseTradeDate, isDateInRange } from '../lib/dateUtils';

interface EquityCurveProps {
  filters?: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  };
}

export const EquityCurve = ({ filters }: EquityCurveProps) => {
  const { pnlUnit, setPnlUnit } = useDisplay();
  const { showToast } = useToast();
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

  // Calculate cumulative P&L data for the chart
  let cumulativePnl = 0;
  const chartData = filteredTrades.map((trade, index) => {
    cumulativePnl += trade.pnl;
    return {
      name: trade.date.split(',')[0], // Just the date part
      value: cumulativePnl
    };
  });

  // Add a starting point if there's data
  const finalData = chartData.length > 0 
    ? [{ name: 'Start', value: 0 }, ...chartData]
    : [{ name: 'No Data', value: 0 }];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 dark:border-slate-800/50 layered-shadow group transition-all relative overflow-hidden h-full flex flex-col">
      {/* Glassmorphism Depth: Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display tracking-tight">Equity Curve & Drawdown</h3>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Cumulative P&L • {filteredTrades.length} trades</p>
          </div>
          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-inner backdrop-blur-sm">
            <button 
              onClick={() => {
                setPnlUnit('R');
                showToast('Display unit switched to R-Multiple', 'info');
              }}
              className={`px-2 py-1 text-[8px] font-bold rounded-md transition-all active:scale-95 ${
                pnlUnit === 'R' 
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-100 dark:border-slate-600' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              R-Multiple
            </button>
            <button 
              onClick={() => {
                setPnlUnit('$');
                showToast('Display unit switched to Dollar ($)', 'info');
              }}
              className={`px-2 py-1 text-[8px] font-bold rounded-md transition-all active:scale-95 ${
                pnlUnit === '$' 
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-100 dark:border-slate-600' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Dollar ($)
            </button>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[180px] relative">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={finalData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.01}/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#94A3B8" strokeOpacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700, fontFamily: 'monospace' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700, fontFamily: 'monospace' }}
                tickFormatter={(value) => pnlUnit === 'R' ? `${(value / 250).toFixed(1)}R` : `$${value}`}
                dx={-10}
              />
              <Tooltip 
                content={<ChartTooltip suffix={pnlUnit === 'R' ? ' R' : ''} prefix={pnlUnit === '$' ? '$' : ''} />}
                cursor={{ 
                  stroke: '#0EA5E9', 
                  strokeWidth: 2, 
                  strokeDasharray: '6 6',
                  className: 'drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0EA5E9" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                dot={{ r: 0 }}
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 4, 
                  stroke: '#fff', 
                  fill: '#0EA5E9',
                  className: "shadow-xl"
                }}
                style={{ filter: 'url(#glow)' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
  );
};
