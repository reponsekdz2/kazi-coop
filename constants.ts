import { User, UserRole, Company, Job, Application, Interview, Transaction, SavingsGoal, Budget, Cooperative, LoanApplication, Message, LearningModule, ActivityLog, Testimonial } from './types';

export const USERS: User[] = [
  { 
    id: 'user-1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-1', 
    skills: ['Financial Analysis', 'Microsoft Excel', 'Communication', 'Budgeting'], careerProgress: 3, careerGoal: 'Become a Senior Financial Analyst',
    profileData: { dateOfBirth: '1998-02-15', gender: 'Female', educationLevel: 'Masters', fieldOfStudy: 'Finance', yearsOfExperience: 2, resumeUrl: 'aline_resume.pdf', profileImage: 'https://i.pravatar.cc/150?u=user-1' },
    notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false }
  },
  { 
    id: 'user-2', name: 'Peter Mugabo', email: 'peter@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-2', 
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'], careerProgress: 4, careerGoal: 'Transition to a Full-Stack Developer role',
    profileData: { dateOfBirth: '1995-05-20', gender: 'Male', educationLevel: 'Bachelors', fieldOfStudy: 'Computer Science', yearsOfExperience: 3, resumeUrl: 'peter_resume.pdf', profileImage: 'https://i.pravatar.cc/150?u=user-2' },
    notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: true }
  },
  { 
    id: 'user-3', name: 'Grace Uwase', email: 'grace@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-3', 
    skills: ['Customer Service', 'Sales', 'CRM Software'], careerProgress: 1,
    notificationSettings: { jobAlerts: false, messageAlerts: true, coopUpdates: true }
  },
  { 
    id: 'user-4', name: 'David Ishimwe', email: 'david@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user-4', 
    skills: ['Graphic Design', 'Adobe Creative Suite', 'Branding', 'UI/UX'], careerProgress: 2,
    notificationSettings: { jobAlerts: true, messageAlerts: false, coopUpdates: false }
  },
  { 
    id: 'user-5', name: 'Jean Bizimana', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
    notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: true }
  },
  { 
    id: 'user-6', name: 'Marie Claire', email: 'marie@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user-6',
    notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: true }
  },
];

export const COMPANIES: Company[] = [
  { id: 'comp-1', name: 'TechSolutions Ltd.', description: 'A leading software development company in Kigali.', industry: 'Technology', location: 'Kigali, Rwanda' },
  { id: 'comp-2', name: 'Kigali Creatives', description: 'A design and marketing agency.', industry: 'Marketing', location: 'Kigali, Rwanda' },
  { id: 'comp-3', name: 'Rwanda Finance Inc.', description: 'A major financial services provider.', industry: 'Finance', location: 'Kigali, Rwanda' },
];

