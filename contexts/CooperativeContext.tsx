import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, CooperativeMessage, Meeting, Election, ElectionOption } from '../types';
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
  scheduleMeeting: (coopId: string, meetingDetails: Omit<Meeting, 'id' | 'cooperativeId' | 'status'>) => void;
  createElection: (coopId: string, electionDetails: Omit<Election, 'id' | 'cooperativeId' | 'status' | 'votedUserIds' | 'options'> & { optionTexts: string[] }) => void;
  castVote: (coopId: string, electionId: string, optionId: string) => void;
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
  };

  const scheduleMeeting = (coopId: string, meetingDetails: Omit<Meeting, 'id' | 'cooperativeId' | 'status'>) => {
      setCooperatives(prev => prev.map(coop => {
          if (coop.id === coopId) {
              const newMeeting: Meeting = {
                  ...meetingDetails,
                  id: `m-${Date.now()}`,
                  cooperativeId: coopId,
                  status: 'Scheduled',
              };
              addToast(`Meeting "${newMeeting.title}" scheduled successfully!`, 'success');
              return { ...coop, meetings: [...(coop.meetings || []), newMeeting] };
          }
          return coop;
      }));
  };

  const createElection = (coopId: string, electionDetails: Omit<Election, 'id' | 'cooperativeId' | 'status' | 'votedUserIds' | 'options'> & { optionTexts: string[] }) => {
      setCooperatives(prev => prev.map(coop => {
          if (coop.id === coopId) {
              const newElection: Election = {
                  id: `e-${Date.now()}`,
                  cooperativeId: coopId,
                  title: electionDetails.title,
                  description: electionDetails.description,
                  status: 'Active',
                  votedUserIds: [],
                  options: electionDetails.optionTexts.map((text, i) => ({
                      id: `eo-${Date.now()}-${i}`,
                      text,
                      votes: 0,
                  })),
              };
              addToast(`Election "${newElection.title}" has been created!`, 'success');
              return { ...coop, elections: [...(coop.elections || []), newElection] };
          }
          return coop;
      }));
  };

  const castVote = (coopId: string, electionId: string, optionId: string) => {
      if(!user) return;
      setCooperatives(prev => prev.map(coop => {
          if (coop.id === coopId) {
              const updatedElections = (coop.elections || []).map(election => {
                  if (election.id === electionId) {
                      if(election.votedUserIds.includes(user.id)) {
                          addToast('You have already voted in this election.', 'error');
                          return election;
                      }
                      const updatedOptions = election.options.map(opt => 
                          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                      );
                      addToast('Your vote has been cast successfully!', 'success');
                      return { ...election, options: updatedOptions, votedUserIds: [...election.votedUserIds, user.id] };
                  }
                  return election;
              });
              return { ...coop, elections: updatedElections };
          }
          return coop;
      }));
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, getCooperativeById, approveJoinRequest, denyJoinRequest, postMessage, scheduleMeeting, createElection, castVote }}>
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