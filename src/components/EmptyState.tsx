import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Search, FileX, Inbox, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'simple' | 'illustrated';
}

export const EmptyState = ({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action,
  variant = 'illustrated'
}: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      {variant === 'illustrated' ? (
        <div className="relative mb-8">
          {/* Background Glows */}
          <div className="absolute inset-0 bg-sky-400/10 blur-3xl rounded-full scale-150" />
          <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/5 to-emerald-500/5 blur-2xl rounded-full" />
          
          {/* Icon Cluster */}
          <div className="relative bg-white dark:bg-slate-900 w-24 h-24 rounded-3xl border border-slate-100 dark:border-slate-800 layered-shadow flex items-center justify-center text-slate-300 dark:text-slate-600">
            <Icon size={40} strokeWidth={1.5} />
            
            {/* Floating Accents */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 layered-shadow flex items-center justify-center text-sky-400"
            >
              <Search size={16} />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -left-6 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 layered-shadow flex items-center justify-center text-emerald-400"
            >
              <FileX size={20} />
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-slate-300 dark:text-slate-700">
          <Icon size={48} strokeWidth={1} />
        </div>
      )}

      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium max-w-xs leading-relaxed mb-8">
        {description}
      </p>

      {action && (
        <button 
          onClick={action.onClick}
          className="px-6 py-2.5 bg-slate-800 dark:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-sky-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
