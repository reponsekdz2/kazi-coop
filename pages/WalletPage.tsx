import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../contexts/AppContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import { useLoan } from '../contexts/LoanContext';
import { useBudget, BudgetWithSpending } from '../contexts/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, BanknotesIcon, BuildingStorefrontIcon, CurrencyDollarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { Transaction, TransactionCategory, UserRole } from '../types';
import RingProgress from '../components/ui/RingProgress';
import DepositModal from '../components/ui/DepositModal';
import WithdrawModal from '../components/ui/WithdrawModal';

type WalletTab = 'overview' | 'transactions' | 'savings' | 'loans' | 'budgeting';

const COLORS = ['#005A9C', '#5E96C3', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const SeekerWallet: React.FC = () => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<WalletTab>('overview');
    const { transactions } = useTransactions();
    const { goals } = useSavingsGoals();
    const { applications } = useLoan();
    const { budgetsWithSpending } = useBudget();
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    const totalBalance = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const spentThisMonth = useMemo(() => {
        const now = new Date();
        return transactions
            .filter(t => t.amount < 0 && new Date(t.date).getMonth() === now.getMonth())
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }, [transactions]);
    
    const spendingData = useMemo(() => {
        const spending = transactions
            .filter(t => t.amount < 0)
            .reduce((acc, t) => {
                const category = t.category;
                acc[category] = (acc[category] || 0) + Math.abs(t.amount);
                return acc;
            }, {} as Record<string, number>);
        
        return Object.entries(spending).map(([name, value]) => ({ name, value }));
    }, [transactions]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <p className="text-gray-500 dark:text-gray-400">{t('wallet.balance')}</p>
                                <p className="text-4xl font-bold text-dark dark:text-light mt-2">RWF {totalBalance.toLocaleString()}</p>
                                <div className="flex space-x-6 mt-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">{t('wallet.spentThisMonth')}</p>
                                        <p className="font-semibold text-dark dark:text-light">RWF {spentThisMonth.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">{t('wallet.totalSavings')}</p>
                                        <p className="font-semibold text-dark dark:text-light">RWF {goals.reduce((s, g) => s + g.currentAmount, 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">{t('wallet.activeLoans')}</p>
                                        <p className="font-semibold text-dark dark:text-light">{applications.filter(a => a.status === 'Approved').length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card title={t('wallet.recentTransactions')}>
                                <div className="space-y-3">
                                    {transactions.slice(0, 5).map(t => (
                                        <div key={t.id} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-full mr-3 ${t.amount > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                                    {t.amount > 0 ? <ArrowUpIcon className="h-5 w-5 text-green-600" /> : <ArrowDownIcon className="h-5 w-5 text-red-600" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-dark dark:text-light">{t.description}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className={`font-bold ${t.amount > 0 ? 'text-green-600' : 'text-dark dark:text-light'}`}>
                                                {t.amount > 0 ? '+' : '-'}RWF {Math.abs(t.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card title={t('wallet.spendingBreakdown')}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {spendingData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(value) => `RWF ${Number(value).toLocaleString()}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </div>
                );
            case 'transactions':
                return <TransactionsTab transactions={transactions} />;
            case 'savings':
                return <Card title={t('wallet.savingsGoals')}>Your savings goals here...</Card>;
            case 'loans':
                 return <Card title={t('wallet.loans.title')}>Your loans here...</Card>;
            case 'budgeting':
                 return <BudgetingTab budgets={budgetsWithSpending} />;
            default:
                return null;
        }
    };

    const tabs: {id: WalletTab, label: string}[] = [
        { id: 'overview', label: t('wallet.tabs.overview') },
        { id: 'transactions', label: t('wallet.tabs.transactions') },
        { id: 'savings', label: t('wallet.tabs.savings') },
        { id: 'loans', label: t('wallet.tabs.loans') },
        { id: 'budgeting', label: t('wallet.tabs.budgeting') },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('wallet.title')}</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsWithdrawOpen(true)}>{t('wallet.withdraw')}</Button>
                    <Button onClick={() => setIsDepositOpen(true)}>{t('wallet.deposit')}</Button>
                </div>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                           {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {renderTabContent()}

            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} currentBalance={totalBalance} />
        </div>
    );
}

const TransactionsTab: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const { t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<{ type: 'all' | 'income' | 'expense', category: 'all' | TransactionCategory }>({ type: 'all', category: 'all' });

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(transactions.map(t => t.category))];
        return ['all', ...uniqueCategories];
    }, [transactions]);
    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesType = filter.type === 'all' || (filter.type === 'income' && t.amount > 0) || (filter.type === 'expense' && t.amount < 0);
            const matchesCategory = filter.category === 'all' || t.category === filter.category;
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesCategory && matchesSearch;
        });
    }, [transactions, searchTerm, filter]);

    return (
        <Card title={t('wallet.allTransactions')}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-light dark:bg-gray-800/50 rounded-lg">
                <div className="md:col-span-2 relative">
                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder={t('wallet.searchTransactions')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
                <div>
                    <select 
                        value={filter.type} 
                        onChange={e => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="all">{t('wallet.filter.allTypes')}</option>
                        <option value="income">{t('wallet.filter.income')}</option>
                        <option value="expense">{t('wallet.filter.expenses')}</option>
                    </select>
                </div>
                <div>
                     <select 
                        value={filter.category} 
                        onChange={e => setFilter(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat === 'all' ? t('wallet.filter.allCategories') : cat}</option>)}
                    </select>
                </div>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {filteredTransactions.map(t => (
                     <div key={t.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                         <div className="flex items-center">
                             <div className={`p-2 rounded-full mr-4 ${t.amount > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                 {t.amount > 0 ? <ArrowUpIcon className="h-5 w-5 text-green-600" /> : <ArrowDownIcon className="h-5 w-5 text-red-600" />}
                             </div>
                             <div>
                                 <p className="font-semibold text-dark dark:text-light">{t.description}</p>
                                 <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{t.category}</span>
                                 </div>
                             </div>
                         </div>
                         <p className={`font-bold text-lg ${t.amount > 0 ? 'text-green-600' : 'text-dark dark:text-light'}`}>
                             {t.amount > 0 ? '+' : '-'}RWF {Math.abs(t.amount).toLocaleString()}
                         </p>
                     </div>
                ))}
            </div>
        </Card>
    );
};


const BudgetingTab: React.FC<{ budgets: BudgetWithSpending[] }> = ({ budgets }) => {
    const { t } = useAppContext();
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-light">{t('wallet.budgets')}</h2>
                <Button variant="secondary">{t('wallet.budgeting.createNewBudget')}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => {
                    const isOverBudget = budget.remainingAmount < 0;
                    const progressPercentage = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;

                    return (
                        <Card key={budget.id} className="flex flex-col items-center text-center p-4">
                            <h3 className="font-bold text-lg text-dark dark:text-light mb-3">{budget.category}</h3>
                            <div className="relative">
                                <RingProgress 
                                    percentage={Math.round(progressPercentage)} 
                                    size={140} 
                                    strokeWidth={12}
                                    progressColorClassName={isOverBudget ? 'text-red-500' : 'text-primary'}
                                    textColorClassName={`dark:text-light ${isOverBudget ? 'text-red-500' : 'text-dark'}`}
                                />
                            </div>
                            <div className="mt-4">
                                <p className={`font-bold text-2xl ${isOverBudget ? 'text-red-500' : 'text-dark dark:text-light'}`}>
                                    RWF {Math.abs(budget.remainingAmount).toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {isOverBudget 
                                        ? t('wallet.budgeting.overbudgetLabel')
                                        : t('wallet.budgeting.remainingLabel')
                                    }
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    Spent RWF {budget.spentAmount.toLocaleString()} of RWF {budget.budgetAmount.toLocaleString()}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const EmployerWallet: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    
    const companyDetails = user?.companyDetails;
    if (!companyDetails) return null;

    const budgetData = companyDetails.operationalBudget.map(b => ({ name: t(`wallet.categories.${b.category.toLowerCase()}`) || b.category, value: b.amount }));

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('wallet.employerTitle')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                            <BanknotesIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('wallet.companyBalance')}</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {companyDetails.balance.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('wallet.totalPayouts')}</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {companyDetails.totalPayouts.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                            <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('wallet.coopInvestments')}</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {companyDetails.cooperativeInvestments.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <Card title={t('wallet.operationalBudget')}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} label>
                             {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                         <Tooltip formatter={(value) => `RWF ${Number(value).toLocaleString()}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    return user?.role === UserRole.EMPLOYER ? <EmployerWallet /> : <SeekerWallet />;
}

export default WalletPage;