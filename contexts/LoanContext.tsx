import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoanApplication } from '../types';
import { LOAN_APPLICATIONS } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface LoanContextType {
  applications: LoanApplication[];
  submitLoanApplication: (details: Omit<LoanApplication, 'id' | 'status' | 'userId'>) => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>(LOAN_APPLICATIONS.filter(app => app.userId === user?.id));
  const { addToast } = useToast();

  const submitLoanApplication = (details: Omit<LoanApplication, 'id' | 'status' | 'userId'>) => {
    if (!user) return;

    const newApplication: LoanApplication = {
      id: `la-${new Date().getTime()}`,
      userId: user.id,
      ...details,
      status: 'Pending',
    };

    setApplications(prev => [...prev, newApplication]);
    addToast('Loan application submitted successfully!', 'success');

    // Simulate approval process
    setTimeout(() => {
      setApplications(prev =>
        prev.map(app =>
          app.id === newApplication.id ? { ...app, status: 'Approved' } : app
        )
      );
      addToast(`Your loan for RWF ${newApplication.amount.toLocaleString()} has been approved!`, 'info');
    }, 5000);
  };

  return (
    <LoanContext.Provider value={{ applications, submitLoanApplication }}>
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