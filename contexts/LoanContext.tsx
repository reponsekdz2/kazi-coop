import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Loan } from '../types';
import { LOANS } from '../constants'; // Assuming LOANS are in constants

interface LoanContextType {
  loans: Loan[];
  applyForLoan: (amount: number, reason: string) => Promise<boolean>;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>(LOANS);

  const applyForLoan = async (amount: number, reason: string): Promise<boolean> => {
    // Mock API call
    console.log(`Applying for loan of ${amount} for ${reason}`);
    // In a real app, you would add the new loan to state here after a successful API call.
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  };

  return (
    <LoanContext.Provider value={{ loans, applyForLoan }}>
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
