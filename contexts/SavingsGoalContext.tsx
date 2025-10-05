
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SavingsGoal } from '../types';
import { SAVINGS_GOALS } from '../constants';
import { useToast } from './ToastContext';

interface SavingsGoalContextType {
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (details: Omit<SavingsGoal, 'id'>) => void;
}

const SavingsGoalContext = createContext<SavingsGoalContextType | undefined>(undefined);

export const SavingsGoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(SAVINGS_GOALS);
  const { addToast } = useToast();

  const addSavingsGoal = (details: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      id: `sg-${new Date().getTime()}`,
      ...details,
    };

    setSavingsGoals(prev => [...prev, newGoal]);
    addToast('New savings goal created!', 'success');
  };

  return (
    <SavingsGoalContext.Provider value={{ savingsGoals, addSavingsGoal }}>
      {children}
    </SavingsGoalContext.Provider>
  );
};

export const useSavingsGoals = (): SavingsGoalContextType => {
  const context = useContext(SavingsGoalContext);
  if (!context) {
    throw new Error('useSavingsGoals must be used within a SavingsGoalProvider');
  }
  return context;
};