export const JOBS: Job[] = [
  { id: 'job-1', title: 'Frontend Developer', companyId: 'comp-1', employerId: 'user-5', location: 'Kigali', type: 'Full-time', description: 'Develop and maintain user-facing features for our web applications.', requirements: ['React', 'TypeScript', 'CSS'], status: 'Open', isSaved: true, salary: 1500000, workersNeeded: 2, rating: 5, imageUrl: 'https://placehold.co/600x400/005A9C/white?text=Tech' },
  { id: 'job-2', title: 'Graphic Designer', companyId: 'comp-2', employerId: 'user-6', location: 'Remote', type: 'Contract', description: 'Create visually stunning graphics for digital and print media.', requirements: ['Adobe Photoshop', 'Adobe Illustrator'], status: 'Open', isSaved: false, salary: 800000, workersNeeded: 1, rating: 4, imageUrl: 'https://placehold.co/600x400/10B981/white?text=Creative' },
  { id: 'job-3', title: 'Financial Analyst', companyId: 'comp-3', employerId: 'user-5', location: 'Kigali', type: 'Full-time', description: 'Analyze financial data and provide insights to support business decisions.', requirements: ['Finance Degree', 'Excel', 'CPA'], status: 'Closed', isSaved: false, salary: 1200000, workersNeeded: 1, rating: 4 },
  { id: 'job-4', title: 'Customer Support Rep', companyId: 'comp-1', employerId: 'user-5', location: 'Kigali', type: 'Part-time', description: 'Assist customers with their inquiries and issues.', requirements: ['Communication Skills', 'Patience'], status: 'Open', isSaved: false, salary: 400000, workersNeeded: 3, rating: 3, imageUrl: 'https://placehold.co/600x400/5E96C3/white?text=Support' },
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', userId: 'user-2', jobId: 'job-1', submissionDate: '2023-10-01T10:00:00Z', status: 'Interviewing', applicantInfo: USERS[1].profileData! },
  { id: 'app-2', userId: 'user-1', jobId: 'job-3', submissionDate: '2023-09-28T14:00:00Z', status: 'Offered', applicantInfo: USERS[0].profileData! },
  { id: 'app-3', userId: 'user-4', jobId: 'job-2', submissionDate: '2023-10-02T11:00:00Z', status: 'Applied', applicantInfo: { dateOfBirth: '2000-11-10', gender: 'Male', educationLevel: 'Diploma', fieldOfStudy: 'Art & Design', yearsOfExperience: 1, resumeUrl: 'david_resume.pdf', profileImage: USERS[3].avatarUrl } },
  { id: 'app-4', userId: 'user-3', jobId: 'job-1', submissionDate: '2023-10-03T09:00:00Z', status: 'Reviewed', applicantInfo: { dateOfBirth: '1999-01-01', gender: 'Female', educationLevel: 'High School', fieldOfStudy: 'General Studies', yearsOfExperience: 2, resumeUrl: 'grace_resume.pdf', profileImage: USERS[2].avatarUrl } },
];

export const INTERVIEWS: Interview[] = [
  { id: 'int-1', userId: 'user-2', jobId: 'job-1', date: new Date(Date.now() + 3 * 86400000).toISOString(), type: 'Technical', status: 'Scheduled' },
  { id: 'int-2', userId: 'user-1', jobId: 'job-3', date: '2023-09-15T13:00:00Z', type: 'Final', status: 'Completed' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', userId: 'user-1', date: '2023-10-01T08:00:00Z', description: 'Salary Deposit', amount: 500000, category: 'Income', provider: 'Bank Transfer' },
  { id: 'txn-2', userId: 'user-1', date: '2023-10-01T12:00:00Z', description: 'Groceries', amount: -25000, category: 'Groceries', provider: 'Mobile Money' },
  { id: 'txn-3', userId: 'user-1', date: '2023-10-02T09:00:00Z', description: 'Contribution to Ikimina', amount: -50000, category: 'Cooperative', provider: 'Mobile Money' },
  { id: 'txn-4', userId: 'user-2', date: '2023-10-01T08:00:00Z', description: 'Project Payment', amount: 800000, category: 'Income', provider: 'PayPal' },
  { id: 'txn-5', userId: 'user-5', date: '2023-10-01T08:00:00Z', description: 'Client Payment', amount: 2500000, category: 'Income', provider: 'Bank Transfer' },
  { id: 'txn-6', userId: 'user-5', date: '2023-10-02T12:00:00Z', description: 'Office Supplies', amount: -150000, category: 'Utilities', provider: 'Mobile Money' },
  { id: 'txn-7', userId: 'user-5', date: '2023-10-03T09:00:00Z', description: 'Software Subscription', amount: -75000, category: 'Utilities', provider: 'PayPal' },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'sg-1', userId: 'user-1', name: 'New Laptop', targetAmount: 1000000, currentAmount: 650000, deadline: '2024-03-01T00:00:00Z' },
];

export const BUDGETS: Budget[] = [
  { id: 'b-1', userId: 'user-1', category: 'Groceries', budgetAmount: 100000 },
];

