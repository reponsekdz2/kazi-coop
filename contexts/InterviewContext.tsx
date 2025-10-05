
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Interview } from '../types';
import { INTERVIEWS } from '../constants';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  interviews: Interview[];
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [interviews] = useState<Interview[]>(() => INTERVIEWS.filter(i => i.userId === user?.id));

  return (
    <InterviewContext.Provider value={{ interviews }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviews = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
