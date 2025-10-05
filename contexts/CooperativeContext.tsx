import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, UserRole } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  createCooperative: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans'>) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allCooperatives, setAllCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  const cooperatives = useMemo(() => {
      if (user?.role === UserRole.EMPLOYER) {
          return allCooperatives.filter(c => c.creatorId === user.id);
      }
      return allCooperatives;
  }, [user, allCooperatives]);
  
  const createCooperative = (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans'>) => {
      if (!user || user.role !== UserRole.EMPLOYER) {
          addToast("Only employers can create cooperatives.", "error");
          return;
      }
      const newCooperative: Cooperative = {
          id: `coop-${new Date().getTime()}`,
          creatorId: user.id,
          members: [user.id],
          totalSavings: 0,
          totalLoans: 0,
          ...details,
      };
      setAllCooperatives(prev => [...prev, newCooperative]);
      addToast("Cooperative created successfully!", "success");
  };

  return (
    <CooperativeContext.Provider value={{ cooperatives, createCooperative }}>
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