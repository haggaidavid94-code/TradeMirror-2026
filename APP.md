# Professional Trading Journal & Behavioral Analytics Suite

A comprehensive, desktop-optimized ecosystem built for professional traders who treat their execution as a high-performance craft. This application combines quantitative financial tracking with qualitative psychological auditing to provide a complete view of a trader's performance lifecycle.

## 🎯 Product Vision
The "Edge Journal" is designed to eliminate the feedback loop delay in active trading. By combining AI-assisted data entry with deep behavioral pattern recognition, it helps traders transform raw execution data into institutional-grade insights.

---

## 🛠 Core Modules & Detailed Features

### 1. The Ritual Engine (Daily Journal)
*Structured as a personal trading diary with a balanced pre/post-market workflow.*
- **Pre-Market Readiness Checklist**: A dedicated morning routine module to verify market context, sizing rules, and emotional readiness before the bell.
- **Dynamic Intention Setting**: Space to save a "Primary Anchor" for the day (e.g., "Wait for VWAP reclaim") which persists across the session view.
- **Focus Tickers**: Quick-tagging system for the day's priority watchlists (Equities, Crypto, or Forex symbols).
- **Session Timeline**: A chronological log for capturing intraday observations, emotional inflection points, and market regime shifts.
- **Post-Market Scorecard**: Quantitative ratings (1-10) for **Execution Precision**, **Patience**, and **Risk Management**.
- **Reflection Suite**: Structured fields for "Wins to Reinforce" and "Errors to Remove," complete with mood-based tagging (Focused, Confident, Steady, Frustrated).

### 2. Quantitative Foundation (Trade Log)
*A high-density repository for every execution with intelligent data capture.*
- **AI "Power Entry"**: Built-in Gemini AI integration. Users can drop an execution screenshot to automatically extract Ticker Symbol, Entry Price, and Trade Type.
- **Multidimensional Tagging**: Link trades to specific **Playbook Setups** (e.g., Bull Flag, ORB, Mean Reversion) and **Timeframes**.
- **Risk Multiplier Tracking (R)**: Automatically calculates performance in "Risk Units" (R), the gold standard for institutional performance measurement.
- **Trade Review Drawer**: An interactive sub-view for every trade to add post-mortem notes, screenshots, and behavioral tags.
- **Global Filter System**: Instantly slice performance by Asset Class, Setup Type, or Date Range.

### 3. Psychology & Behavioral Analytics
*The "Intelligence Layer" that identifies why you win or lose.*
- **Emotional Trend Engine**: Visualization of self-rated Mindset scores against P&L results to detect "performance plateaus."
- **Pattern Breakdown**: An audit tool that identifies recurring triggers (FOMO, Revenge Trading, Chasing) and quantifies their specific dollar impact on the account.
- **Recovery Anchors**: A library of personalized routines (Breathing exercises, 2-minute pause rule, walk-away thresholds) to reset after execution errors.
- **Impulse Detector**: Built-in logic during trade entry that flags potential risk violations or "tilt" trades before they are finalized.
- **Emotional Balance Heatmap**: Visual distribution of internal states (Calm, Focused, Frustrated, Tilted) across a rolling 30-day window.

### 4. Performance Visualization (Reporting)
*Bespoke charts designed for rapid data consumption.*
- **Glow-Enhanced Equity Curve**: A multi-gradient area chart visualizing portfolio growth with custom SVG filters.
- **Monthly Objectives Tracker**: Interactive progress bars for Profit Goals, Max Drawdown Limits, and habit-based consistency targets.
- **Win Rate Distribution**: Bar charts showing success probability by Day of the Week and by individual Playbook Setup.
- **Risk Exposure Gauge**: Real-time calculation of current capital at risk vs. total account equity.

---

## 🎨 Visual Identity & UX Patterns
- **Technical Editorial Aesthetic**: High-contrast, wide-screen desktop layout inspired by modern financial terminals.
- **Typography**: Space Grotesk for headers and JetBrains Mono for financial data to ensure max legibility.
- **Interactive Feedback**: Leverages Framer Motion for staggered entrances, smooth drawer transitions, and responsive hover states.
- **Privacy-First Architecture**: **100% Local Storage Persistence**. Your proprietary setups, trade data, and financial records never leave your machine.

## 🏗 Technology Stack
- **Framework**: React 19 + Vite (Type-Safe development)
- **Styling**: Tailwind CSS (Sophisticated utility-first design)
- **Animations**: motion/react (Hardware-accelerated transitions)
- **Charts**: Recharts (Customized with SVG filters and glow effects)
- **AI**: @google/genai (Multimodal screenshot parsing)
- **Icons**: Lucide-React (Unified iconographic language)

---

## 📅 Roadmap: Current Progress
- [x] **Phase 1: UI/UX Foundation**: All core pages (Daily Journal, Log, Reports, Psychology) fully styled.
- [x] **Phase 2: Local Persistence**: Secure state management for Trades, Journal entries, and Settings.
- [x] **Phase 3: AI Tooling**: Gemini integration for screenshot-to-journal data extraction.
- [x] **Phase 4: Behavioral Audit**: Implementation of the Psychology pattern tracking engine.
- [ ] **Phase 5: Import/Export**: Support for MetaTrader and Interactive Brokers CSV parsing.
- [ ] **Phase 6: Multi-Device Sync**: Optional encrypted cloud backup transition.
