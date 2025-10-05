import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoanApplication, RepaymentInstallment } from '../types';
import { LOAN_APPLICATIONS } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface LoanContextType {
  applications: LoanApplication[];
  submitLoanApplication: (details: Omit<LoanApplication, 'id' | 'status' | 'userId' | 'remainingAmount' | 'repaymentSchedule' | 'repayments'>) => void;
  makeRepayment: (loanId: string, amount: number) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>(() => LOAN_APPLICATIONS.filter(app => app.userId === user?.id));
  const { addToast } = useToast();

  const submitLoanApplication = (details: Omit<LoanApplication, 'id' | 'status' | 'userId' | 'remainingAmount' | 'repaymentSchedule' | 'repayments'>) => {
    if (!user) return;

    const newApplication: LoanApplication = {
      id: `la-${new Date().getTime()}`,
      userId: user.id,
      ...details,
      status: 'Pending',
      remainingAmount: details.amount,
      repaymentSchedule: [],
      repayments: [],
    };

    setApplications(prev => [...prev, newApplication]);
    addToast('Loan application submitted successfully!', 'success');

    // Simulate approval process
    setTimeout(() => {
      setApplications(prev =>
        prev.map(app => {
          if (app.id === newApplication.id) {
            const installmentAmount = app.amount / app.repaymentPeriod;
            const schedule: RepaymentInstallment[] = Array.from({ length: app.repaymentPeriod }, (_, i) => ({
              dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString(),
              amount: installmentAmount,
              status: 'pending',
            }));

            addToast(`Your loan for RWF ${newApplication.amount.toLocaleString()} has been approved!`, 'info');
            return { ...app, status: 'Approved', repaymentSchedule: schedule };
          }
          return app;
        })
      );
    }, 5000);
  };

  const makeRepayment = (loanId: string, amount: number) => {
    setApplications(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newRemaining = loan.remainingAmount - amount;
        const newRepayment = { amount, date: new Date().toISOString() };
        
        let newStatus = loan.status;
        if (newRemaining <= 0) {
          newStatus = 'Fully Repaid';
          addToast('Congratulations! You have fully repaid this loan.', 'success');
        } else {
          addToast(`Successfully made a repayment of RWF ${amount.toLocaleString()}.`, 'success');
        }

        return {
          ...loan,
          remainingAmount: Math.max(0, newRemaining),
          repayments: [...loan.repayments, newRepayment],
          status: newStatus,
        };
      }
      return loan;
    }));
  };

  return (
    <LoanContext.Provider value={{ applications, submitLoanApplication, makeRepayment }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = (): LoanContextType => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};