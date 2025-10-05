
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Application } from '../types';
import { APPLICATIONS } from '../constants';

interface ApplicationContextType {
  applications: Application[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications] = useState<Application[]>(APPLICATIONS);

  return (
    <ApplicationContext.Provider value={{ applications }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
