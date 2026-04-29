import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDisplay } from '../context/DisplayContext';
import { useToast } from '../context/ToastContext';
import { useTrades } from '../context/TradeContext';

import { parseTradeDate as parseDateUtil, isDateInRange } from '../lib/dateUtils';

interface TradeDay {
  date: string;
  pnl: number;
  trades: number;
  result: 'win' | 'loss' | 'be';
}

interface TradingCalendarProps {
  onDayClick?: (dayData: TradeDay) => void;
  filters?: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  };
}

export const TradingCalendar = ({ onDayClick, filters }: TradingCalendarProps) => {
  const { formatPnl } = useDisplay();
  const { showToast } = useToast();
  const { trades } = useTrades();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  // Helper to parse "Oct 24, 10:15 AM" to "YYYY-MM-DD"
  const parseTradeDate = (dateStr: string) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];

    // Handle ISO format YYYY-MM-DD
    if (dateStr.includes('-') && !dateStr.includes(',')) {
      return dateStr.substring(0, 10);
    }

    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const parts = dateStr.split(' ');
    const month = months[parts[0]] || '01';
    
    // Safeguard
    const rawDay = parts[1] || '01';
    const day = rawDay.replace(',', '').padStart(2, '0');
    
    // Use year from dateUtils logic or current year if not specified
    const yearPart = parts.find(p => p.length === 4 && !isNaN(parseInt(p)));
    const year = yearPart || new Date().getFullYear().toString();
    
    return `${year}-${month}-${day}`;
  };

  // Filter trades based on global filters
  const filteredTrades = trades.filter(trade => {
    const tradeDate = parseDateUtil(trade.date);
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

  // Group filtered trades by date
  const dailyStats: Record<string, TradeDay> = {};
  filteredTrades.forEach(trade => {
    const dateKey = parseTradeDate(trade.date);
    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = { date: dateKey, pnl: 0, trades: 0, result: 'be' };
    }
    dailyStats[dateKey].pnl += trade.pnl;
    dailyStats[dateKey].trades += 1;
    dailyStats[dateKey].result = dailyStats[dateKey].pnl > 0 ? 'win' : dailyStats[dateKey].pnl < 0 ? 'loss' : 'be';
  });

  // Calculate footer stats
  const winningDays = Object.values(dailyStats).filter(d => d.result === 'win').length;
  const losingDays = Object.values(dailyStats).filter(d => d.result === 'loss').length;
  const beDays = Object.values(dailyStats).filter(d => d.result === 'be').length;
  const monthlyPnl = Object.values(dailyStats).reduce((acc, d) => acc + d.pnl, 0);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    showToast('Navigated to previous month', 'info');
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    showToast('Navigated to next month', 'info');
  };

  const calendarDays = [];
  if (view === 'monthly') {
    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      calendarDays.push(i);
    }
  } else if (view === 'weekly') {
    // Show the week containing currentDate
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      calendarDays.push({
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        fullDate: d
      });
    }
  } else if (view === 'daily') {
    calendarDays.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      fullDate: currentDate
    });
  }

  const getDayData = (day: number | any) => {
    let dateStr = '';
    if (typeof day === 'number') {
      dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else if (day && day.fullDate) {
      const d = day.fullDate;
      dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return dailyStats[dateStr];
  };

  const prevPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (view === 'weekly') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
    showToast(`Navigated to previous ${view.replace('ly', '')}`, 'info');
  };

  const nextPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (view === 'weekly') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
    showToast(`Navigated to next ${view.replace('ly', '')}`, 'info');
  };

  const getPeriodLabel = () => {
    if (view === 'monthly') return `${monthName} ${year}`;
    if (view === 'weekly') {
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startLabel = startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      const endLabel = endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startLabel} - ${endLabel}`;
    }
    return currentDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-sky-500 text-white rounded-lg shadow-md shadow-sky-500/20">
            <CalendarIcon size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-none mb-0.5">Trading Calendar</h3>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Performance History</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            {(['monthly', 'weekly', 'daily'] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  showToast(`Switched to ${v} view`, 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                  view === v 
                    ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm scale-105' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:border-slate-700 mx-0.5" />

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                showToast('Jumped to Today', 'info');
              }}
              className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg border border-sky-200 dark:border-sky-500/30 transition-all mr-1"
            >
              Today
            </button>
            <button onClick={prevPeriod} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90 text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 min-w-[110px] text-center tracking-tight">
              {getPeriodLabel()}
            </span>
            <button onClick={nextPeriod} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90 text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <ChevronRight size={16} />
            </button>
          </div>

          <button 
            onClick={() => showToast('Calendar filters opened', 'info')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {view !== 'daily' && (
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-0.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>
        )}

        <div className={`grid gap-1.5 ${view === 'daily' ? 'grid-cols-1' : 'grid-cols-7'}`}>
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800" />;
            
            const data = getDayData(day);
            const dayNum = typeof day === 'number' ? day : day.day;
            const isToday = typeof day === 'number' 
              ? (day === new Date().getDate() && month === new Date().getMonth())
              : (day.day === new Date().getDate() && day.month === new Date().getMonth() && day.year === new Date().getFullYear());

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.04, y: -2, zIndex: 10 }}
                onClick={() => data && onDayClick?.(data)}
                className={`${view === 'daily' ? 'aspect-video sm:aspect-[5/1]' : 'aspect-square'} rounded-xl border p-2 flex flex-col justify-between transition-all duration-300 relative group cursor-pointer shadow-sm hover:shadow-xl ${
                  data 
                    ? data.result === 'win' 
                      ? 'bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-500/40 dark:to-emerald-500/10 border-emerald-200 dark:border-emerald-500/40 hover:ring-2 hover:ring-emerald-500/30' 
                      : data.result === 'loss'
                        ? 'bg-gradient-to-br from-rose-100 to-white dark:from-rose-500/40 dark:to-rose-500/10 border-rose-200 dark:border-rose-500/40 hover:ring-2 hover:ring-rose-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className={`text-xs font-black ${isToday ? 'text-sky-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum}
                    </span>
                    {view === 'daily' && (
                      <span className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">
                        {currentDate.toLocaleDateString('default', { weekday: 'long' })}
                      </span>
                    )}
                  </div>
                  {data && (
                    <div className={`p-0.5 rounded shadow-sm ${
                      data.result === 'win' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : data.result === 'loss' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-400 text-white shadow-slate-400/20'
                    }`}>
                      {data.result === 'win' ? <ArrowUpRight size={10} /> : data.result === 'loss' ? <ArrowDownRight size={10} /> : <Minus size={10} />}
                    </div>
                  )}
                </div>

                {data ? (
                  <div className="mt-auto">
                    <p className={`${view === 'daily' ? 'text-3xl' : 'text-[11px]'} font-black font-mono leading-none tracking-tighter ${
                      data.pnl > 0 ? 'text-emerald-600 dark:text-emerald-400' : data.pnl < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {formatPnl(data.pnl)}
                    </p>
                    <p className={`${view === 'daily' ? 'text-xs' : 'text-[9px]'} font-black text-slate-400 uppercase mt-0.5 tracking-wider`}>{data.trades} Trades</p>
                  </div>
                ) : (
                  view === 'daily' && (
                    <div className="mt-auto">
                      <p className="text-xs font-bold text-slate-400 italic">No activity.</p>
                    </div>
                  )
                )}

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-2 z-10 pointer-events-none">
                  <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-2 shadow-2xl border border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/40">
                      <ArrowUpRight size={10} />
                    </div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Analyze</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-auto p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Win: <span className="text-slate-900 dark:text-white ml-0.5">{winningDays}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/40" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Loss: <span className="text-slate-900 dark:text-white ml-0.5">{losingDays}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-lg shadow-slate-400/40" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BE: <span className="text-slate-900 dark:text-white ml-0.5">{beDays}</span></span>
          </div>
        </div>
        
        <div className="text-center sm:text-right px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Monthly Net P&L</p>
          <p className={`text-lg font-black font-mono tracking-tighter ${monthlyPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatPnl(monthlyPnl)}
          </p>
        </div>
      </div>
    </div>
  );
};
