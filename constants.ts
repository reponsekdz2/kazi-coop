import { User, UserRole, Job, Application, Interview, Cooperative, Transaction, SavingsGoal, Budget, LoanApplication, Message, LearningModule, ActivityLog, Testimonial, Company } from './types';

// USERS
export const USERS: User[] = [
  {
    id: 'user-seeker-1',
    name: 'Aline Umutoni',
    email: 'aline@example.com',
    role: UserRole.SEEKER,
    avatarUrl: `https://i.pravatar.cc/150?u=user-seeker-1`,
    skills: ['React', 'TypeScript', 'Node.js', 'Project Management'],
    careerProgress: 3,
    careerGoal: 'Become a Senior Frontend Developer and eventually a Tech Lead.',
  },
  {
    id: 'user-seeker-2',
    name: 'Peter Mugabo',
    email: 'peter@example.com',
    role: UserRole.SEEKER,
    avatarUrl: `https://i.pravatar.cc/150?u=user-seeker-2`,
    skills: ['UX/UI Design', 'Figma', 'Agile Methodologies'],
    careerProgress: 2,
    careerGoal: 'Transition into a Product Management role.',
  },
  {
    id: 'user-employer-1',
    name: 'Jean Habimana',
    email: 'jean@example.com',
    role: UserRole.EMPLOYER,
    avatarUrl: `https://i.pravatar.cc/150?u=user-employer-1`,
  },
];

// COMPANIES
export const COMPANIES: Company[] = [
    { id: 'comp-1', name: 'TechSolutions Ltd.', description: 'A leading innovator in the tech industry, focusing on creating cutting-edge solutions for the African market. We are committed to fostering a collaborative and inclusive work environment.', industry: 'Technology', location: 'Kigali, Rwanda' },
    { id: 'comp-2', name: 'Kigali Creatives', description: 'A design agency that brings creative ideas to life. We specialize in branding, web design, and digital marketing.', industry: 'Creative Arts', location: 'Kigali, Rwanda' },
    { id: 'comp-3', name: 'Innovate Rwanda', description: 'A non-profit organization dedicated to fostering innovation and entrepreneurship in Rwanda through mentorship and funding.', industry: 'Non-profit', location: 'Kigali, Rwanda' },
];

// JOBS
export const JOBS: Job[] = [
  {
    id: 'job-1',
    employerId: 'user-employer-1',
    companyId: 'comp-1',
    title: 'Frontend Developer',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    requirements: ['3+ years of React experience', 'Strong proficiency in TypeScript', 'Experience with state management libraries'],
    isSaved: true,
    status: 'Open',
  },
  {
    id: 'job-2',
    employerId: 'user-employer-1',
    companyId: 'comp-2',
    title: 'UX/UI Designer',
    location: 'Remote',
    type: 'Contract',
    description: 'Seeking a creative UX/UI designer for a 3-month contract...',
    requirements: ['Portfolio of design projects', 'Proficiency in Figma and Adobe XD', 'Understanding of user-centered design principles'],
    isSaved: false,
    status: 'Open',
  },
  {
    id: 'job-3',
    employerId: 'user-employer-1',
    companyId: 'comp-3',
    title: 'Project Manager',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    description: 'We need an experienced Project Manager to lead our development team...',
    requirements: ['5+ years in project management', 'Agile/Scrum certification', 'Excellent communication skills'],
    isSaved: true,
    status: 'Closed',
  },
];

// APPLICATIONS
export const APPLICATIONS: Application[] = [
  { id: 'app-1', userId: 'user-seeker-1', jobId: 'job-1', submissionDate: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'Interviewing' },
  { id: 'app-2', userId: 'user-seeker-2', jobId: 'job-2', submissionDate: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'Reviewed' },
  { id: 'app-3', userId: 'user-seeker-1', jobId: 'job-3', submissionDate: new Date(Date.now() - 10 * 86400000).toISOString(), status: 'Rejected' },
  { id: 'app-4', userId: 'user-seeker-2', jobId: 'job-1', submissionDate: new Date().toISOString(), status: 'Applied' },
];

// INTERVIEWS
export const INTERVIEWS: Interview[] = [
    { id: 'int-1', userId: 'user-seeker-1', jobId: 'job-1', date: new Date(Date.now() + 3 * 86400000).toISOString(), type: 'Technical', status: 'Scheduled', details: 'Google Meet Link: ...' },
    { id: 'int-2', userId: 'user-seeker-2', jobId: 'job-2', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'Phone Screen', status: 'Completed' },
    { id: 'int-3', userId: 'user-seeker-1', jobId: 'job-1', date: new Date(Date.now() + 5 * 86400000).toISOString(), type: 'Video Call', status: 'Scheduled', details: 'platform-call-link' },
];

// COOPERATIVES
export const COOPERATIVES: Cooperative[] = [
  {
    id: 'coop-1',
    name: 'TechSolutions Innovators Circle',
    description: 'A savings group for employees of TechSolutions to foster financial growth and community.',
    creatorId: 'user-employer-1',
    members: ['user-employer-1', 'user-seeker-1'],
    joinRequests: ['user-seeker-2'],
    totalSavings: 5800000,
    totalLoans: 1200000,
    contributionSettings: { amount: 50000, frequency: 'Monthly' },
    loanSettings: { interestRate: 10, maxLoanPercentage: 80 },
    contributions: [
        { userId: 'user-seeker-1', amount: 50000, date: new Date(Date.now() - 30 * 86400000).toISOString() }
    ],
    loans: [
        { 
            id: 'coop-loan-1', cooperativeId: 'coop-1', userId: 'user-seeker-1', amount: 250000, purpose: 'School fees', interestRate: 10, repaymentPeriod: 6, status: 'Approved', applicationDate: new Date().toISOString(), remainingAmount: 250000, repayments: [],
            repaymentSchedule: Array.from({ length: 6 }, (_, i) => ({
                id: `coop-loan-1-inst-${i}`,
                dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString(),
                amount: 43750,
                status: 'pending'
            }))
        }
    ],
  },
];

