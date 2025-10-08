import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Budget, TransactionCategory } from '../types';
// FIX: Import mock data from the new constants file.
import { BUDGETS } from '../constants';
import { useToast } from './ToastContext';
import { useTransactions } from './TransactionContext';
import { useAuth } from './AuthContext';

export interface BudgetWithSpending extends Budget {
    spentAmount: number;
    remainingAmount: number;
    progress: number;
}

interface BudgetContextType {
  budgetsWithSpending: BudgetWithSpending[];
  addBudget: (details: Omit<Budget, 'id' | 'userId'>) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>(() => BUDGETS.filter(b => b.userId === user?.id));
  const { addToast } = useToast();
  const { transactions } = useTransactions();

  const addBudget = (details: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    if (budgets.some(b => b.category === details.category)) {
        addToast(`A budget for ${details.category} already exists.`, 'error');
        return;
    }
    const newBudget: Budget = {
      id: `b-${new Date().getTime()}`,
      userId: user.id,
      ...details,
    };

    setBudgets(prev => [...prev, newBudget]);
    addToast('New budget created successfully!', 'success');
  };

  const budgetsWithSpending = useMemo(() => {
    return budgets.map(budget => {
        const spentAmount = transactions
            .filter(t => t.category === budget.category && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const remainingAmount = budget.budgetAmount - spentAmount;
        const progress = budget.budgetAmount > 0 ? Math.min((spentAmount / budget.budgetAmount) * 100, 100) : 0;

        return {
            ...budget,
            spentAmount,
            remainingAmount,
            progress
        };
    });
  }, [budgets, transactions]);


  return (
    <BudgetContext.Provider value={{ budgetsWithSpending, addBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
