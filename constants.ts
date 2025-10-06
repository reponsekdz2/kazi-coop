// FIX: Created constants.ts to provide mock data for the application.
import { User, UserRole, Company, Job, Application, Interview, Cooperative, CooperativeMember, Loan, Transaction, SavingsGoal, Budget, LoanApplication, ActivityLog, Message, LearningModule, Testimonial } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg', skills: ['JavaScript', 'React', 'Node.js', 'Communication'], careerProgress: 3, notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false } },
  { id: 'user-2', name: 'Jean Mugabo', email: 'jean@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg', notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: true } },
  { id: 'user-3', name: 'Grace Uwase', email: 'grace@example.com', role: UserRole.SEEKER, avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg', skills: ['Project Management', 'Agile', 'Scrum'], careerProgress: 2, notificationSettings: { jobAlerts: false, messageAlerts: true, coopUpdates: true } },
  { id: 'user-4', name: 'David Ineza', email: 'david@example.com', role: UserRole.SEEKER, avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg', skills: ['Data Analysis', 'Python', 'SQL'], careerProgress: 4, notificationSettings: { jobAlerts: true, messageAlerts: false, coopUpdates: false } },
];

export const COMPANIES: Company[] = [
    { id: 'comp-1', name: 'TechSolutions Ltd.', description: 'Leading tech company in Kigali.', industry: 'Technology', location: 'Kigali, Rwanda' },
    { id: 'comp-2', name: 'Kigali Creatives', description: 'Design and marketing agency.', industry: 'Marketing', location: 'Kigali, Rwanda' }
];

export const JOBS: Job[] = [
  { id: 'job-1', employerId: 'user-2', companyId: 'comp-1', title: 'Frontend Developer', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Develop amazing user interfaces.', requirements: ['React', 'TypeScript', 'CSS'], isSaved: true, status: 'Open', salary: 1200000, workersNeeded: 2, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop' },
  { id: 'job-2', employerId: 'user-2', companyId: 'comp-1', title: 'Backend Developer', location: 'Remote', type: 'Contract', description: 'Build robust APIs and services.', requirements: ['Node.js', 'PostgreSQL', 'Docker'], isSaved: false, status: 'Open', salary: 1500000, workersNeeded: 1, rating: 4, imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop' },
  { id: 'job-3', employerId: 'user-2', companyId: 'comp-2', title: 'UI/UX Designer', location: 'Kigali, Rwanda', type: 'Full-time', description: 'Design beautiful and intuitive user experiences.', requirements: ['Figma', 'Sketch', 'User Research'], isSaved: false, status: 'Closed', salary: 1000000, workersNeeded: 1, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1601584115990-22718c50a41d?q=80&w=2574&auto=format&fit=crop' },
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', jobId: 'job-1', userId: 'user-1', status: 'Interviewing', submissionDate: '2023-10-01T10:00:00Z', applicantInfo: { educationLevel: 'Bachelors', fieldOfStudy: 'Computer Science', yearsOfExperience: 2, resumeUrl: 'aline_resume.pdf' } },
  { id: 'app-2', jobId: 'job-2', userId: 'user-3', status: 'Applied', submissionDate: '2023-10-02T11:00:00Z', applicantInfo: { educationLevel: 'Masters', fieldOfStudy: 'Business Administration', yearsOfExperience: 5, resumeUrl: 'grace_cv.pdf' } },
  { id: 'app-3', jobId: 'job-2', userId: 'user-1', status: 'Pending Review', submissionDate: new Date().toISOString(), applicantInfo: { educationLevel: 'Bachelors', fieldOfStudy: 'Computer Science', yearsOfExperience: 2, resumeUrl: 'aline_resume_v2.pdf' } },
];

export const INTERVIEWS: Interview[] = [
    { id: 'int-1', jobId: 'job-1', userId: 'user-1', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'Technical', status: 'Scheduled' }
];

export const MESSAGES: Message[] = [
    { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, we were impressed with your profile. Are you available for a chat?', timestamp: '2023-10-02T14:00:00Z' },
    { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Hi Jean, thank you! Yes, I am. How about tomorrow at 2 PM?', timestamp: '2023-10-02T14:05:00Z' }
];

const cooperativeMembers: CooperativeMember[] = [
    { userId: 'user-1', joinDate: '2023-01-15', totalContribution: 750000, lastContributionDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), status: 'active', penalties: 0 },
    { userId: 'user-2', joinDate: '2023-01-15', totalContribution: 750000, lastContributionDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), status: 'active', penalties: 0 },
    { userId: 'user-3', joinDate: '2023-01-15', totalContribution: 700000, lastContributionDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), status: 'active', penalties: 5000 },
    { userId: 'user-4', joinDate: '2023-01-15', totalContribution: 0, lastContributionDate: null, status: 'pending_approval', penalties: 0 },
]

export const COOPERATIVES: Cooperative[] = [
  { 
    id: 'coop-1', 
    name: 'TechSolutions Innovators Circle', 
    description: 'Savings group for TechSolutions employees.', 
    creatorId: 'user-2', 
    members: cooperativeMembers, 
    contributionAmount: 50000, 
    initialContribution: 10000,
    contributionFrequency: 'Monthly', 
    nextContributionDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), 
    totalSavings: 2200000, 
    totalLoans: 500000, 
    rulesAndRegulations: '1. Contribute by the 5th of each month.\n2. Late payments incur a 10% penalty.\n3. Loan requests are reviewed bi-weekly.', 
    loans: [],
    announcements: [
        { id: 'an-1', message: 'Reminder: Monthly contributions are due next week!', date: new Date().toISOString() }
    ]
  },
   { 
    id: 'coop-2', 
    name: 'Kigali Creatives Fund', 
    description: 'A weekly savings cooperative for creative professionals in Kigali.', 
    creatorId: 'user-2', 
    members: [],
    contributionAmount: 10000, 
    initialContribution: 5000,
    contributionFrequency: 'Weekly', 
    nextContributionDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), 
    totalSavings: 800000, 
    totalLoans: 150000, 
    rulesAndRegulations: '1. Contributions are due every Friday.\n2. Missing a payment results in a RWF 1,000 fine.', 
    loans: [],
    announcements: []
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', userId: 'user-1', date: '2023-10-01T09:00:00Z', description: 'Salary Deposit', amount: 800000, category: 'Income', provider: 'Bank Transfer' },
  { id: 'txn-2', userId: 'user-1', date: '2023-10-05T12:00:00Z', description: 'Co-op Contribution', amount: -50000, category: 'Savings', provider: 'Mobile Money' },
  { id: 'txn-3', userId: 'user-2', date: '2023-10-01T09:00:00Z', description: 'Client Payment', amount: 2000000, category: 'Income', provider: 'PayPal' },
  { id: 'txn-4', userId: 'user-1', date: '2023-10-06T12:00:00Z', description: 'Groceries', amount: -25000, category: 'Groceries', provider: 'Mobile Money' },
  { id: 'txn-5', userId: 'user-1', date: '2023-10-07T12:00:00Z', description: 'Transport', amount: -10000, category: 'Transport', provider: 'Mobile Money' },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', userId: 'user-1', name: 'New Laptop', targetAmount: 1200000, currentAmount: 400000, status: 'active' },
    { id: 'sg-2', userId: 'user-1', name: 'Emergency Fund', targetAmount: 500000, currentAmount: 500000, status: 'completed' }
];

export const BUDGETS: Budget[] = [
    { id: 'b-1', userId: 'user-1', category: 'Groceries', budgetAmount: 150000 },
    { id: 'b-2', userId: 'user-1', category: 'Transport', budgetAmount: 50000 }
];

export const LOAN_APPLICATIONS: LoanApplication[] = [
    // no loans initially
];

export const ACTIVITY_LOG: ActivityLog[] = [
  { id: 'log-1', type: 'NEW_MEMBER', description: 'Grace Uwase joined your cooperative.', timestamp: '2023-10-03T09:00:00Z' },
  { id: 'log-2', type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: "Backend Developer".', timestamp: '2023-10-02T15:00:00Z' },
  { id: 'log-3', type: 'SAVINGS_GOAL', description: 'You reached 33% of your "New Laptop" goal.', timestamp: '2023-10-01T10:00:00Z' },
  { id: 'log-4', type: 'LARGE_DEPOSIT', description: 'You received a large deposit of RWF 800,000.', timestamp: '2023-10-01T09:01:00Z' },
];

export const LEARNING_MODULES: LearningModule[] = [
    { 
      id: 'lm-1', title: 'Advanced React Patterns', category: 'Web Development', type: 'video', duration: '1h 45m', progress: 50, 
      content: { summary: 'Deep dive into advanced React concepts like higher-order components, render props, and context API.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', keyTakeaways: ['Understand render props pattern', 'Master Higher-Order Components (HOCs)', 'Effectively use the Context API for state management'] } 
    },
    { 
      id: 'lm-2', title: 'Effective Communication', category: 'Soft Skills', type: 'article', duration: '30m read', progress: 0, 
      content: { summary: 'Learn the fundamentals of clear, concise, and professional communication in the workplace.', articleText: 'Effective communication is the cornerstone of any successful team...', keyTakeaways: ['Active Listening techniques', 'Providing constructive feedback', 'Clarity in written communication'] } 
    },
    { 
      id: 'lm-3', title: 'Startup Fundamentals', category: 'Entrepreneurship', type: 'video', duration: '2h 15m', progress: 0, 
      content: { 
        summary: 'From idea to MVP. Learn the essential first steps to starting your own business in the tech space.', 
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
        keyTakeaways: ['Validating your business idea', 'Creating a Minimum Viable Product (MVP)', 'Basics of market research', 'Pitching to investors'] 
      },
      quiz: [
          {
              question: "What does MVP stand for?",
              options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Mainstream Viable Project"],
              correctAnswerIndex: 1
          },
          {
              question: "What is the primary goal of market research?",
              options: ["To sell your product", "To understand customer needs and market size", "To design a logo", "To hire employees"],
              correctAnswerIndex: 1
          }
      ]
    }
];

export const TESTIMONIALS: Testimonial[] = [
    { id: 't-1', name: 'Aline Umutoni', role: 'Frontend Developer', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg', quote: 'KaziCoop helped me land my dream job and the Ikimina feature is fantastic for saving!' }
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 10.2, "Loans Disbursed": 2.5 },
  { name: 'Feb', "Total Savings": 15.5, "Loans Disbursed": 4.0 },
  { name: 'Mar', "Total Savings": 22.0, "Loans Disbursed": 5.1 },
];