export const COOPERATIVES: Cooperative[] = [
    { 
      id: 'coop-1', name: 'TechSolutions Innovators Circle', creatorId: 'user-5', 
      description: 'A savings group for employees of TechSolutions.', 
      contributionAmount: 50000, contributionFrequency: 'Monthly', 
      members: [
        { userId: 'user-1', joinDate: '2023-01-15T00:00:00Z', totalContribution: 450000, lastContributionDate: '2023-09-15T00:00:00Z' }, 
        { userId: 'user-2', joinDate: '2023-02-01T00:00:00Z', totalContribution: 400000, lastContributionDate: '2023-09-01T00:00:00Z' }
      ], 
      walletBalance: 850000, 
      loans: [
          { id: 'l-1', memberId: 'user-2', amount: 200000, requestDate: '2023-08-10T00:00:00Z', status: 'Approved', repaymentDueDate: '2023-11-10T00:00:00Z'}
      ],
      rulesAndRegulations: "1. All members must contribute by the 5th of each month.\n2. Loan requests are reviewed on the 15th of each month.\n3. Late contributions will incur a 5% penalty.",
      announcements: [{ id: 'anno-1', message: 'Welcome to our new member, Grace!', date: '2023-10-05T10:00:00Z' }],
      joinRequests: [{ userId: 'user-3', date: '2023-10-04T12:00:00Z' }]
    },
];

export const LOAN_APPLICATIONS: LoanApplication[] = [];

export const MESSAGES: Message[] = [
  { id: 'msg-1', senderId: 'user-5', receiverId: 'user-2', text: 'Hi Peter, we were impressed with your profile. Are you available for an interview next week?', timestamp: '2023-10-02T15:00:00Z' },
  { id: 'msg-2', senderId: 'user-2', receiverId: 'user-5', text: 'Hello Jean, that sounds great! I am available anytime on Tuesday or Wednesday.', timestamp: '2023-10-02T15:05:00Z' },
];

export const LEARNING_MODULES: LearningModule[] = [
    { id: 'lm-1', title: 'Advanced React Patterns', category: 'Web Development', type: 'video', duration: '45 min', progress: 60, content: { summary: 'Learn advanced techniques for building scalable React applications.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', keyTakeaways: ['State management with Context API', 'Higher-Order Components', 'Performance Optimization'] } },
    { id: 'lm-2', title: 'Introduction to Financial Modeling', category: 'Finance', type: 'article', duration: '1 hr read', progress: 20, content: { summary: 'A beginner-friendly guide to financial modeling in Excel.', articleText: 'Financial modeling is a crucial skill...\n\nAnother paragraph here.', keyTakeaways: ['Building a 3-statement model', 'Forecasting revenues', 'Valuation techniques'] } },
];

export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'al-1', type: 'NEW_MEMBER', description: 'Grace Uwase joined KaziCoop.', timestamp: '2023-10-03T09:00:00Z' },
    { id: 'al-2', type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Customer Support Rep.', timestamp: '2023-10-02T14:00:00Z' },
    { id: 'al-3', type: 'SAVINGS_GOAL', description: 'Aline Umutoni reached 65% of her "New Laptop" savings goal.', timestamp: '2023-10-01T18:00:00Z' },
    { id: 'al-4', type: 'LARGE_DEPOSIT', description: 'Peter Mugabo made a large deposit of RWF 800,000.', timestamp: '2023-10-01T08:00:00Z' },
];

export const TESTIMONIALS: Testimonial[] = [
    { id: 't-1', name: 'Aline Umutoni', role: 'Financial Analyst', quote: 'KaziCoop helped me land my dream job and the Ikimina feature is helping me save for my masters degree. It\'s a game-changer!', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
    { id: 't-2', name: 'Peter Mugabo', role: 'Software Developer', quote: 'The platform is intuitive and connected me with a top tech company in Kigali. The learning resources are also a huge plus.', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
    { id: 't-3', name: 'Jean Bizimana', role: 'Hiring Manager, TechSolutions', quote: 'We found our best candidates through KaziCoop. The quality of the talent pool is exceptional.', avatarUrl: 'https://i.pravatar.cc/150?u=user-5' },
];

export const cooperativeFinancialsData = [
    { name: 'Jan', "Total Savings": 10.5, "Loans Disbursed": 2.1 },
    { name: 'Feb', "Total Savings": 15.2, "Loans Disbursed": 3.4 },
    { name: 'Mar', "Total Savings": 22.8, "Loans Disbursed": 5.0 },
    { name: 'Apr', "Total Savings": 30.1, "Loans Disbursed": 6.8 },
    { name: 'May', "Total Savings": 45.6, "Loans Disbursed": 9.5 },
    { name: 'Jun', "Total Savings": 58.2, "Loans Disbursed": 12.1 },
    { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 16.3 },
];
