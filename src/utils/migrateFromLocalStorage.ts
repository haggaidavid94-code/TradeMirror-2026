import { db } from '../lib/db';

const STORAGE_KEYS = {
  TRADES: 'trading_journal_trades',
  JOURNAL: 'trading_journal_entries',
  SETTINGS: 'trading_journal_settings',
  CHECKLIST: 'trading_journal_checklist'
};

export const migrateFromLocalStorage = async (userId: string) => {
  const summary = {
    trades: 0,
    journalEntries: 0,
    settings: false,
    checklist: false
  };

  try {
    // 1. Migrate Settings
    const localSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (localSettings) {
      const settings = JSON.parse(localSettings);
      const { error } = await db.settings.upsertSettings({
        user_id: userId,
        risk_per_trade: settings.riskPerTrade || 0,
        daily_loss_limit: settings.dailyLossLimit || 0,
        account_equity: settings.currentBalance || 0,
        display_currency: settings.currency || 'USD'
      });
      if (!error) summary.settings = true;
    }

    // 2. Migrate Trades
    const localTrades = localStorage.getItem(STORAGE_KEYS.TRADES);
    if (localTrades) {
      const trades = JSON.parse(localTrades);
      for (const trade of trades) {
        const { error } = await db.trades.createTrade({
          user_id: userId,
          ticker: trade.asset || 'UNKNOWN',
          direction: trade.type || 'Long',
          entry_price: parseFloat(trade.entry) || 0,
          exit_price: parseFloat(trade.exit) || 0,
          pnl: trade.pnl || 0,
          r_multiple: trade.risk || 0,
          setup_tag: trade.strategy,
          timeframe: trade.timeframe,
          asset_class: trade.assetClass,
          notes: `Migrated duration: ${trade.duration}`,
          date: new Date(trade.date).toISOString()
        });
        if (!error) summary.trades++;
      }
    }

    // 3. Migrate Journal Entries
    const localJournal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (localJournal) {
      const entries = JSON.parse(localJournal);
      for (const entry of entries) {
        // Journal Day
        const { data: journalDay, error: journalError } = await db.journal.upsertJournalDay({
          user_id: userId,
          date: entry.date,
          primary_anchor: entry.intention,
          mood: entry.mood,
          reflections_wins: entry.proudOf,
          reflections_errors: entry.needsWork,
          scorecard_execution_precision: Math.min(10, Math.max(1, Math.round(entry.score || 5)))
        });

        if (!journalError && journalDay) {
          summary.journalEntries++;
          
          // Psychology Log
          await db.psychology.logMindsetScore({
            user_id: userId,
            date: entry.date,
            mindset_score: Math.min(10, Math.max(1, entry.mindset || 5))
          });
        }
      }
    }

    localStorage.setItem('migration_complete', 'true');
    return { success: true, summary };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
