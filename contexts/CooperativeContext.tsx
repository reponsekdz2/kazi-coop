import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, UserRole, Contribution } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  createCooperative: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans' | 'joinRequests' | 'contributions'>) => void;
  requestToJoin: (cooperativeId: string) => void;
  approveJoinRequest: (cooperativeId: string, userId: string) => void;
  denyJoinRequest: (cooperativeId: string, userId: string) => void;
  makeContribution: (cooperativeId: string, amount: number) => void;
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
  
  const createCooperative = (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans' | 'joinRequests' | 'contributions'>) => {
      if (!user || user.role !== UserRole.EMPLOYER) {
          addToast("Only employers can create cooperatives.", "error");
          return;
      }
      const newCooperative: Cooperative = {
          id: `coop-${new Date().getTime()}`,
          creatorId: user.id,
          members: [user.id],
          joinRequests: [],
          totalSavings: 0,
          totalLoans: 0,
          contributions: [],
          ...details,
      };
      setAllCooperatives(prev => [...prev, newCooperative]);
      addToast("Cooperative created successfully!", "success");
  };
  
  const requestToJoin = (cooperativeId: string) => {
    if (!user) return;
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId) {
        if (coop.joinRequests.includes(user.id) || coop.members.includes(user.id)) {
          addToast("You have already sent a request or are a member.", "info");
          return coop;
        }
        addToast("Your request to join has been sent.", "success");
        return { ...coop, joinRequests: [...coop.joinRequests, user.id] };
      }
      return coop;
    }));
  };
  
  const approveJoinRequest = (cooperativeId: string, userId: string) => {
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId && coop.creatorId === user?.id) {
        addToast("Member approved successfully.", "success");
        return {
          ...coop,
          members: [...coop.members, userId],
          joinRequests: coop.joinRequests.filter(id => id !== userId),
        };
      }
      return coop;
    }));
  };

  const denyJoinRequest = (cooperativeId: string, userId: string) => {
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId && coop.creatorId === user?.id) {
        addToast("Member request denied.", "info");
        return {
          ...coop,
          joinRequests: coop.joinRequests.filter(id => id !== userId),
        };
      }
      return coop;
    }));
  };

  const makeContribution = (cooperativeId: string, amount: number) => {
    if (!user) return;
    setAllCooperatives(prev => prev.map(coop => {
        if (coop.id === cooperativeId && coop.members.includes(user.id)) {
            const newContribution: Contribution = {
                userId: user.id,
                amount,
                date: new Date().toISOString(),
            };
            addToast(`Successfully contributed RWF ${amount.toLocaleString()}.`, 'success');
            return {
                ...coop,
                totalSavings: coop.totalSavings + amount,
                contributions: [newContribution, ...coop.contributions],
            };
        }
        return coop;
    }));
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, createCooperative, requestToJoin, approveJoinRequest, denyJoinRequest, makeContribution }}>
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
