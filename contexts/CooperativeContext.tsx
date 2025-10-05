import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, CooperativeMessage } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  userCooperatives: Cooperative[];
  getCooperativeById: (id: string) => Cooperative | undefined;
  approveJoinRequest: (coopId: string, userId: string) => void;
  denyJoinRequest: (coopId: string, userId: string) => void;
  postMessage: (coopId: string, messageText: string) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  const userCooperatives = useMemo(() => {
    if (!user || !user.cooperativeIds) return [];
    return cooperatives.filter(c => user.cooperativeIds?.includes(c.id));
  }, [user, cooperatives]);
  
  const getCooperativeById = (id: string) => {
    return cooperatives.find(c => c.id === id);
  };

  const approveJoinRequest = (coopId: string, userId: string) => {
    setCooperatives(prevCoops =>
      prevCoops.map(coop => {
        if (coop.id === coopId) {
          addToast(`Approved join request for cooperative: ${coop.name}`, 'success');
          return {
            ...coop,
            members: coop.members + 1,
            joinRequests: coop.joinRequests?.filter(req => req.userId !== userId),
          };
        }
        return coop;
      })
    );
  };

  const denyJoinRequest = (coopId: string, userId: string) => {
    setCooperatives(prevCoops =>
      prevCoops.map(coop => {
        if (coop.id === coopId) {
           addToast(`Denied join request for cooperative: ${coop.name}`, 'info');
          return {
            ...coop,
            joinRequests: coop.joinRequests?.filter(req => req.userId !== userId),
          };
        }
        return coop;
      })
    );
  };

  const postMessage = (coopId: string, messageText: string) => {
    if(!user) return;
    setCooperatives(prevCoops => 
        prevCoops.map(coop => {
            if (coop.id === coopId) {
                const newMessage: CooperativeMessage = {
                    id: `cm-${Date.now()}`,
                    userId: user.id,
                    text: messageText,
                    timestamp: new Date().toISOString(),
                };
                const updatedMessages = [...(coop.messages || []), newMessage];
                return { ...coop, messages: updatedMessages };
            }
            return coop;
        })
    );
  }

  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, getCooperativeById, approveJoinRequest, denyJoinRequest, postMessage }}>
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