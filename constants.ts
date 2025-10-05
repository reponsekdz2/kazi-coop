
import { User, UserRole, Job, Application, Interview, Message, Transaction, SavingsGoal, Budget, LoanApplication, LearningModule, LearningPath, Cooperative, ActivityLog } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-1', careerGoal: 'Frontend Developer', completedModuleIds: ['lm-1', 'lm-2'], careerProgress: 3, skills: ['React', 'TypeScript', 'Project Management', 'Agile'] },
  { id: 'user-2', name: 'Jean Habimana', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'Admin User', email: 'admin@example.com', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Chris Mwizerwa', email: 'chris@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-4', careerGoal: 'UX/UI Designer', completedModuleIds: [], careerProgress: 1, skills: ['Figma', 'Adobe XD', 'User Research'] },
];

export const JOBS: Job[] = [
  { id: 'job-1', title: 'Frontend Developer', company: 'TechSolutions Ltd.', location: 'Kigali, Rwanda', description: 'Seeking a skilled Frontend Developer.', longDescription: 'Full job description here...', skills: ['React', 'TypeScript', 'Next.js'], type: 'Full-time', salaryRange: 'RWF 1.2M - 1.8M' },
  { id: 'job-2', title: 'UX/UI Designer', company: 'Creative Minds Inc.', location: 'Kigali, Rwanda', description: 'Design beautiful and intuitive user interfaces.', longDescription: 'Full job description here...', skills: ['Figma', 'Sketch', 'Prototyping'], type: 'Contract', salaryRange: 'RWF 800k - 1.2M' },
  { id: 'job-3', title: 'Backend Developer', company: 'DataCorp', location: 'Remote', description: 'Build robust and scalable backend systems.', longDescription: 'Full job description here...', skills: ['Node.js', 'PostgreSQL', 'Docker'], type: 'Full-time', salaryRange: 'RWF 1.5M - 2.2M' },
  { id: 'job-4', title: 'Project Manager', company: 'BuildIt Rwanda', location: 'Kigali, Rwanda', description: 'Lead our construction technology projects.', longDescription: 'Full job description here...', skills: ['Agile', 'Scrum', 'JIRA'], type: 'Full-time', salaryRange: 'RWF 2.0M - 2.8M' },
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', userId: 'user-1', jobId: 'job-1', status: 'Interviewing', matchScore: 92, submissionDate: '2024-07-20T10:00:00Z', statusHistory: [{ status: 'Applied', date: '2024-07-20T10:00:00Z' }, { status: 'Reviewed', date: '2024-07-21T10:00:00Z' }, { status: 'Interviewing', date: '2024-07-22T10:00:00Z' }] },
  { id: 'app-2', userId: 'user-1', jobId: 'job-3', status: 'Applied', matchScore: 78, submissionDate: '2024-07-22T11:00:00Z', statusHistory: [{ status: 'Applied', date: '2024-07-22T11:00:00Z' }] },
];

export const INTERVIEWS: Interview[] = [
  { id: 'int-1', jobId: 'job-1', userId: 'user-1', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'Online', status: 'Scheduled' },
  { id: 'int-2', jobId: 'job-2', userId: 'user-4', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'In-Person', status: 'Scheduled' },
];

