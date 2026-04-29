import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RiskContextType {
  maxRiskPerTrade: number;
  setMaxRiskPerTrade: (value: number) => void;
  dailyLossLimit: number;
  setDailyLossLimit: (value: number) => void;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export const RiskProvider = ({ children }: { children: ReactNode }) => {
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState(500);
  const [dailyLossLimit, setDailyLossLimit] = useState(1500);

  return (
    <RiskContext.Provider value={{ maxRiskPerTrade, setMaxRiskPerTrade, dailyLossLimit, setDailyLossLimit }}>
      {children}
    </RiskContext.Provider>
  );
};

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
};
