import React from 'react';
import { 
  Brain, 
  Plus, 
  Circle, 
  Shield, 
  Zap, 
  Target,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartTooltip } from '../components/ChartTooltip';
import { MetricSkeleton, CardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { useTrades } from '../context/TradeContext';
import { useToast } from '../context/ToastContext';

// --- Sub-components ---

const PsychStat = ({ label, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow soft-shadow-hover transition-all relative overflow-hidden group flex-1">
    {Icon && (
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity dark:text-white">
        <Icon size={80} strokeWidth={1} />
      </div>
    )}
    <div className="relative z-10">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>
      <h4 className={`text-3xl font-bold mb-1 font-display tracking-tight ${color}`}>{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtext}</p>
    </div>
  </div>
);

// --- Main Page Component ---

export const Psychology = () => {
  const { trades, loading: tradesLoading } = useTrades();
  const [isLoading, setIsLoading] = React.useState(true);
  const { showToast } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = React.useMemo(() => {
    if (trades.length === 0) return null;

    const impulseTrades = trades.filter(t => (t.mistakes || '').toLowerCase().includes('impulse')).length;
    const ruleFollowedPercent = ((trades.length - impulseTrades) / trades.length) * 100;

    // Last 5 trades emotional score mock (since we don't have a specific field for score yet)
    const trendData = trades.slice(0, 5).reverse().map((t, i) => ({
      name: `T${i+1}`,
      value: t.pnl > 0 ? 8 + Math.random() : 5 + Math.random()
    }));

    return { impulseTrades, ruleFollowedPercent, trendData };
  }, [trades]);

  if (tradesLoading || isLoading) {
    return (
      <div className="pb-12 space-y-8">
        <div className="flex gap-6">
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <CardSkeleton className="h-[400px]" />
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="py-20 text-center">
        <EmptyState 
          title="Psychology insights pending" 
          description="Log your emotions and mistakes in the journal to build your psychological edge map."
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow">
            <Brain size={16} className="text-sky-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-white font-mono tracking-tight">Psychological Edge</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Mindset Tracking Active</span>
          </div>
          <button 
            onClick={() => showToast('Reflection prompts coming soon', 'info')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 layered-shadow"
          >
            <MessageSquare size={16} />
            Reflection prompts
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/10 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
                Master the space between the plan and the trade.
              </h1>
              <div className="flex gap-6">
                <PsychStat label="Rule Adherence" value={`${stats?.ruleFollowedPercent.toFixed(0)}%`} subtext="Process consistency" color="text-emerald-500" icon={Shield} />
                <PsychStat label="Impulse Trades" value={stats?.impulseTrades} subtext="Tracked as mistakes" color="text-amber-500" icon={Zap} />
                <PsychStat label="Mindset Focus" value="Calm" subtext="Most frequent state" color="text-sky-500" icon={Target} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 font-display">Mindset Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F8FAFC" className="dark:opacity-[0.03]" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 font-display">Notes & Signals</h3>
              <div className="space-y-4">
                {trades.filter(t => t.mistakes || t.notes).slice(0, 3).map((t, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.date}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{t.symbol} - {t.strategy}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">"{t.notes || t.mistakes}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
