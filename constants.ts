import { User, UserRole, Job, Application, Interview, Cooperative, Transaction, LoanApplication, SavingsGoal, Budget, Message, LearningModule, ActivityLog } from './types';

// Mock Users
export const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Aline Umutoni',
    email: 'aline@example.com',
    role: UserRole.SEEKER,
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    skills: ['React', 'TypeScript', 'Node.js', 'Project Management'],
    careerProgress: 3,
  },
  {
    id: 'user-2',
    name: 'Jean Mugabo',
    email: 'jean@example.com',
    role: UserRole.EMPLOYER,
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    companyDetails: {
        balance: 25000000,
        totalPayouts: 15750000,
        cooperativeInvestments: 3000000,
        operationalBudget: [
            { category: 'Payouts', amount: 16000000 },
            { category: 'Marketing', amount: 4000000 },
            { category: 'Operations', amount: 5000000 },
        ]
    }
  },
   {
    id: 'user-3',
    name: 'Chris K.',
    email: 'chris@example.com',
    role: UserRole.SEEKER,
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    skills: ['SQL', 'Python', 'Data Analysis'],
    careerProgress: 1,
  },
  {
    id: 'user-4',
    name: 'Diane Ishimwe',
    email: 'diane@example.com',
    role: UserRole.ADMIN,
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
  }
];

// Mock Jobs
export const JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'TechSolutions Ltd.',
    location: 'Kigali, Rwanda',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building the client-side of our web applications.',
    type: 'Full-time',
    requirements: ['2+ years of experience with React', 'Strong proficiency in TypeScript', 'Experience with state management libraries like Redux or Zustand'],
    employerId: 'user-2',
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    company: 'Innovate Rwanda',
    location: 'Remote',
    description: 'Join our creative team to design intuitive and engaging user interfaces for our mobile and web products.',
    type: 'Contract',
    requirements: ['Portfolio of design projects', 'Proficiency in Figma, Sketch, or Adobe XD', 'Understanding of user-centered design principles'],
    employerId: 'user-2',
  },
  {
    id: 'job-3',
    title: 'Project Manager',
    company: 'Kigali Hub',
    location: 'Kigali, Rwanda',
    description: 'We need an organized and experienced Project Manager to lead our software development projects from conception to launch.',
    type: 'Full-time',
    requirements: ['PMP certification is a plus', 'Experience with Agile methodologies', 'Excellent communication skills'],
    employerId: 'user-2',
  },
   {
    id: 'job-4',
    title: 'Data Analyst',
    company: 'Rwanda Insights',
    location: 'Kigali, Rwanda',
    description: 'Analyze large datasets to identify trends, develop charts and reports, and provide actionable insights for our clients.',
    type: 'Part-time',
    requirements: ['Proficiency in SQL and Python (Pandas)', 'Experience with data visualization tools like Tableau or Power BI', 'Strong analytical skills'],
    employerId: 'another-employer-id',
  },
];

// Mock Applications
export const APPLICATIONS: Application[] = [
  { id: 'app-1', userId: 'user-1', jobId: 'job-1', submissionDate: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'Interviewing' },
  { id: 'app-2', userId: 'user-3', jobId: 'job-4', submissionDate: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'Reviewed' },
  { id: 'app-3', userId: 'user-1', jobId: 'job-3', submissionDate: new Date().toISOString(), status: 'Applied' },
];

// Mock Interviews
export const INTERVIEWS: Interview[] = [
  { id: 'int-1', userId: 'user-1', jobId: 'job-1', date: new Date(Date.now() + 3 * 86400000).toISOString(), type: 'Technical', status: 'Scheduled' },
];

// Mock Cooperatives
export const COOPERATIVES: Cooperative[] = [
  { id: 'coop-1', name: 'TechSolutions Innovators Circle', description: 'A savings group for employees of TechSolutions Ltd. focused on technology and innovation investments.', creatorId: 'user-2', members: ['user-1', 'user-2'], totalSavings: 12500000, totalLoans: 3000000, contributionAmount: 50000, contributionFrequency: 'Monthly' },
  { id: 'coop-2', name: 'Kigali Freelancers Fund', description: 'A cooperative for freelance designers, developers, and writers in Kigali to support each other financially.', creatorId: 'another-employer-id', members: ['user-3'], totalSavings: 4800000, totalLoans: 1200000, contributionAmount: 15000, contributionFrequency: 'Weekly' },
];

