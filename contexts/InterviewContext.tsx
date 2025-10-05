import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Interview, UserRole } from '../types';
import { INTERVIEWS } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface InterviewContextType {
  interviews: Interview[];
  scheduleInterview: (details: Omit<Interview, 'id' | 'status'>) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allInterviews, setAllInterviews] = useState<Interview[]>(INTERVIEWS);
  
  const interviews = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.SEEKER) {
        return allInterviews.filter(i => i.userId === user.id);
    }
     if (user.role === UserRole.EMPLOYER) {
        // This logic would be more complex, needing to check against employer's jobs
        // For now, returning all for simplicity in mock environment
        return allInterviews;
    }
    return allInterviews;
  }, [user, allInterviews]);
  
  const scheduleInterview = (details: Omit<Interview, 'id' | 'status'>) => {
      const newInterview: Interview = {
          id: `int-${new Date().getTime()}`,
          status: 'Scheduled',
          ...details
      };
      setAllInterviews(prev => [...prev, newInterview]);
      addToast('Interview scheduled successfully!', 'success');
  }

  return (
    <InterviewContext.Provider value={{ interviews, scheduleInterview }}>
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
