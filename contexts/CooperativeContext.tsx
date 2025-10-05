
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Cooperative } from '../types';
import { COOPERATIVES } from '../constants';

interface CooperativeContextType {
  cooperatives: Cooperative[];
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  // Add functions to add/update cooperatives if needed

  return (
    <CooperativeContext.Provider value={{ cooperatives }}>
      {children}
    </CooperativeContext.Provider>
  );
};

export const useCooperatives = (): CooperativeContextType => {
  const context = useContext(CooperativeContext);
  if (!context) {
    throw new Error('useCooperatives must be used within a CooperativeProvider');
  }
  return context;
};
