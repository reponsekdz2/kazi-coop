
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Application, ApplicantInfo, UserRole } from '../types';
import { APPLICATIONS } from '../constants';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface ApplicationContextType {
  applications: Application[];
  applyForJob: (jobId: string, applicantInfo: ApplicantInfo) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allApplications, setAllApplications] = useState<Application[]>(APPLICATIONS);

  const applications = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.SEEKER) {
      return allApplications.filter(app => app.userId === user.id);
    }
    // For employers, we'd filter by jobs they own. For this mock, we show all.
    return allApplications;
  }, [user, allApplications]);

  const applyForJob = (jobId: string, applicantInfo: ApplicantInfo) => {
    if (!user) return;
    const newApplication: Application = {
      id: `app-${new Date().getTime()}`,
      jobId,
      userId: user.id,
      status: 'Applied',
      submissionDate: new Date().toISOString(),
      applicantInfo,
    };
    setAllApplications(prev => [newApplication, ...prev]);
    addToast('Application submitted successfully!', 'success');
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setAllApplications(prev => prev.map(app => (app.id === applicationId ? { ...app, status } : app)));
    addToast(`Application status updated to ${status}`, 'info');
  };

  return (
    <ApplicationContext.Provider value={{ applications, applyForJob, updateApplicationStatus }}>
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
