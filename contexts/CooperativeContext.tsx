
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
  joinCooperative: (cooperativeId: string) => void;
  approveMember: (cooperativeId: string, memberId: string) => void;
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
  
  const joinCooperative = (cooperativeId: string) => {
    if (!user) return;
    setCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId) {
        if (coop.members.some(m => m.userId === user.id)) {
          addToast("You are already a member or your request is pending.", "error");
          return coop;
        }
        const newMember: CooperativeMember = {
            userId: user.id,
            joinDate: new Date().toISOString(),
            status: 'pending_approval',
            totalContribution: 0,
            lastContributionDate: null,
            penalties: 0,
        };
        addToast("Request to join sent!", "success");
        return { ...coop, members: [...coop.members, newMember] };
      }
      return coop;
    }));
  };
  
  const approveMember = (cooperativeId: string, memberId: string) => {
      setCooperatives(prev => prev.map(coop => {
          if (coop.id === cooperativeId) {
              const updatedMembers = coop.members.map(member => {
                  if (member.userId === memberId) {
                      addToast(`${memberId} has been approved.`, "success"); // In a real app, find user name
                      return { ...member, status: 'active' as const }; // Using 'as const' for type safety
                  }
                  return member;
              });
              return { ...coop, members: updatedMembers };
          }
          return coop;
      }));
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, getCooperativeById, joinCooperative, approveMember }}>
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
