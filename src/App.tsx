/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import React from 'react';
import { AppLayout } from './components/AppLayout';
import { QuickStats } from './components/QuickStats';
import { EquityCurve } from './components/EquityCurve';
import { MiddleGrid } from './components/MiddleGrid';
import { SidebarWidgets } from './components/SidebarWidgets';
import { TradesTable } from './components/TradesTable';
import { DailyJournal } from './pages/DailyJournal';
import { TradeLog } from './pages/TradeLog';
import { DetailedReports } from './pages/DetailedReports';
import { PlaybookSetups } from './pages/PlaybookSetups';
import { Psychology } from './pages/Psychology';
import { ImportBrokerData } from './pages/ImportBrokerData';
import { Settings } from './pages/Settings';
import { DailyObjectives } from './components/DailyObjectives';
import { RiskExposureGauge } from './components/RiskExposureGauge';
import { TradingCalendar } from './components/TradingCalendar';
import { DashboardFilters } from './components/DashboardFilters';
import { DateRangePicker } from './components/DateRangePicker';
import { TradeReplayDrawer } from './components/TradeReplayDrawer';
import { PsychologyHeatmap } from './components/PsychologyHeatmap';
import { StrategyBacktest } from './components/StrategyBacktest';
import { AddTradeModal } from './components/AddTradeModal';
import { 
  Calendar, 
  ChevronDown, 
  Upload, 
  Plus,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Skeleton, CardSkeleton, MetricSkeleton, TableRowSkeleton } from './components/Skeleton';
import { EmptyState } from './components/EmptyState';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

import { useToast } from './context/ToastContext';
import { useAuth } from './context/AuthContext';
import { useTrades } from './context/TradeContext';
import { LogIn, Activity, AlertCircle } from 'lucide-react';
import { getSupabase } from './lib/supabase';

import api, { UserSettings } from './services/api';

