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

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number; // in months
  status: 'Pending' | 'Approved' | 'Rejected';
}
