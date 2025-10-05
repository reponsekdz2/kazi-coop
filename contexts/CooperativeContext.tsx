import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Cooperative, UserRole, Contribution, CooperativeLoan, RepaymentInstallment } from '../types';
import { COOPERATIVES } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useTransactions } from './TransactionContext';

type CooperativeSettingsPayload = {
    name: string;
    description: string;
    contributionSettings: {
        amount: number;
        frequency: 'Weekly' | 'Monthly';
    };
    loanSettings: {
        interestRate: number;
    };
};

interface CooperativeContextType {
  cooperatives: Cooperative[];
  createCooperative: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans' | 'joinRequests' | 'contributions' | 'loans' | 'loanSettings'>) => void;
  requestToJoin: (cooperativeId: string) => void;
  approveJoinRequest: (cooperativeId: string, userId: string) => void;
  denyJoinRequest: (cooperativeId: string, userId: string) => void;
  makeContribution: (cooperativeId: string, amount: number) => void;
  applyForLoan: (cooperativeId: string, details: { amount: number, purpose: string, repaymentPeriod: number }) => void;
  approveLoan: (cooperativeId: string, loanId: string) => void;
  rejectLoan: (cooperativeId: string, loanId: string) => void;
  makeLoanRepayment: (cooperativeId: string, loanId: string, installmentId: string) => void;
  updateCooperativeSettings: (cooperativeId: string, settings: CooperativeSettingsPayload) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

export const CooperativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addTransaction } = useTransactions();
  const [allCooperatives, setAllCooperatives] = useState<Cooperative[]>(COOPERATIVES);

  const cooperatives = useMemo(() => {
      if (user?.role === UserRole.EMPLOYER) {
          return allCooperatives.filter(c => c.creatorId === user.id);
      }
      return allCooperatives;
  }, [user, allCooperatives]);
  
  const createCooperative = (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'totalSavings' | 'totalLoans' | 'joinRequests' | 'contributions'| 'loans' | 'loanSettings'>) => {
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
          loans: [],
          loanSettings: { interestRate: 10, maxLoanPercentage: 80 }, // Default settings
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

  const applyForLoan = (cooperativeId: string, details: { amount: number, purpose: string, repaymentPeriod: number }) => {
    if (!user) return;
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId) {
        const availableFunds = coop.totalSavings - coop.totalLoans;
        if (details.amount > availableFunds) {
          addToast(`Requested amount exceeds available funds (RWF ${availableFunds.toLocaleString()}).`, 'error');
          return coop;
        }
        const newLoan: CooperativeLoan = {
          id: `coop-loan-${new Date().getTime()}`,
          cooperativeId: coop.id,
          userId: user.id,
          amount: details.amount,
          purpose: details.purpose,
          repaymentPeriod: details.repaymentPeriod,
          interestRate: coop.loanSettings.interestRate,
          status: 'Pending',
          applicationDate: new Date().toISOString(),
          repayments: [],
          remainingAmount: details.amount,
          repaymentSchedule: [],
        };
        addToast("Loan application submitted successfully.", "success");
        return { ...coop, loans: [...coop.loans, newLoan] };
      }
      return coop;
    }));
  };

  const approveLoan = (cooperativeId: string, loanId: string) => {
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId && coop.creatorId === user?.id) {
        const loanToApprove = coop.loans.find(l => l.id === loanId);
        if (!loanToApprove) return coop;
        
        const availableFunds = coop.totalSavings - coop.totalLoans;
        if (loanToApprove.amount > availableFunds) {
          addToast("Cannot approve loan, insufficient funds available.", "error");
          return coop;
        }

        // Generate repayment schedule (simple interest)
        const principal = loanToApprove.amount;
        const annualRate = loanToApprove.interestRate / 100;
        const months = loanToApprove.repaymentPeriod;
        
        const totalInterest = principal * annualRate * (months / 12);
        const totalRepayment = principal + totalInterest;
        const monthlyPayment = totalRepayment / months;

        const schedule: RepaymentInstallment[] = Array.from({ length: months }, (_, i) => ({
          id: `${loanToApprove.id}-inst-${i}`,
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString(),
          amount: Math.round(monthlyPayment), // Round to nearest RWF
          status: 'pending',
        }));
        
        addToast("Loan approved and funds disbursed.", "success");
        return {
          ...coop,
          totalLoans: coop.totalLoans + loanToApprove.amount,
          loans: coop.loans.map(l => l.id === loanId ? { ...l, status: 'Approved', approvalDate: new Date().toISOString(), repaymentSchedule: schedule } : l),
        };
      }
      return coop;
    }));
  };

  const rejectLoan = (cooperativeId: string, loanId: string) => {
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId && coop.creatorId === user?.id) {
        addToast("Loan request rejected.", "info");
        return {
          ...coop,
          loans: coop.loans.map(l => l.id === loanId ? { ...l, status: 'Rejected' } : l),
        };
      }
      return coop;
    }));
  };
  
  const makeLoanRepayment = (cooperativeId: string, loanId: string, installmentId: string) => {
    if(!user) return;
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId) {
        const loan = coop.loans.find(l => l.id === loanId);
        if (!loan) return coop;
        
        const installmentIndex = loan.repaymentSchedule.findIndex(inst => inst.id === installmentId);
        if (installmentIndex === -1 || loan.repaymentSchedule[installmentIndex].status !== 'pending') return coop;

        const installment = loan.repaymentSchedule[installmentIndex];
        const paymentAmount = installment.amount;
        
        // Calculate principal portion for this simple interest model to correctly adjust total loans
        const principalPortion = loan.amount / loan.repaymentPeriod;

        // Update installment status
        const updatedSchedule = [...loan.repaymentSchedule];
        updatedSchedule[installmentIndex] = { ...installment, status: 'paid' };

        // Update loan aggregates
        const updatedLoan = {
          ...loan,
          remainingAmount: loan.remainingAmount - principalPortion, // Reduce remaining principal
          repayments: [...loan.repayments, { date: new Date().toISOString(), amount: paymentAmount }],
          repaymentSchedule: updatedSchedule,
        };
        
        // Create wallet transaction
        addTransaction({
          userId: user.id,
          date: new Date().toISOString(),
          description: `Loan repayment to ${coop.name}`,
          amount: -paymentAmount,
          category: 'Loan Repayment'
        });

        addToast(`Successfully paid RWF ${paymentAmount.toLocaleString()}.`, 'success');

        return {
          ...coop,
          totalSavings: coop.totalSavings + paymentAmount, // Savings pool increases by full payment
          totalLoans: coop.totalLoans - principalPortion, // Total loans (principal) decreases
          loans: coop.loans.map(l => l.id === loanId ? updatedLoan : l)
        };
      }
      return coop;
    }));
  };

  const updateCooperativeSettings = (cooperativeId: string, settings: CooperativeSettingsPayload) => {
    setAllCooperatives(prev => prev.map(coop => {
      if (coop.id === cooperativeId && coop.creatorId === user?.id) {
        addToast("Cooperative settings updated successfully.", "success");
        return {
          ...coop,
          name: settings.name,
          description: settings.description,
          contributionSettings: settings.contributionSettings,
          loanSettings: {
            ...coop.loanSettings,
            interestRate: settings.loanSettings.interestRate,
          }
        };
      }
      return coop;
    }));
  };


  return (
    <CooperativeContext.Provider value={{ cooperatives, createCooperative, requestToJoin, approveJoinRequest, denyJoinRequest, makeContribution, applyForLoan, approveLoan, rejectLoan, makeLoanRepayment, updateCooperativeSettings }}>
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