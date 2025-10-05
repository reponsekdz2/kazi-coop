
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Job } from '../types';
import { JOBS } from '../constants';

interface JobContextType {
  jobs: Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs] = useState<Job[]>(JOBS);

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
