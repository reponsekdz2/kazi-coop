// FIX: Define all necessary types for the application.
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
  cooperativeId?: string;
  cooperativeStatus?: 'Member' | 'Pending' | 'None';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  skills: string[];
  salary: string;
}

export interface Application {
    id: string;
    jobId: string;
    userId: string;
    status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
    matchScore: number;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Cooperative {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    members: User[];
    savings: number;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number; // positive for deposit, negative for withdrawal
    date: string; // ISO string
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string; // ISO string
}

export interface Notification {
    id: number;
    message: string;
    date: string;
    read: boolean;
}

export interface InvestmentPod {
  id: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  apy: number; // Annual Percentage Yield
  description: string;
  performanceData: { month: string; value: number }[];
}

export interface LoanOffer {
  id: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  purpose: string;
  fundedAmount: number;
}
