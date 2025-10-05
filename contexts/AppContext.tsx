

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { CooperativeProvider } from './CooperativeContext';
import { LoanProvider } from './LoanContext';
import { TransactionProvider } from './TransactionContext';
import { SavingsGoalProvider } from './SavingsGoalContext';
import { BudgetProvider } from './BudgetContext';
import { JobProvider } from './JobContext';
import { ApplicationProvider } from './ApplicationContext';

type Theme = 'light' | 'dark';
type Language = 'en' | 'fr' | 'rw';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const storedLang = localStorage.getItem('language') as Language;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (storedLang) {
      setLanguage(storedLang);
    }

  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/translations/${language}.json`);
        const data = await response.json();
        setTranslations(data);
        localStorage.setItem('language', language);
      } catch (error) {
        console.error(`Could not load translation file for language: ${language}`, error);
      }
    };
    fetchTranslations();
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };
  
  const t = useCallback((key: string): string => {
    // Basic key lookup for simplicity. A more robust solution might handle nested keys.
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key itself if not found
      }
    }
    return result || key;
  }, [translations]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CooperativeProvider>
          <TransactionProvider>
            <JobProvider>
             <ApplicationProvider>
                <LoanProvider>
                    <SavingsGoalProvider>
                      <BudgetProvider>
                        <AppContextProvider>
                          {children}
                        </AppContextProvider>
                      </BudgetProvider>
                    </SavingsGoalProvider>
                </LoanProvider>
              </ApplicationProvider>
            </JobProvider>
          </TransactionProvider>
        </CooperativeProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};