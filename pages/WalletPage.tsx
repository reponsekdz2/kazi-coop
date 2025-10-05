
import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../contexts/AppContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import { useLoan } from '../contexts/LoanContext';
import { useBudget } from '../contexts/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

type WalletTab = 'overview' | 'savings' | 'loans' | 'budgeting';

const COLORS = ['#005A9C', '#5E96C3', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];


const WalletPage: React.FC = () => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<WalletTab>('overview');
    const { transactions } = useTransactions();
    const { goals } = useSavingsGoals();
    const { applications } = useLoan();
    const { budgetsWithSpending } = useBudget();

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
                            <Card title="Recent Transactions">
                                <div className="space-y-3">
                                    {transactions.slice(0, 5).map(t => (
                                        <div key={t.id} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-full mr-3 ${t.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
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
                                        <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </div>
                );
            case 'savings':
                return <Card title={t('wallet.savingsGoals')}>Your savings goals here...</Card>;
            case 'loans':
                 return <Card title={t('wallet.loans.title')}>Your loans here...</Card>;
            case 'budgeting':
                 return <Card title={t('wallet.budgets')}>Your budgets here...</Card>;
            default:
                return null;
        }
    };

    const tabs: {id: WalletTab, label: string}[] = [
        { id: 'overview', label: t('wallet.tabs.overview') },
        { id: 'savings', label: t('wallet.tabs.savings') },
        { id: 'loans', label: t('wallet.tabs.loans') },
        { id: 'budgeting', label: t('wallet.tabs.budgeting') },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('wallet.title')}</h1>
                <div className="flex gap-2">
                    <Button variant="secondary">{t('wallet.sendMoney')}</Button>
                    <Button>{t('wallet.addMoney')}</Button>
                </div>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
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
        </div>
    );
};

export default WalletPage;
