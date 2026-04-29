import React from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Circle, 
  Target,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Plus,
  Settings,
  BarChart2,
  Zap,
  Search,
  Shield
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { ChartTooltip } from '../components/ChartTooltip';
import { MetricSkeleton, CardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { useTrades } from '../context/TradeContext';
import { useDisplay } from '../context/DisplayContext';
import { useToast } from '../context/ToastContext';

// --- Sub-components ---

const ReportMetric = ({ label, value, subtext, color, icon: Icon }: any) => (
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

const SetupRow = ({ setup, note, trades, winRate, avgR, pnl, pnlColor }: any) => (
  <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition-all group cursor-pointer last:border-0 data-row">
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">{setup}</p>
      <p className="text-[11px] text-slate-400 font-medium">{note}</p>
    </div>
    <div className="w-20 text-center">
      <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">{trades}</p>
    </div>
    <div className="w-24 text-center">
      <p className="text-sm font-bold text-emerald-500 font-mono">{winRate}</p>
    </div>
    <div className="w-24 text-center">
      <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">{avgR}</p>
    </div>
    <div className="w-28 text-right">
      <p className={`text-sm font-bold font-mono ${pnlColor}`}>{pnl}</p>
    </div>
  </div>
);

// --- Main Page Component ---

export const DetailedReports = () => {
  const { trades, loading: tradesLoading } = useTrades();
  const { formatPnl } = useDisplay();
  const [isLoading, setIsLoading] = React.useState(true);
  const { showToast } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = React.useMemo(() => {
    if (trades.length === 0) return null;

    const netPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = (trades.filter(t => t.pnl > 0).length / (trades.length || 1)) * 100;
    const avgR = trades.reduce((sum, t) => sum + t.risk, 0) / (trades.length || 1);

    // Equity curve data
    let cumulative = 0;
    const equityData = trades.slice().reverse().map((t, i) => {
      cumulative += t.pnl;
      return { name: `T${i+1}`, value: cumulative };
    });

    // Setup breakdown
    const setupMap: Record<string, any> = {};
    trades.forEach(t => {
      const s = t.strategy || 'Unknown';
      if (!setupMap[s]) setupMap[s] = { trades: 0, wins: 0, pnl: 0, totalR: 0 };
      setupMap[s].trades++;
      setupMap[s].pnl += t.pnl;
      setupMap[s].totalR += t.risk;
      if (t.pnl > 0) setupMap[s].wins++;
    });

    const setupData = Object.entries(setupMap).map(([name, data]) => ({
      setup: name,
      note: 'Based on your recent execution data',
      trades: data.trades,
      winRate: `${((data.wins / data.trades) * 100).toFixed(0)}%`,
      avgR: `${(data.totalR / data.trades).toFixed(1)}R`,
      pnl: `${data.pnl >= 0 ? '+' : ''}${formatPnl(data.pnl)}`,
      pnlColor: data.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
    })).sort((a, b) => {
      const valA = parseFloat(a.pnl.replace(/[^0-9.-]/g, ''));
      const valB = parseFloat(b.pnl.replace(/[^0-9.-]/g, ''));
      return valB - valA;
    });

    const winningPnl = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const losingPnl = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = losingPnl === 0 ? (winningPnl > 0 ? 'Max' : '0.00') : (winningPnl / losingPnl).toFixed(2);

    return { netPnl, winRate, avgR, equityData, setupData, profitFactor };
  }, [trades, formatPnl]);

  if (tradesLoading || isLoading) {
    return (
      <div className="pb-12 space-y-8">
        <div className="flex gap-6">
          <MetricSkeleton />
          <MetricSkeleton />
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
          title="No data available for reports" 
          description="Once you start logging trades, we'll generate detailed performance analytics here."
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => showToast('Date selection coming soon', 'info')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover cursor-pointer transition-all group"
          >
            <Calendar size={16} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono tracking-tight">All Time</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports Focus</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">Performance breakdown → edge → next actions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Report synced</span>
          </div>
          <button 
            onClick={() => showToast('Exporting PDF report...')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-8">
          {/* Intro Card */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/10 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <BarChart2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Detailed Reports</span>
                </div>
              </div>

              <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
                See exactly where your edge is coming from.
              </h1>

              <div className="flex gap-6 mb-12">
                <ReportMetric label="Net P&L" value={`${stats?.netPnl >= 0 ? '+' : ''}${formatPnl(stats?.netPnl || 0)}`} subtext={`${trades.length} trades total`} color={stats?.netPnl >= 0 ? "text-emerald-500" : "text-rose-500"} icon={TrendingUp} />
                <ReportMetric label="Win Rate" value={`${stats?.winRate.toFixed(1)}%`} subtext="Overall precision" color="text-slate-800 dark:text-white" icon={Target} />
                <ReportMetric label="Average R" value={`${stats?.avgR.toFixed(2)}R`} subtext="Expectancy" color="text-slate-800 dark:text-white" icon={Zap} />
                <ReportMetric label="Profit Factor" value={stats?.profitFactor} subtext="Reward to Risk" color="text-sky-500" icon={Shield} />
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Setups</p>
                  <div className="flex items-center gap-3">
                    {stats?.setupData.slice(0, 3).map(s => (
                      <span key={s.setup} className="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{s.setup}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Data Quality</p>
                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Verified Sync</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 font-display">Equity Curve</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.equityData}>
                    <defs>
                      <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<ChartTooltip prefix="$" />} />
                    <Area type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={3} fill="url(#colorEquity)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 font-display">Setup Frequency</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.setupData.slice(0, 5)}>
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="trades" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="setup" hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Setup Breakdown</h3>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <div className="flex-1">Setup</div>
              <div className="w-20 text-center">Trades</div>
              <div className="w-24 text-center">Win Rate</div>
              <div className="w-24 text-center">Avg R</div>
              <div className="w-28 text-right">P&L</div>
            </div>
            <div className="px-3">
              {stats?.setupData.map((data, i) => (
                <SetupRow key={i} {...data} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
