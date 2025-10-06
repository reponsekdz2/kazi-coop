import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useTransactions } from '../contexts/TransactionContext';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import { useBudget } from '../contexts/BudgetContext';
import { ArrowUpIcon, ArrowDownIcon, BanknotesIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/solid';
import DepositModal from '../components/ui/DepositModal';
import WithdrawModal from '../components/ui/WithdrawModal';
import TransferModal from '../components/ui/TransferModal';
import { SavingsGoal, Transaction, UserRole, PaymentProvider } from '../types';
import FinancialMetricCard from '../components/layout/FinancialMetricCard';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return user.role === UserRole.EMPLOYER ? <EmployerWalletView /> : <SeekerWalletView />;
}

const SeekerWalletView: React.FC = () => {
    const { user } = useAuth();
    const { transactions, balance } = useTransactions();
    const { goals } = useSavingsGoals();
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    const totalIncome = useMemo(() => transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const totalExpenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0), [transactions]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light">My Wallet</h1>
                    <p className="text-gray-500 dark:text-gray-400">Your central hub for managing your finances.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsTransferOpen(true)}>
                         <PaperAirplaneIcon className="h-5 w-5 mr-2 inline-block -mt-1 transform -rotate-45" />
                        Send Money
                    </Button>
                    <Button variant="secondary" onClick={() => setIsWithdrawOpen(true)}>Withdraw</Button>
                    <Button onClick={() => setIsDepositOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2 inline-block"/>
                        Deposit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <FinancialMetricCard 
                    title="Current Balance"
                    value={`RWF ${balance.toLocaleString()}`}
                    change="+2.5% vs last month"
                    isPositive={true}
                    icon={BanknotesIcon}
                />
                 <FinancialMetricCard 
                    title="Monthly Income"
                    value={`RWF ${totalIncome.toLocaleString()}`}
                    change="+10% vs last month"
                    isPositive={true}
                    icon={ArrowUpIcon}
                />
                 <FinancialMetricCard 
                    title="Monthly Expenses"
                    value={`RWF ${Math.abs(totalExpenses).toLocaleString()}`}
                    change="-5% vs last month"
                    isPositive={false}
                    icon={ArrowDownIcon}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Savings Goals">
                    {goals.map(goal => <SavingsGoalItem key={goal.id} goal={goal} />)}
                </Card>
                <Card title="Recent Transactions">
                    <TransactionList transactions={transactions.slice(0, 5)} />
                </Card>
            </div>
            
            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} currentBalance={balance} />
            <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} currentBalance={balance} />
        </div>
    );
};


const EmployerWalletView: React.FC = () => {
    const { transactions, balance } = useTransactions();
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    
    const providerData = useMemo(() => {
        const data: {[key in PaymentProvider]?: number} = {};
        transactions.forEach(t => {
            data[t.provider] = (data[t.provider] || 0) + Math.abs(t.amount);
        });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [transactions]);
    
    const monthlyFlowData = useMemo(() => {
        const data: {[key: string]: {inflow: number, outflow: number}} = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short' });
            if (!data[month]) data[month] = { inflow: 0, outflow: 0 };
            if (t.amount > 0) data[month].inflow += t.amount;
            else data[month].outflow += Math.abs(t.amount);
        });
        return Object.entries(data).map(([name, values]) => ({ name, ...values }));
    }, [transactions]);

    const totalInflow = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalOutflow = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const COLORS = ['#005A9C', '#5E96C3', '#10B981'];

    return (
        <div>
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light">Company Wallet</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your company's transactions and financial health.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsWithdrawOpen(true)}>Withdraw</Button>
                    <Button onClick={() => setIsDepositOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2 inline-block"/>
                        Deposit
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* FIX: Added missing 'change' prop to resolve compilation error. */}
                <FinancialMetricCard title="Current Balance" value={`RWF ${balance.toLocaleString()}`} icon={BanknotesIcon} isPositive={true} change="+1.2%" />
                <FinancialMetricCard title="Total Inflow" value={`RWF ${totalInflow.toLocaleString()}`} icon={ArrowUpIcon} isPositive={true} change="+4.5%" />
                <FinancialMetricCard title="Total Outflow" value={`RWF ${Math.abs(totalOutflow).toLocaleString()}`} icon={ArrowDownIcon} isPositive={false} change="-2.1%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card title="Monthly Cash Flow" className="lg:col-span-3">
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyFlowData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`}/>
                            <Legend />
                            <Bar dataKey="inflow" name="Inflow" fill="#10B981" />
                            <Bar dataKey="outflow" name="Outflow" fill="#EF4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Transaction Providers" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={providerData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                {providerData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

             <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} currentBalance={balance} />
        </div>
    )
}

const SavingsGoalItem: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
    const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-dark dark:text-light">{goal.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">RWF {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    return (
        <div className="space-y-3">
            {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-dark dark:text-light">{t.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {t.amount > 0 ? '+' : ''}RWF {t.amount.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default WalletPage;