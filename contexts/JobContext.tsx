import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Job, UserRole } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../services/api';

interface JobContextType {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  createJob: (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => Promise<void>;
  updateJob: (jobId: string, jobData: Partial<Omit<Job, 'id' | 'employerId' | 'isSaved'>>) => Promise<void>;
  toggleSaveJob: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
        if (user) {
            try {
                setIsLoading(true);
                const fetchedJobs = await api.get<Job[]>('/jobs');
                // Note: saved state would ideally be user-specific and fetched from a separate endpoint
                const jobsWithSaved = fetchedJobs.map(j => ({ ...j, isSaved: false }));
                setJobs(jobsWithSaved);
                setError(null);
            } catch (err: any) {
                setError(err.message);
                addToast('Failed to load jobs', 'error');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Clear jobs if user logs out
            setJobs([]);
            setIsLoading(false);
        }
    };
    fetchJobs();
  }, [user, addToast]);


  const createJob = async (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
    if (!user || user.role !== UserRole.EMPLOYER) return;
    try {
        const newJob = await api.post<Job>('/jobs', jobData);
        setJobs(prev => [{...newJob, isSaved: false }, ...prev]);
        addToast('New job posted successfully!', 'success');
    } catch(err: any) {
        addToast(err.message || 'Failed to create job.', 'error');
    }
  };

  const updateJob = async (jobId: string, jobData: Partial<Omit<Job, 'id' | 'employerId' | 'isSaved'>>) => {
      try {
        const updatedJob = await api.put<Job>(`/jobs/${jobId}`, jobData);
        setJobs(prev => prev.map(job => (job.id === jobId ? { ...job, ...updatedJob } : job)));
        addToast('Job details updated!', 'success');
      } catch(err: any) {
        addToast(err.message || 'Failed to update job.', 'error');
      }
  };

  const toggleSaveJob = (jobId: string) => {
      // This remains a client-side operation as we don't have a backend mechanism for it yet.
      setJobs(prev => prev.map(job => {
          if (job.id === jobId) {
              const newSavedStatus = !job.isSaved;
              addToast(newSavedStatus ? 'Job saved!' : 'Job unsaved.', 'info');
              return { ...job, isSaved: newSavedStatus };
          }
          return job;
      }));
  };

  return (
    <JobContext.Provider value={{ jobs, isLoading, error, createJob, updateJob, toggleSaveJob }}>
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
