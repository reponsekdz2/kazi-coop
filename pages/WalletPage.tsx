import React, { useState, Fragment } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTransactions } from '../contexts/TransactionContext';
import { useBudget, BudgetWithSpending } from '../contexts/BudgetContext';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import { useLoan } from '../contexts/LoanContext';
import { LoanApplication, TransactionCategory } from '../types';
import { ArrowDownLeftIcon, ArrowUpRightIcon, BanknotesIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { Tab } from '@headlessui/react';
import Modal from '../components/ui/Modal';
import RingProgress from '../components/ui/RingProgress';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const WalletPage: React.FC = () => {
  const { t } = useAppContext();

  const tabs = [
    { name: t('wallet.tabs.overview'), component: <OverviewTab /> },
    { name: t('wallet.tabs.savings'), component: <SavingsGoalsTab /> },
    { name: t('wallet.tabs.loans'), component: <LoansTab /> },
    { name: t('wallet.tabs.budgeting'), component: <BudgetingTab /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-light">{t('wallet.title')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary">{t('wallet.sendMoney')}</Button>
          <Button><PlusIcon className="h-4 w-4 mr-2 inline" />{t('wallet.addMoney')}</Button>
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>{tab.component}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

// Tabs Components

const OverviewTab: React.FC = () => {
    const { t } = useAppContext();
    const { transactions } = useTransactions();
    const { goals } = useSavingsGoals();
    const { applications: loans } = useLoan();

    const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const totalSavings = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialMetricCard title={t('wallet.balance')} value={`RWF ${totalBalance.toLocaleString()}`} change={`+${totalIncome.toLocaleString()}`} isPositive={true} icon={BanknotesIcon}/>
                <FinancialMetricCard title={t('wallet.spentThisMonth')} value={`RWF ${Math.abs(totalExpenses).toLocaleString()}`} change="" isPositive={false} icon={ArrowUpRightIcon}/>
                <FinancialMetricCard title={t('wallet.totalSavings')} value={`RWF ${totalSavings.toLocaleString()}`} change="" isPositive={true} icon={ArrowDownLeftIcon}/>
                <FinancialMetricCard title={t('wallet.activeLoans')} value={`RWF ${loans.filter(l=>l.status === 'Approved').reduce((s, l) => s + l.remainingAmount, 0).toLocaleString()}`} change="" isPositive={false} icon={ArrowPathIcon}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <UpcomingPayments />
                </div>
                <div className="lg:col-span-2">
                    <Card title={t('wallet.recentTransactions')}>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {transactions.slice(0, 5).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-dark dark:text-light">{tx.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-dark dark:text-light'}`}>
                                        {tx.amount > 0 ? '+' : ''} RWF {tx.amount.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
};

const SavingsGoalsTab: React.FC = () => {
    const { goals } = useSavingsGoals();
    const { t } = useAppContext();
    return (
         <Card title={t('wallet.savingsGoals')}>
            <div className="space-y-6">
                {goals.map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                         <div key={goal.id}>
                            <div className="flex justify-between mb-2 text-sm">
                                <span className="font-medium text-dark dark:text-light">{goal.name}</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    RWF {goal.currentAmount.toLocaleString()} / RWF {goal.targetAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                                <div 
                                  className="bg-accent h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" 
                                  style={{ width: `${progress}%` }}
                                >
                                    {Math.round(progress)}%
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
};

const BudgetingTab: React.FC = () => {
    const { budgetsWithSpending } = useBudget();
    const { t } = useAppContext();
    const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
     return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title={
                 <div className="flex justify-between items-center">
                    <span>{t('wallet.budgets')}</span>
                    <Button size="sm" onClick={() => setIsNewBudgetModalOpen(true)}>
                        <PlusIcon className="h-4 w-4 mr-1 inline" />
                        {t('wallet.budgeting.createNewBudget')}
                    </Button>
                </div>
            } className="lg:col-span-1">
                 <div className="space-y-4">
                    {budgetsWithSpending.map(budget => (
                        <div key={budget.id} className="flex items-center gap-4">
                           <RingProgress percentage={Math.round(budget.progress)} size={60} strokeWidth={6} />
                           <div>
                                <p className="font-bold text-dark dark:text-light">{t(`wallet.categories.${budget.category.toLowerCase().replace(' ', '')}`)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold text-dark dark:text-light">RWF {budget.spentAmount.toLocaleString()}</span> / {budget.budgetAmount.toLocaleString()}
                                </p>
                           </div>
                        </div>
                    ))}
                </div>
            </Card>
             <Card title={t('wallet.spendingBreakdown')} className="lg:col-span-2">
                <SpendingChart budgets={budgetsWithSpending} />
            </Card>
            <NewBudgetModal isOpen={isNewBudgetModalOpen} onClose={() => setIsNewBudgetModalOpen(false)} />
        </div>
    )
}

const LoansTab: React.FC = () => {
    const { applications } = useLoan();
    const { t } = useAppContext();
    const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);

    const openDetails = (loan: LoanApplication) => {
        setSelectedLoan(loan);
        setIsDetailsModalOpen(true);
    };

    const closeDetails = () => {
        setIsDetailsModalOpen(false);
        setSelectedLoan(null);
    };

    const statusStyles: {[key: string]: string} = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Fully Repaid': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    };

    return (
        <>
        <Card title={
             <div className="flex justify-between items-center">
                <span>{t('wallet.loans.title')}</span>
                <Button onClick={() => setIsNewLoanModalOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-2 inline" />
                    {t('wallet.loans.applyForLoan')}
                </Button>
            </div>
        }>
            <div className="space-y-3">
                {applications.map(loan => (
                    <div key={loan.id} className="p-3 border rounded-lg flex justify-between items-center dark:border-gray-700">
                        <div>
                            <p className="font-bold text-dark dark:text-light">{loan.purpose}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">RWF {loan.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[loan.status]}`}>
                                {t(`wallet.loans.status.${loan.status.replace(' ', '')}`)}
                            </span>
                            {(loan.status === 'Approved' || loan.status === 'Fully Repaid') && (
                                <Button variant="secondary" onClick={() => openDetails(loan)}>{t('wallet.loans.viewDetails')}</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
        {selectedLoan && (
            <LoanDetailsModal isOpen={isDetailsModalOpen} onClose={closeDetails} loan={selectedLoan} />
        )}
        <NewLoanApplicationModal isOpen={isNewLoanModalOpen} onClose={() => setIsNewLoanModalOpen(false)} />
        </>
    );
};

// Modals and Helper Components

interface LoanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: LoanApplication;
}

const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({ isOpen, onClose, loan }) => {
    const { t } = useAppContext();
    const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
    const progress = Math.min(((loan.amount - loan.remainingAmount) / loan.amount) * 100, 100);
    const totalPaid = loan.repayments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`${t('wallet.loans.loanDetailsTitle')}: ${loan.purpose}`}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Left Side: Progress & Action */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-light dark:bg-gray-700/50 rounded-lg">
                        <RingProgress percentage={Math.round(progress)} size={150} strokeWidth={12} />
                        <p className="mt-4 font-bold text-2xl text-dark dark:text-light">RWF {loan.remainingAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('wallet.loans.remaining')}</p>
                        {loan.status === 'Approved' && (
                            <Button className="mt-4 w-full" onClick={() => setIsRepaymentModalOpen(true)}>{t('wallet.loans.makeRepayment')}</Button>
                        )}
                    </div>
                    {/* Right Side: Details & History */}
                    <div className="md:col-span-3">
                        {/* Summary Details */}
                        <div className="space-y-2 border-b pb-4 mb-4 dark:border-gray-700">
                             <h4 className="font-semibold text-dark dark:text-light mb-2">{t('wallet.loans.summary')}</h4>
                             <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('wallet.loans.principal')}</span><span className="font-medium text-dark dark:text-light">RWF {loan.amount.toLocaleString()}</span></div>
                             <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('wallet.loans.interestRate')}</span><span className="font-medium text-dark dark:text-light">{loan.interestRate}%</span></div>
                             <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('wallet.loans.totalPaid')}</span><span className="font-medium text-green-600 dark:text-green-400">RWF {totalPaid.toLocaleString()}</span></div>
                             <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('wallet.loans.remaining')}</span><span className="font-medium text-red-600 dark:text-red-400">RWF {loan.remainingAmount.toLocaleString()}</span></div>
                        </div>
                        {/* Repayment History */}
                        <div>
                            <h4 className="font-semibold text-dark dark:text-light mb-2">{t('wallet.loans.repaymentHistory')}</h4>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                {loan.repayments.length > 0 ? loan.repayments.map((p, i) => (
                                    <div key={i} className="flex justify-between text-sm bg-light dark:bg-gray-700 p-2 rounded">
                                        <span>{new Date(p.date).toLocaleString()}</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">RWF {p.amount.toLocaleString()}</span>
                                    </div>
                                )) : <p className="text-sm text-gray-500">{t('wallet.loans.noRepayments')}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <MakeRepaymentModal isOpen={isRepaymentModalOpen} onClose={() => setIsRepaymentModalOpen(false)} loan={loan} />
        </>
    );
};

interface MakeRepaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: LoanApplication;
}

const MakeRepaymentModal: React.FC<MakeRepaymentModalProps> = ({ isOpen, onClose, loan }) => {
    const { t } = useAppContext();
    const { makeRepayment } = useLoan();
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const repaymentAmount = Number(amount);
        if (repaymentAmount > 0 && repaymentAmount <= loan.remainingAmount) {
            makeRepayment(loan.id, repaymentAmount);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.loans.makeRepayment')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.loans.repaymentAmount')}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={loan.remainingAmount}
                        placeholder={`Max RWF ${loan.remainingAmount.toLocaleString()}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};

interface NewLoanApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewLoanApplicationModal: React.FC<NewLoanApplicationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useAppContext();
    const { submitLoanApplication } = useLoan();
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [repaymentPeriod, setRepaymentPeriod] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitLoanApplication({
            amount: Number(amount),
            purpose,
            repaymentPeriod: Number(repaymentPeriod),
            interestRate: 5, // Default interest rate
        });
        setAmount('');
        setPurpose('');
        setRepaymentPeriod('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.loans.newLoanApplication')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.loans.loanAmount')}</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500000" className="w-full input-field" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.loans.loanPurpose')}</label>
                    <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Buy a new laptop" className="w-full input-field" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.loans.repaymentPeriod')}</label>
                    <input type="number" value={repaymentPeriod} onChange={(e) => setRepaymentPeriod(e.target.value)} placeholder="e.g. 12" className="w-full input-field" required/>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};

interface NewBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewBudgetModal: React.FC<NewBudgetModalProps> = ({ isOpen, onClose }) => {
    const { t } = useAppContext();
    const { addBudget, budgetsWithSpending } = useBudget();
    const [category, setCategory] = useState<TransactionCategory | ''>('');
    const [amount, setAmount] = useState('');
    
    const existingCategories = budgetsWithSpending.map(b => b.category);
    const allBudgetableCategories: TransactionCategory[] = ['Utilities', 'Groceries', 'Transport', 'Entertainment', 'Loan Repayment', 'Savings Contribution', 'Business'];
    const availableCategories = allBudgetableCategories
        .filter(c => !existingCategories.includes(c));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category && amount) {
            addBudget({
                category,
                budgetAmount: Number(amount)
            });
            setCategory('');
            setAmount('');
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.budgeting.newBudgetTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.budgeting.category')}</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as TransactionCategory)} className="w-full input-field" required>
                        <option value="" disabled>Select a category</option>
                        {availableCategories.map(cat => (
                           <option key={cat} value={cat}>{t(`wallet.categories.${cat.toLowerCase().replace(' ', '')}`)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.budgeting.budgetAmount')}</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" className="w-full input-field" required/>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    )

}


const UpcomingPayments: React.FC = () => {
    const { t } = useAppContext();
    const { applications } = useLoan();
    const upcoming = applications
        .filter(l => l.status === 'Approved')
        .flatMap(l => l.repaymentSchedule.filter(p => p.status === 'pending'))
        .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);
    
    return (
        <Card title={t('wallet.upcomingPayments.title')}>
            <div className="space-y-3">
                {upcoming.length > 0 ? upcoming.map(payment => {
                    const dueDate = new Date(payment.dueDate);
                    const now = new Date();
                    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
                    const isOverdue = diffDays < 0;

                    return (
                        <div key={payment.dueDate} className="flex justify-between items-center p-2 rounded bg-light dark:bg-gray-700">
                             <div>
                                <p className="font-semibold text-dark dark:text-light">RWF {payment.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t('wallet.loans.dueDate')}: {dueDate.toLocaleDateString()}</p>
                            </div>
                            <div className={`text-sm font-bold ${isOverdue ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                {isOverdue ? t('wallet.upcomingPayments.overdue') : `${t('wallet.upcomingPayments.dueIn')} ${diffDays} ${t('wallet.upcomingPayments.days')}`}
                            </div>
                        </div>
                    );
                }) : <p className="text-sm text-center text-gray-500 py-4">{t('common.noData')}</p>}
            </div>
        </Card>
    );
};


const SpendingChart: React.FC<{budgets: BudgetWithSpending[]}> = ({budgets}) => {
    const { theme, t } = useAppContext();
    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.3)';

    const data = budgets.map(b => ({
        name: t(`wallet.categories.${b.category.toLowerCase().replace(' ', '')}`),
        Spent: b.spentAmount,
        Budget: b.budgetAmount
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(value) => `RWF ${Number(value)/1000}k`}/>
                <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                <Legend wrapperStyle={{ color: axisColor }} />
                <Bar dataKey="Spent" fill="#005A9C" />
                <Bar dataKey="Budget" fill="#5E96C3" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default WalletPage;