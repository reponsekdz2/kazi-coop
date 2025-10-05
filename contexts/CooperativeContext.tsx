import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Cooperative, CooperativeMessage } from '../types';
import { COOPERATIVES } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  joinCooperative: (coopId: string) => void;
  postMessageToCooperative: (coopId: string, messageText: string) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);
  const { addToast } = useToast();

  const joinCooperative = (coopId: string) => {
    if (!user) {
      addToast('You must be logged in to join.', 'error');
      return;
    }

    setCooperatives(prev =>
      prev.map(coop => {
        if (coop.id === coopId && !coop.memberIds.includes(user.id)) {
          addToast(`Successfully joined ${coop.name}!`, 'success');
          return { ...coop, memberIds: [...coop.memberIds, user.id] };
        }
        return coop;
      })
    );
  };

  const postMessageToCooperative = (coopId: string, messageText: string) => {
    if (!user) {
        addToast('You must be logged in to post a message.', 'error');
        return;
    }

    const newMessage: CooperativeMessage = {
        id: `cm-${new Date().getTime()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl,
        timestamp: new Date().toISOString(),
        text: messageText,
    };
    
    setCooperatives(prev => prev.map(coop => {
        if (coop.id === coopId) {
            return {
                ...coop,
                messages: [newMessage, ...coop.messages]
            };
        }
        return coop;
    }));

    addToast('Message posted successfully!', 'success');
  };

  return (
    <CooperativeContext.Provider value={{ cooperatives, joinCooperative, postMessageToCooperative }}>
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