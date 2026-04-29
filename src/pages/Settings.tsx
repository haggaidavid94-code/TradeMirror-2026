import React from 'react';
import { 
  Settings as SettingsIcon, 
  ChevronDown, 
  Bell, 
  Monitor, 
  Database, 
  AlertTriangle, 
  Circle, 
  RotateCcw, 
  Save, 
  Mail, 
  Smartphone, 
  Clock, 
  Layout, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  DollarSign, 
  User, 
  FileText, 
  Shield, 
  Lock, 
  ExternalLink,
  Trash2,
  Download,
  RefreshCw,
  Zap,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { migrateFromLocalStorage } from '../utils/migrateFromLocalStorage';

// --- Sub-components ---

const SettingsStat = ({ label, value, subtext, icon: Icon, color, iconBg, iconColor }: any) => (
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
          <div className={`w-8 h-8 rounded-lg ${iconBg} dark:bg-slate-800 flex items-center justify-center ${iconColor} border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <h4 className={`text-3xl font-bold mb-1 font-display tracking-tight ${color}`}>{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtext}</p>
    </div>
  </div>
);

const Toggle = ({ enabled, label, subtext }: { enabled: boolean, label: string, subtext?: string }) => (
  <div className="flex items-center justify-between py-5 border-b border-slate-50 dark:border-slate-800 last:border-0 group cursor-pointer">
    <div className="flex-1 pr-8">
      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-sky-600 transition-colors">{label}</p>
      {subtext && <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">{subtext}</p>}
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 soft-shadow-inner ${enabled ? 'bg-sky-500 shadow-lg shadow-sky-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </div>
  </div>
);

const DropdownField = ({ label, value, icon: Icon }: any) => (
  <div className="flex-1 group">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{label}</p>
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className="text-slate-400 group-hover:text-sky-500 transition-colors" />}
        <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
      </div>
      <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
    </div>
  </div>
);

const NotificationCard = ({ icon: Icon, title, subtext, buttons }: any) => (
  <div className="flex-1 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl layered-shadow soft-shadow-hover transition-all group flex flex-col">
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 transition-colors">{title}</p>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 uppercase tracking-wide">{subtext}</p>
    </div>
    <div className="flex gap-2">
      {buttons.map((btn: any, i: number) => (
        <button key={i} className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 soft-shadow-hover transition-all active:scale-95">
          <btn.icon size={12} />
          {btn.label}
        </button>
      ))}
    </div>
  </div>
);

const BrokerCard = ({ name, status, statusColor, statusBg, description }: any) => (
  <div className="flex-1 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl layered-shadow soft-shadow-hover transition-all group cursor-pointer">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-sky-600 transition-colors">{name}</h4>
      <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm ${statusBg} ${statusColor} border-current/10 dark:border-current/20`}>{status}</span>
    </div>
    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 uppercase tracking-wide">{description}</p>
    <button className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] hover:text-sky-600 transition-colors flex items-center gap-2">
      Manage connection
      <ExternalLink size={10} />
    </button>
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

export const Settings = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  return (
    <motion.div 
      className="pb-12 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => showToast('Workspace selection coming soon', 'info')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover cursor-pointer transition-all group"
          >
            <Layout size={16} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tight">Workspace settings</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Settings Focus</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">Notifications → Workspace → Account</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full border border-sky-100 dark:border-sky-500/20 shadow-sm">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Preferences synced</span>
          </div>
          <button 
            onClick={() => showToast('Restoring default settings...')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 layered-shadow soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            Restore defaults
          </button>
          <button 
            onClick={() => showToast('Saving changes...')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </motion.header>

      <div className="space-y-8">
        {/* Settings Hub Intro */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-500/5 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                <SettingsIcon size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Settings Hub</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[280px] soft-shadow-inner group">
                <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-4 group-hover:text-sky-600 transition-colors">Most active area</p>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 uppercase tracking-wide">Notifications and workspace preferences are pinned at the top for faster review.</p>
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {['Desktop', 'Email', 'Mobile'].map((t, i) => (
                    <button 
                      key={t} 
                      onClick={() => showToast(`Switched to ${t} view`, 'info')}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="text-[48px] font-bold text-slate-800 dark:text-white mb-6 max-w-2xl leading-[1.05] tracking-tight font-display">
              Manage your workspace in one clean place.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
              A full all-in-one settings hub for notifications, workspace preferences, journal defaults, broker sync rules, and account controls—organized in a calm single-column flow.
            </p>

            <div className="flex gap-6">
              <SettingsStat label="Notifications" value="12 rules" subtext="Across desktop, email, and alerts" icon={Bell} iconBg="bg-slate-50" iconColor="text-slate-400" color="text-slate-800 dark:text-white" />
              <SettingsStat label="Workspace Mode" value="Focus" subtext="Compact chrome, calm surfaces" icon={Monitor} iconBg="bg-sky-50" iconColor="text-sky-500" color="text-sky-500" />
              <SettingsStat label="Broker Syncs" value="3 active" subtext="IBKR, Tradovate, manual CSV" icon={RefreshCw} iconBg="bg-emerald-50" iconColor="text-emerald-500" color="text-emerald-500" />
              <SettingsStat label="Pending Review" value="2 changes" subtext="Timezone and digest cadence" icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-500" color="text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest font-display">Notifications</h3>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Decide what deserves your attention and where it should appear.</p>
            </div>
            <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 shadow-sm">Priority area</span>
          </div>

          <div className="flex gap-6 mb-12">
            <NotificationCard 
              title="Daily summary" 
              subtext="A short close-of-day digest with P&L, discipline notes, and execution stats." 
              buttons={[{ icon: Monitor, label: 'Desktop' }, { icon: Mail, label: 'Email' }]}
            />
            <NotificationCard 
              title="Risk alerts" 
              subtext="Notify when daily loss, size limits, or revenge-trading patterns show up." 
              buttons={[{ icon: Smartphone, label: 'Mobile' }, { icon: Monitor, label: 'Desktop' }]}
            />
            <NotificationCard 
              title="Weekly review reminders" 
              subtext="A Friday nudge to review playbooks, detailed reports, and mindset notes." 
              buttons={[{ icon: Mail, label: 'Email' }]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Channel defaults</p>
              <Toggle enabled={true} label="Desktop alerts" subtext="Banner alerts for fills, risk events, and import completion." />
              <Toggle enabled={true} label="Email digests" subtext="Daily and weekly summaries grouped into a clean recap." />
              <Toggle enabled={false} label="Quiet hours" subtext="Pause non-critical messages from 9:00 PM to 7:00 AM." />
            </div>
            <div className="space-y-8">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Delivery cadence</p>
              <DropdownField label="End-of-day digest" value="Weekdays at 4:30 PM" />
              <DropdownField label="Weekly review reminder" value="Friday at 5:00 PM" />
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between soft-shadow-inner group cursor-pointer">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-sky-600 transition-colors">High-priority route</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white font-mono">Desktop + mobile push</p>
                </div>
                <RefreshCw size={16} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Workspace Preferences */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest font-display">Workspace preferences</h3>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Tune layout density, default landing page, and the flow of your everyday review process.</p>
            </div>
            <span className="px-4 py-1.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-500/20 shadow-sm">Workspace</span>
          </div>

          <div className="flex gap-6 mb-12">
            <DropdownField label="Default landing page" value="Dashboard" icon={Layout} />
            <DropdownField label="Calendar start" value="Monday" icon={Calendar} />
            <DropdownField label="Timezone" value="Eastern Time (ET)" icon={Globe} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Layout style</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => showToast('Switched to Focused layout')}
                  className="flex items-center gap-3 px-5 py-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-2xl text-xs font-bold text-sky-600 dark:text-sky-400 shadow-sm transition-all active:scale-95"
                >
                  <Monitor size={16} />
                  Focused layout
                </button>
                <button 
                  onClick={() => showToast('Switched to Balanced layout')}
                  className="flex items-center gap-3 px-5 py-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl text-xs font-bold text-slate-400 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
                >
                  <Layout size={16} />
                  Balanced layout
                </button>
                <button 
                  onClick={() => showToast('Switched to Dense layout')}
                  className="flex items-center gap-3 px-5 py-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl text-xs font-bold text-slate-400 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
                >
                  <Layout size={16} />
                  Dense layout
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Focused layout keeps a quieter chrome and more breathing room between decision-heavy sections.</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Review defaults</p>
              <Toggle enabled={true} label="Open daily journal after close" subtext="Shortcut into reflection right after the session ends." />
              <Toggle enabled={true} label="Show psychology prompts by default" subtext="Place mindset cues near the top of review screens." />
              <Toggle enabled={false} label="Compact stat cards" subtext="Use shorter KPI blocks to reduce vertical scrolling." />
            </div>
          </div>
        </motion.section>

        {/* Trading Preferences */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest font-display">Trading preferences & journaling defaults</h3>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Set the defaults that keep imports, tags, and reviews consistent across every session.</p>
            </div>
            <span className="px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-orange-100 dark:border-orange-500/20 shadow-sm">Defaults</span>
          </div>

          <div className="flex gap-6 mb-12">
            <DropdownField label="Base currency" value="USD" icon={DollarSign} />
            <DropdownField label="Default account" value="Margin Account • IBKR" icon={Database} />
            <DropdownField label="Session template" value="Intraday review" icon={FileText} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Tagging and playbook rules</p>
              <Toggle enabled={true} label="Require playbook tag before save" subtext="Encourages structured classification for every logged trade." />
              <Toggle enabled={true} label="Auto-suggest setup tags" subtext="Use symbol, time, and entry pattern to suggest likely setups." />
              <Toggle enabled={false} label="Require post-trade note" subtext="Add one short observation before marking a trade reviewed." />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Reflection template</p>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl h-44 overflow-y-auto soft-shadow-inner group">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-wide group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                  1. What was the setup quality? 2. Did I follow my risk plan? 3. What emotion influenced execution? 4. What gets repeated or improved tomorrow?
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Broker Connections */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest font-display">Broker connections & import rules</h3>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Control sync behavior, duplicate handling, and import safeguards without leaving the settings hub.</p>
            </div>
            <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 shadow-sm">3 Connected</span>
          </div>

          <div className="flex gap-6 mb-12">
            <BrokerCard name="Interactive Brokers" status="Healthy" statusColor="text-emerald-600" statusBg="bg-emerald-50 dark:bg-emerald-500/10" description="Primary import source for fills and statements." />
            <BrokerCard name="Tradovate" status="Review" statusColor="text-sky-600" statusBg="bg-sky-50 dark:bg-sky-500/10" description="Used for futures journaling and execution exports." />
            <BrokerCard name="CSV imports" status="Saved" statusColor="text-orange-600" statusBg="bg-orange-50 dark:bg-orange-500/10" description="Fallback upload path for historical and ad hoc imports." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Import safety rules</p>
              <Toggle enabled={true} label="Quarantine duplicate rows" subtext="Hold suspected duplicates for review instead of merging automatically." />
              <Toggle enabled={true} label="Normalize broker timezone" subtext="Convert fills into workspace time before reports update." />
              <Toggle enabled={false} label="Allow auto-append on clean imports" subtext="Skip manual approval when mapping and integrity checks pass fully." />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Default import mode</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => showToast('Import mode: Append safely')}
                  className="flex items-center gap-3 px-5 py-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-2xl text-[10px] font-bold text-sky-600 dark:text-sky-400 shadow-sm transition-all active:scale-95"
                >
                  <CheckCircle2 size={16} />
                  Append safely
                </button>
                <button 
                  onClick={() => showToast('Import mode: Review first')}
                  className="flex items-center gap-4 px-5 py-3 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl text-[10px] font-bold text-slate-400 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
                >
                  <Eye size={16} />
                  Review first
                </button>
                <button 
                  onClick={() => showToast('Import mode: Overwrite mapped')}
                  className="flex items-center gap-3 px-5 py-3 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl text-[10px] font-bold text-slate-400 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
                >
                  <RefreshCw size={16} />
                  Overwrite mapped
                </button>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl soft-shadow-inner group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-sky-600 transition-colors">Saved broker note</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-wide">
                  Use append-safe mode for March imports. Keep aliases for futures contracts under review before analytics sync.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Migration */}
        {!localStorage.getItem('migration_complete') && (
          <motion.section variants={itemVariants} className="bg-sky-50 dark:bg-sky-500/5 p-10 rounded-2xl border border-sky-100 dark:border-sky-500/20 layered-shadow">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-sky-800 dark:text-sky-400 mb-1 uppercase tracking-widest font-display">Data Migration</h3>
                <p className="text-sm text-sky-600/70 dark:text-sky-400/60 font-medium tracking-wide">Move your existing local journal and trade history to your new cloud account.</p>
              </div>
              <Database className="text-sky-400 animate-bounce" size={24} />
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-sky-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex-1 pr-12">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">Sync Local Storage to Supabase</p>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">We detected existing trade data in your browser. Clicking below will securely upload all historical logs to your profile and enable multi-device sync.</p>
              </div>
              <button 
                onClick={async () => {
                  if (!user) return;
                  showToast('Starting migration...', 'info');
                  const result = await migrateFromLocalStorage(user.id);
                  if (result.success) {
                    showToast(`Success! Migrated ${result.summary?.trades} trades and ${result.summary?.journalEntries} journal entries.`, 'success');
                  } else {
                    showToast('Migration encountered an error.', 'error');
                  }
                }}
                className="flex items-center gap-2 px-8 py-4 bg-sky-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-sky-500/30 hover:bg-sky-600 transition-all active:scale-95"
              >
                <RefreshCw size={18} />
                Migrate My Data
              </button>
            </div>
          </motion.section>
        )}

        {/* Account & Security */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-widest font-display">Account & security</h3>
              <p className="text-sm text-slate-400 font-medium tracking-wide">Keep your workspace protected while preserving the calm, single-column settings flow.</p>
            </div>
            <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-slate-100 dark:border-slate-800 shadow-sm">
              <Lock size={12} />
              Secure
            </span>
          </div>

          <div className="flex gap-6 mb-12">
            <div className="flex-1 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between soft-shadow-inner group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
                  <img src="https://picsum.photos/seed/alex/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-600 transition-colors">Display name</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">Alex Mercer</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors">Edit</button>
            </div>
            <div className="flex-1 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between soft-shadow-inner group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600 transition-colors">Plan</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">Pro Member</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Manage</button>
            </div>
            <div className="flex-1 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between soft-shadow-inner group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-100 dark:border-sky-500/20 shadow-sm">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-sky-600 transition-colors">2FA Status</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight font-mono">Enabled</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Security controls</p>
              <Toggle enabled={true} label="Require two-factor authentication" subtext="Prompt for a verification step on new device sign-in." />
              <Toggle enabled={true} label="Session timeout after inactivity" subtext="Sign out after 30 minutes away from the workspace." />
              <Toggle enabled={true} label="Security email alerts" subtext="Get a message when password or connection settings change." />
            </div>
            <div className="space-y-8">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Sensitive actions</p>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between soft-shadow-inner group">
                <div className="flex-1 pr-8">
                  <p className="text-sm font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 transition-colors">Export full account data</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Download journals, imports, notes, and analytics snapshots.</p>
                </div>
                <button 
                  onClick={() => showToast('Requesting data export...')}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95"
                >
                  Request export
                </button>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between soft-shadow-inner group">
                <div className="flex-1 pr-8">
                  <p className="text-sm font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 transition-colors">Reset workspace preferences</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">Restore default panels, cadence, and notification routing.</p>
                </div>
                <button 
                  onClick={() => showToast('Resetting defaults...')}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 soft-shadow-hover hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95"
                >
                  Reset defaults
                </button>
              </div>
              <div className="p-8 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center justify-between soft-shadow-inner group">
                <div className="flex-1 pr-8">
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-2 group-hover:text-rose-600 transition-colors">Delete workspace</p>
                  <p className="text-[11px] text-rose-400 dark:text-rose-500/60 font-medium leading-relaxed uppercase tracking-wide">Permanently remove account data after confirmation.</p>
                </div>
                <button 
                  onClick={() => showToast('Workspace deletion coming soon', 'error')}
                  className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Delete workspace
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};
