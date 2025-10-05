// FIX: Populated the empty constants.ts file with mock data.
import { User, UserRole, Job, Application, Message, Notification, ActivityLog, Cooperative, Punishment, LoanInvestment, LoanApplication } from './types';

export const USERS: User[] = [
  { id: 'user1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', skills: ['Financial Analysis', 'Microsoft Excel', 'Accounting', 'Team Leadership'], savingsBalance: 85000, cooperativeShare: 125000 },
  { id: 'user2', name: 'Jean-Claude D.', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2', savingsBalance: 500000 },
  { id: 'user3', name: 'Admin Kazi', email: 'admin@kazicoop.com', role: UserRole.COOP_ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
  { id: 'user4', name: 'Kwame Nkrumah', email: 'kwame@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', skills: ['Graphic Design', 'Adobe Creative Suite', 'Branding'], savingsBalance: 42000, cooperativeShare: 50000 },
  { id: 'user5', name: 'Samuel M.', email: 'samuel@example.com', role: UserRole.COOP_ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user5' },
];

export const JOBS: Job[] = [
    {
        id: 'job1',
        title: 'Frontend Developer',
        company: 'TechSolutions Ltd.',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        salary: 'RWF 1,500,000 - 2,000,000',
        salaryMin: 1500000,
        salaryMax: 2000000,
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the ‘client-side’ of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
    },
    {
        id: 'job2',
        title: 'Accountant',
        company: 'Kigali Financials',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        salary: 'RWF 800,000 - 1,200,000',
        salaryMin: 800000,
        salaryMax: 1200000,
        description: 'Seeking a detail-oriented Accountant to manage financial transactions, from fixed payments and variable expenses to bank deposits and budgets. If you have an Accounting degree and are familiar with procedures like tax management and cost accounting, we’d like to meet you.',
        skills: ['QuickBooks', 'Financial Reporting', 'Tax Preparation', 'Auditing'],
    },
    {
        id: 'job3',
        title: 'Marketing Manager',
        company: 'Creative Minds Inc.',
        location: 'Remote',
        type: 'Contract',
        salary: 'RWF 1,000,000',
        salaryMin: 1000000,
        salaryMax: 1000000,
        description: 'We are looking for a Marketing Manager to take ownership of our marketing strategy. This includes social media management, content creation, and campaign analysis.',
        skills: ['SEO', 'Content Marketing', 'Social Media', 'Google Analytics'],
    },
];

export const APPLICATIONS: Application[] = [
    { id: 'app1', jobId: 'job1', userId: 'user1', status: 'Interviewing', matchScore: 92 },
    { id: 'app2', jobId: 'job1', userId: 'user4', status: 'Pending', matchScore: 78 },
    { id: 'app3', jobId: 'job2', userId: 'user1', status: 'Offered', matchScore: 85 },
];

export const MESSAGES: Message[] = [
    { id: 'msg1', senderId: 'user1', receiverId: 'user2', text: 'Hello! I am interested in the Frontend Developer position.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'msg2', senderId: 'user2', receiverId: 'user1', text: 'Hi Aline, thanks for reaching out. We are reviewing applications and will get back to you soon.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'msg3', senderId: 'user4', receiverId: 'user2', text: 'Good day, is the Marketing Manager role still open?', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 1, message: 'Your application for Frontend Developer was viewed.', date: '2 hours ago', read: false },
    { id: 2, message: 'New job matched: Accountant at Kigali Financials.', date: '1 day ago', read: false },
    { id: 3, message: 'Welcome to KaziCoop!', date: '3 days ago', read: true },
];

export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'log1', type: 'NEW_MEMBER', description: 'Kwame Nkrumah joined KaziCoop.', timestamp: new Date().toISOString() },
    { id: 'log2', type: 'NEW_JOB', description: 'Creative Minds Inc. posted a new job for Marketing Manager.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'log3', type: 'SAVINGS_GOAL', description: 'TechSolutions Innovators Circle reached their savings goal.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'log4', type: 'LARGE_DEPOSIT', description: 'Aline Umutoni made a large deposit of RWF 50,000.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export const COOPERATIVES: Cooperative[] = [
    { id: 'coop1', name: 'TechSolutions Innovators Circle', type: 'Corporate', creatorId: 'user2', members: ['user1', 'user4', 'user5'], totalSavings: 5250000, goal: "Purchase new laptops for all members", goalProgress: 68},
    { id: 'coop2', name: 'Kigali Artisans Guild', type: 'Community', members: ['user1', 'user3', 'user4'], totalSavings: 1200000, goal: "Open a shared workshop", goalProgress: 45},
];

export const PUNISHMENTS: Punishment[] = [
    { id: 'pun1', userId: 'user1', cooperativeId: 'coop1', reason: 'Late Contribution (July)', amount: 5000, dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending' }
];

export const LOAN_INVESTMENTS: LoanInvestment[] = [
    { id: 'li1', lenderId: 'user1', borrowerId: 'user4', amount: 50000, interestRate: 8, term: 6, status: 'Active', nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()}
];

export const LOAN_APPLICATIONS: LoanApplication[] = [
    { id: 'la1', userId: 'user1', cooperativeId: 'coop1', amount: 250000, purpose: 'Small Business Startup', repaymentPeriod: 12, status: 'Pending', requestDate: new Date().toISOString() },
    { id: 'la2', userId: 'user1', cooperativeId: 'coop1', amount: 50000, purpose: 'Emergency Medical Bills', repaymentPeriod: 6, status: 'Approved', requestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'la3', userId: 'user1', cooperativeId: 'coop1', amount: 100000, purpose: 'Home Improvement', repaymentPeriod: 12, status: 'Rejected', requestDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 24.0 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 28.9 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 35.2 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 40.1 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 42.6 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 48.3 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 55.7 },
];
