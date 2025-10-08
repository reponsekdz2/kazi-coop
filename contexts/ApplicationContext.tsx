import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Application, ApplicantInfo, UserRole } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../services/api';

interface ApplicationContextType {
  applications: Application[];
  isLoading: boolean;
  applyForJob: (jobId: string, applicantInfo: ApplicantInfo) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
        if (!user) {
            setApplications([]);
            setIsLoading(false);
            return;
        };
        try {
            setIsLoading(true);
            let fetchedApps: Application[] = [];
            if(user.role === UserRole.SEEKER) {
                fetchedApps = await api.get<Application[]>('/applications');
            } else {
                // For employers, we could fetch all applications for their jobs.
                // This would require a different endpoint, e.g., /api/applications/employer
                // For now, we'll just show an empty list for simplicity.
            }
            setApplications(fetchedApps);
        } catch (err) {
            addToast('Failed to load applications.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    fetchApplications();
  }, [user, addToast]);

  const applyForJob = async (jobId: string, applicantInfo: ApplicantInfo) => {
    if (!user) return;
    try {
        const newApplication = await api.post<Application>('/applications', { jobId, applicantInfo });
        setApplications(prev => [newApplication, ...prev]);
        addToast('Application submitted successfully!', 'success');
    } catch(err: any) {
        addToast(err.message || 'Failed to submit application.', 'error');
        throw err;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
        const updatedApplication = await api.put<Application>(`/applications/${applicationId}/status`, { status });
        setApplications(prev => prev.map(app => (app.id === applicationId ? updatedApplication : app)));
        addToast(`Application status updated to ${status}`, 'info');
    } catch (err: any) {
        addToast(err.message || 'Failed to update status.', 'error');
    }
  };

  return (
    <ApplicationContext.Provider value={{ applications, isLoading, applyForJob, updateApplicationStatus }}>
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
