import { User, UserRole, Job, Application, Cooperative, MemberContribution, Transaction, LearningResource, Badge, Notification, Interview, Message } from './types';

export const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Aline Umutoni',
    email: 'aline@example.com',
    role: UserRole.SEEKER,
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    profile: {
      title: 'Software Developer',
      bio: 'Passionate frontend developer with 3 years of experience in React and TypeScript. Eager to join a mission-driven company.',
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL'],
      completeness: 80,
    },
  },
  {
    id: 'user-2',
    name: 'Jean Bosco Mugisha',
    email: 'jean@example.com',
    role: UserRole.EMPLOYER,
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    profile: {
      company: 'Innovate Rwanda Ltd.',
      bio: 'Hiring manager at a leading tech company in Kigali. Looking for talented individuals to help us build the future of tech in Africa.',
      completeness: 100,
    },
  },
  {
    id: 'user-3',
    name: 'Chantal Ingabire',
    email: 'chantal@example.com',
    role: UserRole.COOP_ADMIN,
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    profile: {
      company: 'Turemerane Cooperative',
      bio: 'Administrator for Turemerane Cooperative, focused on empowering our members financially.',
      completeness: 100,
    },
  },
  {
    id: 'user-4',
    name: 'David Nsenga',
    email: 'david@example.com',
    role: UserRole.SEEKER,
    avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    profile: {
      title: 'UX/UI Designer',
      bio: 'Creative designer focused on user-centric and beautiful interfaces. Proficient in Figma, Sketch, and Adobe XD.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing'],
      completeness: 90,
    }
  }
];

export const JOBS: Job[] = [
  { id: 'job-1', title: 'Frontend Developer', company: 'Innovate Rwanda Ltd.', location: 'Kigali, Rwanda', type: 'Full-time', postedDate: '2024-07-20', description: 'Seeking a skilled React developer to join our dynamic team.', employerId: 'user-2' },
  { id: 'job-2', title: 'UX/UI Designer', company: 'Innovate Rwanda Ltd.', location: 'Remote', type: 'Contract', postedDate: '2024-07-18', description: 'Design beautiful and intuitive user interfaces for mobile and web applications.', employerId: 'user-2' },
  { id: 'job-3', title: 'Backend Engineer (Node.js)', company: 'Africa Tech Solutions', location: 'Kigali, Rwanda', type: 'Full-time', postedDate: '2024-07-15', description: 'Build and maintain scalable server-side applications and APIs.', employerId: 'another-employer' },
];

export const APPLICATIONS: Application[] = [
  { id: 'app-1', jobId: 'job-1', seekerId: 'user-1', status: 'Interviewing', appliedDate: '2024-07-21' },
  { id: 'app-2', jobId: 'job-2', seekerId: 'user-4', status: 'Under Review', appliedDate: '2024-07-22' },
  { id: 'app-3', jobId: 'job-1', seekerId: 'user-4', status: 'Rejected', appliedDate: '2024-07-19' },
];

export const INTERVIEWS: Interview[] = [
    { id: 'int-1', jobId: 'job-1', seekerId: 'user-1', date: '2024-08-05', time: '10:00 AM', type: 'Online', status: 'Scheduled' },
];

export const COOPERATIVES: Cooperative[] = [
  { id: 'coop-1', name: 'Turemerane Cooperative', description: 'A savings and credit cooperative for local entrepreneurs.', totalSavings: 15000000, totalLoans: 8500000, membersCount: 45 },
];

export const CONTRIBUTIONS: MemberContribution[] = [
  { id: 'c-1', memberId: 'user-1', amount: 50000, date: '2024-07-01', type: 'Contribution' },
  { id: 'c-2', memberId: 'user-1', amount: 50000, date: '2024-06-01', type: 'Contribution' },
  { id: 'c-3', memberId: 'user-1', amount: 20000, date: '2024-05-15', type: 'Loan Repayment' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't-4', type: 'Withdrawal', amount: -75000, date: '2024-06-10', description: 'Bank Transfer', status: 'Completed' },
  { id: 't-3', type: 'Loan', amount: 500000, date: '2024-06-20', description: 'Small Business Loan', status: 'Completed' },
  { id: 't-2', type: 'Payment', amount: -50000, date: '2024-07-01', description: 'Cooperative Contribution', status: 'Completed' },
  { id: 't-1', type: 'Deposit', amount: 100000, date: '2024-07-15', description: 'Mobile Money Top-up', status: 'Completed' },
];

export const LEARNING_RESOURCES: LearningResource[] = [
    { id: 'learn-1', title: 'Introduction to Financial Literacy', type: 'video', duration: '15 min', thumbnailUrl: 'https://picsum.photos/seed/learn1/300/170' },
    { id: 'learn-2', title: 'How to Build a Winning CV', type: 'article', duration: '10 min read', thumbnailUrl: 'https://picsum.photos/seed/learn2/300/170' },
    { id: 'learn-3', title: 'Entrepreneurship 101: Starting Your Business', type: 'guide', duration: '45 min', thumbnailUrl: 'https://picsum.photos/seed/learn3/300/170' },
];

export const BADGES: Badge[] = [
    { id: 'badge-1', name: 'Early Bird', description: 'Completed your first saving.', icon: '☀️', unlocked: true },
    { id: 'badge-2', name: 'Job Hunter', description: 'Applied for 5 jobs.', icon: '🎯', unlocked: true },
    { id: 'badge-3', name: 'Avid Learner', description: 'Completed 3 learning modules.', icon: '🎓', unlocked: false },
    { id: 'badge-4', name: 'Super Saver', description: 'Saved consistently for 3 months.', icon: '💰', unlocked: true },
];

export const NOTIFICATIONS: Notification[] = [
    {id: 'n-1', message: 'Your interview for Frontend Developer is scheduled for tomorrow.', date: '2024-07-24', read: false},
    {id: 'n-2', message: 'Your monthly cooperative contribution is due in 3 days.', date: '2024-07-23', read: false},
    {id: 'n-3', message: 'A new job matching your skills has been posted.', date: '2024-07-22', read: true},
];

export const MESSAGES: Message[] = [
    { id: 'msg-1', conversationId: 'conv-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hi Aline, thanks for applying! We were impressed with your profile. Are you available for a quick chat tomorrow?', timestamp: '2024-07-22 14:30', read: false },
    { id: 'msg-2', conversationId: 'conv-1', senderId: 'user-1', receiverId: 'user-2', text: 'Hi Jean Bosco, thank you! Yes, I am. How about 10:00 AM?', timestamp: '2024-07-22 14:35', read: true },
    { id: 'msg-3', conversationId: 'conv-1', senderId: 'user-2', receiverId: 'user-1', text: 'Perfect. I will send you a calendar invite shortly.', timestamp: '2024-07-22 14:36', read: true },
    { id: 'msg-4', conversationId: 'conv-2', senderId: 'user-2', receiverId: 'user-4', text: 'Hello David, we\'d like to move forward with an initial design review. Please let me know your availability.', timestamp: '2024-07-23 11:00', read: true },
];
