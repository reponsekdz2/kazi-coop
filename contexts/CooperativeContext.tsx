import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  userCooperatives: Cooperative[];
  getCooperativeById: (id: string) => Cooperative | undefined;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  const userCooperatives = useMemo(() => {
    if (!user || !user.cooperativeIds) return [];
    return cooperatives.filter(c => user.cooperativeIds?.includes(c.id));
  }, [user, cooperatives]);
  
  const getCooperativeById = (id: string) => {
    return cooperatives.find(c => c.id === id);
  };

  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, getCooperativeById }}>
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
