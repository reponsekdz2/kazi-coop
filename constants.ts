import { User, UserRole, Job, Application, Cooperative, Message, Transaction, SavingsGoal, Budget, LoanApplication, LearningModule, LearningPath, ActivityLog, CooperativeActivity, CooperativeActivityType, Interview } from './types';

// USERS
export const USERS: User[] = [
  { id: 'user-1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user1', skills: ['JavaScript', 'React', 'HTML/CSS', 'Agile'], careerProgress: 3, careerGoal: "Become a Senior Frontend Developer", completedModuleIds: ['lm-1', 'lm-2'] },
  { id: 'user-2', name: 'Jean-Claude D.', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=user2', companyName: 'TechSolutions Ltd.', companyDescription: 'A leading technology firm in Kigali, specializing in innovative software solutions for businesses across East Africa.', companyLogoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600' },
  { id: 'user-3', name: 'Admin User', email: 'admin@example.com', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
  { id: 'user-4', name: 'Kevine N.', email: 'kevine@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user4', skills: ['Project Management', 'Scrum', 'JIRA'], careerProgress: 1, careerGoal: "Start my own business" },
  { id: 'user-5', name: 'Samuel M.', email: 'samuel@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=user5', skills: ['Node.js', 'Express', 'MongoDB'], careerProgress: 4 },
];

// JOBS
export const JOBS: Job[] = [
  { 
    id: 'job-1', 
    employerId: 'user-2', 
    title: 'Senior Frontend Developer', 
    company: 'TechSolutions Ltd.', 
    companyLogoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', 
    location: 'Kigali, Rwanda', 
    type: 'Full-time', 
    salary: 'RWF 1.5M - 2M', 
    description: 'We are looking for an experienced frontend developer to join our dynamic team. You will be responsible for building the client-side of our web applications, ensuring a seamless user experience. You should be able to translate our company and customer needs into functional and appealing interactive applications.', 
    requirements: ['5+ years experience with React', 'Proficiency in TypeScript and modern state management libraries', 'Strong understanding of RESTful APIs', 'Experience with Agile development methodologies'], 
    requiredDocuments: ['CV', 'Cover Letter', 'Portfolio'],
    requiredSkills: ['React', 'TypeScript', 'Redux', 'Jest', 'Tailwind CSS'],
    matchScore: 92 
  },
  { 
    id: 'job-2', 
    employerId: 'user-2', 
    title: 'Project Manager', 
    company: 'BuildIt Rwanda', 
    companyLogoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=600', 
    location: 'Remote', 
    type: 'Contract', 
    salary: 'RWF 1.2M', 
    description: 'Manage our new construction project from start to finish. Responsibilities include defining project scope, setting deadlines, assigning responsibilities, and monitoring progress. You will need excellent communication and leadership skills.', 
    requirements: ['Agile or PMP Certification', '3+ years of project management experience', 'Strong leadership and communication skills', 'Experience in the construction industry is a plus'], 
    requiredDocuments: ['CV', 'Cover Letter'],
    requiredSkills: ['Agile', 'Scrum', 'JIRA', 'Budget Management'],
    matchScore: 78 
  },
  { 
    id: 'job-3', 
    employerId: 'user-2', 
    title: 'Backend Engineer', 
    company: 'Fintech Innovators', 
    companyLogoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600', 
    location: 'Kigali, Rwanda', 
    type: 'Full-time', 
    salary: 'RWF 1.3M - 1.8M', 
    description: 'Develop and maintain our backend services. This includes managing databases, building server-side logic, and integrating with third-party services. A strong understanding of security and scalability is required.', 
    requirements: ['Expertise in Node.js and PostgreSQL', 'Experience designing and building microservices architecture', 'Familiarity with cloud platforms (AWS, Azure, or GCP)', 'Knowledge of financial systems is a bonus'], 
    requiredDocuments: ['CV', 'Diploma'],
    requiredSkills: ['Node.js', 'PostgreSQL', 'Microservices', 'AWS', 'REST APIs'],
    matchScore: 85 
  },
  { 
    id: 'job-4', 
    employerId: 'user-2', 
    title: 'UX/UI Designer', 
    company: 'Creative Minds Inc.', 
    companyLogoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=rose&shade=600', 
    location: 'Kigali, Rwanda', 
    type: 'Part-time', 
    salary: 'RWF 700k', 
    description: 'Create beautiful and intuitive user interfaces. You will be involved in the entire design process, from user research and wireframing to creating high-fidelity mockups and prototypes.', 
    requirements: ['Proficiency in Figma, Sketch, or Adobe XD', 'A strong portfolio showcasing your design process', 'Experience with user research and usability testing', 'Ability to work collaboratively with developers and product managers'], 
    requiredDocuments: ['CV', 'Portfolio'],
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    matchScore: 65 
  },
];

// APPLICATIONS
export const APPLICATIONS: Application[] = [
    { 
      id: 'app-1', userId: 'user-1', jobId: 'job-1', status: 'Interviewing', matchScore: 92, submissionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { status: 'Reviewed', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { status: 'Interviewing', date: new Date(Date.now() - 86400000 * 1).toISOString() }
      ]
    },
    { 
      id: 'app-2', userId: 'user-4', jobId: 'job-2', status: 'Applied', matchScore: 78, submissionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 2).toISOString() }
      ]
    },
    { 
      id: 'app-3', userId: 'user-5', jobId: 'job-3', status: 'Reviewed', matchScore: 85, submissionDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 10).toISOString() },
        { status: 'Reviewed', date: new Date(Date.now() - 86400000 * 8).toISOString() }
      ]
    },
    { 
      id: 'app-4', userId: 'user-1', jobId: 'job-3', status: 'Applied', matchScore: 60, submissionDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 1).toISOString() }
      ]
    },
    { 
      id: 'app-5', userId: 'user-4', jobId: 'job-1', status: 'Applied', matchScore: 70, submissionDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 3).toISOString() }
      ]
    },
    { 
      id: 'app-6', userId: 'user-5', jobId: 'job-1', status: 'Rejected', matchScore: 55, submissionDate: new Date(Date.now() - 86400000 * 6).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 6).toISOString() },
        { status: 'Reviewed', date: new Date(Date.now() - 86400000 * 4).toISOString() },
        { status: 'Rejected', date: new Date(Date.now() - 86400000 * 3).toISOString() }
      ]
    },
    { 
      id: 'app-7', userId: 'user-1', jobId: 'job-4', status: 'Offered', matchScore: 88, submissionDate: new Date(Date.now() - 86400000 * 4).toISOString(),
      statusHistory: [
        { status: 'Applied', date: new Date(Date.now() - 86400000 * 4).toISOString() },
        { status: 'Reviewed', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { status: 'Interviewing', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { status: 'Offered', date: new Date(Date.now() - 86400000 * 1).toISOString() }
      ]
    },
];

// INTERVIEWS
export const INTERVIEWS: Interview[] = [
    { id: 'int-1', applicationId: 'app-1', jobId: 'job-1', userId: 'user-1', date: new Date(Date.now() + 86400000 * 2).toISOString(), type: 'Online' },
    { id: 'int-2', applicationId: 'app-3', jobId: 'job-3', userId: 'user-5', date: new Date(Date.now() + 86400000 * 4).toISOString(), type: 'In-Person' },
    { id: 'int-3', applicationId: 'app-7', jobId: 'job-4', userId: 'user-1', date: new Date(Date.now() + 86400000 * 1).toISOString(), type: 'Online' },
];

// COOPERATIVES
export const COOPERATIVES: Cooperative[] = [
    { 
      id: 'coop-1', 
      name: 'TechSolutions Innovators Circle', 
      description: 'A savings group for tech professionals aiming to invest in startups.', 
      memberIds: ['user-1', 'user-4', 'user-5'], 
      totalSavings: 2500000, 
      loanPoolAmount: 1800000, 
      coverImageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800', 
      goal: 'Invest in a local tech startup', 
      goalProgress: 60,
      messages: [
        { id: 'cm-1', userId: 'user-4', userName: 'Kevine N.', userAvatar: 'https://i.pravatar.cc/150?u=user4', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), text: "Excited about our progress! Does anyone have updates on potential startups to invest in?"},
        { id: 'cm-2', userId: 'user-1', userName: 'Aline Umutoni', userAvatar: 'https://i.pravatar.cc/150?u=user1', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), text: "I've been looking into a few fintech startups. I can share a summary at our next meeting."},
      ]
    },
    { 
      id: 'coop-2', 
      name: 'Kigali Creatives Fund', 
      description: 'For designers and artists saving for new equipment and studio space.', 
      memberIds: [], 
      totalSavings: 1200000, 
      loanPoolAmount: 750000, 
      coverImageUrl: 'https://images.unsplash.com/photo-1558690554-485457f9c286?q=80&w=800', 
      goal: 'Purchase new design software', 
      goalProgress: 85,
      messages: []
    },
];

