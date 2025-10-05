// FIX: Provide mock data for the application constants.
import { User, UserRole, Job, Application, SavingsGoal, Cooperative, Transaction, Message, Notification, InvestmentPod, LoanOffer } from './types';

export const USERS: User[] = [
  { id: 'user1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', cooperativeId: 'coop4', cooperativeStatus: 'Member' },
  { id: 'user2', name: 'Jean-Claude Dusabe', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
  { id: 'user3', name: 'Admin Kazi', email: 'admin@example.com', role: UserRole.COOP_ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3', cooperativeId: 'coop3' },
  { id: 'user4', name: 'Fatima Zahra', email: 'fatima@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', cooperativeId: 'coop3', cooperativeStatus: 'Pending' },
  { id: 'user5', name: 'Samuel Mwangi', email: 'samuel@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user5', cooperativeId: 'coop1', cooperativeStatus: 'Member' },
  { id: 'user6', name: 'Maria Oliveira', email: 'maria@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user6' }
];

export const JOBS: Job[] = [
  { id: 'job1', title: 'Frontend Developer', company: 'TechSolutions Ltd.', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Developing and maintaining user-facing features...', skills: ['React', 'TypeScript', 'CSS'], salary: 'RWF 1,500,000 / month' },
  { id: 'job2', title: 'UX/UI Designer', company: 'Creative Minds Inc.', location: 'Remote', type: 'Contract', description: 'Designing user interfaces for web and mobile applications...', skills: ['Figma', 'Adobe XD', 'User Research'], salary: 'RWF 1,200,000 / month' },
  { id: 'job3', title: 'Project Manager', company: 'BuildIt Rwanda', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Leading project planning sessions and managing project progress...', skills: ['Agile', 'Scrum', 'JIRA'], salary: 'RWF 2,000,000 / month' },
  { id: 'job4', title: 'Data Analyst', company: 'Data Insights Co.', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Interpreting data, analyzing results using statistical techniques...', skills: ['SQL', 'Python', 'Tableau'], salary: 'RWF 1,800,000 / month' },
];

export const APPLICATIONS: Application[] = [
  { id: 'app1', jobId: 'job1', userId: 'user1', status: 'Interviewing', matchScore: 92 },
  { id: 'app2', jobId: 'job1', userId: 'user4', status: 'Applied', matchScore: 85 },
  { id: 'app3', jobId: 'job2', userId: 'user5', status: 'Offered', matchScore: 95 },
  { id: 'app4', jobId: 'job3', userId: 'user1', status: 'Rejected', matchScore: 78 },
  { id: 'app5', jobId: 'job1', userId: 'user6', status: 'Interviewing', matchScore: 88 },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg1', name: 'New Laptop', targetAmount: 800000, currentAmount: 550000 }
];

export const COOPERATIVES: Cooperative[] = [
  { id: 'coop1', name: 'Agri-Tech Innovators', logoUrl: 'https://via.placeholder.com/150/92c950/ffffff?Text=Agri', description: 'A cooperative for technology enthusiasts in the agricultural sector.', members: USERS.filter(u => u.cooperativeId === 'coop1'), savings: 15000000, type: 'Community' },
  { id: 'coop2', name: 'Kigali Artisans United', logoUrl: 'https://via.placeholder.com/150/f9a8d4/ffffff?Text=Art', description: 'Empowering local artisans through shared resources and market access.', members: [], savings: 8500000, type: 'Community' },
  { id: 'coop3', name: 'Future Leaders Savings', logoUrl: 'https://via.placeholder.com/150/60a5fa/ffffff?Text=Future', description: 'A savings and credit cooperative for young professionals.', members: USERS.filter(u => u.cooperativeId === 'coop3'), savings: 25000000, type: 'Community' },
  { id: 'coop4', name: 'TechSolutions Innovators Circle', logoUrl: 'https://via.placeholder.com/150/1d4ed8/ffffff?Text=Tech', description: 'A savings and investment group for employees of TechSolutions Ltd.', members: USERS.filter(u => u.cooperativeId === 'coop4'), savings: 5200000, type: 'Corporate', creatorId: 'user2' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 'txn1', description: 'Salary Deposit - TechSolutions', amount: 750000, date: '2024-07-30T10:00:00Z' },
    { id: 'txn2', description: 'Ikimina Contribution', amount: -50000, date: '2024-08-01T11:00:00Z' },
    { id: 'txn3', description: 'Groceries', amount: -25000, date: '2024-08-02T15:00:00Z' },
    { id: 'txn4', description: 'Freelance Project Payment', amount: 150000, date: '2024-08-05T09:00:00Z' },
    { id: 'txn5', description: 'Rent', amount: -200000, date: '2024-08-05T12:00:00Z' },
];

export const MESSAGES: Message[] = [
  { id: 'msg1', senderId: 'user2', receiverId: 'user1', text: 'Hi Aline, your profile looks great. Are you available for a quick chat about the Frontend role?', timestamp: '2024-08-05T14:00:00Z' },
  { id: 'msg2', senderId: 'user1', receiverId: 'user2', text: 'Hi Jean-Claude, thank you! Yes, I am. When works for you?', timestamp: '2024-08-05T14:02:00Z' },
  { id: 'msg3', senderId: 'user2', receiverId: 'user1', text: 'How about 3 PM today?', timestamp: '2024-08-05T14:03:00Z' },
  { id: 'msg4', senderId: 'user1', receiverId: 'user2', text: 'Perfect, see you then!', timestamp: '2024-08-05T14:05:00Z' },
  { id: 'msg5', senderId: 'user4', receiverId: 'user1', text: 'Hey, did you hear back from TechSolutions?', timestamp: '2024-08-06T09:00:00Z' },
  { id: 'msg6', senderId: 'user1', receiverId: 'user4', text: 'Yes! I have an interview today. Wish me luck!', timestamp: '2024-08-06T09:01:00Z' },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 1, message: 'Your application for Frontend Developer was viewed.', date: '2 hours ago', read: false },
    { id: 2, message: 'New message from Jean-Claude Dusabe.', date: '3 hours ago', read: false },
    { id: 3, message: 'Welcome to KaziCoop! Complete your profile to get started.', date: '1 day ago', read: true },
    { id: 4, message: 'Your savings goal "New Laptop" is 68% complete.', date: '2 days ago', read: true },
];

export const INVESTMENT_PODS: InvestmentPod[] = [
  { id: 'pod1', name: 'Rwanda Agri-Growth Fund', riskLevel: 'Low', apy: 8.5, description: 'Invest in a diversified portfolio of local agriculture businesses.', performanceData: [{month: 'Jan', value: 100}, {month: 'Feb', value: 101}, {month: 'Mar', value: 102}, {month: 'Apr', value: 103}, {month: 'May', value: 104}, {month: 'Jun', value: 105}] },
  { id: 'pod2', name: 'Kigali Tech Innovators', riskLevel: 'Medium', apy: 15.2, description: 'Support promising tech startups in the Kigali Innovation City.', performanceData: [{month: 'Jan', value: 100}, {month: 'Feb', value: 105}, {month: 'Mar', value: 103}, {month: 'Apr', value: 110}, {month: 'May', value: 112}, {month: 'Jun', value: 115}] },
  { id: 'pod3', name: 'Sustainable Tourism Ventures', riskLevel: 'High', apy: 22.0, description: 'High-risk, high-reward investments in eco-lodges and sustainable tourism projects.', performanceData: [{month: 'Jan', value: 100}, {month: 'Feb', value: 98}, {month: 'Mar', value: 110}, {month: 'Apr', value: 115}, {month: 'May', value: 125}, {month: 'Jun', value: 130}] },
];

export const LOAN_OFFERS: LoanOffer[] = [
    { id: 'loan1', borrowerId: 'user5', amount: 500000, interestRate: 12, term: 12, purpose: 'Purchase new equipment for my artisan business.', fundedAmount: 150000 },
    { id: 'loan2', borrowerId: 'user6', amount: 1000000, interestRate: 10, term: 24, purpose: 'Capital for a small grocery store startup.', fundedAmount: 950000 },
];
