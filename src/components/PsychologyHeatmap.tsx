import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Brain, Info } from 'lucide-react';

const data = [
  { mood: 'Confident', pnl: 850, size: 100, color: '#10B981' },
  { mood: 'Calm', pnl: 600, size: 80, color: '#10B981' },
  { mood: 'Focused', pnl: 400, size: 60, color: '#10B981' },
  { mood: 'Neutral', pnl: 150, size: 40, color: '#94A3B8' },
  { mood: 'Anxious', pnl: -200, size: 70, color: '#EF4444' },
  { mood: 'FOMO', pnl: -450, size: 90, color: '#EF4444' },
  { mood: 'Frustrated', pnl: -600, size: 110, color: '#EF4444' },
  { mood: 'Greedy', pnl: -300, size: 50, color: '#EF4444' },
];

const moodMap: Record<string, number> = {
  'Frustrated': 1,
  'FOMO': 2,
  'Anxious': 3,
  'Greedy': 4,
  'Neutral': 5,
  'Focused': 6,
  'Calm': 7,
  'Confident': 8,
};

const chartData = data.map(item => ({
  ...item,
  moodIndex: moodMap[item.mood]
}));

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-slate-800/50 layered-shadow shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={14} className="text-sky-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Psychology State</span>
        </div>
        <p className="text-lg font-black text-slate-800 dark:text-white mb-1">{data.mood}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Performance</span>
          <span className={`text-sm font-black font-mono ${data.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {data.pnl >= 0 ? `+$${data.pnl}` : `-$${Math.abs(data.pnl)}`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

import { useToast } from '../context/ToastContext';

export const PsychologyHeatmap = () => {
  const { showToast } = useToast();
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-[11px] font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-[0.15em]">
            <div className="p-1.5 bg-sky-500 text-white rounded-lg shadow-md shadow-sky-500/20">
              <Brain size={12} />
            </div>
            Mood vs. Performance
          </h3>
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Psychological Edge Analysis</p>
        </div>
        <button 
          onClick={() => showToast('Psychology analysis help opened', 'info')}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <XAxis 
              type="number" 
              dataKey="moodIndex" 
              name="Mood" 
              domain={[0, 9]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              tickFormatter={(val) => {
                const entry = Object.entries(moodMap).find(([_, index]) => index === val);
                return entry ? entry[0].substring(0, 3) : '';
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 700, fontFamily: 'monospace' }}
            />
            <YAxis 
              type="number" 
              dataKey="pnl" 
              name="P&L" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700, fontFamily: 'monospace' }}
              tickFormatter={(value) => `$${value}`}
            />
            <ZAxis type="number" dataKey="size" range={[100, 1000]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Mood Data" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  fillOpacity={0.6}
                  stroke={entry.color}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Optimal State</span>
          <span className="text-[10px] font-bold text-emerald-500">Confident / Calm</span>
        </div>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex flex-col text-right">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Danger Zone</span>
          <span className="text-[10px] font-bold text-rose-500">FOMO / Frustrated</span>
        </div>
      </div>
    </div>
  );
};
