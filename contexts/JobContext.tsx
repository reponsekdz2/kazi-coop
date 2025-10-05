import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Job } from '../types';
import { JOBS } from '../constants';
import { useToast } from './ToastContext';

interface JobContextType {
  jobs: Job[];
  addJob: (details: Omit<Job, 'id'>) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const { addToast } = useToast();

  const addJob = (details: Omit<Job, 'id'>) => {
    const newJob: Job = {
      id: `job-${new Date().getTime()}`,
      ...details,
    };

    setJobs(prev => [newJob, ...prev]);
    addToast('New job posted successfully!', 'success');
  };

  return (
    <JobContext.Provider value={{ jobs, addJob }}>
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