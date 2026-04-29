import React, { createContext, useContext, useState, ReactNode } from 'react';

type PnlUnit = '$' | 'R';

interface DisplayContextType {
  pnlUnit: PnlUnit;
  setPnlUnit: (unit: PnlUnit) => void;
  formatPnl: (value: number, riskPerTrade?: number) => string;
}

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const DisplayProvider = ({ children }: { children: ReactNode }) => {
  const [pnlUnit, setPnlUnit] = useState<PnlUnit>('R'); // Default to R as requested for "pro" feel

  const formatPnl = (value: number, riskPerTrade: number = 500) => {
    if (pnlUnit === 'R') {
      const rValue = value / riskPerTrade;
      return `${rValue >= 0 ? '+' : ''}${rValue.toFixed(1)}R`;
    }
    return `${value >= 0 ? '+' : '-'}$${Math.abs(value).toLocaleString()}`;
  };

  return (
    <DisplayContext.Provider value={{ pnlUnit, setPnlUnit, formatPnl }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error('useDisplay must be used within a DisplayProvider');
  }
  return context;
};