// Mock Transactions
export const TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', userId: 'user-1', date: new Date(Date.now() - 1 * 86400000).toISOString(), description: 'Salary Deposit', amount: 800000, category: 'Income' },
  { id: 'txn-2', userId: 'user-1', date: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Groceries', amount: -25000, category: 'Groceries' },
  { id: 'txn-3', userId: 'user-1', date: new Date(Date.now() - 3 * 86400000).toISOString(), description: 'MTN Airtime', amount: -5000, category: 'Utilities' },
  { id: 'txn-4', userId: 'user-1', date: new Date(Date.now() - 4 * 86400000).toISOString(), description: 'Ikimina Contribution', amount: -50000, category: 'Savings Contribution' },
  { id: 'txn-5', userId: 'user-1', date: new Date(Date.now() - 5 * 86400000).toISOString(), description: 'Moto Fare', amount: -1500, category: 'Transport' },
];

// Mock Loan Applications
export const LOAN_APPLICATIONS: LoanApplication[] = [
  { id: 'la-1', userId: 'user-1', amount: 500000, purpose: 'Laptop Purchase', repaymentPeriod: 6, status: 'Approved', remainingAmount: 416667, repaymentSchedule: [], repayments: [{ date: new Date().toISOString(), amount: 83333 }] },
];

// Mock Savings Goals
export const SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'sg-1', userId: 'user-1', name: 'New Smartphone', targetAmount: 400000, currentAmount: 150000, targetDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString() },
];

// Mock Budgets
export const BUDGETS: Budget[] = [
  { id: 'b-1', userId: 'user-1', category: 'Groceries', budgetAmount: 100000 },
  { id: 'b-2', userId: 'user-1', category: 'Transport', budgetAmount: 40000 },
  { id: 'b-3', userId: 'user-1', category: 'Entertainment', budgetAmount: 50000 },
];

// Mock Messages
export const MESSAGES: Message[] = [
  { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, your profile looks great. Are you available for a quick chat about the Frontend role?', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Hi Jean, thank you! Yes, I am. When works for you?', timestamp: new Date(Date.now() - 300000).toISOString() },
];

// Mock Learning Modules
export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'lm-1',
    title: 'Mastering React Hooks',
    category: 'Web Development',
    type: 'video',
    duration: '45 min',
    progress: 60,
    content: {
      summary: 'Go in-depth with React Hooks and learn how to write cleaner, more efficient functional components.',
      videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
      keyTakeaways: ['Understand useState and useEffect', 'Learn about custom hooks', 'Manage complex state with useReducer'],
    },
  },
  {
    id: 'lm-2',
    title: 'CV Writing for Tech Roles',
    category: 'Career Development',
    type: 'article',
    duration: '15 min read',
    progress: 0,
    content: {
      summary: 'Learn how to craft a compelling CV that stands out to tech recruiters and hiring managers.',
      articleText: 'Start with a strong summary...\n\nTailor your skills section to the job description...',
      keyTakeaways: ['Highlight key achievements with metrics', 'Use keywords from the job description', 'Keep it concise and readable'],
    },
  }
];

// Mock Activity Log for Analytics
export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'al-1', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Frontend Developer.' },
    { id: 'al-2', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'NEW_MEMBER', description: 'Chris K. joined the platform.' },
    { id: 'al-3', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'SAVINGS_GOAL', description: 'Aline Umutoni reached a savings goal: New Smartphone.' },
    { id: 'al-4', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'LARGE_DEPOSIT', description: 'A deposit of RWF 500,000 was made to the Kigali Freelancers Fund.' },
];

// Mock Data for Charts
export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 10 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 12 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 15 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 18 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 20 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 22 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 25 },
];