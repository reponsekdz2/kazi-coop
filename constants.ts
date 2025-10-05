import { User, UserRole, Job, Application, Message, Notification, Transaction, Cooperative, Loan, ActivityLog } from './types';

export const USERS: User[] = [
  { id: 'user1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', savingsBalance: 150000, cooperativeShare: 250000, careerProgress: 3, skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'] },
  { id: 'user2', name: 'Jean-Claude D.', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
  { id: 'user3', name: 'Fatima N.', email: 'fatima@example.com', role: UserRole.COOP_ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
  { id: 'user4', name: 'David K.', email: 'david@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', savingsBalance: 80000, cooperativeShare: 120000, careerProgress: 2 },
  { id: 'user5', name: 'Samuel M.', email: 'samuel@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user5', savingsBalance: 220000, cooperativeShare: 350000, careerProgress: 5 },
];

export const JOBS: Job[] = [
  { id: 1, title: 'Senior Accountant', company: 'Kigali Financials', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Detailed job description for a Senior Accountant...', skills: ['CPA', 'QuickBooks', 'Financial Reporting'], salary: 'RWF 1,200,000 - 1,500,000', salaryMin: 1200000, salaryMax: 1500000 },
  { id: 2, title: 'React Native Developer', company: 'Mobile Innovations', location: 'Remote', type: 'Contract', description: 'We are looking for an experienced React Native developer...', skills: ['React Native', 'TypeScript', 'Firebase', 'GraphQL'], salary: 'RWF 1,800,000 - 2,200,000', salaryMin: 1800000, salaryMax: 2200000 },
  { id: 3, title: 'Marketing Manager', company: 'Go! Rwanda', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Lead our marketing team to new heights...', skills: ['SEO', 'Content Marketing', 'Social Media'], salary: 'RWF 900,000 - 1,100,000', salaryMin: 900000, salaryMax: 1100000 },
  { id: 4, title: 'Data Analyst', company: 'Insight Analytics', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Analyze large datasets to provide actionable insights...', skills: ['SQL', 'Python', 'Tableau', 'Power BI'], salary: 'RWF 1,000,000 - 1,300,000', salaryMin: 1000000, salaryMax: 1300000 },
];

export const APPLICATIONS: Application[] = [
  { id: 1, jobId: 2, userId: 'user1', status: 'Interviewing', matchScore: 92 },
  { id: 2, jobId: 2, userId: 'user4', status: 'Pending', matchScore: 78 },
  { id: 3, jobId: 1, userId: 'user5', status: 'Reviewed', matchScore: 85 },
];

export const MESSAGES: Message[] = [
  { id: 1, senderId: 'user2', receiverId: 'user1', text: 'Hi Aline, we were very impressed with your profile for the React Native position. Are you available for a quick chat tomorrow?', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, senderId: 'user1', receiverId: 'user2', text: 'Hello Jean-Claude! Thank you. Yes, I am available tomorrow. What time works best for you?', timestamp: new Date(Date.now() - 86000000).toISOString() },
  { id: 3, senderId: 'user4', receiverId: 'user5', text: 'Hey Samuel, did you see the new Data Analyst role at Insight Analytics?', timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, message: 'Your application for React Native Developer was viewed by Mobile Innovations.', date: '2 hours ago', read: false },
  { id: 2, message: 'You have a new message from Jean-Claude D.', date: '1 day ago', read: false },
  { id: 3, message: 'Welcome to KaziCoop! Complete your profile to get started.', date: '3 days ago', read: true },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 1, type: 'deposit', amount: 25000, date: '2024-08-14', description: 'Co-op Contribution' },
    { id: 2, type: 'withdrawal', amount: 10000, date: '2024-08-12', description: 'Mobile Airtime' },
    { id: 3, type: 'deposit', amount: 500000, date: '2024-08-01', description: 'Salary - July' },
    { id: 4, type: 'transfer', amount: 20000, date: '2024-07-28', description: 'Sent to Samuel M.' },
];

export const COOPERATIVES: Cooperative[] = [
    { id: 'coop1', name: 'TechSolutions Innovators Circle', members: 15, totalSavings: 12500000, loanPool: 5000000, logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: 'coop2', name: 'Kigali Creatives Fund', members: 25, totalSavings: 28000000, loanPool: 12000000, logoUrl: 'https://cdn-icons-png.flaticon.com/512/993/993739.png' },
];

export const LOANS: Loan[] = [
    { id: 1, userId: 'user1', amount: 500000, interestRate: 5, status: 'Approved', repaymentProgress: 25, dueDate: '2024-12-31' },
];

export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 1, type: 'NEW_MEMBER', description: 'David K. joined the platform.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, type: 'NEW_JOB', description: 'Go! Rwanda posted a new job: Marketing Manager.', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, type: 'SAVINGS_GOAL', description: 'Aline U. is 68% towards their savings goal.', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, type: 'LARGE_DEPOSIT', description: 'Samuel M. deposited RWF 100,000 into their co-op share.', timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 10.5 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 12.2 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 15.8 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 18.1 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 20.3 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 22.9 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 25.0 },
];
