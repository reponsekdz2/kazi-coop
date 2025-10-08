import { User, UserRole, Job, Application, Interview, Cooperative, Loan, Transaction, SavingsGoal, Budget, ActivityLog, LearningModule, Testimonial, Company, Message, CooperativeMember } from './types';

export const USERS: User[] = [
  { id: 'u-1', name: 'Aline Umutoni', email: 'aline@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=aline', skills: ['React', 'TypeScript', 'Node.js', 'Figma'], careerProgress: 3, notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: true } },
  { id: 'u-2', name: 'Jean Bosco', email: 'jean@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=jean', skills: ['Project Management', 'Agile', 'Scrum', 'Jira'], careerProgress: 2, notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false } },
  { id: 'u-3', name: 'Marie Claire', email: 'marie@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=marie', notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false } },
  { id: 'u-4', name: 'David Mugisha', email: 'david@example.com', role: UserRole.SEEKER, avatarUrl: 'https://i.pravatar.cc/150?u=david', skills: ['Python', 'Data Analysis', 'SQL'], careerProgress: 1, notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false } },
  { id: 'u-5', name: 'Admin User', email: 'admin@example.com', role: UserRole.EMPLOYER, avatarUrl: 'https://i.pravatar.cc/150?u=admin', notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false } }
];

export const COMPANIES: Company[] = [
  { id: 'c-1', name: 'TechSolutions Ltd.', description: 'A leading technology firm specializing in innovative software solutions for businesses in Africa. We are passionate about using technology to solve real-world problems.', industry: 'Technology', location: 'Kigali, Rwanda' },
  { id: 'c-2', name: 'Kigali Creatives', description: 'A dynamic design and marketing agency that helps brands tell their stories. We offer a full suite of services from branding to digital marketing.', industry: 'Marketing', location: 'Kigali, Rwanda' },
  { id: 'c-3', name: 'Rwanda AgriGrow', description: 'Focused on modernizing agriculture through technology and sustainable practices. Join us to make an impact on food security.', industry: 'Agriculture', location: 'Musanze, Rwanda' }
];

export const JOBS: Job[] = [
  { id: 'j-1', employerId: 'u-3', companyId: 'c-1', title: 'Frontend Developer', location: 'Kigali', type: 'Full-time', description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building the client-side of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.', requirements: ['2+ years of experience with React', 'Strong proficiency in TypeScript and CSS', 'Experience with RESTful APIs'], isSaved: false, status: 'Open', salary: 1200000, workersNeeded: 2, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c' },
  { id: 'j-2', employerId: 'u-3', companyId: 'c-2', title: 'UI/UX Designer', location: 'Remote', type: 'Contract', description: 'We need a creative UI/UX Designer to work on a variety of projects. The ideal candidate will have experience in creating user-centered designs and be proficient in modern design tools.', requirements: ['Proven experience as a UI/UX Designer', 'Portfolio of design projects', 'Proficiency in Figma and Sketch', 'Understanding of user research principles'], isSaved: true, status: 'Open', salary: 900000, workersNeeded: 1, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e' },
  { id: 'j-3', employerId: 'u-5', companyId: 'c-1', title: 'Backend Developer', location: 'Kigali', type: 'Full-time', description: 'Join our backend team to build and maintain the server-side logic of our applications. You will work with our team of engineers to design and implement scalable and robust systems.', requirements: ['3+ years of experience with Node.js', 'Experience with MongoDB and Express', 'Knowledge of microservices architecture'], isSaved: false, status: 'Closed', salary: 1500000, workersNeeded: 1, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5' },
  { id: 'j-4', employerId: 'u-5', companyId: 'c-3', title: 'Agronomist', location: 'Musanze', type: 'Full-time', description: 'We are seeking an experienced Agronomist to support our farming operations. You will be responsible for developing and implementing strategies to improve crop yield and quality.', requirements: ['Degree in Agronomy or related field', 'Experience with modern farming techniques', 'Knowledge of local crops and climate'], isSaved: false, status: 'Open', salary: 800000, workersNeeded: 3, rating: 4.0, imageUrl: 'https://images.unsplash.com/photo-1563214534-5406597lkj' }
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', jobId: 'j-1', userId: 'u-1', status: 'Interviewing', submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), applicantInfo: { educationLevel: 'Bachelors', fieldOfStudy: 'Computer Science', yearsOfExperience: 3, resumeUrl: 'data:application/pdf;base64,sample-base64-string' } },
  { id: 'app-2', jobId: 'j-2', userId: 'u-2', status: 'Applied', submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), applicantInfo: { educationLevel: 'Masters', fieldOfStudy: 'Graphic Design', yearsOfExperience: 5, resumeUrl: 'data:application/pdf;base64,sample-base64-string-2' } },
  { id: 'app-3', jobId: 'j-1', userId: 'u-4', status: 'Applied', submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), applicantInfo: { educationLevel: 'Bachelors', fieldOfStudy: 'Information Technology', yearsOfExperience: 1, resumeUrl: 'data:application/pdf;base64,sample-base64-string-3' } },
];