export default function App() {
  const { user, loading: authLoading, signOut, supabaseError } = useAuth();
  const { trades } = useTrades();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authInProgress, setAuthInProgress] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const { showToast } = useToast();

  // Dashboard Filter State
  const [filters, setFilters] = useState({
    assetClass: 'All Assets',
    strategy: 'All Setups',
    timeframe: 'All Timeframes',
    dateRange: 'All Time',
    search: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseError) {
      showToast(supabaseError, "error");
      return;
    }

    setAuthInProgress(true);
    try {
      const supabase = getSupabase();
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Welcome back!", "success");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast("Check your email to confirm registration!", "success");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleDayClick = (dayData: any) => {
    setSelectedDay(dayData);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userSettings = await api.getSettings();
        setSettings(userSettings);
        console.log("Profile sync complete.");
      } catch (error: any) {
        console.error("Failed to fetch settings:", error);
        showToast("Failed to load your profile settings.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, showToast]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Activity className="w-12 h-12 text-sky-500 animate-pulse mb-4" />
        <p className="text-slate-500 font-medium">Initializing Journal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 layered-shadow border border-slate-100 dark:border-slate-800"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-sky-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">Edge Journal</h1>
            <p className="text-slate-500 dark:text-slate-400">Master your execution with precision analytics.</p>
          </div>

          {supabaseError && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-500">
              <AlertCircle className="shrink-0" size={18} />
              <div className="text-xs font-medium leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-wider">Setup Required</p>
                {supabaseError}
              </div>
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                placeholder="trader@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={authInProgress}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl py-4 font-bold shadow-xl shadow-slate-200 dark:shadow-none hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
            >
              {authInProgress ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={20} />
              )}
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          
          <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">Cloud Synchronization Enabled</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AddTradeModal 
        isOpen={isAddTradeOpen} 
        onClose={() => setIsAddTradeOpen(false)} 
      />

      {activeTab === 'Dashboard' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Header Section */}
          <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* Date Picker */}
              <DateRangePicker 
                value={filters.dateRange} 
                onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))} 
              />

              {/* Account Balance */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Balance</span>
                  {settings && (() => {
                    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
                    const initialBalance = settings.initialBalance || 0;
                    const currentBalance = initialBalance + totalPnL;
                    const diff = currentBalance - initialBalance;
                    const percent = initialBalance > 0 ? (diff / initialBalance) * 100 : 0;
                    
                    if (diff > 0) {
                      return (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-wider">In Profit (+{percent.toFixed(1)}%)</span>
                        </div>
                      );
                    } else if (diff < 0) {
                      return (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded-md border border-rose-500/20">
                          <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-wider">Drawdown ({percent.toFixed(1)}%)</span>
                        </div>
                      );
                    } else if (diff === 0 && initialBalance > 0) {
                      return (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-500/10 text-slate-500 rounded-md border border-slate-500/20">
                          <div className="w-1 h-1 rounded-full bg-slate-500" />
                          <span className="text-[8px] font-black uppercase tracking-wider">Break Even</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white font-display tracking-tight leading-none">
                  {(() => {
                    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
                    const initialBalance = settings?.initialBalance || 0;
                    const balance = initialBalance + totalPnL;
                    return `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                  })()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Market Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100/50 dark:border-emerald-500/20 shadow-sm">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Market Open</span>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => setActiveTab('Import Broker Data')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm active:scale-95"
              >
                <Upload size={14} />
                Import CSV
              </button>
              
              <button 
                onClick={() => setIsAddTradeOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-900/40 hover:shadow-lg hover:shadow-sky-300 transition-all active:scale-95"
              >
                <Plus size={14} />
                Add Manual Trade
              </button>
            </div>
          </motion.header>

          <motion.div variants={itemVariants}>
            <DashboardFilters filters={filters} setFilters={setFilters} />
          </motion.div>

          <TradeReplayDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            dayData={selectedDay} 
          />

          {/* Bento Grid Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-4 mb-6">
            {/* Row 1: Main Stats & Equity Curve */}
            <motion.div variants={itemVariants} className="xl:col-span-8 lg:col-span-3 md:col-span-2 flex flex-col">
              {isLoading ? <CardSkeleton className="flex-1" /> : <EquityCurve filters={filters} />}
            </motion.div>

            <div className="xl:col-span-4 lg:col-span-1 md:col-span-2 grid grid-cols-1 gap-4">
              <motion.div variants={itemVariants}>
                {isLoading ? <CardSkeleton /> : <SidebarWidgets showOnlyStreak />}
              </motion.div>
              <motion.div variants={itemVariants}>
                {isLoading ? <CardSkeleton /> : <DailyObjectives />}
              </motion.div>
            </div>

            {/* Row 2: Pulse Metrics */}
            <motion.div variants={itemVariants} className="xl:col-span-3 lg:col-span-1 md:col-span-1">
              {isLoading ? <MetricSkeleton /> : <QuickStats showOnly="Net P&L" filters={filters} />}
            </motion.div>
            <motion.div variants={itemVariants} className="xl:col-span-3 lg:col-span-1 md:col-span-1">
              {isLoading ? <MetricSkeleton /> : <QuickStats showOnly="Win Rate" filters={filters} />}
            </motion.div>
            <motion.div variants={itemVariants} className="xl:col-span-3 lg:col-span-1 md:col-span-1">
              {isLoading ? <MetricSkeleton /> : <QuickStats showOnly="Profit Factor" filters={filters} />}
            </motion.div>
            <motion.div variants={itemVariants} className="xl:col-span-3 lg:col-span-1 md:col-span-1">
              {isLoading ? <MetricSkeleton /> : <QuickStats showOnly="Expectancy" filters={filters} />}
            </motion.div>

            {/* Row 3: Detailed Analytics & Performance */}
            <motion.div variants={itemVariants} className="xl:col-span-8 lg:col-span-3 md:col-span-2 flex flex-col gap-4">
              {isLoading ? <CardSkeleton /> : <MiddleGrid filters={filters} />}
              {isLoading ? <CardSkeleton /> : <TradingCalendar onDayClick={handleDayClick} filters={filters} />}
              <div className="flex-1 min-h-[220px]">
                {isLoading ? <CardSkeleton className="h-full" /> : <PsychologyHeatmap />}
              </div>
            </motion.div>

            <div className="xl:col-span-4 lg:col-span-1 md:col-span-2 flex flex-col gap-4">
              <motion.div variants={itemVariants}>
                {isLoading ? <CardSkeleton /> : <SidebarWidgets showOnlyAsset />}
              </motion.div>
              <motion.div variants={itemVariants}>
                {isLoading ? <CardSkeleton /> : <SidebarWidgets showOnlyMistakes />}
              </motion.div>
              <motion.div variants={itemVariants}>
                {isLoading ? <CardSkeleton /> : <RiskExposureGauge />}
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                {isLoading ? <CardSkeleton className="h-full" /> : <SidebarWidgets showOnlyReview />}
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Trades Directory */}
          <motion.div variants={itemVariants} className="mb-12">
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-100 layered-shadow overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                  <Skeleton width={150} height={24} />
                </div>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </div>
            ) : (
              <TradesTable setActiveTab={setActiveTab} filters={filters} setFilters={setFilters} />
            )}
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'Daily Journal' && <DailyJournal />}
      {activeTab === 'Trade Log' && <TradeLog onAddTrade={() => setIsAddTradeOpen(true)} />}
      {activeTab === 'Detailed Reports' && <DetailedReports />}
      {activeTab === 'Playbook & Setups' && <PlaybookSetups />}
      {activeTab === 'Psychology' && <Psychology />}
      {activeTab === 'Strategy' && <StrategyBacktest />}
      {activeTab === 'Import Broker Data' && <ImportBrokerData />}
      {activeTab === 'Settings' && <Settings />}
      
      {activeTab !== 'Dashboard' && activeTab !== 'Daily Journal' && activeTab !== 'Trade Log' && activeTab !== 'Detailed Reports' && activeTab !== 'Playbook & Setups' && activeTab !== 'Psychology' && activeTab !== 'Strategy' && activeTab !== 'Import Broker Data' && activeTab !== 'Settings' && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <h2 className="text-2xl font-bold mb-2">{activeTab}</h2>
          <p>This section is currently under development.</p>
        </div>
      )}
    </AppLayout>
  );
}
