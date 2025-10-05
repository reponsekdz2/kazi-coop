
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
  careerGoal?: string;
  completedModuleIds?: string[];
  careerProgress?: number;
  skills?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  longDescription: string;
  skills: string[];
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryRange: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Offered' | 'Rejected';
  matchScore: number;
  submissionDate: string;
  statusHistory: { status: Application['status']; date: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export type TransactionCategory =
  | 'Salary'
  | 'Utilities'
  | 'Groceries'
  | 'Transport'
  | 'Entertainment'
  | 'Loan Repayment'
  | 'Savings Contribution'
  | 'Business'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for income, negative for expense
  category: TransactionCategory;
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  budgetAmount: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface RepaymentInstallment {
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface LoanApplication {
  id: string;
  userId: string;
  purpose: string;
  amount: number;
  interestRate: number;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
  remainingAmount: number;
  repaymentSchedule: RepaymentInstallment[];
  repayments: { amount: number; date: string }[];
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'article';
  duration: string;
  coverImageUrl: string;
  content: {
    summary: string;
    videoUrl?: string;
    articleText?: string;
    keyTakeaways: string[];
  };
}

export interface LearningPath {
  id: string;
  name: string;
  relevantGoal: string;
  moduleIds: string[];
}

export interface Cooperative {
    id: string;
    name: string;
    description: string;
    members: string[]; // array of user IDs
    totalSavings: number;
    loanPool: number;
    avatarUrl: string;
}

export interface Interview {
    id: string;
    jobId: string;
    userId: string;
    date: string;
    type: 'Online' | 'In-Person';
    status: 'Scheduled' | 'Completed' | 'Canceled';
}

export interface ActivityLog {
    id: string;
    type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
    description: string;
    timestamp: string;
}
