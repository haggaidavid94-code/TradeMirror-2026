import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { Trade } from '../services/api';
import { useAuth } from './AuthContext';

interface TradeContextType {
  trades: Trade[];
  loading: boolean;
  refreshTrades: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'userId'>) => Promise<Trade>;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTrades = useCallback(async () => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getTrades();
      setTrades(data);
    } catch (error) {
      console.error("Failed to refresh trades:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTrades();
  }, [refreshTrades]);

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'userId'>) => {
    const newTrade = await api.addTrade(tradeData);
    setTrades(prev => [newTrade, ...prev]);
    return newTrade;
  };

  return (
    <TradeContext.Provider value={{ trades, loading, refreshTrades, addTrade }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