// COOPERATIVE_ACTIVITIES
export const COOPERATIVE_ACTIVITIES: CooperativeActivity[] = [
    { id: 'ca-1', cooperativeId: 'coop-1', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), type: CooperativeActivityType.NEW_MEMBER, description: 'Samuel M. joined the cooperative.', actorUserId: 'user-5' },
    { id: 'ca-2', cooperativeId: 'coop-1', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), type: CooperativeActivityType.CONTRIBUTION, description: 'Aline U. contributed to savings.', actorUserId: 'user-1', amount: 50000 },
    { id: 'ca-3', cooperativeId: 'coop-1', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), type: CooperativeActivityType.LOAN_APPROVED, description: 'A loan was approved for Kevine N.', actorUserId: 'user-4', amount: 200000 },
    { id: 'ca-4', cooperativeId: 'coop-1', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), type: CooperativeActivityType.MEETING_SCHEDULED, description: 'Monthly review meeting scheduled for next week.' },
    { id: 'ca-5', cooperativeId: 'coop-2', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), type: CooperativeActivityType.GOAL_REACHED, description: 'Reached the savings goal for "New Design Software"!' },
];

// MESSAGES
export const MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, we were impressed with your application. Are you available for an interview next week?', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Hello Jean-Claude, thank you! Yes, I am available. Does Tuesday at 10 AM work for you?', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'msg-3', senderId: 'user-4', receiverId: 'user-5', text: 'Hey, are you joining the co-op meeting tonight?', timestamp: new Date().toISOString() },
];

