import { getSupabase } from './supabase';

export const db = {
  // --- Journal ---
  journal: {
    async getJournalDay(date: string) {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: null };

      const { data, error } = await supabase
        .from('journal_days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();
      return { data, error };
    },
    async upsertJournalDay(journalData: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('journal_days')
        .upsert(journalData, { onConflict: 'user_id, date' })
        .select()
        .single();
      return { data, error };
    },
    async addSessionEvent(event: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('session_events')
        .insert(event)
        .select()
        .single();
      return { data, error };
    },
    async getSessionEvents(journalDayId: string) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('session_events')
        .select('*')
        .eq('journal_day_id', journalDayId)
        .order('timestamp', { ascending: true });
      return { data, error };
    }
  },

  // --- Trades ---
  trades: {
    async getTrades(filters: any = {}) {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: [], error: null };

      let query = supabase.from('trades').select('*').eq('user_id', user.id).order('date', { ascending: false });

      if (filters.assetClass) query = query.eq('asset_class', filters.assetClass);
      if (filters.setupTag) query = query.eq('setup_tag', filters.setupTag);
      if (filters.challengeTag) query = query.eq('challenge_tag', filters.challengeTag);
      if (filters.startDate) query = query.gte('date', filters.startDate);
      if (filters.endDate) query = query.lte('date', filters.endDate);

      const { data, error } = await query;
      return { data, error };
    },
    async createTrade(trade: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('trades')
        .insert(trade)
        .select()
        .single();
      return { data, error };
    },
    async updateTrade(id: string, updates: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
    async deleteTrade(id: string) {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      return { error };
    }
  },

  // --- Psychology ---
  psychology: {
    async logMindsetScore(entry: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('psychology_logs')
        .upsert(entry, { onConflict: 'user_id, date' })
        .select()
        .single();
      return { data, error };
    },
    async getMindsetHistory(days: number = 30) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('psychology_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(days);
      return { data, error };
    },
    async upsertBehaviorPattern(pattern: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('behavior_patterns')
        .upsert(pattern)
        .select()
        .single();
      return { data, error };
    },
    async getBehaviorPatterns() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('behavior_patterns')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    async upsertRecoveryAnchor(anchor: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('recovery_anchors')
        .upsert(anchor)
        .select()
        .single();
      return { data, error };
    },
    async getRecoveryAnchors() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('recovery_anchors')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    }
  },

  // --- Settings ---
  settings: {
    async getSettings() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: null };

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return { data, error };
    },
    async upsertSettings(settingsData: any) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('settings')
        .upsert(settingsData, { onConflict: 'user_id' })
        .select()
        .single();
      return { data, error };
    }
  }
};
