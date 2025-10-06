// FIX: Created CooperativeContext.tsx to manage and provide cooperative data.
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, CooperativeMember } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  userCooperatives: Cooperative[];
  getCooperativeById: (id: string) => Cooperative | undefined;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);
  const { addToast } = useToast();
  
  const userCooperatives = useMemo(() => {
    if (!user) return [];
    // FIX: Used .some() to correctly check if the user is a member of the cooperative.
    return cooperatives.filter(c => c.members.some(member => member.userId === user.id));
  }, [user, cooperatives]);

  const getCooperativeById = (id: string) => {
    return cooperatives.find(c => c.id === id);
  }

  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, getCooperativeById }}>
      {children}
    </CooperativeContext.Provider>
  );
};

export const useCooperative = (): CooperativeContextType => {
  const context = useContext(CooperativeContext);
  if (!context) {
    throw new Error('useCooperative must be used within a CooperativeProvider');
  }
  return context;
};