import { User, UserRole, Job, Application, Message, LearningModule, Cooperative, Transaction, SavingsGoal, LoanApplication, CooperativeBudget, CooperativeTransaction, LearningPath } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Aline U.', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], cooperativeIds: ['coop-1', 'coop-3'], careerProgress: 3, careerGoal: 'Senior Frontend Developer', completedModuleIds: ['lm-1'] },
  { id: 'user-2', name: 'Jean-Claude D.', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2', skills: ['Management', 'Hiring'], cooperativeIds: ['coop-1'] },
  { id: 'user-3', name: 'Admin User', email: 'admin@example.com', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3', skills: ['System Administration'], cooperativeIds: ['coop-4'] },
  { id: 'user-4', name: 'Peter G.', email: 'peter@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', skills: ['Project Management', 'Agile', 'Scrum'], careerProgress: 1, careerGoal: 'Project Manager', completedModuleIds: [] },
  { id: 'user-5', name: 'Samuel M.', email: 'samuel@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user5', skills: ['UX/UI Design', 'Figma', 'Adobe XD'], cooperativeIds: ['coop-2', 'coop-1'], careerProgress: 5, careerGoal: 'Lead UX/UI Designer', completedModuleIds: ['lm-2', 'lm-3'] },
  { id: 'user-6', name: 'Grace K.', email: 'grace@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user6', skills: ['Marketing', 'SEO'], careerProgress: 2, cooperativeIds: ['coop-1'], completedModuleIds: [] },
];

export const JOBS: Job[] = [
  { id: 'job-1', title: 'Frontend Developer', company: 'TechSolutions Ltd.', location: 'Kigali, Rwanda', type: 'Full-time', description: 'We are looking for a skilled Frontend Developer to join our team...', skills: ['React', 'TypeScript', 'Next.js'], salary: 'RWF 1.2M - 1.5M', salaryMin: 1200000, salaryMax: 1500000 },
  { id: 'job-2', title: 'Project Manager', company: 'BuildIt Rwanda', location: 'Kigali, Rwanda', type: 'Contract', description: 'Seeking an experienced Project Manager to lead our new construction project...', skills: ['Agile', 'JIRA', 'Scrum'], salary: 'RWF 1.8M - 2.2M', salaryMin: 1800000, salaryMax: 2200000 },
  { id: 'job-3', title: 'UX/UI Designer', company: 'Creative Minds Inc.', location: 'Remote', type: 'Part-time', description: 'Creative Minds is looking for a talented designer to create amazing user experiences...', skills: ['Figma', 'User Research'], salary: 'RWF 800k - 1M', salaryMin: 800000, salaryMax: 1000000 },
  { id: 'job-4', title: 'Backend Developer', company: 'TechSolutions Ltd.', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Join our backend team to build scalable and robust services...', skills: ['Node.js', 'PostgreSQL', 'Docker'], salary: 'RWF 1.3M - 1.6M', salaryMin: 1300000, salaryMax: 1600000 },
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', jobId: 'job-1', userId: 'user-1', status: 'Interviewing', matchScore: 92 },
  { id: 'app-2', jobId: 'job-2', userId: 'user-4', status: 'Pending', matchScore: 85 },
  { id: 'app-3', jobId: 'job-1', userId: 'user-5', status: 'Rejected', matchScore: 65 },
  { id: 'app-4', jobId: 'job-3', userId: 'user-5', status: 'Offered', matchScore: 95 },
  { id: 'app-5', jobId: 'job-4', userId: 'user-1', status: 'Pending', matchScore: 78 },
];

export const MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, we were impressed with your application. Are you available for an interview next week?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Hi Jean-Claude, that\'s great news! Yes, I am available. What time works for you?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-3', senderId: 'user-5', receiverId: 'user-1', text: 'Hey, saw we are in the same coop, let\'s connect!', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export const ACTIVITY_LOG = [
  { id: 1, type: 'NEW_MEMBER', description: 'Aline U. joined KaziCoop.', timestamp: new Date().toISOString() },
  { id: 2, type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new Frontend Developer job.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 3, type: 'SAVINGS_GOAL', description: 'Samuel M. reached their savings goal for a new laptop.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 4, type: 'LARGE_DEPOSIT', description: 'Jean-Claude D. made a large deposit of RWF 200,000.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export const cooperativeFinancialsData = [
    { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 15.2 },
    { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 18.9 },
    { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 22.1 },
    { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 25.6 },
    { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 28.3 },
    { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 31.5 },
    { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 35.0 },
];

export const LEARNING_MODULES: LearningModule[] = [
    { id: 'lm-1', title: 'Mastering React for Modern Web Apps', category: 'Technical Skills', type: 'video', duration: '2h 30m', coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=870', content: { summary: 'An in-depth guide to advanced React concepts.', keyTakeaways: ['Component Lifecycle', 'State Management with Hooks', 'React Router'], videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', articleText: 'This module covers...' } },
    { id: 'lm-2', title: 'Financial Literacy 101', category: 'Financial Well-being', type: 'article', duration: '45m read', coverImageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=870', content: { summary: 'Learn the basics of managing your personal finances effectively.', keyTakeaways: ['Budgeting', 'Saving vs Investing', 'Understanding Debt'], articleText: 'Financial literacy is the foundation of your relationship with money...\n\nIn this article, we will explore the core pillars of personal finance that can empower you to make informed and effective decisions. The first step is creating a budget...' } },
    { id: 'lm-3', title: 'Ace Your Technical Interview', category: 'Career Growth', type: 'video', duration: '1h 15m', coverImageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=870', content: { summary: 'Strategies and tips for succeeding in technical interviews.', keyTakeaways: ['Data Structures', 'Algorithms', 'System Design Basics'], videoUrl: 'https://www.youtube.com/embed/1_aU8MfeSjA', articleText: 'Technical interviews can be daunting...' } },
    { id: 'lm-4', title: 'How to Generate a Business Idea', category: 'Entrepreneurship', type: 'article', duration: '1h read', coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1032', content: { summary: 'A step-by-step guide to finding and validating your first business idea.', keyTakeaways: ['Identifying Market Gaps', 'Validating Your Idea', 'Creating a Lean Canvas'], articleText: 'Every great business starts with an idea, but where do ideas come from?\n\nThis guide will walk you through practical steps. Start by observing problems in your own life or community. Often, the best business ideas come from solving a problem you personally experience. This is known as "scratching your own itch." For example, maybe you find it difficult to get fresh produce delivered in your neighborhood. That could be a business idea!\n\nOnce you have a list of problems, start brainstorming solutions. Don\'t filter yourself at this stage; just write everything down. After brainstorming, you need to validate your idea. Talk to potential customers. Are they willing to pay for your solution? This step is crucial and can save you years of wasted effort.' } },
    { id: 'lm-5', title: 'Introduction to Digital Marketing', category: 'Entrepreneurship', type: 'video', duration: '2h 45m', coverImageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=871', content: { summary: 'Learn the fundamentals of SEO, SEM, and Social Media Marketing to grow your business online.', keyTakeaways: ['SEO Basics', 'Paid Advertising (PPC)', 'Content Marketing'], videoUrl: 'https://www.youtube.com/embed/nU-IIXbw_Hk', articleText: 'Digital marketing is essential for any modern business...' } },
];

export const LEARNING_PATHS: LearningPath[] = [
    {
        id: 'lp-1',
        title: 'Frontend Developer Path',
        description: 'From fundamentals to advanced concepts, become a top-tier frontend developer.',
        relevantGoal: 'Senior Frontend Developer',
        moduleIds: ['lm-1', 'lm-3', 'lm-5'],
    },
    {
        id: 'lp-2',
        title: 'UX/UI Design Path',
        description: 'Master the art of user-centered design and create beautiful, functional products.',
        relevantGoal: 'Lead UX/UI Designer',
        moduleIds: ['lm-3', 'lm-4', 'lm-2'],
    },
];

export const COOPERATIVES: Cooperative[] = [
    { id: 'coop-1', name: 'TechSolutions Innovators Circle', members: 5, totalSavings: 1250000, loanPool: 800000, creator: 'Jean-Claude D.', creatorId: 'user-2', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=870', joinRequests: [ { userId: 'user-4', status: 'pending' }], loansDisbursed: 250000, profit: 50000, messages: [ {id: 'cm-1', userId: 'user-2', text: 'Welcome everyone! Let\'s discuss our investment strategy for this quarter.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, {id: 'cm-2', userId: 'user-5', text: 'Great idea! I have some thoughts on investing in local tech startups.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }], communityGoal: 'Fund New Workspace', goalAmount: 2000000, goalProgress: 1250000 },
    { id: 'coop-2', name: 'Kigali Creatives Fund', members: 12, totalSavings: 3400000, loanPool: 2000000, creator: 'Samuel M.', creatorId: 'user-5', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=871' },
    { id: 'coop-3', name: 'Future Builders Cooperative', members: 8, totalSavings: 980000, loanPool: 500000, creator: 'Aline U.', creatorId: 'user-1', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4b248a?q=80&w=934' },
    { id: 'coop-4', name: 'Rwanda Agri-Ventures', members: 25, totalSavings: 8500000, loanPool: 5000000, creator: 'Admin User', creatorId: 'user-3', imageUrl: 'https://images.unsplash.com/photo-1492496913980-50133821932d?q=80&w=987' },
];

export const COOPERATIVE_BUDGET: CooperativeBudget = {
    id: 'budget-1',
    cooperativeId: 'coop-1',
    allocations: [
        { category: 'Technology Investment', amount: 400000 },
        { category: 'Marketing', amount: 150000 },
        { category: 'Operational Costs', amount: 100000 },
        { category: 'Emergency Fund', amount: 150000 },
    ],
};

export const COOPERATIVE_TRANSACTIONS: CooperativeTransaction[] = [
    { id: 'ct-1', cooperativeId: 'coop-1', description: 'Monthly contribution from A. U.', amount: 50000, type: 'contribution', date: new Date().toISOString() },
    { id: 'ct-2', cooperativeId: 'coop-1', description: 'Loan to P. G. for equipment', amount: -250000, type: 'loan_disbursement', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ct-3', cooperativeId: 'coop-1', description: 'Software subscription payment', amount: -25000, type: 'expense', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ct-4', cooperativeId: 'coop-1', description: 'Return from short-term investment', amount: 75000, type: 'investment_return', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];


export const TRANSACTIONS: Transaction[] = [
    { id: 't-1', type: 'deposit', description: 'Salary from TechSolutions Ltd.', amount: 800000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 't-2', type: 'payment', description: 'Ikimina Contribution', amount: -50000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 't-3', type: 'withdrawal', description: 'Rent Payment', amount: -200000, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', name: 'New Laptop', targetAmount: 1500000, currentAmount: 1050000 },
    { id: 'sg-2', name: 'Emergency Fund', targetAmount: 1000000, currentAmount: 450000 },
];

const today = new Date();
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
const twoMonths = new Date(today.getFullYear(), today.getMonth() + 2, 15);

export const LOAN_APPLICATIONS: LoanApplication[] = [
    { 
        id: 'la-1', 
        userId: 'user-1', 
        cooperativeId: 'coop-1',
        amount: 250000,
        remainingAmount: 125000, 
        purpose: 'Laptop Purchase', 
        repaymentPeriod: 6, 
        status: 'Approved',
        repayments: [
            { amount: 41667, date: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString() },
            { amount: 41667, date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString() },
        ],
        repaymentSchedule: [
            { dueDate: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString(), amount: 41667, status: 'paid' },
            { dueDate: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(), amount: 41667, status: 'paid' },
            { dueDate: nextMonth.toISOString(), amount: 41667, status: 'pending' },
            { dueDate: twoMonths.toISOString(), amount: 41667, status: 'pending' },
            { dueDate: new Date(today.getFullYear(), today.getMonth() + 3, 15).toISOString(), amount: 41667, status: 'pending' },
            { dueDate: new Date(today.getFullYear(), today.getMonth() + 4, 15).toISOString(), amount: 41667, status: 'pending' },
        ]
    },
    { 
        id: 'la-2', 
        userId: 'user-5', 
        cooperativeId: 'coop-2',
        amount: 500000,
        remainingAmount: 500000,
        purpose: 'Business Startup', 
        repaymentPeriod: 12, 
        status: 'Pending',
        repayments: [],
        repaymentSchedule: [],
    },
    { 
        id: 'la-3', 
        userId: 'user-1', 
        cooperativeId: 'coop-3',
        amount: 100000,
        remainingAmount: 0,
        purpose: 'Emergency', 
        repaymentPeriod: 2, 
        status: 'Fully Repaid',
        repayments: [
            { amount: 50000, date: new Date(2024, 4, 15).toISOString() },
            { amount: 50000, date: new Date(2024, 5, 15).toISOString() },
        ],
        repaymentSchedule: [
             { dueDate: new Date(2024, 4, 15).toISOString(), amount: 50000, status: 'paid' },
             { dueDate: new Date(2024, 5, 15).toISOString(), amount: 50000, status: 'paid' },
        ],
    },
];