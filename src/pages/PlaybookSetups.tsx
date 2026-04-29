import React from 'react';
import { 
  Target, 
  ChevronDown, 
  Plus, 
  Copy, 
  Target as TargetIcon,
  TrendingUp,
  Shield,
  AlertTriangle,
  Circle
} from 'lucide-react';
import { MetricSkeleton, CardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { useTrades } from '../context/TradeContext';
import { useDisplay } from '../context/DisplayContext';
import { useToast } from '../context/ToastContext';

// --- Sub-components ---

const PlaybookStat = ({ label, value, subtext, color, icon: Icon }: any) => (
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

const SetupCard = ({ tags, score, title, description, trades, winRate, avgR, pnl }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow soft-shadow-hover transition-all flex flex-col group cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string, i: number) => (
          <span key={i} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm ${i === 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200'}`}>
            {tag}
          </span>
        ))}
      </div>
      <div className="text-right">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
        <p className="text-2xl font-bold text-emerald-500 font-display tracking-tighter">{score}</p>
      </div>
    </div>
    
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 transition-colors font-display">{title}</h3>
    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">{description}</p>
    
    <div className="flex gap-6 mb-8">
      <div className="group/stat">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-slate-800 dark:group-hover/stat:text-slate-200 transition-colors">{trades} trades</p>
      </div>
      <div className="group/stat">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-emerald-500 transition-colors">{winRate} win</p>
      </div>
      <div className="group/stat">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-slate-800 dark:group-hover/stat:text-slate-200 transition-colors">{avgR}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">P&L</p>
        <p className={`text-sm font-bold font-mono ${pnl.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{pnl}</p>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Action</p>
        <p className="text-sm font-bold text-sky-500 hover:text-sky-600 transition-colors uppercase tracking-widest">Detail</p>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export const PlaybookSetups = () => {
  const { trades, loading: tradesLoading } = useTrades();
  const { formatPnl } = useDisplay();
  const [isLoading, setIsLoading] = React.useState(true);
  const { showToast } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const playbookStats = React.useMemo(() => {
    if (trades.length === 0) return null;

    const setupMap: Record<string, any> = {};
    trades.forEach(t => {
      const s = t.strategy || 'Unknown';
      if (!setupMap[s]) setupMap[s] = { trades: 0, wins: 0, pnl: 0, totalR: 0 };
      setupMap[s].trades++;
      setupMap[s].pnl += t.pnl;
      setupMap[s].totalR += t.risk;
      if (t.pnl > 0) setupMap[s].wins++;
    });

    const activeSetupsCount = Object.keys(setupMap).length;
    const bestSetup = Object.entries(setupMap).sort((a, b) => b[1].pnl - a[1].pnl)[0];

    const cards = Object.entries(setupMap).map(([name, data]) => ({
      tags: [data.pnl >= 0 ? 'A-tier' : 'Review Needed'],
      score: (Math.min(9.5, Math.max(1.0, (data.wins / data.trades) * 10))).toFixed(1),
      title: name,
      description: `Historical performance statistics based on ${data.trades} execution logs.`,
      trades: data.trades,
      winRate: `${((data.wins / data.trades) * 100).toFixed(0)}%`,
      avgR: `${(data.totalR / data.trades).toFixed(1)}R`,
      pnl: `${data.pnl >= 0 ? '+' : ''}${formatPnl(data.pnl)}`
    }));

    return { activeSetupsCount, bestSetup, cards };
  }, [trades, formatPnl]);

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
          title="Your playbook is empty" 
          description="Log trades with strategy tags to automatically build your playbook library."
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow">
            <Target size={16} className="text-sky-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-white font-mono tracking-tight">Active Playbook</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">{playbookStats?.activeSetupsCount} active setups</span>
          </div>
          <button 
            onClick={() => showToast('Opening setup builder...')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all active:scale-95"
          >
            <Plus size={16} />
            Create setup
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/10 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
                Repeat what works. Cut what drags.
              </h1>
              <div className="flex gap-6">
                <PlaybookStat label="Active Setups" value={playbookStats?.activeSetupsCount} subtext="Tracked in your trade logs" color="text-slate-800 dark:text-white" icon={TargetIcon} />
                <PlaybookStat label="Best Performer" value={playbookStats?.bestSetup?.[0]} subtext={`${((playbookStats?.bestSetup?.[1].wins / playbookStats?.bestSetup?.[1].trades) * 100).toFixed(0)}% win rate`} color="text-emerald-500" icon={TrendingUp} />
                <PlaybookStat label="Edges Found" value={trades.filter(t => t.pnl > 0).length} subtext="Successful trades logged" color="text-sky-500" icon={Shield} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {playbookStats?.cards.map((card, i) => (
              <SetupCard key={i} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