// TRANSACTIONS
export const TRANSACTIONS: Transaction[] = [
    { id: 't-1', userId: 'user-1', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Salary Deposit', amount: 800000, category: 'Income' },
    { id: 't-2', userId: 'user-1', date: new Date(Date.now() - 86400000 * 4).toISOString(), description: 'Groceries', amount: -45000, category: 'Groceries' },
    { id: 't-3', userId: 'user-1', date: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Co-op Contribution', amount: -50000, category: 'Savings Contribution' },
    { id: 't-4', userId: 'user-1', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Moto Fare', amount: -5000, category: 'Transport' },
    { id: 't-5', userId: 'user-1', date: new Date(Date.now() - 86400000 * 1).toISOString(), description: 'Canal+ Subscription', amount: -15000, category: 'Entertainment' },
];

// SAVINGS_GOALS
export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', userId: 'user-1', name: 'New Laptop', targetAmount: 1200000, currentAmount: 750000 },
    { id: 'sg-2', userId: 'user-1', name: 'Emergency Fund', targetAmount: 500000, currentAmount: 500000 },
];

// BUDGETS
export const BUDGETS: Budget[] = [
    { id: 'b-1', userId: 'user-1', category: 'Groceries', budgetAmount: 100000 },
    { id: 'b-2', userId: 'user-1', category: 'Transport', budgetAmount: 30000 },
    { id: 'b-3', userId: 'user-1', category: 'Entertainment', budgetAmount: 50000 },
];

// LOAN_APPLICATIONS
export const LOAN_APPLICATIONS: LoanApplication[] = [
    { id: 'la-1', userId: 'user-1', amount: 500000, purpose: 'Buy new laptop', repaymentPeriod: 6, interestRate: 5, status: 'Approved', remainingAmount: 250000, 
      repaymentSchedule: [
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), amount: 87500, status: 'paid'},
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), amount: 87500, status: 'paid'},
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() + 0)).toISOString(), amount: 87500, status: 'pending'},
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), amount: 87500, status: 'pending'},
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(), amount: 87500, status: 'pending'},
        {dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), amount: 87500, status: 'pending'},
      ], 
      repayments: [
        {amount: 87500, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString()},
        {amount: 87500, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()},
      ] 
    },
    { id: 'la-2', userId: 'user-1', amount: 200000, purpose: 'Professional Course', repaymentPeriod: 4, interestRate: 5, status: 'Fully Repaid', remainingAmount: 0, repaymentSchedule: [], repayments: [] },
    { id: 'la-3', userId: 'user-1', amount: 100000, purpose: 'Family Emergency', repaymentPeriod: 3, interestRate: 5, status: 'Pending', remainingAmount: 100000, repaymentSchedule: [], repayments: [] },
];

