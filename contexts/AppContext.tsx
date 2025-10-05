
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { JobProvider } from './JobContext';
import { ApplicationProvider } from './ApplicationContext';
import { TransactionProvider } from './TransactionContext';
import { SavingsGoalProvider } from './SavingsGoalContext';
import { LoanProvider } from './LoanContext';
import { BudgetProvider } from './BudgetContext';
import { CooperativeProvider } from './CooperativeContext';
import { InterviewProvider } from './InterviewContext';

// Basic i18n implementation
const translations: Record<string, any> = {
    en: {
        'common.cancel': 'Cancel',
        'common.submit': 'Submit',
        'common.noData': 'No data available.',
        'login.welcome': 'Welcome Back!',
        'login.continue': 'Log in to continue your journey.',
        'login.jobSeeker': 'Job Seeker',
        'login.employer': 'Employer',
        'login.email': 'Email Address',
        'login.password': 'Password',
        'login.loginAs': 'Login as {role}',
        'login.noAccount': "Don't have an account?",
        'login.signUp': 'Sign up',
        'header.profile': 'My Profile',
        'header.logout': 'Logout',
        'sidebar.dashboard': 'Dashboard',
        'sidebar.findJobs': 'Find Jobs',
        'sidebar.jobPostings': 'Job Postings',
        'sidebar.interviews': 'Interviews',
        'sidebar.cooperatives': 'Cooperatives',
        'sidebar.wallet': 'Wallet',
        'sidebar.learningHub': 'Learning Hub',
        'sidebar.messages': 'Messages',
        'sidebar.myProfile': 'My Profile',
        'sidebar.helpCenter': 'Help Center',
        'sidebar.talentPool': 'User Analytics',
        'sidebar.platformAnalytics': 'Platform Analytics',
        'dashboard.welcome': 'Welcome back, {name}!',
        'dashboard.activeApplications': 'Active Applications',
        'dashboard.interviewsScheduled': 'Interviews Scheduled',
        'dashboard.totalSavings': 'Total Savings',
        'dashboard.profileCompletion': 'Profile Completion',
        'dashboard.careerJourney': 'Your Career Journey',
        'dashboard.recommendedJobs': 'Recommended Jobs',
        'dashboard.view': 'View',
        'dashboard.employerDashboard': 'Employer Dashboard',
        'dashboard.activePostings': 'Active Postings',
        'dashboard.newApplicants': 'New Applicants',
        'dashboard.interviewsThisWeek': 'Interviews This Week',
        'dashboard.avgMatchScore': 'Avg. Match Score',
        'dashboard.applicationTrends': 'Application Trends',
        'dashboard.applicantStatus': 'Applicant Status',
        'dashboard.upcomingInterviews': 'Upcoming Interviews',
        'dashboard.forJob': 'For: {jobTitle}',
        'dashboard.noUpcomingInterviews': 'No upcoming interviews.',
        'dashboard.viewInterviewSchedule': 'View Full Schedule',
        'applicationStatus.Applied': 'Applied',
        'applicationStatus.Reviewed': 'Reviewed',
        'applicationStatus.Interviewing': 'Interviewing',
        'applicationStatus.Offered': 'Offered',
        'applicationStatus.Rejected': 'Rejected',
        'wallet.title': 'My Wallet',
        'wallet.sendMoney': 'Send Money',
        'wallet.addMoney': 'Add Money',
        'wallet.tabs.overview': 'Overview',
        'wallet.tabs.savings': 'Savings',
        'wallet.tabs.loans': 'Loans',
        'wallet.tabs.budgeting': 'Budgeting',
        'wallet.balance': 'Current Balance',
        'wallet.spentThisMonth': 'Spent This Month',
        'wallet.totalSavings': 'Total Savings',
        'wallet.activeLoans': 'Active Loans',
        'wallet.spendingBreakdown': 'Spending Breakdown',
        'wallet.savingsGoals': 'Savings Goals',
        'wallet.budgets': 'Budgets',
        'wallet.budgeting.createNewBudget': 'New Budget',
        'wallet.budgeting.overbudgetLabel': 'Overbudget',
        'wallet.budgeting.remainingLabel': 'Remaining',
        'wallet.budgeting.newBudgetTitle': 'Create New Budget',
        'wallet.budgeting.category': 'Category',
        'wallet.budgeting.budgetAmount': 'Budget Amount',
        'wallet.loans.title': 'Loan Management',
        'wallet.loans.applyForLoan': 'Apply for New Loan',
        'wallet.loans.status.Pending': 'Pending',
        'wallet.loans.status.Approved': 'Approved',
        'wallet.loans.status.Rejected': 'Rejected',
        'wallet.loans.status.FullyRepaid': 'Fully Repaid',
        'wallet.loans.viewDetails': 'View Details',
        'wallet.loans.loanDetailsTitle': 'Loan Details',
        'wallet.loans.remaining': 'Remaining',
        'wallet.loans.makeRepayment': 'Make Repayment',
        'wallet.loans.summary': 'Summary',
        'wallet.loans.principal': 'Principal Amount',
        'wallet.loans.interestRate': 'Interest Rate',
        'wallet.loans.totalPaid': 'Total Paid',
        'wallet.loans.repaymentHistory': 'Repayment History',
        'wallet.loans.date': 'Date',
        'wallet.loans.amount': 'Amount',
        'wallet.loans.noRepayments': 'No repayments made yet.',
        'wallet.loans.repaymentAmount': 'Repayment Amount',
        'wallet.loans.newLoanApplication': 'New Loan Application',
        'wallet.loans.loanAmount': 'Loan Amount (RWF)',
        'wallet.loans.loanPurpose': 'Purpose of Loan',
        'wallet.loans.repaymentPeriod': 'Repayment Period (Months)',
        'wallet.upcomingPayments.title': 'Upcoming Payments',
        'wallet.upcomingPayments.overdue': 'Overdue',
        'wallet.upcomingPayments.dueIn': 'Due in',
        'wallet.upcomingPayments.days': 'days',
        'wallet.loans.dueDate': 'Due Date',
        'wallet.categories.salary': 'Salary',
        'wallet.categories.utilities': 'Utilities',
        'wallet.categories.groceries': 'Groceries',
        'wallet.categories.transport': 'Transport',
        'wallet.categories.entertainment': 'Entertainment',
        'wallet.categories.loanrepayment': 'Loan Repayment',
        'wallet.categories.savingscontribution': 'Savings Contribution',
        'wallet.categories.business': 'Business',
        'wallet.categories.other': 'Other',
        'learning.title': 'Learning Hub',
        'learning.subtitle': 'Upskill yourself with our curated courses and learning paths.',
        'learning.yourPersonalizedPath': 'Your Personalized Learning Path',
        'learning.pathDescription': 'Based on your goal to become a {goal}, we recommend this path.',
        'learning.pathProgress': 'Path Progress',
        'learning.completed': 'Completed',
        'learning.current': 'Current Step',
        'learning.locked': 'Locked',
        'learning.step': 'Step {number}',
        'learning.categories.webdevelopment': 'Web Development',
        'learning.categories.careerskills': 'Career Skills',
        'learning.categories.design': 'Design',
        'profile.title': 'My Profile',
        'profile.changePicture': 'Change Picture',
        'profile.skills': 'Skills',
        'profile.profileStrength': 'Profile Strength',
        'profile.completeProfilePrompt': 'Complete your profile to increase your visibility to employers.',
        'profile.completeProfileBtn': 'Complete Profile',
        'profile.personalInfo': 'Personal Information',
        'profile.edit': 'Edit',
        'profile.fullName': 'Full Name',
        'profile.email': 'Email Address',
        'profile.role': 'Role',
        'profile.password': 'Password',
        'profile.changePassword': 'Change Password',
        'profile.activityTimeline': 'Activity Timeline',
        'helpCenter.title': "How can we help?",
        'helpCenter.subtitle': "Find answers to your questions below.",
        'helpCenter.searchPlaceholder': "Search for help...",
        'helpCenter.categories.general': "General",
        'helpCenter.categories.jobs': "Jobs & Applications",
        'helpCenter.categories.cooperatives': "Cooperatives",
        'helpCenter.categories.wallet': "Wallet & Finances",
        'helpCenter.faqs.q1': "How do I apply for a job?",
        'helpCenter.faqs.a1': "Simply navigate to the 'Find Jobs' page, select a job you're interested in, and click the 'Apply Now' button. Make sure your profile is complete for a higher chance of success!",
        'helpCenter.faqs.q2': "What is a cooperative (Ikimina)?",
        'helpCenter.faqs.a2': "A cooperative, or Ikimina, is a community savings group where members contribute money regularly and can take out loans from the collective pool. It's a powerful way to save and access capital.",
        'helpCenter.faqs.q3': "How do I join a cooperative?",
        'helpCenter.faqs.a3': "On the 'Cooperatives' page, you can browse existing groups. If a group is open for new members, you'll see a 'Join' button. Some groups may be by invitation only.",
        'helpCenter.faqs.q4': "Is my money safe in the wallet?",
        'helpCenter.faqs.a4': "Yes, we use industry-standard security measures, including encryption and secure protocols, to protect your financial data and transactions.",
    },
};

type Language = 'en' | 'fr' | 'rw';
type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language] || translations.en;
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return key;
    }
    return result || key;
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppContextProvider>
            <ToastProvider>
                <AuthProvider>
                    <JobProvider>
                        <ApplicationProvider>
                            <TransactionProvider>
                                <SavingsGoalProvider>
                                    <LoanProvider>
                                        <BudgetProvider>
                                            <CooperativeProvider>
                                                <InterviewProvider>
                                                    {children}
                                                </InterviewProvider>
                                            </CooperativeProvider>
                                        </BudgetProvider>
                                    </LoanProvider>
                                </SavingsGoalProvider>
                            </TransactionProvider>
                        </ApplicationProvider>
                    </JobProvider>
                </AuthProvider>
            </ToastProvider>
        </AppContextProvider>
    )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
