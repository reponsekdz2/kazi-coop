// FIX: Defined UserRole enum to resolve a circular dependency where the file was importing from itself.
export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer',
  ADMIN = 'Admin',
}

export interface UserDocument {
    id: string;
    name: string;
    fileUrl: string; // In a real app, this would be a URL to the stored file
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  skills?: string[];
  cooperativeIds?: string[];
  careerProgress?: number;
  careerGoal?: string;
  completedModuleIds?: string[];
  documents?: UserDocument[];
}

export interface RequiredDocument {
    name: string;
    required: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // e.g., Full-time, Part-time
  description: string;
  skills: string[];
  salary: string;
  salaryMin: number;
  salaryMax: number;
  requiredEducation: string;
  requiredExperience: number; // in years
  requiredDocuments: RequiredDocument[];
}

export interface SubmittedDocument {
    name: string;
    fileUrl: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Offered' | 'Rejected';
  matchScore: number; // Percentage
  submittedDocuments: SubmittedDocument[];
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
    title: string;
    description: string;
    relevantGoal: string; // matches user's careerGoal
    moduleIds: string[];
}

export interface CooperativeJoinRequest {
    userId: string;
    status: 'pending';
}

export interface Contributor {
    id: string;
    name: string;
    avatarUrl: string;
    amount: number;
}

export interface CooperativeMessage {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface CooperativeActivity {
    id: string;
    cooperativeId: string;
    type: 'NEW_MEMBER' | 'LOAN_APPROVED' | 'GOAL_REACHED' | 'NEW_MEETING' | 'NEW_ELECTION';
    description: string;
    timestamp: string;
}

export interface Meeting {
    id: string;
    cooperativeId: string;
    title: string;
    description: string;
    date: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ElectionOption {
    id: string;
    text: string;
    votes: number;
}
export interface Election {
    id: string;
    cooperativeId: string;
    title: string;
    description: string;
    options: ElectionOption[];
    status: 'Active' | 'Closed';
    votedUserIds: string[];
}

export interface Cooperative {
    id: string;
    name: string;
    members: number;
    totalSavings: number;
    loanPool: number;
    creator: string;
    creatorId: string;
    imageUrl: string;
    joinRequests?: CooperativeJoinRequest[];
    communityGoal?: string;
    goalAmount?: number;
    goalProgress?: number;
    topContributors?: Contributor[];
    loansDisbursed?: number;
    profit?: number;
    messages?: CooperativeMessage[];
    activities?: CooperativeActivity[];
    meetings?: Meeting[];
    elections?: Election[];
}

export interface CooperativeBudget {
    id: string;
    cooperativeId: string;
    allocations: { category: string, amount: number }[];
}

export interface CooperativeTransaction {
    id: string;
    cooperativeId: string;
    description: string;
    amount: number;
    type: 'contribution' | 'loan_disbursement' | 'expense' | 'investment_return';
    date: string;
}

export type TransactionCategory = 'Salary' | 'Contribution' | 'Rent' | 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Utilities' | 'Other';

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'payment' | 'loan';
    description: string;
    amount: number;
    date: string;
    category: TransactionCategory;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Budget {
    id: string;
    category: TransactionCategory;
    budgetAmount: number;
}

export interface Repayment {
    amount: number;
    date: string;
}

export interface RepaymentInstallment {
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid';
}

export interface LoanApplication {
  id:string;
  userId: string;
  cooperativeId: string;
  amount: number;
  interestRate: number; // Annual percentage rate
  remainingAmount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
  repaymentSchedule: RepaymentInstallment[];
  repayments: Repayment[];
}