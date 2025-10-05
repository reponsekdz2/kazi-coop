import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Application } from '../types';
import { APPLICATIONS } from '../constants';
import { useToast } from './ToastContext';

interface ApplicationContextType {
  applications: Application[];
  applyForJob: (jobId: string, userId: string) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const { addToast } = useToast();

  const applyForJob = (jobId: string, userId: string) => {
    const newApplication: Application = {
        id: `app-${new Date().getTime()}`,
        userId,
        jobId,
        submissionDate: new Date().toISOString(),
        status: 'Applied',
    };
    setApplications(prev => [...prev, newApplication]);
    addToast("Application submitted successfully!", "success");
  };
  
  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
      addToast("Application status updated.", "info");
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