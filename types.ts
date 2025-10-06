
// FIX: Created types.ts to define all shared TypeScript interfaces and types.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  skills?: string[];
  careerProgress?: number;
  notificationSettings?: {
    jobAlerts: boolean;
    messageAlerts: boolean;
    coopUpdates: boolean;
  }
}

export interface Company {
  id: string;
  name:string;
  description: string;
  industry: string;
  location: string;
}

export interface Job {
  id: string;
  employerId: string;
  companyId: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  isSaved: boolean;
  status?: 'Open' | 'Closed';
  salary?: number;
  workersNeeded?: number;
  rating?: number;
  imageUrl?: string;
}

export interface ApplicantInfo {
  educationLevel: string;
  fieldOfStudy: string;
  yearsOfExperience: number;
  resumeUrl: string | null;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'Pending Review' | 'Applied' | 'Reviewed' | 'Interviewing' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  submissionDate: string;
  applicantInfo: ApplicantInfo;
}

export interface Interview {
  id: string;
  jobId: string;
  userId: string;
  date: string;
  type: 'Phone Screen' | 'Technical' | 'On-site' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Canceled';
  details?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  interestRate: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Repaid';
  requestDate: string;
  approvalDate?: string;
}
export interface CooperativeMember {
    userId: string;
    joinDate: string;
    status: 'pending_approval' | 'awaiting_agreement' | 'active' | 'inactive';
    totalContribution: number;
    lastContributionDate: string | null;
    penalties: number;
}
export interface Cooperative {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: CooperativeMember[];
  contributionAmount: number;
  contributionFrequency: 'Weekly' | 'Monthly';
  nextContributionDate: string;
  initialContribution: number;
  totalSavings: number;
  totalLoans: number;
  rulesAndRegulations: string;
  loans: Loan[];
  announcements: { id: string, message: string, date: string }[];
}

export type TransactionCategory =
  | 'Income'
  | 'Transfer'
  | 'Withdrawal'
  | 'Savings'
  | 'Loan Repayment'
  | 'Groceries'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Other';

export type PaymentProvider = 'Mobile Money' | 'PayPal' | 'Bank Transfer';

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  provider: PaymentProvider;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: 'active' | 'completed';
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  budgetAmount: number;
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
  cooperativeId: string;
  amount: number;
  reason: string;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
  remainingAmount: number;
  repaymentSchedule: RepaymentInstallment[];
  repayments: { amount: number, date: string }[];
}

export interface ActivityLog {
  id: string;
  type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
  description: string;
  timestamp: string;
}

export interface Notification extends ActivityLog {
    read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
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
  quiz?: QuizQuestion[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
}