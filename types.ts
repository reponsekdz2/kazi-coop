// FIX: Populated the empty types.ts file with necessary type definitions.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
  COOP_ADMIN = 'Co-op Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  skills?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  skills: string[];
}

export interface Application {
    id: string;
    jobId: string;
    userId: string;
    status: 'Pending' | 'Interviewing' | 'Offered' | 'Rejected';
    matchScore: number;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
}

export interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

export interface ActivityLog {
    id: string;
    type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
    description: string;
    timestamp: string;
}
