import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { AuthProvider } from './AuthContext';
import { CooperativeProvider } from './CooperativeContext';
import { TransactionProvider } from './TransactionContext';
import { SavingsGoalProvider } from './SavingsGoalContext';
import { BudgetProvider } from './BudgetContext';
import { LoanProvider } from './LoanContext';
import { ToastProvider } from './ToastContext';
import { InterviewProvider } from './InterviewContext';
import { JobProvider } from './JobContext';
import { ApplicationProvider } from './ApplicationContext';

type Theme = 'light' | 'dark';
type Language = 'en' | 'fr' | 'rw';

// Simple i18n implementation
const translations: Record<Language, Record<string, any>> = {
  en: {
    sidebar: {
        dashboard: 'Dashboard',
        findJobs: 'Find Jobs',
        interviews: 'Interviews',
        cooperatives: 'Cooperatives',
        wallet: 'Wallet',
        learningHub: 'Learning Hub',
        messages: 'Messages',
        myProfile: 'My Profile',
        helpCenter: 'Help Center',
        jobManagement: 'Job Management',
        talentPool: 'Talent Pool',
        platformAnalytics: 'Platform Analytics',
        walletManagement: 'Wallet Management',
        cooperativeManagement: 'Cooperative Management',
    },
    header: {
        profile: 'My Profile',
        logout: 'Logout'
    },
    login: {
        welcome: 'Welcome Back!',
        continue: 'Log in to continue your journey with KaziCoop.',
        jobSeeker: 'Job Seeker',
        employer: 'Employer',
        email: 'Email Address',
        password: 'Password',
        loginAs: 'Login as {role}',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
    },
    dashboard: {
        welcome: 'Welcome back, {name}!',
        activeApplications: 'Active Applications',
        interviewsScheduled: 'Interviews Scheduled',
        totalSavings: 'Total Savings',
        profileCompletion: 'Profile Completion',
        careerJourney: 'Your Career Journey',
        recommendedJobs: 'Recommended Jobs',
        view: 'View',
        employerDashboard: 'Employer Dashboard',
        activePostings: 'Active Postings',
        newApplicants: 'New Applicants',
        interviewsThisWeek: 'Interviews This Week',
        avgMatchScore: 'Avg. Match Score',
        applicationTrends: 'Application Trends',
        applicantStatus: 'Applicant Status',
        upcomingInterviews: 'Upcoming Interviews',
        forJob: 'For: {jobTitle}',
        noUpcomingInterviews: 'No upcoming interviews.',
        viewInterviewSchedule: 'View Full Schedule'
    },
    applicationStatus: {
        Applied: 'Applied',
        Reviewed: 'Reviewed',
        Interviewing: 'Interviewing',
        Offered: 'Offered',
        Rejected: 'Rejected',
    },
    wallet: {
        title: 'My Wallet',
        employerTitle: 'Company Wallet Management',
        sendMoney: 'Send Money',
        addMoney: 'Add Money',
        tabs: {
            overview: 'Overview',
            savings: 'Savings',
            loans: 'Loans',
            budgeting: 'Budgeting',
        },
        balance: 'Total Balance',
        spentThisMonth: 'Spent this month',
        totalSavings: 'Total Savings',
        activeLoans: 'Active Loans',
        spendingBreakdown: 'Spending Breakdown',
        savingsGoals: 'Savings Goals',
        budgets: 'Budgets',
        categories: {
            income: 'Income',
            utilities: 'Utilities',
            groceries: 'Groceries',
            transport: 'Transport',
            entertainment: 'Entertainment',
            loanrepayment: 'Loan Repayment',
            savingscontribution: 'Savings Contribution',
            business: 'Business',
        },
        budgeting: {
            createNewBudget: 'New Budget',
            overbudgetLabel: 'Overbudget',
            remainingLabel: 'Remaining',
            newBudgetTitle: 'Create a New Budget',
            category: 'Category',
            budgetAmount: 'Budget Amount',
        },
        loans: {
            title: 'My Loans',
            applyForLoan: 'Apply for Loan',
            viewDetails: 'View Details',
            status: {
                Pending: 'Pending',
                Approved: 'Approved',
                Rejected: 'Rejected',
                FullyRepaid: 'Fully Repaid',
            },
            loanDetailsTitle: 'Loan Details',
            remaining: 'Remaining',
            makeRepayment: 'Make Repayment',
            summary: 'Summary',
            principal: 'Principal Amount',
            interestRate: 'Interest Rate',
            totalPaid: 'Total Paid',
            repaymentHistory: 'Repayment History',
            date: 'Date',
            amount: 'Amount',
            noRepayments: 'No repayments made yet.',
            repaymentAmount: 'Repayment Amount',
            newLoanApplication: 'New Loan Application',
            loanAmount: 'Loan Amount (RWF)',
            loanPurpose: 'Purpose of Loan',
            repaymentPeriod: 'Repayment Period (Months)',
            dueDate: 'Due Date'
        },
        upcomingPayments: {
            title: 'Upcoming Payments',
            overdue: 'Overdue',
            dueIn: 'Due in',
            days: 'days'
        },
        companyBalance: 'Company Balance',
        totalPayouts: 'Total Payouts (YTD)',
        coopInvestments: 'Co-op Investments',
        operationalBudget: 'Operational Budget Allocation'
    },
    profile: {
        title: 'My Profile',
        changePicture: 'Change Picture',
        skills: 'My Skills',
        profileStrength: 'Profile Strength',
        completeProfilePrompt: 'Complete your profile to increase your visibility to employers.',
        completeProfileBtn: 'Complete Profile',
        personalInfo: 'Personal Information',
        edit: 'Edit',
        fullName: 'Full Name',
        email: 'Email Address',
        role: 'Role',
        password: 'Password',
        changePassword: 'Change Password',
        activityTimeline: 'Activity Timeline',
    },
    helpCenter: {
        title: 'Help Center',
        subtitle: "How can we help you today?",
        searchPlaceholder: 'Search for articles...',
        categories: {
            general: 'General',
            jobs: 'Jobs',
            cooperatives: 'Cooperatives',
            wallet: 'Wallet',
        },
        faqs: {
            q1: 'How do I apply for a job?',
            a1: 'Navigate to the "Find Jobs" page, browse the listings, and click "Apply" on any job you are interested in.',
            q2: 'What is a cooperative (Ikimina)?',
            a2: 'A cooperative is a community savings group where members contribute money regularly and can take loans from the collective pool.',
            q3: 'How do I join a cooperative?',
            a3: 'You can browse existing cooperatives on the "Cooperatives" page and request to join, or create your own.',
            q4: 'How do I add money to my wallet?',
            a4: 'Click the "Add Money" button on the Wallet page and follow the instructions to deposit funds via Mobile Money or bank transfer.',
        }
    },
    cooperatives: {
        pageTitle: 'Community Cooperatives (Ikimina)',
        pageSubtitle: 'Join a savings group to build your financial future with the community. Save, borrow, and grow together.',
        manageTitle: 'Cooperative Management',
        manageSubtitle: 'Manage your existing cooperatives or create a new one to empower your community.',
        create: 'Create Cooperative',
        manageBtn: 'Manage',
        viewDetails: 'View Details',
        requestJoin: 'Request to Join',
        noCooperatives: 'You have not created any cooperatives yet.',
        createModalTitle: 'Create New Cooperative',
        name: 'Cooperative Name',
        description: 'Description',
        contributionAmount: 'Contribution Amount (RWF)',
        contributionFrequency: 'Contribution Frequency',
    },
    common: {
        cancel: 'Cancel',
        submit: 'Submit',
        noData: 'No data to display.',
    }
  },
  fr: { /* French translations */ },
  rw: { /* Kinyarwanda translations */ },
};

// Fill in other languages with English as fallback
translations.fr = { ...translations.en };
translations.rw = { ...translations.en };

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const changeLanguage = (lang: Language) => {
      setLanguage(lang);
  }

  const t = useMemo(() => (key: string): string => {
    return key.split('.').reduce((acc, cur) => acc?.[cur], translations[language]) || key;
  }, [language]);


  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
      <ToastProvider>
        <AuthProvider>
          <JobProvider>
            <ApplicationProvider>
              <InterviewProvider>
                <CooperativeProvider>
                    <TransactionProvider>
                        <SavingsGoalProvider>
                            <BudgetProvider>
                                <LoanProvider>
                                    {children}
                                </LoanProvider>
                            </BudgetProvider>
                        </SavingsGoalProvider>
                    </TransactionProvider>
                </CooperativeProvider>
              </InterviewProvider>
            </ApplicationProvider>
          </JobProvider>
        </AuthProvider>
      </ToastProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};