// FIX: Created TransactionContext.tsx to resolve module not found error.
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Transaction, User } from '../types';
import { TRANSACTIONS, USERS } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (details: Omit<Transaction, 'id'>) => void;
  addTransfer: (receiverId: string, amount: number, note: string) => void;
  balance: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(TRANSACTIONS);

  const transactions = useMemo(() => {
    if (!user) return [];
    return allTransactions.filter(t => t.userId === user.id);
  }, [user, allTransactions]);
  
  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const addTransaction = (details: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: `txn-${new Date().getTime()}`,
      ...details,
    };
    setAllTransactions(prev => [newTransaction, ...prev]);
    if (details.amount > 0) {
        addToast(`Deposited RWF ${details.amount.toLocaleString()}`, 'success');
    } else if (details.description.toLowerCase().includes('withdraw')) {
        addToast(`Withdrawal of RWF ${Math.abs(details.amount).toLocaleString()} processed.`, 'success');
    }
  };
  
  const addTransfer = (receiverId: string, amount: number, note: string) => {
    if (!user) return;
    const sender = user;
    const receiver = USERS.find(u => u.id === receiverId);
    if (!receiver) {
      addToast('Recipient not found.', 'error');
      return;
    }

    const senderTransaction: Transaction = {
      id: `txn-${new Date().getTime()}-s`,
      userId: sender.id,
      date: new Date().toISOString(),
      description: `Transfer to ${receiver.name}${note ? `: ${note}` : ''}`,
      amount: -amount,
      category: 'Transfer',
    };

    const receiverTransaction: Transaction = {
      id: `txn-${new Date().getTime()}-r`,
      userId: receiver.id,
      date: new Date().toISOString(),
      description: `Transfer from ${sender.name}${note ? `: ${note}` : ''}`,
      amount: amount,
      category: 'Transfer',
    };

    setAllTransactions(prev => [senderTransaction, receiverTransaction, ...prev]);
    addToast(`Successfully sent RWF ${amount.toLocaleString()} to ${receiver.name}.`, 'success');
  };


  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, addTransfer, balance }}>
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