
// FIX: Defined UserRole enum directly in this file to resolve export errors across the app.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
}

export interface SeekerProfileData {
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  educationLevel: 'High School' | 'Diploma' | 'Bachelors' | 'Masters' | 'PhD';
  fieldOfStudy: string;
  yearsOfExperience: number;
  resumeUrl: string;
  profileImage: string;
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
  profileData?: SeekerProfileData;
  notificationSettings?: {
    jobAlerts: boolean;
    messageAlerts: boolean;
    coopUpdates: boolean;
  };
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
  title: string;
  companyId: string;
  employerId: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
  status: 'Open' | 'Closed';
  isSaved: boolean;
  salary?: number;
  workersNeeded?: number;
  rating?: number;
  imageUrl?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  submissionDate: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  applicantInfo: SeekerProfileData;
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

export type TransactionCategory = 'Income' | 'Withdrawal' | 'Transfer' | 'Cooperative' | 'Groceries' | 'Utilities' | 'Loan Repayment';
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
  deadline: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  budgetAmount: number;
}

export interface CooperativeMember {
  userId: string;
  joinDate: string;
  totalContribution: number;
  lastContributionDate?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Repaid';
  repaymentDueDate: string;
}

export interface Cooperative {
  id: string;
  name: string;
  creatorId: string;
  description: string;
  contributionAmount: number;
  contributionFrequency: 'Weekly' | 'Monthly';
  members: CooperativeMember[];
  walletBalance: number;
  loans: Loan[];
  rulesAndRegulations: string;
  announcements: { id: string, message: string, date: string }[];
  joinRequests: { userId: string, date: string }[];
}

export interface Repayment {
  amount: number;
  date: string;
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
  repayments: Repayment[];
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
    type: 'NEW_MEMBER' | 'NEW_JOB' | 'SAVINGS_GOAL' | 'LARGE_DEPOSIT';
    description: string;
    timestamp: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
    avatarUrl: string;
}