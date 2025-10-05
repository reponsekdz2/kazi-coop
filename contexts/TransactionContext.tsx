
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction } from '../types';
import { TRANSACTIONS } from '../constants';
import { useToast } from './ToastContext';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (details: Omit<Transaction, 'id'>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const { addToast } = useToast();

  const addTransaction = (details: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: `t-${new Date().getTime()}`,
      ...details,
    };

    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    addToast('Transaction added successfully!', 'success');
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
