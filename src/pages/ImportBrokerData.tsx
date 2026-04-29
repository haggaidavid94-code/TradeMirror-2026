import React from 'react';
import { 
  Upload, 
  ChevronDown, 
  FileText, 
  Circle, 
  Settings, 
  Zap, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Search,
  Download,
  Database,
  RefreshCcw,
  Eye,
  Play,
  FileSpreadsheet,
  AlertCircle,
  Link,
  BarChart3,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

import { useToast } from '../context/ToastContext';

// --- Sub-components ---

const ImportStat = ({ label, value, subtext, icon: Icon, color, iconBg, iconColor }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow soft-shadow-hover transition-all relative overflow-hidden group flex-1">
    {Icon && (
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity dark:text-white">
        <Icon size={80} strokeWidth={1} />
      </div>
    )}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <h4 className={`text-3xl font-bold mb-1 font-display tracking-tight ${color}`}>{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtext}</p>
    </div>
  </div>
);

const ValidationItem = ({ icon: Icon, title, note, color, iconBg, status }: any) => (
  <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${color} shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1.5">
        <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-sky-600 transition-colors">{title}</p>
        {status && <span className="text-[9px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">{status}</span>}
      </div>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">{note}</p>
    </div>
  </div>
);

const MappingRow = ({ column, mappedTo, type, coverage, status, statusColor, statusBg }: any) => (
  <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition-all group cursor-pointer last:border-0 border-l-4 border-l-transparent hover:border-l-sky-500">
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">{column}</p>
      <p className="text-[11px] text-slate-400 font-medium">Ticker symbol from exported statement</p>
    </div>
    <div className="w-40 text-left">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">{mappedTo}</p>
    </div>
    <div className="w-32 text-left">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">{type}</p>
    </div>
    <div className="w-32 text-center">
      <p className={`text-sm font-bold font-mono ${coverage === '100%' ? 'text-emerald-500' : 'text-amber-500'}`}>{coverage}</p>
    </div>
    <div className="w-32 text-right">
      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm ${statusBg} ${statusColor} border-current/10`}>
        {status}
      </span>
    </div>
  </div>
);

const ScoreRow = ({ label, score, color = 'text-slate-500', width }: any) => (
  <div className="mb-8 last:mb-0 group cursor-pointer">
    <div className="flex justify-between items-end mb-2.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{label}</span>
      <span className={`text-sm font-bold font-mono tracking-tight ${color}`}>{score}</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${(color || 'text-slate-500').replace('text-', 'bg-')} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000`} style={{ width }} />
    </div>
  </div>
);

// --- Main Page Component ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

