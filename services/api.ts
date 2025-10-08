
import { JOBS, APPLICATIONS, COOPERATIVES } from '../constants';
import { Job, Application, Cooperative, ApplicantInfo } from '../types';

const MOCK_DELAY = 500;

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data stores to simulate a backend database
let jobsStore: Job[] = [...JOBS];
let applicationsStore: Application[] = [...APPLICATIONS];
let cooperativesStore: Cooperative[] = [...COOPERATIVES];

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    await delay(MOCK_DELAY);
    console.log(`[API MOCK] GET: ${endpoint}`);
    if (endpoint === '/jobs') {
      return jobsStore as unknown as T;
    }
    if (endpoint === '/applications') {
      // In a real app, this would be filtered by user ID on the backend
      return applicationsStore as unknown as T;
    }
    if (endpoint === '/cooperatives') {
      return cooperativesStore as unknown as T;
    }
    throw new Error(`[API MOCK] Unknown GET endpoint: ${endpoint}`);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    await delay(MOCK_DELAY);
    console.log(`[API MOCK] POST: ${endpoint}`, data);
    if (endpoint === '/jobs') {
      const newJob: Job = {
        id: `j-${Date.now()}`,
        employerId: 'u-3', // Mock employerId
        isSaved: false,
        ...data,
      };
      jobsStore = [newJob, ...jobsStore];
      return newJob as unknown as T;
    }
     if (endpoint === '/applications') {
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        userId: 'u-1', // Mock userId
        status: 'Applied',
        submissionDate: new Date().toISOString(),
        ...data
      };
      applicationsStore = [newApplication, ...applicationsStore];
      return newApplication as unknown as T;
    }
    if (endpoint.match(/\/cooperatives\/(.*)\/join/)) {
        // Simulate joining, no data change for now
        return { success: true } as unknown as T;
    }
    throw new Error(`[API MOCK] Unknown POST endpoint: ${endpoint}`);
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    await delay(MOCK_DELAY);
    console.log(`[API MOCK] PUT: ${endpoint}`, data);
    const jobIdMatch = endpoint.match(/\/jobs\/(.*)/);
    if (jobIdMatch) {
      const jobId = jobIdMatch[1];
      let updatedJob: Job | undefined;
      jobsStore = jobsStore.map(job => {
        if (job.id === jobId) {
          updatedJob = { ...job, ...data };
          return updatedJob;
        }
        return job;
      });
      if (updatedJob) return updatedJob as unknown as T;
      throw new Error(`Job with id ${jobId} not found`);
    }

    const appStatusMatch = endpoint.match(/\/applications\/(.*)\/status/);
    if (appStatusMatch) {
        const appId = appStatusMatch[1];
        let updatedApp: Application | undefined;
        applicationsStore = applicationsStore.map(app => {
            if (app.id === appId) {
                updatedApp = { ...app, status: data.status };
                return updatedApp;
            }
            return app;
        });
        if (updatedApp) return updatedApp as unknown as T;
        throw new Error(`Application with id ${appId} not found`);
    }

     const approveMemberMatch = endpoint.match(/\/cooperatives\/(.*)\/members\/(.*)\/approve/);
    if (approveMemberMatch) {
        // Simulate approval, no data change for now
        return { success: true } as unknown as T;
    }
    
    throw new Error(`[API MOCK] Unknown PUT endpoint: ${endpoint}`);
  },
};

export default api;