export const MESSAGES: Message[] = [
  { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, we were impressed with your application. Are you available for an interview?', timestamp: '2024-07-22T14:00:00Z' },
  { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Hi Jean, thank you! Yes, I am available this week.', timestamp: '2024-07-22T14:05:00Z' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 'txn-1', date: new Date().toISOString(), description: 'Salary Deposit', amount: 800000, category: 'Salary' },
    { id: 'txn-2', date: new Date().toISOString(), description: 'Groceries from Sawa Citi', amount: -45000, category: 'Groceries' },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', userId: 'user-1', name: 'New Laptop', targetAmount: 1200000, currentAmount: 750000 },
];

export const BUDGETS: Budget[] = [
    { id: 'b-1', userId: 'user-1', category: 'Groceries', budgetAmount: 100000 },
    { id: 'b-2', userId: 'user-1', category: 'Transport', budgetAmount: 50000 },
];

export const LOAN_APPLICATIONS: LoanApplication[] = [
    { id: 'la-1', userId: 'user-1', purpose: 'Business Startup', amount: 500000, interestRate: 5, repaymentPeriod: 12, status: 'Approved', remainingAmount: 458333, repaymentSchedule: [], repayments: [{ amount: 41667, date: new Date().toISOString() }] },
];

export const LEARNING_MODULES: LearningModule[] = [
    { id: 'lm-1', title: 'Advanced React Hooks', category: 'Web Development', type: 'video', duration: '45 min', coverImageUrl: 'https://i.pravatar.cc/400?u=lm-1', content: { summary: 'Deep dive into React hooks.', keyTakeaways: ['useEffect for side effects', 'useContext for state management'], videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q' } },
    { id: 'lm-2', title: 'CV Writing Workshop', category: 'Career Skills', type: 'article', duration: '30 min', coverImageUrl: 'https://i.pravatar.cc/400?u=lm-2', content: { summary: 'Craft a compelling CV.', keyTakeaways: ['Use action verbs', 'Tailor to job description'], articleText: 'Article content here...' } },
    { id: 'lm-3', title: 'Introduction to Figma', category: 'Design', type: 'video', duration: '1 hour', coverImageUrl: 'https://i.pravatar.cc/400?u=lm-3', content: { summary: 'Learn the basics of Figma.', keyTakeaways: ['Vector networks', 'Prototyping'], videoUrl: 'https://www.youtube.com/embed/eZJOSK4gXl4' } },
];

export const LEARNING_PATHS: LearningPath[] = [
    { id: 'lp-1', name: 'Frontend Developer Path', relevantGoal: 'Frontend Developer', moduleIds: ['lm-1', 'lm-2'] },
    { id: 'lp-2', name: 'UX/UI Designer Path', relevantGoal: 'UX/UI Designer', moduleIds: ['lm-3', 'lm-2'] },
];

export const COOPERATIVES: Cooperative[] = [
    { id: 'coop-1', name: 'TechSolutions Innovators Circle', description: 'A savings group for tech professionals.', members: ['user-1', 'user-4'], totalSavings: 5200000, loanPool: 1500000, avatarUrl: 'https://i.pravatar.cc/150?u=coop-1' },
    { id: 'coop-2', name: 'Kigali Creatives Fund', description: 'Supporting designers and artists.', members: ['user-4'], totalSavings: 2800000, loanPool: 800000, avatarUrl: 'https://i.pravatar.cc/150?u=coop-2' },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', 'Total Savings': 40.1, 'Loans Disbursed': 10 },
  { name: 'Feb', 'Total Savings': 45.3, 'Loans Disbursed': 12 },
  { name: 'Mar', 'Total Savings': 52.5, 'Loans Disbursed': 15 },
  { name: 'Apr', 'Total Savings': 58.8, 'Loans Disbursed': 20 },
  { name: 'May', 'Total Savings': 65.2, 'Loans Disbursed': 18 },
  { name: 'Jun', 'Total Savings': 71.9, 'Loans Disbursed': 22 },
  { name: 'Jul', 'Total Savings': 78.4, 'Loans Disbursed': 25 },
];

export const ACTIVITY_LOG: ActivityLog[] = [
    {id: 'al-1', type: 'NEW_MEMBER', description: 'Chris Mwizerwa signed up as a Job Seeker.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    {id: 'al-2', type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Frontend Developer.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    {id: 'al-3', type: 'SAVINGS_GOAL', description: 'Aline Umutoni created a new savings goal: New Laptop.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    {id: 'al-4', type: 'LARGE_DEPOSIT', description: 'Aline Umutoni deposited RWF 800,000 to their wallet.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];