export const INTERVIEWS: Interview[] = [
    { id: 'int-1', jobId: 'j-1', userId: 'u-1', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'Technical', status: 'Scheduled', details: 'A technical interview with the engineering team via Google Meet.' },
    { id: 'int-2', jobId: 'j-4', userId: 'u-2', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), type: 'Phone Screen', status: 'Completed', details: 'Initial screening call with HR.' }
];

export const LOANS: Loan[] = [
    { id: 'l-1', memberId: 'u-1', amount: 200000, interestRate: 5, status: 'Approved', requestDate: '2023-09-01', approvalDate: '2023-09-03' },
    { id: 'l-2', memberId: 'u-2', amount: 150000, interestRate: 5, status: 'Repaid', requestDate: '2023-08-15' }
];

const cooperativeMembers: CooperativeMember[] = [
    { userId: 'u-3', joinDate: '2023-01-10', status: 'active', totalContribution: 1200000, lastContributionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), penalties: 0 },
    { userId: 'u-1', joinDate: '2023-02-15', status: 'active', totalContribution: 1000000, lastContributionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), penalties: 0 },
    { userId: 'u-4', joinDate: '2023-05-20', status: 'pending_approval', totalContribution: 0, lastContributionDate: null, penalties: 0 }
];

export const COOPERATIVES: Cooperative[] = [
    { 
        id: 'coop-1', name: 'TechSolutions Innovators Circle', description: 'A savings group for employees of TechSolutions Ltd. to foster financial growth and collaboration.',
        creatorId: 'u-3', members: cooperativeMembers, contributionAmount: 50000, contributionFrequency: 'Monthly',
        nextContributionDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(), initialContribution: 20000,
        totalSavings: 78400000, totalLoans: 12500000,
        rulesAndRegulations: '1. Monthly contributions are due on the 1st of each month.\n2. A penalty of 5% will be applied for late contributions.\n3. Loan applications are reviewed by the committee on the 15th of each month.',
        loans: LOANS, announcements: [{ id: 'anc-1', message: 'The next meeting will be held on the 25th.', date: '2023-10-05' }]
    }
];

export const TRANSACTIONS: Transaction[] = [
    { id: 't-1', userId: 'u-1', date: '2023-10-01', description: 'Salary Deposit', amount: 800000, category: 'Income', provider: 'Bank Transfer' },
    { id: 't-2', userId: 'u-1', date: '2023-10-02', description: 'Groceries', amount: -45000, category: 'Groceries', provider: 'Mobile Money' },
    { id: 't-3', userId: 'u-1', date: '2023-10-05', description: 'Contribution to Ikimina', amount: -50000, category: 'Savings', provider: 'Mobile Money' },
    { id: 't-4', userId: 'u-2', date: '2023-10-03', description: 'Project Payment', amount: 250000, category: 'Income', provider: 'PayPal' },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', userId: 'u-1', name: 'New Laptop', targetAmount: 1200000, currentAmount: 750000, status: 'active' },
    { id: 'sg-2', userId: 'u-1', name: 'Emergency Fund', targetAmount: 500000, currentAmount: 500000, status: 'completed' }
];

export const BUDGETS: Budget[] = [
    { id: 'b-1', userId: 'u-1', category: 'Groceries', budgetAmount: 100000 },
    { id: 'b-2', userId: 'u-1', category: 'Transport', budgetAmount: 50000 },
    { id: 'b-3', userId: 'u-1', category: 'Entertainment', budgetAmount: 75000 },
];

export const LOAN_APPLICATIONS = []; // No initial loan applications

