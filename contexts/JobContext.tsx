import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Job, UserRole } from '../types';
import { JOBS } from '../constants';
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const jobs = useMemo(() => {
      if (user?.role === UserRole.EMPLOYER) {
          return JOBS.filter(job => job.employerId === user.id);
      }
      return JOBS;
  }, [user]);

  return (
    <JobContext.Provider value={{ jobs }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};