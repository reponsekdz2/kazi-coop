
// FIX: Removed a circular import of `UserRole` from this file, which conflicted with the enum declaration below.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
}

export interface SeekerProfileData {
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    educationLevel?: 'High School' | 'Diploma' | 'Bachelors' | 'Masters' | 'PhD';
    fieldOfStudy?: string;
    yearsOfExperience?: number;
    resumeUrl?: string; // a simulated URL to a PDF/image
    profileImage?: string; // a simulated URL
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  skills?: string[];
  careerProgress?: number; // From 1 to 5
  careerGoal?: string; // New field for AI suggestions
  // Seeker specific
  profileData?: SeekerProfileData;
  // Employer specific
  companyId?: string;
}

export interface Company {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
}

export interface Job {
  id: string;
  employerId: string;
  companyId: string; // Changed from company: string
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  isSaved: boolean;
  status: 'Open' | 'Closed';
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  submissionDate: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  applicantInfo?: SeekerProfileData;
}

export interface Contribution {
    userId: string;
    amount: number;
    date: string;
}

export interface RepaymentInstallment {
    id: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid';
}

export interface CooperativeLoan {
    id: string;
    cooperativeId: string;
    userId: string;
    amount: number;
    purpose: string;
    repaymentPeriod: number; // in months
    interestRate: number; // annual percentage
    status: 'Pending' | 'Approved' | 'Rejected' | 'Repaid';
    applicationDate: string;
    approvalDate?: string;
    repayments: { date: string; amount: number }[];
    remainingAmount: number;
    repaymentSchedule: RepaymentInstallment[];
}

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  joinRequests: string[];
  totalSavings: number;
  totalLoans: number;
  contributionSettings: {
    amount: number;
    frequency: 'Weekly' | 'Monthly';
  };
  loanSettings: {
    interestRate: number; // annual percentage
    maxLoanPercentage: number;
  };
  contributions: Contribution[];
  loans: CooperativeLoan[];
  announcements: { text: string; date: string; }[];
}

export type TransactionCategory = 'Income' | 'Withdrawal' | 'Loan Repayment' | 'Savings' | 'Groceries' | 'Utilities' | 'Transport' | 'Transfer';

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

export interface LoanApplication {
    id: string;
    userId: string;
    amount: number;
    purpose: string;
    repaymentPeriod: number; // in months
    status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
    remainingAmount: number;
    repaymentSchedule: RepaymentInstallment[];
    repayments: { amount: number; date: string }[];
}

export interface Interview {
    id: string;
    userId: string;
    jobId: string;
    date: string;
    type: 'Phone Screen' | 'Technical' | 'On-site' | 'Final' | 'Video Call';
    status: 'Scheduled' | 'Completed' | 'Canceled' | 'Confirmed';
    details?: string;
}

export interface ActivityLog {
    id: string;
    type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
    description: string;
    timestamp: string;
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}
