import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User, Contribution } from '../types';
import { UserGroupIcon, BanknotesIcon, ArrowUpRightIcon, CheckIcon, XMarkIcon, CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { USERS } from '../constants';
import RingProgress from '../components/ui/RingProgress';
import { useTransactions } from '../contexts/TransactionContext';

type CooperativeTab = 'overview' | 'members' | 'management' | 'finance';

const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { cooperatives, createCooperative } = useCooperatives();
    const { t } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

    const isEmployer = user?.role === UserRole.EMPLOYER;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">
                        {isEmployer ? t('cooperatives.manageTitle') : t('cooperatives.pageTitle')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        {isEmployer ? t('cooperatives.manageSubtitle') : t('cooperatives.pageSubtitle')}
                    </p>
                </div>
                {isEmployer && <Button onClick={() => setIsCreateModalOpen(true)}>{t('cooperatives.create')}</Button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map(coop => (
                    <CooperativeCard 
                        key={coop.id} 
                        coop={coop} 
                        onViewDetails={() => setSelectedCoop(coop)}
                    />
                ))}
            </div>

            {cooperatives.length === 0 && isEmployer && (
                 <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t('cooperatives.noCooperatives')}</p>
                </div>
            )}
            
            <NewCooperativeModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreate={createCooperative}
            />
            {selectedCoop && (
                <CooperativeDetailsModal 
                    isOpen={!!selectedCoop}
                    onClose={() => setSelectedCoop(null)}
                    cooperative={selectedCoop}
                />
            )}
        </div>
    );
};

const CooperativeCard: React.FC<{coop: Cooperative, onViewDetails: () => void}> = ({ coop, onViewDetails }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const { requestToJoin } = useCooperatives();
    const isEmployer = user?.role === UserRole.EMPLOYER;

    const handleJoinClick = (coop: Cooperative) => {
        if (!user || isEmployer) return;
        if (coop.members.includes(user.id) || coop.joinRequests.includes(user.id)) return;
        requestToJoin(coop.id);
    }
    
    const getJoinButtonState = (): { text: string; disabled: boolean; } => {
        if (!user || isEmployer) return { text: '', disabled: true };
        if (coop.members.includes(user.id)) {
            return { text: t('cooperatives.alreadyMember'), disabled: true };
        }
        if (coop.joinRequests.includes(user.id)) {
            return { text: t('cooperatives.requestPending'), disabled: true };
        }
        return { text: t('cooperatives.requestJoin'), disabled: false };
    }
    
    const joinButtonState = getJoinButtonState();

    return (
        <Card className="flex flex-col">
            <div className="flex-grow">
                <h2 className="text-xl font-bold text-dark dark:text-light mb-2">{coop.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{coop.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                        <span>{coop.members.length} Members</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-green-500" />
                        <span>RWF {coop.totalSavings.toLocaleString()} Total Savings</span>
                    </div>
                     <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <ArrowUpRightIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span>RWF {coop.contributionSettings.amount.toLocaleString()} / {coop.contributionSettings.frequency}</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                <Button variant="secondary" onClick={onViewDetails} className="flex-1">
                    {isEmployer ? t('cooperatives.manageBtn') : t('cooperatives.viewDetails')}
                </Button>
                {!isEmployer && <Button onClick={() => handleJoinClick(coop)} disabled={joinButtonState.disabled} className="flex-1">{joinButtonState.text}</Button>}
            </div>
        </Card>
    );
}

const CooperativeDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; cooperative: Cooperative; }> = ({ isOpen, onClose, cooperative }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<CooperativeTab>('overview');
    
    const isCreator = user?.id === cooperative.creatorId;
    const isMember = user ? cooperative.members.includes(user.id) : false;

    const tabs: {id: CooperativeTab, label: string}[] = [
        { id: 'overview', label: t('cooperatives.tabs.overview') },
        { id: 'members', label: t('cooperatives.tabs.members') },
    ];
    if (isMember) {
        tabs.push({ id: 'finance', label: t('cooperatives.tabs.finance') });
    }
    if (isCreator) {
        tabs.push({ id: 'management', label: t('cooperatives.tabs.management') });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={cooperative.name}>
             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                           {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {activeTab === 'overview' && <OverviewTab cooperative={cooperative} />}
            {activeTab === 'members' && <MembersTab cooperative={cooperative} />}
            {activeTab === 'finance' && isMember && <FinanceTab cooperative={cooperative} />}
            {activeTab === 'management' && isCreator && <ManagementTab cooperative={cooperative} />}
        </Modal>
    )
}

const OverviewTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { t } = useAppContext();
    const loanPoolPercentage = cooperative.totalSavings > 0 ? Math.round((cooperative.totalLoans / cooperative.totalSavings) * 100) : 0;
    const communityGoal = 20000000; // Example goal
    const goalProgressPercentage = Math.min(Math.round((cooperative.totalSavings / communityGoal) * 100), 100);
    const availableForLoan = cooperative.totalSavings - cooperative.totalLoans;

    return (
        <div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cooperative.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modern Card for Total Savings & Goal */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('dashboard.totalSavings')}</h4>
                        <p className="text-4xl font-bold text-dark dark:text-light mt-2">RWF {cooperative.totalSavings.toLocaleString()}</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                           <span>{t('cooperatives.goalProgress')}</span>
                           <span>{goalProgressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goalProgressPercentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 text-right mt-1">Target: RWF {communityGoal.toLocaleString()}</p>
                    </div>
                </Card>

                {/* Modern Card for Loan Pool */}
                <Card className="flex flex-col justify-between">
                     <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('cooperatives.loanPool')}</h4>
                        <p className="text-4xl font-bold text-dark dark:text-light mt-2">RWF {cooperative.totalLoans.toLocaleString()}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('cooperatives.disbursed')}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex-1">
                             <h5 className="text-sm font-semibold text-dark dark:text-light">RWF {availableForLoan.toLocaleString()}</h5>
                             <p className="text-xs text-gray-400">{t('cooperatives.availableForLoan')}</p>
                        </div>
                        <RingProgress percentage={loanPoolPercentage} size={70} strokeWidth={7} />
                    </div>
                </Card>
            </div>
        </div>
    );
};


const MembersTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const cooperativeMembers = USERS.filter(u => cooperative.members.includes(u.id));
    return (
        <Card>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {cooperativeMembers.map(member => (
                    <div key={member.id} className="flex items-center p-2 rounded-lg bg-light dark:bg-gray-700/50">
                        <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-dark dark:text-light">{member.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

const FinanceTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { makeContribution } = useCooperatives();
    const { addTransaction } = useTransactions();
    const { user } = useAuth();
    
    const handleContribute = () => {
        if (!user) return;
        const amount = cooperative.contributionSettings.amount;
        makeContribution(cooperative.id, amount);
        addTransaction({
            userId: user.id,
            date: new Date().toISOString(),
            description: `Contribution to ${cooperative.name}`,
            amount: -amount,
            category: 'Cooperative Contribution'
        });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={t('cooperatives.contributionSettings')}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Amount</span>
                        <span className="font-bold text-dark dark:text-light">RWF {cooperative.contributionSettings.amount.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Frequency</span>
                        <span className="font-bold text-dark dark:text-light">{cooperative.contributionSettings.frequency}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{t('cooperatives.nextContribution')}</span>
                        <span className="font-bold text-dark dark:text-light">Oct 1, 2025</span>
                    </div>
                    <Button onClick={handleContribute} className="w-full !mt-6">
                        {t('cooperatives.makeContribution')} (RWF {cooperative.contributionSettings.amount.toLocaleString()})
                    </Button>
                </div>
            </Card>
            <Card title={t('cooperatives.contributionHistory')}>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cooperative.contributions.length > 0 ? cooperative.contributions.map((c, i) => {
                        const contributor = USERS.find(u => u.id === c.userId);
                        return (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <img src={contributor?.avatarUrl} alt={contributor?.name} className="h-8 w-8 rounded-full mr-3"/>
                                    <p className="font-medium text-dark dark:text-light">{contributor?.name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-600">RWF {c.amount.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400 text-right">{new Date(c.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-gray-500 py-8">{t('cooperatives.noContributions')}</p>}
                </div>
            </Card>
        </div>
    );
};


const ManagementTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { approveJoinRequest, denyJoinRequest } = useCooperatives();
    const pendingRequests = USERS.filter(u => cooperative.joinRequests.includes(u.id));

    return (
        <Card>
            <div>
                <h4 className="font-bold text-lg text-dark dark:text-light mb-4">{t('cooperatives.pendingRequests')} ({pendingRequests.length})</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingRequests.length > 0 ? pendingRequests.map(requestUser => (
                        <div key={requestUser.id} className="flex items-center justify-between p-2 rounded-lg bg-light dark:bg-gray-700/50">
                            <div className="flex items-center">
                                <img src={requestUser.avatarUrl} alt={requestUser.name} className="h-10 w-10 rounded-full mr-4" />
                                <p className="font-bold text-dark dark:text-light">{requestUser.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => approveJoinRequest(cooperative.id, requestUser.id)} className="!p-2">
                                    <CheckIcon className="h-5 w-5"/>
                                </Button>
                                <Button onClick={() => denyJoinRequest(cooperative.id, requestUser.id)} variant="danger" className="!p-2">
                                    <XMarkIcon className="h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('cooperatives.noPendingRequests')}</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

const NewCooperativeModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onCreate: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'joinRequests' | 'totalSavings' | 'totalLoans' | 'contributions'>) => void;
}> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contributionSettings: { amount: 5000, frequency: 'Monthly' as 'Monthly' | 'Weekly' },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'amount' || name === 'frequency') {
            setFormData(prev => ({
                ...prev,
                contributionSettings: {
                    ...prev.contributionSettings,
                    [name]: name === 'amount' ? parseInt(value) : value
                }
            }))
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
        setFormData({ name: '', description: '', contributionSettings: { amount: 5000, frequency: 'Monthly' } });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('cooperatives.createModalTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.name')}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.description')}</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.contributionAmount')}</label>
                    <input type="number" name="amount" value={formData.contributionSettings.amount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.contributionFrequency')}</label>
                    <select name="frequency" value={formData.contributionSettings.frequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Monthly</option>
                        <option>Weekly</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('cooperatives.create')}</Button>
                </div>
            </form>
        </Modal>
    );
};


export default CooperativesPage;