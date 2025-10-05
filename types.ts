
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
  cooperativeIds?: string[];
  careerProgress?: number;
  careerGoal?: string;
  completedModuleIds?: string[];
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
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Offered' | 'Rejected';
  matchScore: number; // Percentage
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


export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'payment' | 'loan';
    description: string;
    amount: number;
    date: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
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
  id: string;
  userId: string;
  cooperativeId: string;
  amount: number;
  remainingAmount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';
  repaymentSchedule: RepaymentInstallment[];
  repayments: Repayment[];
}