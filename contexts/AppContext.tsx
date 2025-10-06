import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CooperativeProvider } from './CooperativeContext';
import { TransactionProvider } from './TransactionContext';
import { SavingsGoalProvider } from './SavingsGoalContext';
import { BudgetProvider } from './BudgetContext';
import { LoanProvider } from './LoanContext';
import { ToastProvider } from './ToastContext';
import { InterviewProvider } from './InterviewContext';
import { JobProvider } from './JobContext';
import { ApplicationProvider } from './ApplicationContext';
import { NotificationProvider } from './NotificationContext';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      <ToastProvider>
        <AuthProvider>
          <TransactionProvider>
            <NotificationProvider>
              <JobProvider>
                <ApplicationProvider>
                  <InterviewProvider>
                    <CooperativeProvider>
                      <BudgetProvider>
                        <SavingsGoalProvider>
                          <LoanProvider>
                            {children}
                          </LoanProvider>
                        </SavingsGoalProvider>
                      </BudgetProvider>
                    </CooperativeProvider>
                  </InterviewProvider>
                </ApplicationProvider>
              </JobProvider>
            </NotificationProvider>
          </TransactionProvider>
        </AuthProvider>
      </ToastProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};