// TRANSACTIONS
export const TRANSACTIONS: Transaction[] = [
    { id: 'txn-1', userId: 'user-seeker-1', date: new Date().toISOString(), description: 'Mobile Money Deposit', amount: 200000, category: 'Income' },
    { id: 'txn-2', userId: 'user-seeker-1', date: new Date(Date.now() - 1 * 86400000).toISOString(), description: 'Groceries', amount: -25000, category: 'Groceries' },
    { id: 'txn-3', userId: 'user-seeker-1', date: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Co-op Contribution', amount: -50000, category: 'Savings' },
    { id: 'txn-4', userId: 'user-seeker-2', date: new Date().toISOString(), description: 'Figma Subscription', amount: -15000, category: 'Utilities' },
];

// SAVINGS GOALS
export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', userId: 'user-seeker-1', name: 'New Laptop', targetAmount: 1500000, currentAmount: 450000 },
];

// BUDGETS
export const BUDGETS: Budget[] = [
    { id: 'b-1', userId: 'user-seeker-1', category: 'Groceries', budgetAmount: 100000 },
];

// LOAN APPLICATIONS
export const LOAN_APPLICATIONS: LoanApplication[] = [];

// MESSAGES
export const MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'user-employer-1', receiverId: 'user-seeker-1', text: 'Hi Aline, we were impressed with your application. Are you available for an interview next week?', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'msg-2', senderId: 'user-seeker-1', receiverId: 'user-employer-1', text: 'Hello Jean, thank you! Yes, I am available. What time works for you?', timestamp: new Date().toISOString() },
];

// LEARNING MODULES
export const LEARNING_MODULES: LearningModule[] = [
    {
        id: 'lm-1',
        title: 'Mastering React Hooks',
        category: 'Web Development',
        type: 'video',
        duration: '45 min',
        progress: 60,
        content: {
            summary: 'Deep dive into React Hooks and learn how to manage state and side effects in your functional components effectively.',
            videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
            keyTakeaways: ['Understand useState and useEffect', 'Learn about custom hooks', 'State management patterns'],
        }
    },
    {
        id: 'lm-2',
        title: 'Effective Interview Techniques',
        category: 'Career Growth',
        type: 'article',
        duration: '15 min read',
        progress: 0,
        content: {
            summary: 'Learn the best strategies to ace your next job interview, from preparation to follow-up.',
            articleText: "Preparation is key to a successful interview. Start by researching the company...",
            keyTakeaways: ['STAR method for answering questions', 'Importance of body language', 'How to ask insightful questions'],
        }
    }
];

// ACTIVITY LOG
export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'al-1', type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Frontend Developer', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'al-2', type: 'NEW_MEMBER', description: 'Peter Mugabo requested to join TechSolutions Innovators Circle.', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'al-3', type: 'LARGE_DEPOSIT', description: 'Aline Umutoni deposited RWF 200,000 to their wallet.', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'al-4', type: 'SAVINGS_GOAL', description: 'Aline Umutoni reached 30% of their "New Laptop" savings goal.', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 10.5 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 12.0 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 15.2 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 18.9 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 22.1 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 25.0 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 28.3 },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 'test-1',
        name: 'Aline U.',
        role: 'Frontend Developer',
        quote: 'KaziCoop helped me find a great job and the Ikimina feature is helping me save for a new laptop. It’s a game-changer!',
        avatarUrl: `https://i.pravatar.cc/150?u=test-1`,
    },
    {
        id: 'test-2',
        name: 'Peter M.',
        role: 'UX/UI Designer',
        quote: 'The platform is so easy to use. I got three interview requests within the first week of completing my profile.',
        avatarUrl: `https://i.pravatar.cc/150?u=test-2`,
    },
    {
        id: 'test-3',
        name: 'Jean H.',
        role: 'Employer, TechSolutions Ltd.',
        quote: 'We found our best candidate through KaziCoop. The talent pool is excellent and the management tools are very efficient.',
        avatarUrl: `https://i.pravatar.cc/150?u=test-3`,
    },
    {
        id: 'test-4',
        name: 'Grace N.',
        role: 'Project Manager',
        quote: 'Joining a cooperative with my colleagues has been amazing for team morale and our financial discipline.',
        avatarUrl: `https://i.pravatar.cc/150?u=test-4`,
    },
    {
        id: 'test-5',
        name: 'Samuel K.',
        role: 'Student',
        quote: 'The learning hub provided me with the skills I needed to land my first internship. Invaluable resource!',
        avatarUrl: `https://i.pravatar.cc/150?u=test-5`,
    },
     {
        id: 'test-6',
        name: 'Fatima Z.',
        role: 'Accountant',
        quote: 'The digital wallet makes everything so simple, from receiving my salary to managing my Ikimina contributions.',
        avatarUrl: `https://i.pravatar.cc/150?u=test-6`,
    }
];