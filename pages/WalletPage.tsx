
import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTransactions } from '../contexts/TransactionContext';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import { useBudget, BudgetWithSpending } from '../contexts/BudgetContext';
import { ArrowUpIcon, ArrowDownIcon, BanknotesIcon, PaperAirplaneIcon, PlusIcon, CheckCircleIcon, TrashIcon, FlagIcon } from '@heroicons/react/24/solid';
import DepositModal from '../components/ui/DepositModal';
import WithdrawModal from '../components/ui/WithdrawModal';
import TransferModal from '../components/ui/TransferModal';
import { SavingsGoal, Transaction, UserRole, PaymentProvider } from '../types';
import FinancialMetricCard from '../components/layout/FinancialMetricCard';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import RingProgress from '../components/layout/RingProgress';
import Modal from '../components/layout/Modal';

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return user.role === UserRole.EMPLOYER ? <EmployerWalletView /> : <SeekerWalletView />;
}

const SeekerWalletView: React.FC = () => {
    const { user } = useAuth();
    const { transactions, balance } = useTransactions();
    const { goals, addGoal, deleteGoal, completeGoal } = useSavingsGoals();
    const { budgetsWithSpending } = useBudget();
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const totalIncome = useMemo(() => transactions.filter(t => t.amount > 0 && t.category === 'Income').reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const totalExpenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0), [transactions]);
    
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const goalSuccessRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <FinancialMetricCard 
                    title="Current Balance"
                    value={`RWF ${balance.toLocaleString()}`}
                    isPositive={true}
                    icon={BanknotesIcon}
                />
                 <FinancialMetricCard 
                    title="Monthly Income"
                    value={`RWF ${totalIncome.toLocaleString()}`}
                    isPositive={true}
                    icon={ArrowUpIcon}
                />
                 <FinancialMetricCard 
                    title="Monthly Expenses"
                    value={`RWF ${Math.abs(totalExpenses).toLocaleString()}`}
                    isPositive={false}
                    icon={ArrowDownIcon}
                />
                 <FinancialMetricCard 
                    title="Active Goals"
                    // FIX: Converted number to string to match prop type.
                    value={goals.filter(g => g.status === 'active').length.toString()}
                    isPositive={true}
                    icon={FlagIcon}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Savings Goals">
                         <div className="flex justify-end mb-4">
                            <Button size="sm" onClick={() => setIsGoalModalOpen(true)}>
                                <PlusIcon className="h-4 w-4 mr-1 inline"/>
                                New Goal
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onComplete={completeGoal} />)}
                        </div>
                    </Card>
                    <Card title="Budget vs. Spending">
                        <BudgetChart data={budgetsWithSpending}/>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <Card title="Goal Success Rate" className="flex flex-col items-center justify-center">
                        <RingProgress percentage={goalSuccessRate} size={150} strokeWidth={12} progressColorClassName="text-accent" />
                        <p className="mt-4 font-semibold text-dark dark:text-light">{completedGoals} of {goals.length} goals completed</p>
                    </Card>
                    <Card title="Recent Transactions">
                        <TransactionList transactions={transactions.slice(0, 5)} />
                    </Card>
                </div>
            </div>
            
            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} currentBalance={balance} />
            <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} currentBalance={balance} />
            <NewGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onSave={addGoal} />
        </div>
    );
};

const BudgetChart: React.FC<{data: BudgetWithSpending[]}> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={80} />
                <Tooltip formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="spentAmount" name="Spent" stackId="a" fill="#EF4444" />
                <Bar dataKey="remainingAmount" name="Remaining" stackId="a" fill="#10B981" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const EmployerWalletView: React.FC = ({/* Omitted for brevity */}) => { /* ... existing employer view ... */ return null;};

const SavingsGoalCard: React.FC<{ goal: SavingsGoal, onDelete: (id: string) => void, onComplete: (id: string) => void }> = ({ goal, onDelete, onComplete }) => {
    const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
    const isCompleted = goal.status === 'completed' || progress >= 100;
    return (
        <Card className="!p-4 bg-light dark:bg-dark">
            <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold text-dark dark:text-light ${isCompleted ? 'line-through' : ''}`}>{goal.name}</span>
                 {isCompleted ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <FlagIcon className="h-6 w-6 text-primary" />}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">RWF {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                <div className={`${isCompleted ? 'bg-green-500' : 'bg-primary'} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
                {!isCompleted && <Button size="sm" variant="secondary" onClick={() => onComplete(goal.id)}>Complete</Button>}
                <Button size="sm" variant="danger" onClick={() => onDelete(goal.id)} className="!bg-red-500/80 hover:!bg-red-600"><TrashIcon className="h-4 w-4"/></Button>
            </div>
        </Card>
    );
}

const NewGoalModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (d: {name: string, targetAmount: number}) => void}> = ({isOpen, onClose, onSave}) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || targetAmount <= 0) return;
        onSave({ name, targetAmount });
        setName('');
        setTargetAmount(0);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Savings Goal">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="label-text">Goal Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field" placeholder="e.g., New Smartphone"/>
                </div>
                 <div>
                    <label className="label-text">Target Amount (RWF)</label>
                    <input type="number" value={targetAmount || ''} onChange={e => setTargetAmount(parseInt(e.target.value) || 0)} required min="1" className="input-field" placeholder="e.g., 500000"/>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                  <Button type="submit">Create Goal</Button>
                </div>
            </form>
        </Modal>
    )
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