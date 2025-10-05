export enum UserRole {
  SEEKER = 'Seeker',
  EMPLOYER = 'Employer',
  COOP_ADMIN = 'Cooperative Admin',
  APP_ADMIN = 'App Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  profile: {
    title?: string;
    company?: string;
    bio: string;
    skills?: string[];
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  postedDate: string;
  employerId: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: 'Pending' | 'Interviewing' | 'Offered' | 'Rejected';
  appliedDate: string;
}

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  totalSavings: number;
  totalLoans: number;
  membersCount: number;
}

export interface MemberContribution {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  type: 'Contribution' | 'Loan Repayment' | 'Penalty';
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Payment' | 'Loan';
  amount: number;
  date: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'guide';
  duration: string;
  thumbnailUrl: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Interview {
  id: string;
  jobId: string;
  seekerId: string;
  date: string;
  time: string;
  type: 'Online' | 'In-Person';
  status: 'Scheduled' | 'Completed' | 'Canceled';
}