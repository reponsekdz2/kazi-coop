import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Application, SubmittedDocument, User } from '../types';
import { APPLICATIONS, USERS } from '../constants';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface ApplicationContextType {
  applications: Application[];
  users: User[]; // To get applicant details
  applyForJob: (jobId: string, submittedDocuments: SubmittedDocument[]) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const [users] = useState<User[]>(USERS);
  const { addToast } = useToast();

  const applyForJob = (jobId: string, submittedDocuments: SubmittedDocument[]) => {
    if (!user) {
        addToast('You must be logged in to apply.', 'error');
        return;
    }

    if(applications.some(app => app.jobId === jobId && app.userId === user.id)) {
        addToast('You have already applied for this job.', 'info');
        return;
    }

    const newApplication: Application = {
      id: `app-${new Date().getTime()}`,
      jobId,
      userId: user.id,
      status: 'Pending',
      matchScore: Math.floor(Math.random() * 20) + 75, // Random high match score
      submittedDocuments,
    };

    setApplications(prev => [newApplication, ...prev]);
    addToast('Application submitted successfully!', 'success');
  };

  return (
    <ApplicationContext.Provider value={{ applications, users, applyForJob }}>
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