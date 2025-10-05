
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
  careerProgress?: number;
  careerGoal?: string;
  completedModuleIds?: string[];
  // Employer-specific fields
  companyName?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoUrl: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Part-time'
  salary: string;
  description: string;
  requirements: string[];
  employerId: string;
  matchScore?: number;
  requiredDocuments?: string[];
  requiredSkills?: string[];
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

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  userId: string;
  date: string;
  type: 'Online' | 'In-Person';
}

export interface CooperativeMessage {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    timestamp: string;
    text: string;
}

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  totalSavings: number;
  loanPoolAmount: number;
  coverImageUrl: string;
  goal: string;
  goalProgress: number;
  messages: CooperativeMessage[];
}

export enum CooperativeActivityType {
  NEW_MEMBER = 'NEW_MEMBER',
  LOAN_APPROVED = 'LOAN_APPROVED',
  GOAL_REACHED = 'GOAL_REACHED',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  CONTRIBUTION = 'CONTRIBUTION'
}

export interface CooperativeActivity {
  id: string;
  cooperativeId: string;
  timestamp: string;
  type: CooperativeActivityType;
  description: string;
  actorUserId?: string;
  amount?: number; 
}


export interface Message {
  id: string;
  senderId: string;
  receiverId:string;
  text: string;
  timestamp: string;
}

export type TransactionCategory = 'Income' | 'Utilities' | 'Groceries' | 'Transport' | 'Entertainment' | 'Loan Repayment' | 'Savings Contribution' | 'Business';

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number; // positive for income, negative for expense
  category: TransactionCategory;
}

export interface SavingsGoal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Budget {
    id: string;
    userId: string;
    category: TransactionCategory;
    budgetAmount: number;
}

export interface RepaymentInstallment {
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  interestRate: number; // percentage
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
    coverImageUrl: string;
    duration: string;
    content: {
        summary: string;
        videoUrl?: string;
        articleText?: string;
        keyTakeaways: string[];
    };
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    relevantGoal: string;
    moduleIds: string[];
}

export interface ActivityLog {
    id: string;
    timestamp: string;
    type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
    description: string;
}