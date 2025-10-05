// FIX: Populated the empty constants.ts file with mock data.
import { User, UserRole, Job, Application, Message, Notification, ActivityLog } from './types';

export const USERS: User[] = [
  { id: 'user1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', skills: ['Financial Analysis', 'Microsoft Excel', 'Accounting', 'Team Leadership'] },
  { id: 'user2', name: 'Jean-Claude D.', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
  { id: 'user3', name: 'Admin Kazi', email: 'admin@kazicoop.com', role: UserRole.COOP_ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
  { id: 'user4', name: 'Kwame Nkrumah', email: 'kwame@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', skills: ['Graphic Design', 'Adobe Creative Suite', 'Branding'] },
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
