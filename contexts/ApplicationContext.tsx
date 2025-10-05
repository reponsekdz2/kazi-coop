import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Application } from '../types';
import { APPLICATIONS } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface ApplicationContextType {
  applications: Application[];
  applyForJob: (jobId: string, matchScore: number) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const { addToast } = useToast();

  const applyForJob = (jobId: string, matchScore: number) => {
    if (!user) {
        addToast('You must be logged in to apply.', 'error');
        return;
    }

    if (applications.some(app => app.jobId === jobId && app.userId === user.id)) {
        addToast('You have already applied for this job.', 'info');
        return;
    }

    const newApplication: Application = {
      id: `app-${new Date().getTime()}`,
      userId: user.id,
      jobId,
      status: 'Applied',
      matchScore,
      submissionDate: new Date().toISOString(),
      // FIX: Add required statusHistory property
      statusHistory: [{ status: 'Applied', date: new Date().toISOString() }],
    };

    setApplications(prev => [newApplication, ...prev]);
    addToast('Application submitted successfully!', 'success');
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === applicationId) {
          // Prevent adding duplicate history entry if status is unchanged
          if (app.status === status) return app;
          
          const newHistoryEntry = { status, date: new Date().toISOString() };
          return {
            ...app,
            status,
            // FIX: Update statusHistory along with status
            statusHistory: [...app.statusHistory, newHistoryEntry],
          };
        }
        return app;
      })
    );
    addToast('Applicant status updated successfully!', 'success');
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