export const ImportBrokerData = () => {
  const { showToast } = useToast();

  return (
    <motion.div 
      className="pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => showToast('Broker selection coming soon', 'info')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover cursor-pointer transition-all group"
          >
            <Database size={16} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tight">Interactive Brokers</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Import Focus</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">Connect broker → map fields → validate rows</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Import ready</span>
          </div>
          <button 
            onClick={() => showToast('Viewing import template...', 'info')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
          >
            <Eye size={16} />
            View template
          </button>
          <button 
            onClick={() => showToast('Starting broker import...')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Play size={16} />
            Start import
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="xl:col-span-9 space-y-8">
          {/* Intro Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/5 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Upload size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Import Broker Data</span>
                </div>
                <button 
                  onClick={() => showToast('Import settings coming soon', 'info')}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow-hover transition-all active:scale-95"
                >
                  <Settings size={14} />
                  Import settings
                </button>
              </div>

              <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
                Bring in broker fills without the cleanup headache.
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
                Upload statements, preview parsed rows, map key columns, and catch duplicates before anything reaches your journal or reports.
              </p>

              <div className="flex gap-6">
                <ImportStat label="Broker" value="IBKR" subtext="CSV statement selected" icon={Database} iconBg="bg-slate-50" iconColor="text-slate-400" color="text-slate-800 dark:text-white" />
                <ImportStat label="Rows Detected" value="2,418" subtext="Across 30 recent sessions" icon={FileSpreadsheet} iconBg="bg-slate-50" iconColor="text-slate-400" color="text-slate-800 dark:text-white" />
                <ImportStat label="Mapped Fields" value="8/8" subtext="Ready for validation" icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500" color="text-emerald-500" />
                <ImportStat label="Needs Review" value="36 rows" subtext="Missing side or symbol match" icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-500" color="text-orange-500" />
              </div>
            </div>
          </motion.div>

          {/* Detected Files & Note */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow group cursor-pointer">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Detected files</h3>
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] group-hover:text-sky-600 transition-colors">1 active source</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold tracking-tight">fills_march.csv</p>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">31.2 MB • Uploaded 2m ago</p>
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-lg uppercase tracking-widest">ACTIVE</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow group cursor-pointer">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Import note</h3>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-colors">Auto-detect on</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-wide">
                TradeMirror matched the broker format automatically and preserved your existing symbol, side, and execution rules from previous imports.
              </p>
            </div>
          </motion.div>

          {/* Import Flow */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Import flow</h3>
                <p className="text-sm text-slate-400 font-medium tracking-wide">A clean step-by-step workspace to get data in confidently.</p>
              </div>
              <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                {['Upload', 'Map fields', 'Validate', 'Finish'].map((t, i) => (
                  <button key={t} className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Drop Zone */}
              <div className="relative">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest font-display">Drop zone</h4>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Ready</span>
                </div>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-slate-800/20 soft-shadow-inner group hover:border-sky-500/50 transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl layered-shadow flex items-center justify-center text-sky-500 mb-8 group-hover:scale-110 transition-transform">
                    <Upload size={36} strokeWidth={2.5} />
                  </div>
                  <h5 className="text-lg font-bold text-slate-800 dark:text-white mb-3 tracking-tight">Drop your broker file here</h5>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-10 max-w-[240px] leading-relaxed">CSV, XLSX, or exported statement up to 50 MB</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => showToast('Opening file picker...')}
                      className="px-8 py-3 bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      Choose file
                    </button>
                    <button 
                      onClick={() => showToast('Checking clipboard for data...')}
                      className="px-8 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
                    >
                      Paste from clipboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest font-display">Validation summary</h4>
                  <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 shadow-sm">Mostly clean</span>
                </div>
                <div className="space-y-5">
                  <ValidationItem 
                    icon={CheckCircle2} 
                    title="2,382 rows are fully matched." 
                    note="Execution time, symbol, quantity, and side all passed auto-checks." 
                    color="text-emerald-500" 
                    iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                  />
                  <ValidationItem 
                    icon={AlertTriangle} 
                    title="24 rows need symbol normalization." 
                    note="Ticker aliases like BRK B and ESM24 need a confirmed mapping." 
                    color="text-amber-500" 
                    iconBg="bg-amber-50 dark:bg-amber-500/10"
                  />
                  <ValidationItem 
                    icon={Shield} 
                    title="12 rows may be duplicates." 
                    note="TradeMirror found matching fills already stored from previous import." 
                    color="text-rose-500" 
                    iconBg="bg-rose-50 dark:bg-rose-500/10"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Field Mapping Preview */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Field mapping preview</h3>
              <p className="text-sm text-slate-400 font-medium mb-10 tracking-wide">Review the detected columns before rows are written into your account.</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 soft-shadow-hover transition-all">
                    <Zap size={12} />
                    Auto-mapped
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <RefreshCcw size={12} />
                    Re-detect
                  </button>
                </div>
                <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="SEARCH COLUMN..." 
                    className="pl-11 pr-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold tracking-widest w-72 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all soft-shadow-inner text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/50 px-10 py-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <div className="flex-1">Incoming Column</div>
              <div className="w-40 text-left">Mapped To</div>
              <div className="w-32 text-left">Type</div>
              <div className="w-32 text-center">Coverage</div>
              <div className="w-32 text-right">Status</div>
            </div>

            <div className="px-5">
              <MappingRow 
                column="symbol" 
                mappedTo="Instrument" 
                type="Text" 
                coverage="99.4%" 
                status="Mapped" 
                statusColor="text-emerald-600" 
                statusBg="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <MappingRow 
                column="side" 
                mappedTo="Direction" 
                type="Enum" 
                coverage="100%" 
                status="Mapped" 
                statusColor="text-emerald-600" 
                statusBg="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <MappingRow 
                column="fill_price" 
                mappedTo="Entry price" 
                type="Number" 
                coverage="100%" 
                status="Mapped" 
                statusColor="text-emerald-600" 
                statusBg="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/20 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-sky-500 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">exec_time_local</p>
                  <p className="text-[11px] text-slate-400 font-medium">Broker execution timestamp with timezone</p>
                </div>
                <div className="w-40 text-left">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">Execution time</p>
                </div>
                <div className="w-32 text-left">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Datetime</p>
                </div>
                <div className="w-32 text-center">
                  <p className="text-sm font-bold text-amber-500 font-mono">98.1%</p>
                </div>
                <div className="w-32 text-right">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 shadow-sm">Review 12 rows</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Queue */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest">Review queue</h3>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">The rows most likely to need a manual decision.</p>
                </div>
                <span className="px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-orange-100 dark:border-orange-500/20 shadow-sm">36 Flagged</span>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Zap size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-amber-600 transition-colors">Ticker alias mismatch</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">24 futures and class-share symbols need a one-time naming decision.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-rose-600 transition-colors">Possible duplicate import</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">12 fills match existing timestamp, quantity, and price combinations.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-sky-600 transition-colors">Timezone confirmation needed</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Execution timestamps appear in exchange time and can be normalized.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens after import */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest">What happens after import</h3>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">A simple checklist so nothing feels ambiguous.</p>
                </div>
                <span className="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20 shadow-sm">4 Steps</span>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Database size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-sky-600 transition-colors">Raw fills are stored safely first.</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Nothing is merged into reports until validation clears.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Link size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-emerald-600 transition-colors">Rows attach to journal and trade log entries.</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Existing notes, screenshots, and playbook tags stay intact.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <Shield size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-amber-600 transition-colors">Duplicates are quarantined automatically.</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">You choose whether to skip, merge, or overwrite suspicious rows.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-hover transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    <BarChart3 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-sky-600 transition-colors">Analytics update as soon as import is approved.</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Detailed Reports and setup stats refresh on next sync.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar Column */}
        <motion.div variants={itemVariants} className="xl:col-span-3 space-y-8">
          {/* Import snapshot */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5 uppercase tracking-widest">Import snapshot</h3>
            <p className="text-[11px] text-slate-400 font-medium mb-10 leading-relaxed uppercase tracking-wider">Everything important at a glance before you proceed.</p>

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Source</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">IBKR</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">File name</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">fills_march.csv</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Import mode</span>
                <span className="text-sm font-bold text-sky-500 font-mono">Append safely</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Next action</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">Review</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[11px] font-bold text-center border border-emerald-100 dark:border-emerald-500/20 shadow-sm uppercase tracking-widest">2,382 ROWS READY</div>
              <div className="px-5 py-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-[11px] font-bold text-center border border-sky-100 dark:border-sky-500/20 shadow-sm uppercase tracking-widest">8 FIELDS MAPPED</div>
              <div className="px-5 py-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-[11px] font-bold text-center border border-orange-100 dark:border-orange-500/20 shadow-sm uppercase tracking-widest">36 ROWS TO REVIEW</div>
            </div>
          </div>

          {/* Source health */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-widest">Source health</h3>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">96% Clean</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-10 leading-relaxed uppercase tracking-wider">Fast quality checks.</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 soft-shadow-hover transition-all group cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-600 transition-colors">Date Format</p>
                <h4 className="text-2xl font-bold text-emerald-500 font-mono tracking-tighter">100%</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Parsed</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 soft-shadow-hover transition-all group cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">Symbol Match</p>
                <h4 className="text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tighter">99%</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Minor alias</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 soft-shadow-hover transition-all group cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-600 transition-colors">Side Detection</p>
                <h4 className="text-2xl font-bold text-emerald-500 font-mono tracking-tighter">100%</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Mapped</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 soft-shadow-hover transition-all group cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-rose-600 transition-colors">Duplicates</p>
                <h4 className="text-2xl font-bold text-rose-500 font-display tracking-tighter">12</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Approval</p>
              </div>
            </div>
          </div>

          {/* Import scorecard */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-widest">Import scorecard</h3>
              <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20">Conf 9.1</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-10 leading-relaxed uppercase tracking-wider">Habit confidence.</p>

            <div className="space-y-8">
              <ScoreRow label="Format recognition" score="9.8" color="text-emerald-500" width="98%" />
              <ScoreRow label="Field mapping" score="9.2" color="text-sky-500" width="92%" />
              <ScoreRow label="Conflict resolution" score="7.3" color="text-orange-500" width="73%" />
            </div>
          </div>

          {/* Recent import activity */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-widest">Recent activity</h3>
              <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[9px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20">Live checks</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-10 leading-relaxed uppercase tracking-wider">System events.</p>

            <div className="space-y-10 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
              <div className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">IBKR template recognized</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Matched previous March import profile automatically.</p>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Just now</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors">File integrity check passed</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">No missing delimiters or broken rows found.</p>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">1m ago</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">36 rows moved to review</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Aliases and duplicates isolated before import.</p>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Today</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
