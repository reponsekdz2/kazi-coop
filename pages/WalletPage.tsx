import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { TRANSACTIONS, SAVINGS_GOALS, INVESTMENT_PODS, LOAN_OFFERS, USERS } from '../constants';
import { SavingsGoal, InvestmentPod, LoanOffer } from '../types';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, ChartPieIcon, BanknotesIcon, ScaleIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type WalletTab = 'overview' | 'goals' | 'invest' | 'loans';

const WalletPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<WalletTab>('overview');

    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'goals':
                return <GoalsTab />;
            case 'invest':
                return <InvestTab />;
            case 'loans':
                return <LoansTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
            <Card>
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6">
                        <TabButton id="overview" activeTab={activeTab} setActiveTab={setActiveTab}>Overview</TabButton>
                        <TabButton id="goals" activeTab={activeTab} setActiveTab={setActiveTab}>Savings Goals</TabButton>
                        <TabButton id="invest" activeTab={activeTab} setActiveTab={setActiveTab}>Investment Pods</TabButton>
                        <TabButton id="loans" activeTab={activeTab} setActiveTab={setActiveTab}>Loan Marketplace</TabButton>
                    </nav>
                </div>
                <div>
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

const TabButton: React.FC<{id: WalletTab, activeTab: WalletTab, setActiveTab: (tab: WalletTab) => void, children: React.ReactNode}> = ({ id, activeTab, setActiveTab, children }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
        {children}
    </button>
);

// --- Overview Tab ---
const OverviewTab: React.FC = () => {
  const currentBalance = TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);

  const processedTransactions = [...TRANSACTIONS]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
        const lastBalance = acc.length > 0 ? acc[acc.length-1].balance : 0;
        acc.push({
            date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: lastBalance + t.amount
        });
        return acc;
    }, [] as {date: string; balance: number}[]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="Financial Overview" className="mb-6 !shadow-none !p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-4 rounded-lg bg-light">
                                <p className="text-gray-500">Current Balance</p>
                                <p className="text-4xl font-bold text-primary my-2">RWF {currentBalance.toLocaleString()}</p>
                                <div className="flex space-x-2 justify-center">
                                    <Button>Deposit</Button>
                                    <Button variant="secondary">Withdraw</Button>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-dark mb-2 text-center">Balance History</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={processedTransactions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="balance" stroke="#005A9C" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                </Card>
                <Card title="Transaction History" className="!shadow-none !p-0">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                    {TRANSACTIONS.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-md hover:bg-light">
                        <div className="flex items-center">
                            {t.amount > 0 ? 
                            <ArrowDownCircleIcon className="h-8 w-8 text-accent mr-4" /> :
                            <ArrowUpCircleIcon className="h-8 w-8 text-red-500 mr-4" />}
                            <div>
                            <p className="font-semibold text-dark">{t.description}</p>
                            <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className={`font-bold ${t.amount > 0 ? 'text-accent' : 'text-red-500'}`}>
                            {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} RWF
                        </p>
                        </div>
                    ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card className="!shadow-none !p-0">
                    <h2 className="text-xl font-bold text-dark mb-4">Quick Actions</h2>
                     <div className="space-y-3">
                        <Button className="w-full !justify-start !py-3 !text-base"><BanknotesIcon className="h-5 w-5 mr-3" /> Transfer Money</Button>
                        <Button className="w-full !justify-start !py-3 !text-base"><ChartPieIcon className="h-5 w-5 mr-3" /> View Analytics</Button>
                        <Button className="w-full !justify-start !py-3 !text-base"><ScaleIcon className="h-5 w-5 mr-3" /> Apply for Loan</Button>
                     </div>
                 </Card>
            </div>
        </div>
    )
}

// --- Goals Tab ---
const GoalsTab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addToast('New savings goal created!', 'success');
        setIsModalOpen(false);
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-dark">My Savings Goals</h2>
                <Button variant="secondary" onClick={() => setIsModalOpen(true)}>New Goal</Button>
            </div>
            <div className="space-y-4">
                {SAVINGS_GOALS.map(goal => (
                    <GoalProgress key={goal.id} goal={goal} />
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Savings Goal">
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                        <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="e.g., New Phone" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Amount (RWF)</label>
                        <input type="number" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="500000" required />
                    </div>
                    <Button type="submit" className="w-full">Create Goal</Button>
                </form>
            </Modal>
        </div>
    )
}

const GoalProgress: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
    const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
    return (
        <div className="p-4 bg-light rounded-md border">
            <p className="font-bold text-dark">{goal.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">RWF {goal.currentAmount.toLocaleString()}</span> / {goal.targetAmount.toLocaleString()} ({progress}%)
            </p>
        </div>
    )
}

// --- Invest Tab ---
const riskColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
}
const InvestTab: React.FC = () => (
    <div>
        <h2 className="text-xl font-bold text-dark mb-4">Available Investment Pods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INVESTMENT_PODS.map(pod => <InvestmentPodCard key={pod.id} pod={pod} />)}
        </div>
    </div>
)

const InvestmentPodCard: React.FC<{pod: InvestmentPod}> = ({ pod }) => (
    <Card className="flex flex-col">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-dark">{pod.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${riskColors[pod.riskLevel]}`}>{pod.riskLevel} Risk</span>
        </div>
        <p className="text-sm text-gray-600 my-2 flex-grow">{pod.description}</p>
        <ResponsiveContainer width="100%" height={80} className="my-2">
             <AreaChart data={pod.performanceData} margin={{top:5, right:0, left:0, bottom: 5}}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005A9C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#005A9C" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#005A9C" fill="url(#colorUv)" strokeWidth={2} />
             </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between items-center mt-4">
             <div className="text-center">
                <p className="text-xs text-gray-500">Est. APY</p>
                <p className="font-bold text-accent text-lg">{pod.apy}%</p>
            </div>
            <Button>Invest Now</Button>
        </div>
    </Card>
)


// --- Loans Tab ---
const LoansTab: React.FC = () => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark">Loan Marketplace</h2>
            <Button variant="secondary">Request a Loan</Button>
        </div>
        <div className="space-y-4">
            {LOAN_OFFERS.map(offer => <LoanOfferCard key={offer.id} offer={offer} />)}
        </div>
    </div>
)

const LoanOfferCard: React.FC<{offer: LoanOffer}> = ({ offer }) => {
    const borrower = USERS.find(u => u.id === offer.borrowerId);
    const fundedPercent = Math.round((offer.fundedAmount / offer.amount) * 100);
    return (
        <Card className="!p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <p className="text-sm text-gray-500">Request from {borrower?.name}</p>
                    <p className="font-bold text-dark my-1">{offer.purpose}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Rate: <span className="font-semibold text-primary">{offer.interestRate}%</span></span>
                        <span>Term: <span className="font-semibold text-primary">{offer.term} months</span></span>
                    </div>
                </div>
                <div className="md:w-1/3">
                    <p className="text-sm font-semibold text-dark text-right">RWF {offer.fundedAmount.toLocaleString()} / {offer.amount.toLocaleString()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-1">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${fundedPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{fundedPercent}% Funded</span>
                        <a href="#" className="text-primary hover:underline font-semibold">Lend Now</a>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default WalletPage;