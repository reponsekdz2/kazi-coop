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
  savingsBalance?: number;
  cooperativeShare?: number;
  careerProgress?: number;
  skills?: string[];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Part-time'
  description: string;
  skills: string[];
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface Application {
  id: number;
  jobId: number;
  userId: string;
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Offered' | 'Rejected';
  matchScore: number;
}

export interface Message {
  id: number;
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

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'loan_repayment' | 'contribution';
  amount: number;
  date: string;
  description: string;
}

export interface Cooperative {
    id: string;
    name: string;
    members: number;
    totalSavings: number;
    loanPool: number;
    logoUrl: string;
}

export interface Loan {
    id: number;
    userId: string;
    amount: number;
    interestRate: number;
    status: 'Pending' | 'Approved' | 'Paid';
    repaymentProgress: number;
    dueDate: string;
}

export interface ActivityLog {
  id: number;
  type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
  description: string;
  timestamp: string;
}
