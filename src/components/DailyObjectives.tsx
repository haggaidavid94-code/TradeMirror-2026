import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export const DailyObjectives = () => {
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: '1', text: 'Max 3 losses allowed', completed: false },
    { id: '2', text: 'No trading before 10:30 AM', completed: true },
    { id: '3', text: 'Wait for A+ setups only', completed: false },
    { id: '4', text: 'Review previous session notes', completed: true },
  ]);

  const allCompleted = objectives.every(obj => obj.completed);
  const completedCount = objectives.filter(obj => obj.completed).length;
  const progress = (completedCount / objectives.length) * 100;

  const toggleObjective = (id: string) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  return (
    <div className={`h-full bg-white dark:bg-slate-900 p-4 rounded-xl border transition-all duration-500 relative overflow-hidden group ${
      allCompleted 
        ? 'border-emerald-500/50 shadow-[0_24px_48px_-12px_rgba(16,185,129,0.15)]' 
        : 'border-slate-200 dark:border-slate-700 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]'
    }`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Target size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg shadow-md transition-all duration-500 ${
              allCompleted ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-sky-500 text-white shadow-sky-500/20'
            }`}>
              <Target size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-none mb-0.5">Daily Objectives</h3>
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Discipline Tracker</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-500 border ${
            allCompleted 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
          }`}>
            <div className={`w-1 h-1 rounded-full ${allCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {allCompleted ? 'Elite' : 'In Progress'}
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          {objectives.map((obj) => (
            <button
              key={obj.id}
              onClick={() => toggleObjective(obj.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-300 group/item ${
                obj.completed 
                  ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/40' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${
                  obj.completed 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700'
                }`}>
                  {obj.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                </div>
                <span className={`text-[11px] font-black transition-all duration-300 ${
                  obj.completed 
                    ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-50' 
                    : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {obj.text}
                </span>
              </div>
              
              {!obj.completed && (
                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest">Done</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Progress Visualization */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-end mb-1.5">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Session Mastery</p>
              <p className="text-lg font-black text-slate-800 dark:text-white font-mono tracking-tighter">
                {completedCount}<span className="text-slate-300 mx-1">/</span>{objectives.length}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-base font-black font-mono tracking-tighter ${allCompleted ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                {Math.round(progress)}%
              </p>
            </div>
          </div>
          
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full relative transition-all duration-700 ${
                allCompleted 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-gradient-to-r from-sky-400 to-sky-600 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
          
          {allCompleted && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] font-black text-emerald-500 uppercase tracking-widest text-center mt-3"
            >
              Perfect Discipline
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};
