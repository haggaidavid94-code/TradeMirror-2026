export interface Trade {
  id?: string;
  asset: string;
  date: string;
  type: string;
  size: string;
  tags: string[];
  entry: string;
  exit: string;
  duration: string;
  risk: number;
  pnl: number;
  color: string;
  assetClass: string;
  strategy: string;
  timeframe: string;
  userId?: string;
}

export interface JournalEntry {
  id?: string;
  date: string;
  mindset: number;
  intention: string;
  proudOf: string;
  needsWork: string;
  mood: string;
  status: string;
  score: number;
  userId?: string;
}

export interface UserSettings {
  initialBalance: number;
  currentBalance: number;
  currency: string;
  userId?: string;
}

export interface ChecklistItem {
    id: number;
    label: string;
    note: string;
    checked: boolean;
    userId?: string;
}

import { db as supabaseDb } from '../lib/db';
import { getSupabase } from '../lib/supabase';

// Helper to get current user ID
const getUserId = async () => {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  } catch (err) {
    return null;
  }
};

const api = {
  getTrades: async (filters: any = {}): Promise<Trade[]> => {
    const { data, error } = await supabaseDb.trades.getTrades(filters);
    if (error) throw error;
    return (data || []).map(t => ({
      id: t.id,
      asset: t.ticker,
      date: t.date,
      type: t.direction,
      size: 'N/A', // Updated schema doesn't have size
      tags: [t.setup_tag].filter(Boolean),
      entry: t.entry_price?.toString() || '0',
      exit: t.exit_price?.toString() || '0',
      duration: 'N/A',
      risk: parseFloat(t.r_multiple) || 0,
      pnl: parseFloat(t.pnl) || 0,
      color: (t.pnl || 0) >= 0 ? 'green' : 'red',
      assetClass: t.asset_class,
      strategy: t.setup_tag,
      timeframe: t.timeframe,
      userId: t.user_id
    }));
  },
  
  addTrade: async (trade: Omit<Trade, 'id' | 'userId'>): Promise<Trade> => {
    const userId = await getUserId();
    if (!userId) throw new Error("Authentication required");

    const cleanCurrency = (val: string | number) => {
      if (typeof val === 'number') return val;
      return parseFloat(val.replace(/[$,]/g, '')) || 0;
    };

    const { data, error } = await supabaseDb.trades.createTrade({
      user_id: userId,
      ticker: trade.asset,
      direction: trade.type,
      entry_price: cleanCurrency(trade.entry),
      exit_price: cleanCurrency(trade.exit),
      pnl: trade.pnl,
      r_multiple: trade.risk,
      setup_tag: trade.strategy,
      timeframe: trade.timeframe,
      asset_class: trade.assetClass,
      date: trade.date
    });

    if (error) throw error;
    
    // Update balance in settings
    const { data: settings } = await supabaseDb.settings.getSettings();
    if (settings) {
      await supabaseDb.settings.upsertSettings({
        ...settings,
        account_equity: (settings.account_equity || 0) + trade.pnl
      });
    }

    // Transform and return the new trade
    return {
      ...trade,
      id: data.id,
      userId: data.user_id
    } as Trade;
  },
  
  getJournal: async (): Promise<JournalEntry[]> => {
    // This is a simplified fetch, ideally we'd fetch all journal_days
    const supabase = getSupabase();
    const { data, error } = await supabase.from('journal_days').select('*').order('date', { ascending: false });
    if (error) throw error;
    
    return (data || []).map(j => ({
      id: j.id,
      date: j.date,
      mindset: j.scorecard_patience || 5, // Fallback
      intention: j.primary_anchor,
      proudOf: j.reflections_wins,
      needsWork: j.reflections_errors,
      mood: j.mood,
      status: 'Completed',
      score: j.scorecard_execution_precision,
      userId: j.user_id
    }));
  },
  
  saveJournal: async (entry: Omit<JournalEntry, 'id' | 'userId'>): Promise<JournalEntry> => {
    const userId = await getUserId();
    if (!userId) throw new Error("Authentication required");

    const { data, error } = await supabaseDb.journal.upsertJournalDay({
      user_id: userId,
      date: entry.date,
      primary_anchor: entry.intention,
      mood: entry.mood,
      reflections_wins: entry.proudOf,
      reflections_errors: entry.needsWork,
      scorecard_execution_precision: entry.score,
      scorecard_patience: entry.mindset
    });

    if (error) throw error;
    return entry as JournalEntry;
  },
  
  getSettings: async (): Promise<UserSettings> => {
    const { data, error } = await supabaseDb.settings.getSettings();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned

    if (!data) {
      const userId = await getUserId();
      return {
        initialBalance: 0,
        currentBalance: 0,
        currency: 'USD',
        userId: userId
      };
    }

    return {
      initialBalance: 0, // Not explicitly in new schema as separate field
      currentBalance: parseFloat(data.account_equity) || 0,
      currency: data.display_currency || 'USD',
      userId: data.user_id
    };
  },

  saveSettings: async (settings: UserSettings): Promise<UserSettings> => {
    const userId = await getUserId();
    if (!userId) throw new Error("Authentication required");

    const { error } = await supabaseDb.settings.upsertSettings({
      user_id: userId,
      account_equity: settings.currentBalance,
      display_currency: settings.currency
    });

    if (error) throw error;
    return settings;
  },

  getChecklist: async (): Promise<ChecklistItem[]> => {
    // Checklist in Supabase is currently stored in journal_days.checklist
    // For simplicity in this mock-to-real migration, we'll return a static list or fetch from the most recent day
    return [
      { id: 1, label: "Reviewed market context", note: "SPY holding above prior day high...", checked: true },
      { id: 2, label: "Defined A+ setups only", note: "VWAP reclaim and opening pullback...", checked: true },
      { id: 3, label: "Risk and stop rules set", note: "Risk capped at $125 per trade...", checked: true },
      { id: 4, label: "Write one sentence of restraint", note: "Skip anything that needs chasing.", checked: false }
    ];
  },

  saveChecklist: async (checklist: ChecklistItem[]): Promise<ChecklistItem[]> => {
    return checklist;
  }
};

export default api;
