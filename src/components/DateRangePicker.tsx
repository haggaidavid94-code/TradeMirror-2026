import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DateRangePickerProps {
  value: string;
  onChange: (range: string) => void;
}

const PRESETS = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Last Month',
  'Last Quarter',
  'Year to Date',
  'All Time'
];

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
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

  const handleSelect = (preset: string) => {
    onChange(preset);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 shadow-sm cursor-pointer transition-all ${
          isOpen 
            ? 'border-sky-500 ring-4 ring-sky-500/10' 
            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <Calendar size={16} className={isOpen ? 'text-sky-500' : 'text-slate-400'} />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{value}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] py-3 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2 flex items-center gap-2">
              <Clock size={12} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Date Range</span>
            </div>
            
            <div className="max-h-72 overflow-y-auto custom-scrollbar px-2">
              {PRESETS.map((preset) => (
                <div
                  key={preset}
                  onClick={() => handleSelect(preset)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                    value === preset 
                      ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{preset}</span>
                  {value === preset && <Check size={14} className="text-sky-500" />}
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-4">
              <button 
                onClick={() => {
                  // In a real app, this would open a calendar picker
                  handleSelect('Custom Range...');
                }}
                className="w-full py-2 text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:bg-sky-50 dark:hover:bg-sky-500/5 rounded-lg transition-colors"
              >
                Custom Range Picker
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
