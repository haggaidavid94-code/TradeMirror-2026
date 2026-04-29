import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenLine, 
  ListOrdered, 
  BarChart3, 
  Target, 
  BrainCircuit, 
  Zap,
  CloudUpload, 
  Sliders,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, isCollapsed, onClick }: NavItemProps) => (
  <motion.div
    whileHover={{ x: isCollapsed ? 0 : 4 }}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
      active 
        ? 'text-white' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
    } ${isCollapsed ? 'justify-center px-0' : ''}`}
  >
    {active && (
      <>
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-sidebar-active rounded-lg shadow-lg shadow-sky-500/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
        {/* Sophisticated Active Indicator: Vertical Gradient Bar */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-sky-300 to-sky-500 rounded-r-full z-20"
        />
        {/* Subtle Glowing Dot */}
        {!isCollapsed && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20 animate-pulse" />
        )}
      </>
    )}
    
    <Icon 
      size={18} 
      className={`relative z-10 transition-transform duration-200 ${active ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} 
      strokeWidth={active ? 2.5 : 2} 
    />
    
    <AnimatePresence>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className={`relative z-10 text-sm font-medium whitespace-nowrap ${active ? 'font-semibold' : ''}`}
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {isCollapsed && active && (
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
    )}
  </motion.div>
);

interface WatchlistItemProps {
  symbol: string;
  price: number;
  change: number;
  history: number[];
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 40;
  const height = 16;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const WatchlistItem = ({ symbol, price, change, history }: WatchlistItemProps) => (
  <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl cursor-pointer transition-all group">
    <div className="flex flex-col">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 transition-colors">{symbol}</span>
      <span className="text-[10px] font-medium text-slate-400 font-mono">${price.toFixed(2)}</span>
    </div>
    <div className="flex items-center gap-3">
      <Sparkline data={history} color={change >= 0 ? '#10B981' : '#EF4444'} />
      <div className="text-right min-w-[45px]">
        <span className={`text-[10px] font-bold font-mono ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}
        </span>
      </div>
    </div>
  </div>
);

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  isCollapsed: boolean,
  setIsCollapsed: (collapsed: boolean) => void
}) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [watchlist, setWatchlist] = useState([
    { symbol: 'SPY', price: 445.20, change: 1.24, history: [440, 442, 441, 443, 445, 444, 445.2] },
    { symbol: 'QQQ', price: 372.50, change: 1.58, history: [365, 368, 367, 370, 371, 372, 372.5] },
    { symbol: 'TSLA', price: 242.80, change: -0.82, history: [245, 244, 246, 243, 242, 243, 242.8] },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(item => {
        const move = (Math.random() - 0.5) * 0.5;
        const newPrice = item.price + move;
        const newHistory = [...item.history.slice(1), newPrice];
        const newChange = item.change + (move / item.price) * 100;
        return { ...item, price: newPrice, change: newChange, history: newHistory };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen glass-surface border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}>
      {/* Logo Area */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-active rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/20">
            <BarChart2 size={20} />
          </div>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-slate-800 dark:text-white whitespace-nowrap"
            >
              TradeMirror
            </motion.h1>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'} py-2 space-y-8 scrollbar-hide`}>
        {/* Main Section */}
        <div>
          {!isCollapsed && <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main</p>}
          <div className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Dashboard')} />
            <NavItem icon={PenLine} label="Daily Journal" active={activeTab === 'Daily Journal'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Daily Journal')} />
            <NavItem icon={ListOrdered} label="Trade Log" active={activeTab === 'Trade Log'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Trade Log')} />
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          {!isCollapsed && <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics & Risk</p>}
          <div className="space-y-1">
            <NavItem icon={BarChart3} label="Detailed Reports" active={activeTab === 'Detailed Reports'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Detailed Reports')} />
            <NavItem icon={Target} label="Playbook & Setups" active={activeTab === 'Playbook & Setups'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Playbook & Setups')} />
            <NavItem icon={Zap} label="Strategy Comparison" active={activeTab === 'Strategy'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Strategy')} />
            <NavItem icon={BrainCircuit} label="Psychology" active={activeTab === 'Psychology'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Psychology')} />
          </div>
        </div>

        {/* Data Section */}
        <div>
          {!isCollapsed && <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</p>}
          <div className="space-y-1">
            <NavItem icon={CloudUpload} label="Import Broker Data" active={activeTab === 'Import Broker Data'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Import Broker Data')} />
            <NavItem icon={Sliders} label="Settings" active={activeTab === 'Settings'} isCollapsed={isCollapsed} onClick={() => setActiveTab('Settings')} />
          </div>
        </div>

        {/* Watchlist Section */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Watchlist</p>
            <div className="space-y-1">
              {watchlist.map(item => (
                <WatchlistItem key={item.symbol} {...item} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t border-sidebar-border dark:border-slate-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 group-hover:ring-2 ring-sky-500/50 transition-all flex items-center justify-center">
              {user?.email ? (
                <span className="text-xs font-bold text-slate-500">{user.email[0].toUpperCase()}</span>
              ) : (
                <img 
                  src={"https://picsum.photos/seed/alex/100/100"} 
                  alt="User" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1 truncate max-w-[100px]">
                  {user?.email?.split('@')[0] || 'Trader'}
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Pro Member</p>
              </motion.div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
