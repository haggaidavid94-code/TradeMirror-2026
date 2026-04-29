import React, { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Layers, 
  Zap, 
  Calendar as CalendarIcon,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';

interface FilterOptionProps {
  label: string;
  value: string;
  icon: React.ElementType;
  options: string[];
  onChange: (val: string) => void;
}

const FilterOption = ({ label, value, icon: Icon, options, onChange }: FilterOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isOpen ? 'z-50' : 'z-20'}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl cursor-pointer transition-all group shadow-sm min-w-[140px] ${
          isOpen ? 'border-sky-500 ring-4 ring-sky-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-sky-500/50'
        }`}
      >
        <Icon size={14} className={`${isOpen ? 'text-sky-500' : 'text-slate-400'} group-hover:text-sky-500 transition-colors`} />
        <div className="flex flex-col flex-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-0.5">{label}</span>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{value}</span>
            <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 bg-slate-50/50 dark:bg-slate-800/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select {label}</span>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 dark:hover:bg-sky-500/10 cursor-pointer transition-colors group/item"
                >
                  <span className={`text-xs font-bold transition-colors ${value === opt ? 'text-sky-500' : 'text-slate-600 dark:text-slate-300 group-hover/item:text-sky-500'}`}>
                    {opt}
                  </span>
                  {value === opt && (
                    <motion.div layoutId={`check-${label}`}>
                      <Check size={14} className="text-sky-500" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DashboardFiltersProps {
  filters: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    assetClass: string;
    strategy: string;
    timeframe: string;
    dateRange: string;
    search: string;
  }>>;
}

export const DashboardFilters = ({ filters, setFilters }: DashboardFiltersProps) => {
  const { showToast } = useToast();
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const masterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (masterRef.current && !masterRef.current.contains(event.target as Node)) {
        setIsMasterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilter = (key: keyof typeof filters, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    showToast(`Filtering by ${key}: ${val}`, 'info');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-2 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm relative z-30">
      <div className="relative" ref={masterRef}>
        <div 
          onClick={() => setIsMasterOpen(!isMasterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all ${
            isMasterOpen 
              ? 'bg-sky-500 text-white ring-4 ring-sky-500/20' 
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/10 dark:shadow-white/5'
          }`}
        >
          <Filter size={14} />
          <span className="text-xs font-black uppercase tracking-widest">Master Filter</span>
          <ChevronDown size={12} className={`transition-transform duration-300 ${isMasterOpen ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {isMasterOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] py-4 px-4 space-y-4"
            >
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Quick Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Last 7 Days', 'This Month', 'Last Quarter', 'Year to Date'].map(preset => (
                    <button 
                      key={preset}
                      onClick={() => {
                        updateFilter('dateRange', preset);
                        setIsMasterOpen(false);
                      }}
                      className="px-2 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-500/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  setFilters({
                    assetClass: 'All Assets',
                    strategy: 'All Setups',
                    timeframe: 'All Timeframes',
                    dateRange: 'All Time',
                    search: ''
                  });
                  showToast('All filters reset to default', 'info');
                  setIsMasterOpen(false);
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

      <FilterOption 
        label="Asset Class" 
        value={filters.assetClass} 
        icon={Layers} 
        options={['All Assets', 'Equities', 'Options', 'Crypto', 'Futures', 'Forex']}
        onChange={(val) => updateFilter('assetClass', val)}
      />
      <FilterOption 
        label="Strategy" 
        value={filters.strategy} 
        icon={Zap} 
        options={['All Setups', 'Bull Flag', 'VWAP Bounce', 'ORB Breakout', 'Mean Reversion', 'Gap and Go', 'Double Bottom']}
        onChange={(val) => updateFilter('strategy', val)}
      />
      <FilterOption 
        label="Timeframe" 
        value={filters.timeframe} 
        icon={CalendarIcon} 
        options={['All Timeframes', 'Intraday', 'Daily', 'Weekly', 'Monthly', 'Yearly']}
        onChange={(val) => updateFilter('timeframe', val)}
      />
      
      <div className="ml-auto flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search trades, tickers..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && showToast(`Searching for: ${filters.search}`, 'info')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all w-48 lg:w-64"
          />
        </div>
      </div>
    </div>
  );
};