export const ACTIVITY_LOG: ActivityLog[] = [
    { id: 'al-1', type: 'NEW_JOB', description: 'TechSolutions Ltd. posted a new job: Frontend Developer.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'al-2', type: 'NEW_MEMBER', description: 'David Mugisha joined the KaziCoop community.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'al-3', type: 'LARGE_DEPOSIT', description: 'Aline Umutoni deposited RWF 800,000 into her wallet.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'al-4', type: 'SAVINGS_GOAL', description: 'Jean Bosco completed his savings goal for a new phone.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];

export const LEARNING_MODULES: LearningModule[] = [
    { 
      id: 'lm-1', title: 'Advanced React Patterns', category: 'Web Development', type: 'video', duration: '1h 45m', progress: 50, 
      content: { summary: 'Deep dive into advanced React concepts like higher-order components, render props, and context API.', videoUrl: 'https://www.youtube.com/embed/TNha-m42I2c', keyTakeaways: ['Understand render props pattern', 'Master Higher-Order Components (HOCs)', 'Effectively use the Context API for state management'] } 
    },
    { 
      id: 'lm-2', title: 'Effective Communication', category: 'Soft Skills', type: 'article', duration: '30m read', progress: 0, 
      content: { summary: 'Learn the fundamentals of clear, concise, and professional communication in the workplace.', articleText: 'Effective communication is the cornerstone of any successful team. It involves not just speaking clearly, but also listening actively and understanding non-verbal cues. In a professional setting, mastering written communication, such as emails and reports, is equally crucial for conveying information accurately and efficiently.', keyTakeaways: ['Active Listening techniques', 'Providing constructive feedback', 'Clarity in written communication'] } 
    },
    { 
      id: 'lm-3', title: 'Startup Fundamentals', category: 'Entrepreneurship', type: 'video', duration: '2h 15m', progress: 0, 
      content: { 
        summary: 'From idea to MVP. Learn the essential first steps to starting your own business in the tech space.', 
        videoUrl: 'https://www.youtube.com/embed/TNha-m42I2c', 
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
    },
    { 
      id: 'lm-4', 
      title: 'Mastering Your Budget in Rwanda', 
      category: 'Financial Literacy', 
      type: 'article', 
      duration: '25m read', 
      progress: 0, 
      content: { 
        summary: 'Learn practical budgeting techniques tailored for the Rwandan context. From tracking expenses on Mobile Money to planning for long-term goals, this guide will help you take control of your finances.', 
        articleText: 'Budgeting is the first step toward financial freedom. A popular method is the 50/30/20 rule: 50% of your income goes to needs (rent, food, transport), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. In Rwanda, a significant portion of transactions happen via Mobile Money. Make it a habit to review your MoMo statement weekly to understand where your money is going. Setting SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals is crucial. Instead of "save money," a SMART goal is "save RWF 100,000 for an emergency fund in the next 6 months by saving RWF 4,200 per week."', 
        keyTakeaways: ['The 50/30/20 rule (Needs/Wants/Savings)', 'Using apps or notebooks to track Mobile Money transactions', 'Setting SMART financial goals', 'How to adjust your budget for irregular income'] 
      },
      quiz: [
          {
              question: "What percentage of income is recommended for savings in the 50/30/20 rule?",
              options: ["10%", "20%", "30%", "50%"],
              correctAnswerIndex: 1
          },
          {
              question: "What does the 'M' in SMART goals stand for?",
              options: ["Money", "Monthly", "Measurable", "Memorable"],
              correctAnswerIndex: 2
          }
      ]
    },
];

export const TESTIMONIALS: Testimonial[] = [
    { id: 't-1', name: 'Aline Umutoni', role: 'Frontend Developer', avatarUrl: 'https://i.pravatar.cc/150?u=aline', quote: 'KaziCoop helped me find a fantastic job and the Ikimina feature is helping me save for my future. It\'s a game-changer for professionals in Rwanda.' },
    { id: 't-2', name: 'Marie Claire', role: 'HR Manager at TechSolutions', avatarUrl: 'https://i.pravatar.cc/150?u=marie', quote: 'We found our best talent through KaziCoop. The platform is intuitive and connects us with a pool of skilled candidates that we couldn\'t find elsewhere.' },
    { id: 't-3', name: 'Jean Bosco', role: 'Project Manager', avatarUrl: 'https://i.pravatar.cc/150?u=jean', quote: 'The learning hub is incredible. I took a course on Agile methodologies that directly helped me in my current role. Highly recommended!' }
];

export const MESSAGES: Message[] = [
    { id: 'm-1', senderId: 'u-1', receiverId: 'u-3', text: 'Hello, I have a question about the Frontend Developer position.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'm-2', senderId: 'u-3', receiverId: 'u-1', text: 'Hi Aline, I\'d be happy to answer. What would you like to know?', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString() },
    { id: 'm-3', senderId: 'u-2', receiverId: 'u-5', text: 'Good afternoon.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

export const cooperativeFinancialsData = [
  { name: 'Jan', "Total Savings": 40.1, "Loans Disbursed": 10.5 },
  { name: 'Feb', "Total Savings": 45.3, "Loans Disbursed": 8.2 },
  { name: 'Mar', "Total Savings": 52.5, "Loans Disbursed": 15.1 },
  { name: 'Apr', "Total Savings": 58.8, "Loans Disbursed": 12.0 },
  { name: 'May', "Total Savings": 65.2, "Loans Disbursed": 18.3 },
  { name: 'Jun', "Total Savings": 71.9, "Loans Disbursed": 14.7 },
  { name: 'Jul', "Total Savings": 78.4, "Loans Disbursed": 20.1 },
];