// LEARNING_MODULES
export const LEARNING_MODULES: LearningModule[] = [
    { id: 'lm-1', title: 'Advanced React Hooks', category: 'Web Development', type: 'video', coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800', duration: '45 min', content: { summary: 'Dive deep into React hooks like useMemo, useCallback, and create your own custom hooks.', videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', keyTakeaways: ['Memoization with useMemo and useCallback', 'Building reusable custom hooks', 'Managing complex state with useReducer'] } },
    { id: 'lm-2', title: 'State Management with Redux', category: 'Web Development', type: 'article', coverImageUrl: 'https://images.unsplash.com/photo-1618423284702-a42e5b41492c?q=80&w=800', duration: '30 min read', content: { summary: 'Learn the core principles of Redux for predictable state management in large applications.', articleText: 'Redux is a predictable state container for JavaScript apps...', keyTakeaways: ['The single source of truth: the Store', 'State is read-only: dispatching Actions', 'Changes are made with pure functions: Reducers'] } },
    { id: 'lm-3', title: 'Agile Project Management', category: 'Career Skills', type: 'video', coverImageUrl: 'https://images.unsplash.com/photo-1542626991-a2f575a45b67?q=80&w=800', duration: '1 hour', content: { summary: 'An introduction to Agile methodologies, including Scrum and Kanban.', videoUrl: 'https://www.youtube.com/embed/t5c4yG6T72Q', keyTakeaways: ['The Agile Manifesto', 'Understanding Scrum roles and ceremonies', 'Visualizing workflow with Kanban boards'] } },
    { id: 'lm-4', title: 'Business Plan 101', category: 'Entrepreneurship', type: 'article', coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800', duration: '40 min read', content: { summary: 'Craft a compelling business plan to guide your venture and attract investors.', articleText: 'A business plan is your roadmap...', keyTakeaways: ['Defining your value proposition', 'Market analysis and competitor research', 'Financial projections and funding needs'] } },
    { id: 'lm-5', title: 'Marketing on a Shoestring', category: 'Entrepreneurship', type: 'video', coverImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800', duration: '50 min', content: { summary: 'Learn low-cost, high-impact marketing strategies for your new business.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', keyTakeaways: ['Leveraging social media for free', 'Content marketing basics', 'Building an email list'] } },
    { id: 'lm-6', title: 'Small Business Finance Basics', category: 'Entrepreneurship', type: 'article', coverImageUrl: 'https://images.unsplash.com/photo-1632236542614-6178a2744825?q=80&w=800', duration: '35 min read', content: { summary: 'Understand the essentials of managing your business finances from day one.', articleText: 'Good financial management is key...', keyTakeaways: ['Separating personal and business finances', 'Tracking income and expenses', 'Understanding profit and loss'] } },
];

// LEARNING_PATHS
export const LEARNING_PATHS: LearningPath[] = [
    { id: 'lp-1', title: 'Become a Senior Frontend Developer', description: 'Master advanced frontend concepts to level up your career.', relevantGoal: 'Become a Senior Frontend Developer', moduleIds: ['lm-1', 'lm-2', 'lm-3'] },
    { id: 'lp-2', title: 'Start Your Business Journey', description: 'Your guide to launching a successful business with low capital.', relevantGoal: 'Start my own business', moduleIds: ['lm-4', 'lm-5', 'lm-6'] },
];

// ACTIVITY_LOG
export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'log-1', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'NEW_MEMBER', description: 'Kevine N. joined KaziCoop.' },
    { id: 'log-2', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Senior Frontend Developer.' },
    { id: 'log-3', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'SAVINGS_GOAL', description: 'Aline U. reached their savings goal for "Emergency Fund".' },
    { id: 'log-4', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), type: 'LARGE_DEPOSIT', description: 'A contribution of RWF 500,000 was made to TechSolutions Innovators Circle.' },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 10 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 12 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 15 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 18 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 20 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 22 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 25 },
];