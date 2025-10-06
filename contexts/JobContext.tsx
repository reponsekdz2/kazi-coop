import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Job, UserRole } from '../types';
import { JOBS } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface JobContextType {
  jobs: Job[];
  createJob: (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => void;
  updateJob: (jobId: string, jobData: Partial<Omit<Job, 'id' | 'employerId' | 'isSaved'>>) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  toggleSaveJob: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allJobs, setAllJobs] = useState<Job[]>(JOBS);

  const jobs = useMemo(() => {
      if (user?.role === UserRole.EMPLOYER) {
          return allJobs.filter(job => job.employerId === user.id);
      }
      return allJobs;
  }, [user, allJobs]);

  const createJob = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
    if (!user || user.role !== UserRole.EMPLOYER) return;
    const newJob: Job = {
        id: `job-${new Date().getTime()}`,
        employerId: user.id,
        isSaved: false,
        status: 'Open',
        ...jobData,
    };
    setAllJobs(prev => [newJob, ...prev]);
    addToast('New job posted successfully!', 'success');
  };

  const updateJob = (jobId: string, jobData: Partial<Omit<Job, 'id' | 'employerId' | 'isSaved'>>) => {
      setAllJobs(prev => prev.map(job => (job.id === jobId ? { ...job, ...jobData } : job)));
      addToast('Job details updated!', 'success');
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
      setAllJobs(prev => prev.map(job => (job.id === jobId ? { ...job, status } : job)));
      addToast(`Job status changed to ${status}`, 'info');
  };

  const toggleSaveJob = (jobId: string) => {
      setAllJobs(prev => prev.map(job => {
          if (job.id === jobId) {
              const newSavedStatus = !job.isSaved;
              addToast(newSavedStatus ? 'Job saved!' : 'Job unsaved.', 'info');
              return { ...job, isSaved: newSavedStatus };
          }
          return job;
      }));
  };

  return (
    <JobContext.Provider value={{ jobs, createJob, updateJob, updateJobStatus, toggleSaveJob }}>
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