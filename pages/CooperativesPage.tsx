import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, Election, Meeting, User } from '../types';
import { UserGroupIcon, ArrowTrendingUpIcon, BanknotesIcon, ArrowDownLeftIcon, ArrowUpRightIcon, BuildingLibraryIcon, ReceiptPercentIcon, PaperAirplaneIcon, UsersIcon, ChatBubbleBottomCenterTextIcon, MagnifyingGlassIcon, CalendarDaysIcon, PlusIcon, MegaphoneIcon, TrophyIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import { useLoan } from '../contexts/LoanContext';
import { useAppContext } from '../contexts/AppContext';
import { COOPERATIVE_BUDGET, COOPERATIVE_TRANSACTIONS, USERS } from '../constants';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import RingProgress from '../components/ui/RingProgress';

const COLORS = ['#005A9C', '#10B981', '#5E96C3', '#F59E0B', '#6366F1'];

const CooperativesPage: React.FC = () => {
    const { cooperatives, userCooperatives } = useCooperatives();
    const { t } = useAppContext();
    const [view, setView] = useState('all'); // 'all' or 'my'
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [detailsModalCoop, setDetailsModalCoop] = useState<Cooperative | null>(null);

    const cooperativesToShow = view === 'my' ? userCooperatives : cooperatives;

    const openLoanModal = (coop: Cooperative) => {
        setDetailsModalCoop(coop);
        setIsLoanModalOpen(true);
    };

    const closeLoanModal = () => {
        setIsLoanModalOpen(false);
        setDetailsModalCoop(null);
    };

    const openDetailsModal = (coop: Cooperative) => {
        setDetailsModalCoop(coop);
    };

    const closeDetailsModal = () => {
        setDetailsModalCoop(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('cooperatives.title')}</h1>
                <Button>{t('cooperatives.create')}</Button>
            </div>
            
            <Card className="!p-0 mb-6">
                 <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setView('all')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${view === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {t('cooperatives.exploreAll')}
                    </button>
                    <button 
                        onClick={() => setView('my')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${view === 'my' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {t('cooperatives.myCooperatives')} ({userCooperatives.length})
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperativesToShow.map(coop => (
                    <CooperativeCard 
                        key={coop.id} 
                        cooperative={coop} 
                        onLoanRequest={() => openLoanModal(coop)}
                        onViewDetails={() => openDetailsModal(coop)}
                    />
                ))}
                 {cooperativesToShow.length === 0 && view === 'my' && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">{t('cooperatives.notJoined')}</p>
                        <Button className="mt-4" onClick={() => setView('all')}>{t('cooperatives.explore')}</Button>
                    </div>
                )}
            </div>

            {detailsModalCoop && !isLoanModalOpen && (
                <CooperativeDetailsModal
                    isOpen={!!detailsModalCoop}
                    onClose={closeDetailsModal}
                    cooperative={detailsModalCoop}
                />
            )}
            
            {detailsModalCoop && isLoanModalOpen && (
                 <LoanRequestModal
                    isOpen={isLoanModalOpen}
                    onClose={closeLoanModal}
                    cooperative={detailsModalCoop}
                />
            )}
        </div>
    );
};


const CooperativeCard: React.FC<{ cooperative: Cooperative, onLoanRequest: () => void, onViewDetails: () => void }> = ({ cooperative, onLoanRequest, onViewDetails }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const isMember = user?.cooperativeIds?.includes(cooperative.id);
    const isCreator = user?.id === cooperative.creatorId;

    return (
        <Card className="!p-0 overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-dark">
            <div className="relative h-40">
                <img src={cooperative.imageUrl} alt={cooperative.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{cooperative.name}</h3>
                    <p className="text-sm text-gray-200">{t('cooperatives.createdBy')} {cooperative.creator}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="grid grid-cols-3 gap-4 text-center mb-4 border-b pb-4 dark:border-gray-700">
                    <div>
                        <UserGroupIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">{cooperative.members}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.members')}</p>
                    </div>
                    <div>
                        <BanknotesIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">RWF {cooperative.totalSavings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.totalSavings')}</p>
                    </div>
                    <div>
                        <ArrowTrendingUpIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">RWF {cooperative.loanPool.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.loanPool')}</p>
                    </div>
                </div>
                <div className="mt-auto pt-2 space-y-2">
                    {isMember ? (
                        <>
                            <Button variant="secondary" onClick={onViewDetails} className="w-full">{isCreator ? t('cooperatives.manage') : t('cooperatives.viewDashboard')}</Button>
                            <Button onClick={onLoanRequest} className="w-full">{t('cooperatives.requestLoan')}</Button>
                        </>
                    ) : (
                         <Button className="w-full">{t('cooperatives.requestToJoin')}</Button>
                    )}
                </div>
            </div>
        </Card>
    )
};

interface LoanRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    cooperative: Cooperative;
}

const LoanRequestModal: React.FC<LoanRequestModalProps> = ({ isOpen, onClose, cooperative }) => {
    const { submitLoanApplication } = useLoan();
    const { t } = useAppContext();
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [period, setPeriod] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitLoanApplication({
            amount: Number(amount),
            purpose,
            repaymentPeriod: Number(period),
            cooperativeId: cooperative.id,
            interestRate: 10 // Mock interest rate
        });
        onClose();
        // Reset form
        setAmount('');
        setPurpose('');
        setPeriod('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('cooperatives.loanRequestTitle')} ${cooperative.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.loanAmountLabel')}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 500000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.purposeLabel')}</label>
                    <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g. Business equipment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.repaymentPeriodLabel')}</label>
                    <input
                        type="number"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="e.g. 12"
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

interface CooperativeDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cooperative: Cooperative;
}

const CooperativeDetailsModal: React.FC<CooperativeDetailsModalProps> = ({ isOpen, onClose, cooperative }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState('overview');
    const isCreator = user?.id === cooperative.creatorId;

    const tabs = [
        { id: 'overview', label: t('cooperatives.details.overview'), icon: BuildingLibraryIcon },
        { id: 'activity', label: t('cooperatives.details.activity'), icon: ClockIcon },
        { id: 'meetings', label: t('cooperatives.details.meetings'), icon: CalendarDaysIcon },
        { id: 'elections', label: t('cooperatives.details.elections'), icon: MegaphoneIcon },
        { id: 'budget', label: t('cooperatives.details.budget'), icon: ReceiptPercentIcon },
        { id: 'transactions', label: t('cooperatives.details.transactions'), icon: ArrowDownLeftIcon },
        { id: 'members', label: t('cooperatives.details.members'), icon: UsersIcon },
        { id: 'community', label: t('cooperatives.details.community'), icon: ChatBubbleBottomCenterTextIcon }
    ];
    
    if (isCreator) {
        tabs.splice(4, 0, { id: 'management', label: t('cooperatives.details.management'), icon: UserGroupIcon });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={cooperative.name}>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize flex items-center gap-2`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="min-h-[400px]">
                {activeTab === 'overview' && <OverviewTab cooperative={cooperative} />}
                {activeTab === 'activity' && <ActivityTab cooperative={cooperative} />}
                {activeTab === 'meetings' && <MeetingsTab cooperative={cooperative} />}
                {activeTab === 'elections' && <ElectionsTab cooperative={cooperative} />}
                {activeTab === 'budget' && <BudgetTab cooperative={cooperative} />}
                {activeTab === 'transactions' && <TransactionsTab cooperative={cooperative} />}
                {activeTab === 'members' && <MembersTab cooperative={cooperative} />}
                {activeTab === 'community' && <CommunityTab cooperative={cooperative} />}
                {activeTab === 'management' && isCreator && <ManagementTab cooperative={cooperative} />}
            </div>
        </Modal>
    );
};

const FinancialMetricRingCard: React.FC<{title: string; value: number; total: number; helpText: string; icon: React.ElementType}> = ({title, value, total, helpText, icon: Icon}) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <Card className="!p-4 bg-light dark:!bg-gray-700/50 !shadow-inner">
            <div className="flex items-center gap-4">
                <RingProgress percentage={percentage} size={80} strokeWidth={8} />
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                    <p className="font-bold text-2xl text-dark dark:text-light">RWF {value.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{helpText}</p>
                </div>
            </div>
        </Card>
    );
};


const OverviewTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    return (
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-dark dark:text-light mb-4">{t('cooperatives.details.financialHealth')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FinancialMetricRingCard 
                    title={t('cooperatives.totalSavings')}
                    value={cooperative.goalProgress || cooperative.totalSavings}
                    total={cooperative.goalAmount || cooperative.totalSavings * 1.5}
                    // FIX: The translation function `t` only accepts one argument. Changed to use .replace() for dynamic values.
                    helpText={t('cooperatives.details.communityGoalHelp').replace('{goal}', cooperative.communityGoal || "growth")}
                    icon={BanknotesIcon}
                />
                 <FinancialMetricRingCard 
                    title={t('cooperatives.loanPool')}
                    value={cooperative.loanPool}
                    total={cooperative.totalSavings}
                    helpText={t('cooperatives.details.loanPoolHelp')}
                    icon={ArrowTrendingUpIcon}
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Card className="!p-3">
                    <UserGroupIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                    <p className="font-bold text-lg text-dark dark:text-light">{cooperative.members}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.members')}</p>
                </Card>
                 <Card className="!p-3">
                    <ReceiptPercentIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                    <p className="font-bold text-lg text-dark dark:text-light">RWF {cooperative.loansDisbursed?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.details.loansDisbursed')}</p>
                </Card>
                 <Card className="!p-3">
                    <TrophyIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                    <p className="font-bold text-lg text-dark dark:text-light">RWF {cooperative.profit?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.details.profit')}</p>
                </Card>
                 <Card className="!p-3">
                    <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                    <p className="font-bold text-lg text-dark dark:text-light">{cooperative.messages?.length || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.details.messages')}</p>
                </Card>
            </div>
        </div>
    );
};

const BudgetTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t, theme } = useAppContext();
    const tooltipBg = theme === 'dark' ? '#2D3748' : '#FFFFFF';
    const tooltipBorder = theme === 'dark' ? '#4A5568' : '#E5E7EB';

    const budget = cooperative?.id === 'coop-1' ? COOPERATIVE_BUDGET : null;
    if (!budget) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.noBudget')}</p>;
    }
    
    const budgetData = budget.allocations.map(item => ({ name: item.category, value: item.amount }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <h4 className="text-lg font-semibold text-dark dark:text-light mb-4 text-center">{t('cooperatives.budgetAllocationChart')}</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={budgetData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                            {budgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} formatter={(value: number) => `RWF ${value.toLocaleString()}`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div>
                 <table className="w-full text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-2">{t('cooperatives.budgetCategory')}</th>
                            <th className="px-4 py-2 text-right">{t('cooperatives.budgetAmount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budget.allocations.map(item => (
                            <tr key={item.category} className="bg-white border-b dark:bg-dark dark:border-gray-700">
                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{item.category}</td>
                                <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">RWF {item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

const TransactionsTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const transactions = COOPERATIVE_TRANSACTIONS.filter(t => t.cooperativeId === cooperative.id);
    
    const iconMap = {
        contribution: { icon: ArrowDownLeftIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/50' },
        loan_disbursement: { icon: ArrowUpRightIcon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' },
        expense: { icon: ArrowUpRightIcon, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
        investment_return: { icon: ArrowDownLeftIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    };

    if (transactions.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noTransactions')}</p>;
    }
    
    return (
        <div>
            <h3 className="text-lg font-bold text-dark dark:text-light mb-4">{t('cooperatives.details.transactionHistory')}</h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {transactions.map(tx => {
                    const { icon: Icon, color, bg } = iconMap[tx.type];
                    return (
                        <div key={tx.id} className="flex justify-between items-center p-2 rounded hover:bg-light dark:hover:bg-gray-700">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full mr-3 ${bg}`}>
                                    <Icon className={`h-5 w-5 ${color}`}/>
                                </div>
                                <div>
                                    <p className="font-semibold text-dark dark:text-light">{tx.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{tx.type.replace('_', ' ')} &bull; {new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className={`font-bold ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-dark dark:text-light'}`}>
                                {tx.amount > 0 ? '+' : ''} RWF {tx.amount.toLocaleString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ManagementTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { approveJoinRequest, denyJoinRequest } = useCooperatives();
    const joinRequests = cooperative.joinRequests || [];

    return (
        <div>
            <h3 className="text-lg font-bold text-dark dark:text-light mb-4">{t('cooperatives.details.joinRequests')} ({joinRequests.length})</h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {joinRequests.length > 0 ? joinRequests.map(req => {
                    const user = USERS.find(u => u.id === req.userId);
                    if (!user) return null;
                    return (
                         <div key={req.userId} className="flex justify-between items-center p-3 rounded bg-light dark:bg-gray-700">
                             <div className="flex items-center">
                                 <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full mr-3" />
                                 <div>
                                     <p className="font-semibold text-dark dark:text-light">{user.name}</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                 </div>
                             </div>
                             <div className="flex gap-2">
                                 <Button variant="secondary" onClick={() => denyJoinRequest(cooperative.id, req.userId)}>{t('cooperatives.details.deny')}</Button>
                                 <Button onClick={() => approveJoinRequest(cooperative.id, req.userId)}>{t('cooperatives.details.approve')}</Button>
                             </div>
                         </div>
                    );
                }) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noJoinRequests')}</p>
                )}
            </div>
        </div>
    );
};

const MembersTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const members = USERS.filter(u => u.cooperativeIds?.includes(cooperative.id));
    
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
         <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark dark:text-light">{t('cooperatives.details.memberList')} ({members.length})</h3>
                <div className="relative w-1/2">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input 
                        type="text"
                        placeholder={t('cooperatives.details.searchMembers')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {filteredMembers.map(member => (
                    <div key={member.id} className="flex items-center p-3 rounded bg-light dark:bg-gray-700">
                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold text-dark dark:text-light">{member.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CommunityTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { user } = useAuth();
    const { postMessage } = useCooperatives();
    const [newMessage, setNewMessage] = useState('');
    const messages = cooperative.messages || [];

    const handlePostMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            postMessage(cooperative.id, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-[400px]">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
                {messages.length > 0 ? messages.map(msg => {
                    const sender = USERS.find(u => u.id === msg.userId);
                    const isCurrentUser = user?.id === msg.userId;
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                             <img src={sender?.avatarUrl} alt={sender?.name} className="h-8 w-8 rounded-full" />
                             <div className={`p-3 rounded-lg max-w-xs ${isCurrentUser ? 'bg-primary text-white' : 'bg-light dark:bg-gray-700'}`}>
                                 <p className="text-sm">{msg.text}</p>
                                 <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                             </div>
                        </div>
                    );
                }) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noMessages')}</p>}
            </div>
            <form onSubmit={handlePostMessage} className="flex gap-2 border-t pt-4 dark:border-gray-700">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('cooperatives.details.postPlaceholder')}
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button type="submit" className="!px-3"><PaperAirplaneIcon className="h-5 w-5" /></Button>
            </form>
        </div>
    );
};

const ActivityTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const activities = cooperative.activities || [];

    const iconMap = {
        NEW_MEMBER: { icon: UserGroupIcon, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/50' },
        LOAN_APPROVED: { icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/50' },
        GOAL_REACHED: { icon: TrophyIcon, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
        NEW_MEETING: { icon: CalendarDaysIcon, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/50' },
        NEW_ELECTION: { icon: MegaphoneIcon, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    };

    return (
        <div className="max-h-[400px] overflow-y-auto pr-2">
            <h3 className="text-lg font-bold text-dark dark:text-light mb-4">{t('cooperatives.details.activityFeed')}</h3>
            {activities.length > 0 ? (
                <ul className="space-y-4">
                    {activities.map(activity => {
                        const { icon: Icon, color, bg } = iconMap[activity.type];
                        return (
                             <li key={activity.id} className="flex items-start gap-3">
                                <div className={`p-2 rounded-full mt-1 ${bg}`}>
                                    <Icon className={`h-5 w-5 ${color}`}/>
                                </div>
                                <div>
                                    <p className="text-sm text-dark dark:text-light">{activity.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noActivity')}</p>
            )}
        </div>
    );
};

const MeetingsTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const meetings = cooperative.meetings || [];
    const isCreator = cooperative.creatorId === user?.id;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark dark:text-light">{t('cooperatives.details.meetingsTitle')}</h3>
                {isCreator && <Button onClick={() => setIsModalOpen(true)}><PlusIcon className="h-4 w-4 mr-2 inline"/>{t('cooperatives.details.scheduleMeeting')}</Button>}
            </div>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {meetings.length > 0 ? meetings.map(meeting => (
                    <Card key={meeting.id} className="!p-3">
                        <p className="font-bold text-dark dark:text-light">{meeting.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 my-1">{meeting.description}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${meeting.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{meeting.status}</span>
                            <span className="text-xs text-gray-500 font-semibold">{new Date(meeting.date).toLocaleString()}</span>
                        </div>
                    </Card>
                )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noMeetings')}</p>}
            </div>
            {isModalOpen && <ScheduleMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cooperativeId={cooperative.id}/>}
        </div>
    );
};

const ScheduleMeetingModal: React.FC<{isOpen: boolean, onClose: () => void, cooperativeId: string}> = ({isOpen, onClose, cooperativeId}) => {
    const { t } = useAppContext();
    const { scheduleMeeting } = useCooperatives();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        scheduleMeeting(cooperativeId, { title, description, date: new Date(date).toISOString() });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('cooperatives.details.scheduleMeeting')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields... */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.details.meetingTitle')}</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.details.meetingDesc')}</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.details.meetingDate')}</label>
                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};

const ElectionsTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { user } = useAuth();
    const { castVote } = useCooperatives();
    const elections = cooperative.elections || [];
    const isCreator = cooperative.creatorId === user?.id;

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark dark:text-light">{t('cooperatives.details.electionsTitle')}</h3>
                {isCreator && <Button><PlusIcon className="h-4 w-4 mr-2 inline"/>{t('cooperatives.details.createElection')}</Button>}
            </div>
             <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {elections.length > 0 ? elections.map(election => (
                    <ElectionCard key={election.id} election={election} coopId={cooperative.id}/>
                )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('cooperatives.details.noElections')}</p>}
             </div>
        </div>
    );
};

const ElectionCard: React.FC<{election: Election, coopId: string}> = ({ election, coopId }) => {
    const { t } = useAppContext();
    const { user } = useAuth();
    const { castVote } = useCooperatives();
    const totalVotes = election.options.reduce((sum, opt) => sum + opt.votes, 0);
    const userHasVoted = user && election.votedUserIds.includes(user.id);
    const { theme } = useAppContext();
    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.3)';

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-dark dark:text-light">{election.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{election.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${election.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{election.status}</span>
            </div>
            <div className="mt-4">
                {election.status === 'Active' ? (
                    <div className="space-y-2">
                        {userHasVoted ? <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircleIcon className="h-5 w-5"/>{t('cooperatives.details.voted')}</p> : <p className="text-sm font-semibold">{t('cooperatives.details.castVote')}</p>}
                        {election.options.map(option => (
                            <div key={option.id} className="flex items-center justify-between p-2 bg-light dark:bg-gray-700 rounded-md">
                                <span>{option.text}</span>
                                <Button size="sm" onClick={() => castVote(coopId, election.id, option.id)} disabled={userHasVoted}>{t('cooperatives.details.vote')}</Button>
                            </div>
                        ))}
                    </div>
                ) : ( // Closed
                    <div>
                        <h5 className="text-sm font-semibold mb-2">{t('cooperatives.details.results')} ({totalVotes} {t('cooperatives.details.votes')})</h5>
                         <ResponsiveContainer width="100%" height={election.options.length * 50}>
                            <BarChart data={election.options} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="text" width={150} tick={{ fill: axisColor, fontSize: 12 }}/>
                                <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}}/>
                                <Bar dataKey="votes" fill="#005A9C" background={{ fill: '#eee' }} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Card>
    );
};


export default CooperativesPage;