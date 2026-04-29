import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreHorizontal, ArrowUpRight } from 'lucide-react';

import { useDisplay } from '../context/DisplayContext';

import { useTrades } from '../context/TradeContext';
import { useToast } from '../context/ToastContext';
import { DateRangePicker } from './DateRangePicker';
import { parseTradeDate, isDateInRange } from '../lib/dateUtils';

interface TradesTableProps {
  setActiveTab?: (tab: string) => void;
  filters?: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  };
  setFilters?: React.Dispatch<React.SetStateAction<{
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  }>>;
}

import { EmptyState } from './EmptyState';

export const TradesTable = ({ setActiveTab, filters, setFilters }: TradesTableProps) => {
  const { formatPnl, pnlUnit } = useDisplay();
  const { showToast } = useToast();
  const { trades, loading } = useTrades();

  const filteredTrades = trades.filter(trade => {
    // Date Range Filter
    const tradeDate = parseTradeDate(trade.date);
    const dateMatch = !filters?.dateRange || isDateInRange(tradeDate, filters.dateRange);

    // Global Search (from DashboardFilters or Table's own search bar)
    const searchMatch = !filters?.search || 
      trade.asset.toLowerCase().includes(filters.search.toLowerCase()) ||
      trade.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

    // Asset Class Filter
    const assetClassMatch = !filters?.assetClass || 
      filters.assetClass === 'All Assets' || 
      filters.assetClass === '' ||
      trade.assetClass === filters.assetClass;

    // Strategy Filter
    const strategyMatch = !filters?.strategy || 
      filters.strategy === 'All Setups' || 
      filters.strategy === '' ||
      trade.strategy === filters.strategy;

    // Timeframe Filter
    const timeframeMatch = !filters?.timeframe ||
      filters.timeframe === 'All Timeframes' ||
      filters.timeframe === '' ||
      (trade as any).timeframe === filters.timeframe;

    return dateMatch && searchMatch && assetClassMatch && strategyMatch && timeframeMatch;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Trades Directory</h3>
          <p className="text-[10px] text-slate-400 font-medium">Detailed view of your latest closed positions.</p>
        </div>
        <div 
          onClick={() => setActiveTab?.('Trade Log')}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          View Full Log <ArrowUpRight size={12} />
        </div>
      </div>

      <div className="p-4 bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search ticker, tags, notes..." 
            value={filters?.search || ''}
            onChange={(e) => setFilters?.(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm dark:text-white dark:placeholder-slate-500"
          />
        </div>
        <div 
          onClick={() => showToast('Asset filter synced with dashboard', 'info')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
        >
          {filters?.assetClass || 'All Assets'} <ChevronDown size={14} className="text-slate-400" />
        </div>
        <div 
          onClick={() => showToast('Status filter coming soon', 'info')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
        >
          Status: Closed <ChevronDown size={14} className="text-slate-400" />
        </div>
        <DateRangePicker 
          value={filters?.dateRange || 'All Time'} 
          onChange={(range) => setFilters?.(prev => ({ ...prev, dateRange: range }))} 
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type / Side</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags & Playbook</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry / Exit</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Risk</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">R-Multiple</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net P&L</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800 animate-pulse">
                  <td colSpan={9} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredTrades.length > 0 ? (
              filteredTrades.map((trade, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => showToast(`Opening details for ${trade.asset}...`, 'info')}
                  className="border-b border-slate-50 dark:border-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-all group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${trade.color} flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm group-hover:scale-105 transition-transform`}>
                        {trade.asset.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">{trade.asset}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono">{trade.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${trade.type.includes('Long') ? 'text-emerald-500' : 'text-rose-500'}`}>{trade.type}</p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono">{trade.size}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {trade.tags.map((tag, i) => (
                        <span key={i} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold shadow-sm ${
                          i === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{trade.entry}</p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono">→ {trade.exit}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                      <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 shadow-inner">
                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                      </div>
                      {trade.duration}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">${trade.risk}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                      trade.pnl >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {(trade.pnl / trade.risk).toFixed(1)}R
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-sm font-bold font-mono ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {formatPnl(trade.pnl)}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast('Trade options menu opened', 'info');
                      }}
                      className="p-2 text-slate-400 hover:text-slate-800 dark:hover:white hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded-xl transition-all"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-20">
                  <EmptyState 
                    title={`No trades found matching "${filters?.assetClass || 'selected filters'}"`}
                    description="Try adjusting your filters or search query to find what you're looking for."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
