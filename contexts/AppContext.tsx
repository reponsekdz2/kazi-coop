import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
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
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import rw from '../translations/rw.json';

type Theme = 'light' | 'dark';
type Language = 'en' | 'fr' | 'rw';

// Simple i18n implementation
const translations: Record<Language, any> = { en, fr, rw };

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const changeLanguage = (lang: Language) => {
      setLanguage(lang);
  }

  const t = useMemo(() => (key: string): string => {
    return key.split('.').reduce((acc, cur) => acc?.[cur], translations[language]) || key;
  }, [language]);


  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
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