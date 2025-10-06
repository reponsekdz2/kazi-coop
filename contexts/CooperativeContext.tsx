import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Cooperative, CooperativeMember, Loan, UserRole } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useTransactions } from './TransactionContext';

interface CooperativeContextType {
  cooperatives: Cooperative[];
  userCooperatives: Cooperative[];
  createCooperative: (details: Pick<Cooperative, 'name' | 'description' | 'contributionAmount' | 'contributionFrequency' | 'rulesAndRegulations'>) => void;
  updateCooperative: (cooperativeId: string, updatedDetails: Partial<Cooperative>) => void;
  joinCooperative: (cooperativeId: string) => void;
  approveJoinRequest: (cooperativeId: string, userId: string) => void;
  makeContribution: (cooperativeId: string) => void;
  requestLoan: (cooperativeId: string, amount: number, reason: string) => void;
  broadcastMessage: (cooperativeId: string, message: string) => void;
  sendReminder: (cooperativeId: string, userId: string) => void;
  distributeShares: (cooperativeId: string) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addTransaction, balance } = useTransactions();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  const userCooperatives = useMemo(() => {
    if (!user) return [];
    return cooperatives.filter(c => c.members.some(m => m.userId === user.id));
  }, [user, cooperatives]);

  const createCooperative = (details: Pick<Cooperative, 'name' | 'description' | 'contributionAmount' | 'contributionFrequency' | 'rulesAndRegulations'>) => {
    if (!user) return;
    const newCooperative: Cooperative = {
      id: `coop-${Date.now()}`,
      creatorId: user.id,
      members: [{ userId: user.id, joinDate: new Date().toISOString(), totalContribution: 0 }],
      walletBalance: 0,
      loans: [],
      announcements: [],
      joinRequests: [],
      ...details,
    };
    setCooperatives(prev => [newCooperative, ...prev]);
    addToast('Cooperative created successfully!', 'success');
  };

  const updateCooperative = (cooperativeId: string, updatedDetails: Partial<Cooperative>) => {
    setCooperatives(prev => prev.map(c => 
      c.id === cooperativeId ? { ...c, ...updatedDetails } : c
    ));
    addToast('Cooperative settings updated successfully!', 'success');
  };

  const joinCooperative = (cooperativeId: string) => {
    if (!user) return;
    setCooperatives(prev => prev.map(c => {
      if (c.id === cooperativeId && !c.members.some(m => m.userId === user.id) && !c.joinRequests.some(r => r.userId === user.id)) {
        const newRequest = { userId: user.id, date: new Date().toISOString() };
        addToast(`Request to join "${c.name}" sent.`, 'info');
        return { ...c, joinRequests: [...c.joinRequests, newRequest] };
      }
      return c;
    }));
  };

  const approveJoinRequest = (cooperativeId: string, userId: string) => {
      setCooperatives(prev => prev.map(c => {
          if (c.id === cooperativeId) {
              const newMember: CooperativeMember = { userId, joinDate: new Date().toISOString(), totalContribution: c.contributionAmount };
              const updatedRequests = c.joinRequests.filter(r => r.userId !== userId);
              
              // This part would need access to the user's personal wallet balance
              // For now, we simulate a successful transaction for the new member
              console.log(`Simulating contribution for new member ${userId}`);

              addToast(`${userId} has been added to the cooperative!`, 'success');
              
              return { 
                  ...c, 
                  members: [...c.members, newMember], 
                  joinRequests: updatedRequests,
                  walletBalance: c.walletBalance + c.contributionAmount
              };
          }
          return c;
      }))
  };

  const makeContribution = (cooperativeId: string) => {
    if (!user) return;
    const coop = cooperatives.find(c => c.id === cooperativeId);
    if (!coop) return;

    if (balance < coop.contributionAmount) {
        addToast('Insufficient balance in your personal wallet.', 'error');
        return;
    }
    
    addTransaction({
        userId: user.id,
        date: new Date().toISOString(),
        description: `Contribution to ${coop.name}`,
        amount: -coop.contributionAmount,
        category: 'Cooperative',
        provider: 'Mobile Money'
    });
    
    setCooperatives(prev => prev.map(c => {
      if (c.id === cooperativeId) {
        const updatedMembers = c.members.map(m => 
            m.userId === user.id 
            ? { ...m, totalContribution: m.totalContribution + c.contributionAmount, lastContributionDate: new Date().toISOString() }
            : m
        );
        addToast(`Contributed RWF ${c.contributionAmount.toLocaleString()} to "${c.name}".`, 'success');
        return { ...c, walletBalance: c.walletBalance + c.contributionAmount, members: updatedMembers };
      }
      return c;
    }));
  };
  
  const requestLoan = (cooperativeId: string, amount: number, reason: string) => {
    if (!user) return;
    setCooperatives(prev => prev.map(c => {
      if (c.id === cooperativeId) {
          if (c.walletBalance < amount) {
              addToast('Loan request denied: insufficient cooperative funds.', 'error');
              return c;
          }
          const newLoan: Loan = {
              id: `loan-${Date.now()}`,
              memberId: user.id,
              amount,
              requestDate: new Date().toISOString(),
              status: 'Pending',
              repaymentDueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), // 3 month default
          };
          addToast('Loan request submitted for approval.', 'info');
          return {...c, loans: [...c.loans, newLoan]};
      }
      return c;
    }));
  };

  const broadcastMessage = (cooperativeId: string, message: string) => {
      setCooperatives(prev => prev.map(c => {
          if(c.id === cooperativeId) {
              const newAnnouncement = { id: `anno-${Date.now()}`, message, date: new Date().toISOString() };
              addToast('Announcement has been broadcast to all members.', 'success');
              return {...c, announcements: [newAnnouncement, ...c.announcements]};
          }
          return c;
      }))
  };

  const sendReminder = (cooperativeId: string, userId: string) => {
    addToast(`A contribution reminder has been sent to the member.`, 'info');
    // In a real app, this would trigger an email or push notification.
  };

  const distributeShares = (cooperativeId: string) => {
      setCooperatives(prev => prev.map(c => {
          if (c.id === cooperativeId && c.members.length > 0) {
              const shareAmount = c.walletBalance / c.members.length;
              if (shareAmount <= 0) {
                  addToast('No funds to distribute.', 'error');
                  return c;
              }
              // This is a simulation. A real app would create transactions for each member.
              addToast(`Distributed RWF ${shareAmount.toLocaleString()} to each of the ${c.members.length} members.`, 'success');
              return { ...c, walletBalance: 0 };
          }
          return c;
      }))
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, userCooperatives, createCooperative, updateCooperative, joinCooperative, approveJoinRequest, makeContribution, requestLoan, broadcastMessage, sendReminder, distributeShares }}>
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
