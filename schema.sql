-- 1. Daily Journal (Ritual Engine)
CREATE TABLE journal_days (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date date NOT NULL,
    primary_anchor text,
    checklist jsonb DEFAULT '[]'::jsonb,
    scorecard_execution_precision int CHECK (scorecard_execution_precision >= 1 AND scorecard_execution_precision <= 10),
    scorecard_patience int CHECK (scorecard_patience >= 1 AND scorecard_patience <= 10),
    scorecard_risk_management int CHECK (scorecard_risk_management >= 1 AND scorecard_risk_management <= 10),
    mood text,
    reflections_wins text,
    reflections_errors text,
    focus_tickers text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, date)
);

-- 2. Session Events (Timeline)
CREATE TABLE session_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    journal_day_id uuid REFERENCES journal_days(id) ON DELETE CASCADE,
    type text NOT NULL,
    content text NOT NULL,
    emotional_tag text,
    timestamp timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- 3. Trade Log
CREATE TABLE trades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ticker text NOT NULL,
    direction text NOT NULL, -- 'Long' or 'Short'
    entry_price numeric,
    exit_price numeric,
    pnl numeric,
    r_multiple numeric,
    setup_tag text,
    timeframe text,
    asset_class text,
    challenge_tag text,
    notes text,
    screenshot_url text,
    behavioral_tags text[] DEFAULT '{}',
    date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- 4. Psychology Logs (Mindset)
CREATE TABLE psychology_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date date NOT NULL,
    mindset_score int CHECK (mindset_score >= 1 AND mindset_score <= 10),
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, date)
);

-- 5. Behavioral Patterns
CREATE TABLE behavior_patterns (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL, -- 'FOMO', 'Revenge Trading', etc.
    trigger text,
    dollar_impact numeric DEFAULT 0,
    start_date date,
    end_date date,
    created_at timestamptz DEFAULT now()
);

-- 6. Recovery Anchors
CREATE TABLE recovery_anchors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    steps text[] DEFAULT '{}',
    category text,
    created_at timestamptz DEFAULT now()
);

-- 7. Settings
CREATE TABLE settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    risk_per_trade numeric DEFAULT 0,
    daily_loss_limit numeric DEFAULT 0,
    preferred_pairs text[] DEFAULT '{}',
    account_equity numeric DEFAULT 0,
    timezone text DEFAULT 'UTC',
    display_currency text DEFAULT 'USD',
    created_at timestamptz DEFAULT now()
);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE journal_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Journal Days policies
CREATE POLICY "Users can manage their own journal days" ON journal_days
    FOR ALL USING (auth.uid() = user_id);

-- Session Events policies
CREATE POLICY "Users can manage their own session events" ON session_events
    FOR ALL USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can manage their own trades" ON trades
    FOR ALL USING (auth.uid() = user_id);

-- Psychology Logs policies
CREATE POLICY "Users can manage their own psychology logs" ON psychology_logs
    FOR ALL USING (auth.uid() = user_id);

-- Behavior Patterns policies
CREATE POLICY "Users can manage their own behavior patterns" ON behavior_patterns
    FOR ALL USING (auth.uid() = user_id);

-- Recovery Anchors policies
CREATE POLICY "Users can manage their own recovery anchors" ON recovery_anchors
    FOR ALL USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can manage their own settings" ON settings
    FOR ALL USING (auth.uid() = user_id);
