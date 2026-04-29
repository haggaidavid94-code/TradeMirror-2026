import React, { useState, useEffect } from 'react';
import api, { JournalEntry, ChecklistItem as IChecklistItem } from '../services/api';
import { 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  History, 
  Plus,
  Share2,
  Wind,
  Target,
  Shield,
  Zap,
  Lightbulb,
  Check,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Star,
  ArrowRight,
  BookOpen,
  MoreHorizontal,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';

import { useToast } from '../context/ToastContext';

// --- Sub-components ---

const JournalStat = ({ icon: Icon, label, value, subtext, color, iconBg }: any) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow soft-shadow-hover transition-all relative overflow-hidden group flex-1">
    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity dark:text-white">
      <Icon size={80} strokeWidth={1} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconBg} dark:bg-slate-800/50 flex items-center justify-center ${color} shadow-sm border border-transparent dark:border-slate-800`}>
          <Icon size={16} />
        </div>
      </div>
      <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 font-display tracking-tight">{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtext}</p>
    </div>
  </div>
);

interface ChecklistItemProps {
  checked?: boolean;
  label: string;
  note: string;
  onToggle?: () => void;
}

const ChecklistItem = ({ checked, label, note, onToggle }: ChecklistItemProps) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl mb-3 soft-shadow-hover transition-all cursor-pointer group"
  >
    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 group-hover:scale-110 ${checked ? 'bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-200' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'}`}>
      {checked && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      )}
    </div>
    <div>
      <p className={`text-sm font-bold mb-1 transition-colors ${checked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white group-hover:text-sky-600'}`}>{label}</p>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{note}</p>
    </div>
  </motion.div>
);

const TimelineItem = ({ time, title, description, dotColor }: any) => (
  <div className="flex gap-6 mb-8 relative last:mb-0 group">
    <div className="flex flex-col items-center shrink-0">
      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md z-10 transition-transform group-hover:scale-125 ${dotColor}`} />
      <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 absolute top-3.5" />
    </div>
    <div className="pb-2">
      <p className="text-[10px] font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-widest">{time}</p>
      <p className="text-xs font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-sky-600 transition-colors">{title}</p>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-sm">{description}</p>
    </div>
  </div>
);

const ScorecardMetric = ({ label, score, color }: { label: string, score: string, color: string }) => (
  <div className="flex-1">
    <div className="flex justify-between items-end mb-2.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-base font-bold text-slate-800 dark:text-white font-mono">{score}</span>
    </div>
    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${(parseFloat(score) / 10) * 100}%` }} />
    </div>
  </div>
);

