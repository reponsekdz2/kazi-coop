import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Cooperative, CooperativeMember } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../services/api';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  userCooperatives: Cooperative[];
  isLoading: boolean;
  getCooperativeById: (id: string) => Cooperative | undefined;
  joinCooperative: (cooperativeId: string) => Promise<void>;
  approveMember: (cooperativeId: string, memberId: string) => Promise<void>;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCooperatives = async () => {
        if (!user) {
            setCooperatives([]);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const data = await api.get<Cooperative[]>('/cooperatives');
            setCooperatives(data);
        } catch (err) {
            addToast('Failed to load cooperatives.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    fetchCooperatives();
  }, [user, addToast]);
  
  const userCooperatives = useMemo(() => {
    if (!user) return [];
    return cooperatives.filter(c => c.members.some(member => member.userId === user.id));
  }, [user, cooperatives]);

  const getCooperativeById = (id: string) => {
    return cooperatives.find(c => c.id === id);
  }
  
  const joinCooperative = async (cooperativeId: string) => {
    if (!user) return;
    try {
        await api.post(`/cooperatives/${cooperativeId}/join`, {});
        // Re-fetch or update state optimistically
        const updatedCoops = cooperatives.map(coop => {
            if (coop.id === cooperativeId) {
                const newMember: CooperativeMember = {
                    userId: user.id,
                    joinDate: new Date().toISOString(),
                    status: 'pending_approval',
                    totalContribution: 0,
                    lastContributionDate: null,
                    penalties: 0,
                };
                return { ...coop, members: [...coop.members, newMember] };
            }
            return coop;
        });
        setCooperatives(updatedCoops);
        addToast("Request to join sent!", "success");
    } catch(err: any) {
        addToast(err.message || 'Failed to join.', 'error');
    }
  };
  
  const approveMember = async (cooperativeId: string, memberId: string) => {
      try {
          await api.put(`/cooperatives/${cooperativeId}/members/${memberId}/approve`, {});
          const updatedCoops = cooperatives.map(coop => {
              if (coop.id === cooperativeId) {
                  return {
                      ...coop,
                      // FIX: Explicitly cast the status to satisfy the strict union type.
                      members: coop.members.map(m => m.userId === memberId ? { ...m, status: 'active' as CooperativeMember['status'] } : m)
                  };
              }
              return coop;
          });
          setCooperatives(updatedCoops);
          addToast(`Member has been approved.`, "success");
      } catch (err: any) {
        addToast(err.message || 'Failed to approve member.', 'error');
      }
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, isLoading, getCooperativeById, joinCooperative, approveMember }}>
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
