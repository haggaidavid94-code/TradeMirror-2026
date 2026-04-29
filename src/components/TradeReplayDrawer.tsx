import React from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Target, 
  Brain,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TradeReplayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: any;
}

import { useDisplay } from '../context/DisplayContext';

import { useToast } from '../context/ToastContext';

export const TradeReplayDrawer = ({ isOpen, onClose, dayData }: TradeReplayDrawerProps) => {
  const { formatPnl } = useDisplay();
  const { showToast } = useToast();
  if (!dayData) return null;

  const mockTrades = [
    {
      id: 1,
      ticker: 'TSLA',
      time: '09:45 AM',
      side: 'Long',
      pnl: 450,
      setup: 'Bull Flag',
      mood: 'Confident',
      image: 'https://picsum.photos/seed/tsla/400/250'
    },
    {
      id: 2,
      ticker: 'NVDA',
      time: '10:30 AM',
      side: 'Short',
      pnl: -200,
      setup: 'VWAP Reject',
      mood: 'Anxious',
      image: 'https://picsum.photos/seed/nvda/400/250'
    },
    {
      id: 3,
      ticker: 'AAPL',
      time: '02:15 PM',
      side: 'Long',
      pnl: 350,
      setup: 'ORB Breakout',
      mood: 'Calm',
      image: 'https://picsum.photos/seed/aapl/400/250'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[101] border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Trade Replay</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dayData.date}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Day Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Net P&L</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatPnl(600)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trades</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white font-mono">3</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

                {mockTrades.map((trade, idx) => (
                  <div key={trade.id} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 z-10 ${
                      trade.side === 'Long' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden group hover:border-sky-500/50 transition-all">
                      {/* Trade Image */}
                      <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={trade.image} 
                          alt={trade.ticker} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{trade.ticker}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              trade.side === 'Long' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            }`}>{trade.side}</span>
                          </div>
                          <span className="text-[10px] font-black text-white font-mono">{formatPnl(trade.pnl)}</span>
                        </div>
                      </div>

                      {/* Trade Details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {trade.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target size={12} />
                            {trade.setup}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <Brain size={14} className="text-sky-500" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Mood: <span className="text-slate-800 dark:text-slate-200">{trade.mood}</span></span>
                        </div>

                        <button 
                          onClick={() => showToast(`Opening analysis for ${trade.ticker}...`, 'info')}
                          className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg transition-colors"
                        >
                          View Full Analysis
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                onClick={() => showToast('Generating day report export...', 'success')}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Export Day Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
