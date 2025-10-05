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
  savingsBalance?: number;
  cooperativeShare?: number;
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

export interface Cooperative {
    id: string;
    name: string;
    creatorId?: string;
    type: 'Community' | 'Corporate';
    members: string[]; // array of user IDs
    totalSavings: number;
    goal: string;
    goalProgress: number;
}

export interface Punishment {
    id: string;
    userId: string;
    cooperativeId: string;
    reason: string;
    amount: number;
    dueDate: string;
    status: 'Pending' | 'Paid';
}

export interface LoanInvestment {
    id: string;
    lenderId: string; // The user who is lending money
    borrowerId: string;
    amount: number;
    interestRate: number; // e.g., 5 for 5%
    term: number; // in months
    status: 'Active' | 'Paid Off';
    nextPaymentDate: string;
}

export interface LoanApplication {
    id: string;
    userId: string;
    cooperativeId: string;
    amount: number;
    purpose: string;
    repaymentPeriod: number; // in months
    status: 'Pending' | 'Approved' | 'Rejected';
    requestDate: string;
}

export interface Budget {
    category: string;
    allocated: number;
    spent: number;
}