const RecentEntry = ({ date, title, note, status, pnl, statusColor }: any) => (
  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl mb-4 flex items-center justify-between group soft-shadow-hover transition-all cursor-pointer last:mb-0 border-l-4 border-l-transparent hover:border-l-sky-500">
    <div className="flex items-center gap-5">
      <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {new Date().toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none font-mono">{date}</span>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h5 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-sky-600 transition-colors">{title}</h5>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm ${statusColor}`}>{status}</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{note}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-sm font-bold font-mono ${pnl.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{pnl}</p>
    </div>
  </div>
);

// --- Main Page Component ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const DailyJournal = () => {
  const { showToast } = useToast();

  // --- State Management ---
  const [checklist, setChecklist] = useState<IChecklistItem[]>([]);
  const [selectedMood, setSelectedMood] = useState('Focused');
  const [proudOf, setProudOf] = useState("");
  const [needsWork, setNeedsWork] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [checklistData, journalData] = await Promise.all([
          api.getChecklist(),
          api.getJournal()
        ]);
        
        setChecklist(checklistData);
        
        // Load the most recent journal entry for today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayEntry = journalData.find(e => e.date === todayStr);
        if (todayEntry) {
          setSelectedMood(todayEntry.mood);
          setProudOf(todayEntry.proudOf);
          setNeedsWork(todayEntry.needsWork);
        }
      } catch (error) {
        console.error("Failed to load journal data:", error);
      }
    };
    
    loadData();
  }, []);

  const toggleCheck = async (id: number) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    try {
        await api.saveChecklist(updated);
    } catch (e) {
        console.error("Failed to save checklist:", e);
    }
  };

  const handleSave = async (isComplete = false) => {
      setIsSaving(true);
      const entry: JournalEntry = {
          date: new Date().toISOString().split('T')[0],
          mindset: 8,
          intention: "Trade slowly and wait for confirmation.",
          proudOf,
          needsWork,
          mood: selectedMood,
          status: isComplete ? "Review saved" : "Draft",
          score: 8.4
      };

      try {
          await api.saveJournal(entry);
          showToast(isComplete ? 'Daily review completed!' : 'Journal draft saved successfully', 'success');
      } catch (e) {
          showToast('Failed to save journal', 'error');
      } finally {
          setIsSaving(false);
      }
  };

  const checkedCount = checklist.filter(i => i.checked).length;
  const readinessScore = Math.round((checkedCount / checklist.length) * 100);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      {/* Header Section */}
      <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => showToast('Date selection coming soon', 'info')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 layered-shadow cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Journal Focus</span>
            <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Pre-market → Post-market</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100/50 dark:border-emerald-500/20 shadow-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Ready for review</span>
          </div>
          <button 
            onClick={() => showToast('Loading past entries...', 'info')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all layered-shadow active:scale-95"
          >
            <History size={14} />
            Past entries
          </button>
          <button 
            onClick={() => showToast('Creating new journal entry...')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-900/40 hover:shadow-lg hover:shadow-sky-300 transition-all active:scale-95"
          >
            <Plus size={14} />
            New entry
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="xl:col-span-9 space-y-8">
          {/* Intro Section */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-50 dark:bg-sky-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                  <BookOpen size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Daily Journal</span>
                </div>
                <button 
                  onClick={() => showToast('Exporting journal note...')}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                >
                  <Share2 size={12} />
                  Export note
                </button>
              </div>
              
              <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-6 max-w-xl leading-[1.1] tracking-tight font-display">
                A calm place to prepare, trade, and reflect.
              </h1>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
                Structured like a personal trading diary with a balanced workflow: set intent before the open, capture key decisions during the session, and close the day with thoughtful post-market review.
              </p>

              <div className="flex gap-5 mb-12">
                <JournalStat icon={Wind} label="Mindset" value="Clear" subtext="7.8/10 energy" color="text-sky-500" iconBg="bg-sky-50" />
                <JournalStat icon={Target} label="Primary Setup" value="VWAP" subtext="2 focus symbols" color="text-emerald-500" iconBg="bg-emerald-50" />
                <JournalStat icon={Shield} label="Risk Plan" value="$500" subtext="Max daily loss" color="text-rose-500" iconBg="bg-rose-50" />
                <JournalStat icon={Zap} label="Session Score" value="8.4" subtext="Rules followed well" color="text-amber-500" iconBg="bg-amber-50" />
              </div>

              <div className="p-8 bg-sky-50/50 dark:bg-sky-500/10 rounded-3xl border-l-[6px] border-sky-500 flex gap-6 soft-shadow-hover transition-all">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-sky-500 shadow-md shrink-0">
                  <Lightbulb size={28} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-relaxed">
                    "My edge is strongest when I trade slowly, size correctly, and wait for confirmation."
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">Today's intention saved to journal</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pre & Post Market Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Pre-Market */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pre-market</p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Plan before the bell</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm transition-colors ${readinessScore > 80 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-600'}`}>
                    Readiness: {readinessScore}%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest">{checkedCount}/{checklist.length} Tasks</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">A simple checklist and note area for the morning routine.</p>
              
              <div className="space-y-1">
                {checklist.map(item => (
                  <div key={item.id}>
                    <ChecklistItem 
                      checked={item.checked}
                      label={item.label}
                      note={item.note}
                      onToggle={() => toggleCheck(item.id)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Morning Intention</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Trade fewer names, let the first move develop, and stay patient after the open. Focus on execution quality over profit.
                </p>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Focus Tickers</p>
                <div className="flex gap-2.5">
                  {['NVDA', 'TSLA', 'SPY', 'QQQ'].map(t => (
                    <span key={t} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold shadow-sm hover:border-sky-500 transition-colors cursor-pointer">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Post-Market */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Post-market</p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Close the loop thoughtfully</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold shadow-sm">Review saved</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">Capture how the day felt, what worked, and what needs refining.</p>

              <div className="mb-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-5 tracking-widest">How did the session feel?</p>
                <div className="flex gap-4">
                  {[
                    { icon: Frown, label: 'Frustrated' },
                    { icon: Meh, label: 'Steady' },
                    { icon: Smile, label: 'Focused' },
                    { icon: Star, label: 'Confident' }
                  ].map((mood, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedMood(mood.label);
                        showToast(`Mood set to: ${mood.label}`, 'info');
                      }}
                      className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${selectedMood === mood.label ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'}`}
                    >
                      <mood.icon size={24} strokeWidth={selectedMood === mood.label ? 2.5 : 2} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{mood.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">What I'm proud of</p>
                  <textarea 
                    value={proudOf}
                    onChange={(e) => setProudOf(e.target.value)}
                    placeholder="Reflect on your wins..."
                    className="w-full p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all resize-none min-h-[120px]"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">What needs work tomorrow</p>
                  <textarea 
                    value={needsWork}
                    onChange={(e) => setNeedsWork(e.target.value)}
                    placeholder="Identify areas for improvement..."
                    className="w-full p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all resize-none min-h-[100px]"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  disabled={isSaving}
                  onClick={() => handleSave(false)}
                  className="flex-1 py-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all soft-shadow active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save draft"}
                </button>
                <button 
                  disabled={isSaving}
                  onClick={() => handleSave(true)}
                  className="flex-1 py-4 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-900/40 hover:shadow-lg hover:shadow-sky-300 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? "Completing..." : "Complete review"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Session Timeline */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <Clock size={18} className="text-sky-500" />
                Session timeline
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mb-10 uppercase tracking-widest">A journal-style recap of the trading day.</p>
              
              <div className="pl-3">
                <TimelineItem 
                  time="9:15 AM" 
                  title="Opening read" 
                  description="Futures strength held into the open. Decided to wait 15 minutes before first entry instead of chasing the initial spike." 
                  dotColor="bg-sky-500"
                />
                <TimelineItem 
                  time="10:05 AM" 
                  title="Best trade: TSLA VWAP reclaim" 
                  description="Good location, proper stop, partials taken into extension. Followed the exact morning plan." 
                  dotColor="bg-emerald-500"
                />
                <TimelineItem 
                  time="11:20 AM" 
                  title="Emotional note" 
                  description="Felt tempted to size up after two green trades. Recognized it quickly and reduced the next position back to normal." 
                  dotColor="bg-amber-500"
                />
                <TimelineItem 
                  time="2:40 PM" 
                  title="Closing thought" 
                  description="Stopped trading after momentum faded. Ending the day green felt good, but the bigger win was staying selective." 
                  dotColor="bg-sky-500"
                />
              </div>
            </motion.div>

            {/* Post-market scorecard */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <Target size={18} className="text-emerald-500" />
                Post-market scorecard
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mb-10 uppercase tracking-widest">Balanced review focused on behavior.</p>

              <div className="flex gap-5 mb-10">
                <ScorecardMetric label="Execution" score="8.7" color="bg-gradient-to-r from-sky-400 to-sky-500" />
                <ScorecardMetric label="Patience" score="8.1" color="bg-gradient-to-r from-emerald-400 to-emerald-500" />
                <ScorecardMetric label="Risk" score="9.0" color="bg-gradient-to-r from-amber-400 to-amber-500" />
              </div>

              <div className="space-y-5">
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase tracking-wider">Best repeatable behavior</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Waiting for price to reclaim VWAP before entering produced the cleanest trade of the day.</p>
                </div>
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase tracking-wider">One thing to remove</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Do not add into momentum unless the original thesis is still intact and volume confirms.</p>
                </div>
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-1.5 uppercase tracking-wider">Tomorrow's anchor</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Trade with the same pace as today's best setup.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Entries */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent journal entries</h3>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Quick access to recent reflections.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all">
                View archive
              </div>
            </div>
            
            <RecentEntry 
              date="23" 
              title="Patience showed up late, but it showed up." 
              note="Kept size small, took one clean breakout, and avoi..." 
              status="Disciplined" 
              pnl="+1.8R" 
              statusColor="bg-emerald-500 text-white"
            />
            <RecentEntry 
              date="22" 
              title="Slow day, strong process." 
              note="Only two trades. No pressure to force activity, ..." 
              status="Low volume" 
              pnl="2 trades" 
              statusColor="bg-amber-500 text-white"
            />
            <RecentEntry 
              date="21" 
              title="Too reactive in the first hour." 
              note="Journal note flagged impulsive adds. Tomorro..." 
              status="Needs review" 
              pnl="Impulse" 
              statusColor="bg-rose-500 text-white"
            />
          </motion.div>
        </div>

        {/* Right Sidebar Column */}
        <div className="xl:col-span-3 space-y-8">
          {/* Today at a glance */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-2">
              <TrendingUp size={18} className="text-sky-500" />
              Today at a glance
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mb-8 uppercase tracking-widest leading-relaxed">Reflection-first summary.</p>

            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Net result</span>
                <span className="text-2xl font-bold text-emerald-500 font-display tracking-tight">+$640</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Trades taken</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">4 trades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Best decision</span>
                <span className="text-sm font-bold text-emerald-500">Waited for reclaim</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Main slip</span>
                <span className="text-sm font-bold text-orange-500">One early add</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center shadow-sm">Disciplined open</div>
              <div className="px-5 py-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center shadow-sm">Good patience</div>
              <div className="px-5 py-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center shadow-sm">Review position adds</div>
            </div>
          </motion.div>

          {/* Journal Streaks */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 layered-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity dark:text-white">
              <Zap size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-2">
                <Zap size={18} className="text-amber-500 fill-amber-500" />
                Journal streaks
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mb-8 uppercase tracking-widest leading-relaxed">Consistency habits.</p>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Reviewed days</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tight">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Plan completion</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tight">86%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">"Calm" entries</span>
                  <span className="text-2xl font-bold text-emerald-500 font-display tracking-tight">9 / 12</span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all soft-shadow active:scale-95">Edit template</button>
                <button className="w-full py-4 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-900/40 hover:shadow-lg hover:shadow-sky-300 transition-all active:scale-95">Start tomorrow's plan</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
