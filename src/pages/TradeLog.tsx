import React from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Circle, 
  Download, 
  Plus, 
  List, 
  Columns,
  Search,
  Filter,
  Tag,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  AlertTriangle,
  MoreHorizontal,
  RefreshCw,
  Check,
  Inbox
} from 'lucide-react';
import { motion } from 'motion/react';
import { Skeleton, CardSkeleton, TableRowSkeleton, MetricSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

import { useToast } from '../context/ToastContext';
import { useTrades } from '../context/TradeContext';

// --- Sub-components ---

const SummaryMetric = ({ label, value, subtext, color, icon: Icon }: any) => (
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

const ExecutionRow = ({ time, holdTime, side, symbol, setup, note, entry, size, exit, exits, active }: any) => (
  <div className={`flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition-all group cursor-pointer border-l-4 data-row ${active ? 'bg-sky-50/50 dark:bg-sky-900/30 border-l-sky-500' : 'border-l-transparent'}`}>
    <div className="w-24">
      <p className="text-xs font-bold text-slate-800 dark:text-white font-mono">{time}</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{holdTime} hold</p>
    </div>
    <div className="w-20">
      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm ${side === 'Long' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
        {side}
      </span>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-sky-600 transition-colors">{symbol} · {setup}</p>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1">{note}</p>
    </div>
    <div className="w-24">
      <p className="text-xs font-bold text-slate-800 dark:text-white font-mono">{entry}</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">{size}</p>
    </div>
    <div className="w-24">
      <p className="text-xs font-bold text-slate-800 dark:text-white font-mono">{exit}</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">{exits}</p>
    </div>
  </div>
);

const ScorecardMetric = ({ label, score, color }: any) => (
  <div className="flex-1 text-center group">
    <div className="relative inline-flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className={`${color} transition-all duration-1000 ease-out`} strokeDasharray={175} strokeDashoffset={175 - (parseFloat(score) / 10) * 175} strokeLinecap="round" />
      </svg>
      <span className="absolute text-sm font-bold text-slate-800 dark:text-white font-mono">{score}</span>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

// --- Main Page Component ---
export const TradeLog = ({ onAddTrade }: { onAddTrade: () => void }) => {
  const { trades, loading: tradesLoading } = useTrades();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { showToast } = useToast();

  const filteredTrades = trades.filter(t => 
    t.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.strategy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const netPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length) * 100 : 0;
  
  const bestSetup = (() => {
    const strategyStats: Record<string, number> = {};
    trades.forEach(t => {
      if (t.pnl > 0) {
        strategyStats[t.strategy] = (strategyStats[t.strategy] || 0) + t.pnl;
      }
    });
    return Object.entries(strategyStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  })();

  const hasResults = searchQuery.toLowerCase() !== 'no results';

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
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono tracking-tight">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Log Focus</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">Execution detail → clean review</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Synced with broker</span>
          </div>
          <button 
            onClick={() => showToast('Exporting CSV...')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button 
            onClick={onAddTrade}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 dark:shadow-sky-900/40 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={16} />
            Add trade
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="xl:col-span-9 space-y-8">
          {/* Intro Card */}
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/10 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <List size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Trade Log</span>
                </div>
                <button 
                  onClick={() => showToast('Column customization coming soon', 'info')}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover transition-all active:scale-95"
                >
                  <Columns size={12} />
                  Columns
                </button>
              </div>

              <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
                Every fill, every exit, every decision in one reviewable ledger.
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
                Built for a denser trading workflow: summary metrics up top, detailed execution rows in the center, and a focused review rail for the selected trade.
              </p>

              <div className="flex gap-6 mb-12">
                {tradesLoading ? (
                  <>
                    <MetricSkeleton />
                    <MetricSkeleton />
                    <MetricSkeleton />
                    <MetricSkeleton />
                  </>
                ) : (
                  <>
                    <SummaryMetric label="Net P&L" value={`${netPnL >= 0 ? '+' : ''}$${netPnL.toLocaleString()}`} subtext={`${trades.length} trades · ${winRate.toFixed(0)}% win rate`} color={netPnL >= 0 ? "text-emerald-500" : "text-rose-500"} icon={ArrowUpRight} />
                    <SummaryMetric label="Average Hold" value="18m" subtext="Inferred from history" color="text-slate-800" icon={Clock} />
                    <SummaryMetric label="Best Setup" value={bestSetup} subtext="highest total pnl" color="text-slate-800" icon={Target} />
                    <SummaryMetric label="Rule Score" value="8.6" subtext="Placeholder" color="text-sky-500" icon={Shield} />
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Session mix</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-sky-100 dark:border-sky-500/20">Balanced split</span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">2 long · 2 short · 3 equities · 1 ETF</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Import note</p>
                  <div className="flex items-center gap-3 justify-end">
                    <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-emerald-100 dark:border-emerald-500/20">Latest sync 3m ago</span>
                    <p className="text-[10px] text-slate-400 font-medium max-w-xs leading-relaxed">Execution timestamps, fills, fees, and route data are available for review on the selected trade.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Log Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Execution log</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">Dense table view with entry and exit details prioritized.</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  {['All trades', 'Winners', 'Losers', 'Mistakes'].map((f, i) => (
                    <button 
                      key={f} 
                      onClick={() => showToast(`Filtering log by: ${f}`, 'info')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button 
                    onClick={() => showToast('Account filter opened', 'info')}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow soft-shadow-hover transition-all active:scale-95"
                  >
                    <Calendar size={12} />
                    All accounts
                  </button>
                  <button 
                    onClick={() => showToast('Setup filter opened', 'info')}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow soft-shadow-hover transition-all active:scale-95"
                  >
                    <Target size={12} />
                    Setups
                  </button>
                  <button 
                    onClick={() => showToast('Tag filter opened', 'info')}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow soft-shadow-hover transition-all active:scale-95"
                  >
                    <Tag size={12} />
                    Tags
                  </button>
                </div>
                <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search symbol or note" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && showToast(`Searching log for: ${e.currentTarget.value}`, 'info')}
                    className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold w-72 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:bg-white dark:focus:bg-slate-700 focus:border-sky-200 dark:focus:border-sky-500/50 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <div className="w-24">Time</div>
              <div className="w-20 text-center">Side</div>
              <div className="flex-1 px-4">Symbol & Setup</div>
              <div className="w-24">Entry</div>
              <div className="w-24">Exit</div>
            </div>

            <div>
              {tradesLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredTrades.length === 0 ? (
                <EmptyState 
                  icon={Inbox}
                  title="No executions found"
                  description="We couldn't find any trades matching your current search or filter criteria."
                  action={{
                    label: "Clear filters",
                    onClick: () => setSearchQuery('')
                  }}
                />
              ) : (
                filteredTrades.map((trade, idx) => (
                  <ExecutionRow 
                    key={trade.id || idx}
                    time={new Date(trade.date).toLocaleDateString()} 
                    holdTime={trade.duration} 
                    side={trade.type} 
                    symbol={trade.asset} 
                    setup={trade.strategy} 
                    note={`P&L: $${trade.pnl}`} 
                    entry={trade.entry} 
                    size={trade.size} 
                    exit={trade.exit} 
                    exits="1 exit" 
                    active={idx === 0}
                  />
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mistake Review */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow group">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Mistake review</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">A tighter list of process issues captured directly from the log.</p>
                </div>
                <span className="px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-orange-100 dark:border-orange-500/20 shadow-sm animate-pulse-soft">1 flagged today</span>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 hover:bg-white dark:hover:bg-slate-800 hover:soft-shadow transition-all group/item">
                <p className="text-xs font-bold text-slate-800 dark:text-white mb-2 group-hover/item:text-orange-600 transition-colors">SPY failed breakout short</p>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">
                  The idea was valid, but the cover happened late after the reclaim. This trade stays in the log because it shows what happens when pace speeds up.
                </p>
                <div className="flex gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded text-[9px] font-bold uppercase tracking-widest">Late cover</span>
                  <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded text-[9px] font-bold uppercase tracking-widest">Impulse</span>
                </div>
                <button className="flex items-center gap-2 text-sky-500 text-[10px] font-bold hover:text-sky-600 transition-colors uppercase tracking-widest">
                  <RefreshCw size={12} className="group-hover/item:rotate-180 transition-transform duration-500" />
                  Replay needed
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:soft-shadow transition-all">
                <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Best repeatable execution</p>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Waiting for reclaim confirmation before entering TSLA produced the cleanest fill, the best R multiple, and the calmest management.
                </p>
              </div>
            </div>

            {/* Execution Scorecard */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Execution scorecard</h3>
              <p className="text-[11px] text-slate-400 font-medium mb-8 uppercase tracking-wider">Short review based on timing, fills, and management.</p>

              <div className="flex gap-4 mb-10">
                <ScorecardMetric label="Entries" score="8.8" color="text-sky-500" />
                <ScorecardMetric label="Exits" score="8.1" color="text-emerald-500" />
                <ScorecardMetric label="Pacing" score="7.4" color="text-orange-500" />
              </div>

              <div className="space-y-6">
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-3 group-hover:text-sky-600 transition-colors">What the log says clearly</p>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:soft-shadow transition-all">
                    Best trades came from confirmation-based entries. The weakest row came from a faster-than-usual reaction around midday.
                  </div>
                </div>
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-3 group-hover:text-sky-600 transition-colors">Tomorrow's rule</p>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:soft-shadow transition-all">
                    If a setup requires a fast add to make sense, it probably should not be in the log tomorrow.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent log notes */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Recent log notes</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Previous sessions with dense execution annotations.</p>
                </div>
                <button className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-sky-500 transition-colors uppercase tracking-widest">View archive</button>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:soft-shadow hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 group-hover:border-sky-100 dark:group-hover:border-sky-500/30 transition-colors">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oct</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-white leading-none font-mono">23</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20">Screenshots</span>
                      <span className="px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded text-[9px] font-bold uppercase tracking-widest border border-orange-100 dark:border-orange-500/20">1 mistake</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                </div>
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:soft-shadow hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:border-emerald-100 dark:group-hover:border-emerald-500/30 transition-colors">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oct</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-white leading-none font-mono">22</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">Disciplined</span>
                      <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20">2 trades</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Broker sync */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Broker sync</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Import health for traders who want terminal-like detail.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 shadow-sm">Healthy</span>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Orders imported</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">37</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Average import delay</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">42<span className="text-xs text-slate-400 ml-1">sec</span></span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Rows needing manual notes</span>
                  <span className="text-xl font-bold text-orange-500 font-mono">2 / 4</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95 uppercase tracking-widest">Review imports</button>
                <button className="flex-1 py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-sky-500/20 dark:shadow-sky-900/40 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest">Sync again</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Review Rail) */}
        <div className="xl:col-span-3 space-y-8">
          {/* Today at a glance */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">Today at a glance</h3>
            <p className="text-[11px] text-slate-400 font-medium mb-8 leading-relaxed uppercase tracking-wider">Compact overview before diving into rows.</p>

            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center group">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Selected trade</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tighter">TSLA</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Entry → exit</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">10:05 → 10:24</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Execution quality</span>
                <span className="text-sm font-bold text-sky-500 uppercase tracking-widest">A- clean</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Slippage</span>
                <span className="text-sm font-bold text-orange-500 font-mono">$12 total</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold text-center uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-500/20 shadow-sm">Good entries</div>
              <div className="px-5 py-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-[10px] font-bold text-center uppercase tracking-[0.2em] border border-sky-100 dark:border-sky-500/20 shadow-sm">Clean partials</div>
              <div className="px-5 py-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-bold text-center uppercase tracking-[0.2em] border border-orange-100 dark:border-orange-500/20 shadow-sm">Review last add</div>
            </div>
          </div>

          {/* Selected trade detail */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-500/10 rounded-full blur-3xl opacity-20 -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Selected trade</h3>
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm">TSLA active</span>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">TSLA · VWAP reclaim</h4>
                  <span className="text-xl font-bold text-emerald-500 font-display tracking-tighter">+$380</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Clean reclaim after opening consolidation. Best alignment between morning plan and actual execution.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Entry</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white font-mono tracking-tighter">241.82</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">10:05 AM</p>
                </div>
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Exit</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white font-mono tracking-tighter">243.14</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">10:24 AM</p>
                </div>
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Stop</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white font-mono tracking-tighter">241.28</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Risk $160</p>
                </div>
                <div className="group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Fees + Slip</p>
                  <p className="text-lg font-bold text-orange-500 font-mono tracking-tighter">$18</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Broker fees</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution tags</p>
                  <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">A- quality</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20 shadow-sm">Good location</span>
                  <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20 shadow-sm">Scale out</span>
                  <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm">One small add</span>
                  <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm">No chase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review rail timeline */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">Review rail</h3>
            <p className="text-[11px] text-slate-400 font-medium mb-10 leading-relaxed uppercase tracking-wider">Notes that make the log more useful on replay.</p>

            <div className="space-y-10 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
              <div className="flex gap-6 relative z-10 group">
                <div className="w-12 shrink-0 text-[10px] font-bold text-slate-400 font-mono pt-1 group-hover:text-sky-500 transition-colors">9:58 AM</div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:soft-shadow transition-all">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Context aligned</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">TSLA held opening support while SPY stayed firm above VWAP.</p>
                </div>
              </div>
              <div className="flex gap-6 relative z-10 group">
                <div className="w-12 shrink-0 text-[10px] font-bold text-slate-400 font-mono pt-1 group-hover:text-sky-500 transition-colors">10:05 AM</div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:soft-shadow transition-all">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Entry trigger</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Entered on reclaim candle close instead of anticipating the break.</p>
                </div>
              </div>
              <div className="flex gap-6 relative z-10 group">
                <div className="w-12 shrink-0 text-[10px] font-bold text-slate-400 font-mono pt-1 group-hover:text-sky-500 transition-colors">10:18 AM</div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:soft-shadow transition-all">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Partial discipline</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Took the first partial into extension and reduced emotional pressure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
