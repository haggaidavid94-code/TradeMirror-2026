import React from 'react';
import { 
  DollarSign, 
  Target, 
  BarChart3, 
  Scale,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  chartData: { value: number }[];
  chartColor: string;
  badge?: {
    text: string;
    type: 'success' | 'info' | 'error';
  };
  subtext: string;
}

const StatCard = (props: StatCardProps) => {
  const { 
    title, 
    value, 
    icon: Icon, 
    iconBg, 
    iconColor, 
    chartData, 
    chartColor, 
    badge, 
    subtext 
  } = props;
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 layered-shadow soft-shadow-hover transition-all relative overflow-hidden group">
      {/* Watermark Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity dark:text-white">
        <Icon size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
          <div className={`w-8 h-8 rounded-lg ${iconBg} dark:bg-slate-800 flex items-center justify-center ${iconColor} shadow-sm`}>
            <Icon size={16} />
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display tracking-tight">{value}</h3>
          <div className="w-20 h-8 relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartColor} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {badge ? (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
              badge.type === 'success' ? 'bg-emerald-500 text-white' : 
              badge.type === 'info' ? 'bg-sky-500 text-white' : 
              'bg-rose-500 text-white'
            }`}>
              {badge.text.startsWith('+') || badge.text.startsWith('-') ? null : (
                badge.type === 'success' ? <TrendingUp size={10} /> : <TrendingDown size={10} />
              )}
              {badge.text}
            </div>
          ) : (
            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-700">
              {subtext.split(' / ')[0]}
            </div>
          )}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {badge ? subtext : subtext.split(' / ')[1] || subtext}
          </span>
        </div>
      </div>
    </div>
  );
};

import { useDisplay } from '../context/DisplayContext';
import { useTrades } from '../context/TradeContext';
import { parseTradeDate, isDateInRange } from '../lib/dateUtils';

interface QuickStatsProps {
  showOnly?: string;
  filters?: {
    assetClass: string;
    strategy: string;
    timeframe: string;
    search: string;
  };
}

export const QuickStats = ({ showOnly, filters }: QuickStatsProps) => {
  const { formatPnl, pnlUnit } = useDisplay();
  const { trades } = useTrades();

  const filteredTrades = trades.filter(trade => {
    // Date Range Filter
    const tradeDate = parseTradeDate(trade.date);
    const dateMatch = !filters || !('dateRange' in filters) || isDateInRange(tradeDate, (filters as any).dateRange);

    const assetClassMatch = !filters?.assetClass || 
      filters.assetClass === 'All Assets' || 
      filters.assetClass === '' ||
      trade.assetClass === filters.assetClass;
    const strategyMatch = !filters?.strategy || 
      filters.strategy === 'All Setups' || 
      filters.strategy === '' ||
      trade.strategy === filters.strategy;
    const timeframeMatch = !filters?.timeframe ||
      filters.timeframe === 'All Timeframes' ||
      filters.timeframe === '' ||
      (trade as any).timeframe === filters.timeframe;
    const searchMatch = !filters?.search || 
      trade.asset.toLowerCase().includes(filters.search.toLowerCase()) ||
      trade.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    return dateMatch && assetClassMatch && strategyMatch && timeframeMatch && searchMatch;
  });

  // Calculate Stats
  const totalTrades = filteredTrades.length;
  const netPnl = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
  const winningTrades = filteredTrades.filter(t => t.pnl > 0);
  const losingTrades = filteredTrades.filter(t => t.pnl < 0);
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  
  const grossWin = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? (grossWin / grossLoss).toFixed(2) : (grossWin > 0 ? '∞' : '0.00');
  
  const totalRisk = filteredTrades.reduce((acc, t) => acc + t.risk, 0);
  const expectancy = totalTrades > 0 ? (netPnl / totalRisk).toFixed(2) : '0.00';
  
  const data1 = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 16 }, { value: 22 }, { value: 20 }
  ];
  const data2 = [
    { value: 60 }, { value: 65 }, { value: 62 }, { value: 68 }, { value: 64 }, { value: 70 }, { value: 68 }
  ];
  const data3 = [
    { value: 2.0 }, { value: 2.2 }, { value: 2.1 }, { value: 2.3 }, { value: 2.15 }, { value: 2.25 }, { value: 2.14 }
  ];
  const data4 = [
    { value: 0.8 }, { value: 0.85 }, { value: 0.82 }, { value: 0.88 }, { value: 0.84 }, { value: 0.9 }, { value: 0.85 }
  ];

  const stats: StatCardProps[] = [
    {
      title: "Net P&L",
      value: pnlUnit === 'R' ? `${(netPnl / 250).toFixed(1)} R` : formatPnl(netPnl),
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      chartData: data1,
      chartColor: "#10B981",
      badge: { text: pnlUnit === 'R' ? formatPnl(netPnl) : `${(netPnl / 250).toFixed(1)} R`, type: netPnl >= 0 ? "success" : "error" },
      subtext: `${totalTrades} Trades`
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      chartData: data2,
      chartColor: "#0EA5E9",
      badge: { text: winRate > 50 ? "+4.2%" : "-2.1%", type: winRate > 50 ? "info" : "error" },
      subtext: `${winningTrades.length}W / ${losingTrades.length}L`
    },
    {
      title: "Profit Factor",
      value: profitFactor,
      icon: BarChart3,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      chartData: data3,
      chartColor: "#F59E0B",
      subtext: pnlUnit === 'R' ? `Gross Win: ${(grossWin/250).toFixed(1)}R / Loss: ${(grossLoss/250).toFixed(1)}R` : `Gross Win: ${formatPnl(grossWin)} / Loss: ${formatPnl(grossLoss)}`
    },
    {
      title: "Expectancy",
      value: `${expectancy} R`,
      icon: Scale,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-500",
      chartData: data4,
      chartColor: "#94A3B8",
      subtext: pnlUnit === 'R' ? "Avg Win: 2.4R / Avg Loss: -1.0R" : "Avg Win: $1,200 / Avg Loss: -$500"
    }
  ];

  const filteredStats = showOnly ? stats.filter(s => s.title === showOnly) : stats;

  return (
    <div className={showOnly ? "" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"}>
      {filteredStats.map((stat, idx) => {
        const Card = StatCard as any;
        return (
          <Card 
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            chartData={stat.chartData}
            chartColor={stat.chartColor}
            badge={stat.badge}
            subtext={stat.subtext}
          />
        );
      })}
    </div>
  );
};
