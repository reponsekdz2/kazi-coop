// FIX: Removed circular import of 'UserRole' from './types' to resolve declaration conflicts.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  skills?: string[];
  careerProgress?: number; // A number from 0-5
  companyDetails?: {
    balance: number;
    totalPayouts: number;
    cooperativeInvestments: number;
    operationalBudget: { category: string; amount: number }[];
  }
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  requirements: string[];
  employerId: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  submissionDate: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Interview Scheduled' | 'Offered' | 'Rejected';
}

export interface Interview {
  id: string;
  userId: string;
  jobId: string;
  date: string;
  type: 'Phone Screen' | 'Technical' | 'On-site' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Canceled';
  details?: string;
}

export interface Contribution {
    userId: string;
    amount: number;
    date: string;
}

export interface CooperativeLoan {
  id: string;
  cooperativeId: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Repaid';
  applicationDate: string;
  approvalDate?: string;
  repayments: Repayment[];
  remainingAmount: number;
  repaymentPeriod: number; // in months
  interestRate: number; // annual percentage
  repaymentSchedule: RepaymentInstallment[];
}

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[]; // array of user IDs
  joinRequests: string[]; // array of user IDs with pending requests
  totalSavings: number;
  totalLoans: number;
  contributionSettings: {
      amount: number;
      frequency: 'Weekly' | 'Monthly';
  };
  loanSettings: {
    interestRate: number; // annual percentage rate
    maxLoanPercentage: number; // max % of total savings that can be loaned out
  };
  contributions: Contribution[];
  loans: CooperativeLoan[];
}

export type TransactionCategory =
  | 'Income'
  | 'Utilities'
  | 'Groceries'
  | 'Transport'
  | 'Entertainment'
  | 'Loan Repayment'
  | 'Savings Contribution'
  | 'Business'
  | 'Payouts'
  | 'Marketing'
  | 'Operations'
  | 'Investments'
  | 'Cooperative Contribution';

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number; // positive for income, negative for expense
  category: TransactionCategory;
}

export interface Repayment {
  date: string;
  amount: number;
}

export interface RepaymentInstallment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
  remainingAmount: number;
  repaymentSchedule: RepaymentInstallment[];
  repayments: Repayment[];
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface Budget {
  id:string;
  userId: string;
  category: TransactionCategory;
  budgetAmount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'article';
  duration: string;
  progress: number;
  content: {
    summary: string;
    videoUrl?: string;
    articleText?: string;
    keyTakeaways: string[];
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
  description: string;
}