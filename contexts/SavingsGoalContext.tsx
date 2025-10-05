
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SavingsGoal } from '../types';
import { SAVINGS_GOALS } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface SavingsGoalContextType {
  goals: SavingsGoal[];
  addGoal: (details: Omit<SavingsGoal, 'id' | 'userId' | 'currentAmount'>) => void;
  addContribution: (goalId: string, amount: number) => void;
}

const SavingsGoalContext = createContext<SavingsGoalContextType | undefined>(undefined);

export const SavingsGoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>(() => SAVINGS_GOALS.filter(g => g.userId === user?.id));
  const { addToast } = useToast();

  const addGoal = (details: Omit<SavingsGoal, 'id' | 'userId' | 'currentAmount'>) => {
    if (!user) return;
    const newGoal: SavingsGoal = {
      id: `sg-${new Date().getTime()}`,
      userId: user.id,
      currentAmount: 0,
      ...details,
    };

    setGoals(prev => [...prev, newGoal]);
    addToast('New savings goal created!', 'success');
  };

  const addContribution = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        addToast(`Added RWF ${amount.toLocaleString()} to your goal: ${goal.name}`, 'success');
        if (newAmount >= goal.targetAmount) {
             addToast(`Congratulations! You've reached your savings goal: ${goal.name}!`, 'info');
        }
        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    }));
  };

  return (
    <SavingsGoalContext.Provider value={{ goals, addGoal, addContribution }}>
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
