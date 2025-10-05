import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User } from '../types';
import { UserGroupIcon, BanknotesIcon, ArrowUpRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { USERS } from '../constants';
import RingProgress from '../components/ui/RingProgress';

type CooperativeTab = 'overview' | 'members' | 'management';

const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { cooperatives, createCooperative, requestToJoin } = useCooperatives();
    const { t } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

    const isEmployer = user?.role === UserRole.EMPLOYER;

    const handleJoinClick = (coop: Cooperative) => {
        if (!user || isEmployer) return;
        if (coop.members.includes(user.id)) return;
        if (coop.joinRequests.includes(user.id)) return;
        requestToJoin(coop.id);
    }
    
    const getJoinButtonState = (coop: Cooperative): { text: string; disabled: boolean; } => {
        if (!user || isEmployer) return { text: '', disabled: true };
        if (coop.members.includes(user.id)) {
            return { text: t('cooperatives.alreadyMember'), disabled: true };
        }
        if (coop.joinRequests.includes(user.id)) {
            return { text: t('cooperatives.requestPending'), disabled: true };
        }
        return { text: t('cooperatives.requestJoin'), disabled: false };
    }

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
                {cooperatives.map(coop => {
                    const joinButtonState = getJoinButtonState(coop);
                    return (
                    <Card key={coop.id} className="flex flex-col">
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
                                    <span>RWF {coop.contributionAmount.toLocaleString()} / {coop.contributionFrequency}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Button variant="secondary" onClick={() => setSelectedCoop(coop)} className="flex-1">
                                {isEmployer ? t('cooperatives.manageBtn') : t('cooperatives.viewDetails')}
                            </Button>
                            {!isEmployer && <Button onClick={() => handleJoinClick(coop)} disabled={joinButtonState.disabled} className="flex-1">{joinButtonState.text}</Button>}
                        </div>
                    </Card>
                )})}
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

const OverviewTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { t } = useAppContext();
    const loanPoolPercentage = cooperative.totalSavings > 0 ? Math.round((cooperative.totalLoans / cooperative.totalSavings) * 100) : 0;
    const communityGoal = 20000000; // Example goal
    const goalProgressPercentage = Math.round((cooperative.totalSavings / communityGoal) * 100);

    return (
        <div>
             <p className="text-gray-600 dark:text-gray-300 mb-6">{cooperative.description}</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                    <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('dashboard.totalSavings')}</h4>
                    <p className="text-3xl font-bold text-dark dark:text-light mt-2">RWF {cooperative.totalSavings.toLocaleString()}</p>
                </Card>
                <Card className="text-center flex flex-col items-center">
                    <h4 className="font-semibold text-gray-500 dark:text-gray-400">Loan Pool Health</h4>
                    <RingProgress percentage={loanPoolPercentage} size={90} strokeWidth={8} className="my-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">RWF {cooperative.totalLoans.toLocaleString()} in use</p>
                </Card>
                <Card className="text-center flex flex-col items-center">
                    <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('cooperatives.goalProgress')}</h4>
                    <RingProgress percentage={goalProgressPercentage} size={90} strokeWidth={8} className="my-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Target: RWF {communityGoal.toLocaleString()}</p>
                </Card>
             </div>
        </div>
    );
}

const CooperativeDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; cooperative: Cooperative; }> = ({ isOpen, onClose, cooperative }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const { approveJoinRequest, denyJoinRequest } = useCooperatives();
    const [activeTab, setActiveTab] = useState<CooperativeTab>('overview');
    
    const isCreator = user?.id === cooperative.creatorId;

    const tabs = [
        { id: 'overview', label: t('cooperatives.tabs.overview') },
        { id: 'members', label: t('cooperatives.tabs.members') },
    ];

    if(isCreator) {
        tabs.push({ id: 'management', label: t('cooperatives.tabs.management') });
    }
    
    const cooperativeMembers = USERS.filter(u => cooperative.members.includes(u.id));
    const pendingRequests = USERS.filter(u => cooperative.joinRequests.includes(u.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={cooperative.name}>
             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as CooperativeTab)}
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
            {activeTab === 'members' && (
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
            )}
            {activeTab === 'management' && isCreator && (
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
            )}
        </Modal>
    )
}

interface NewCooperativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'joinRequests' | 'totalSavings' | 'totalLoans'>) => void;
}

const NewCooperativeModal: React.FC<NewCooperativeModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contributionAmount: 5000,
        contributionFrequency: 'Monthly' as 'Monthly' | 'Weekly',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'contributionAmount' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
        setFormData({ name: '', description: '', contributionAmount: 5000, contributionFrequency: 'Monthly' });
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
                    <input type="number" name="contributionAmount" value={formData.contributionAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.contributionFrequency')}</label>
                    <select name="contributionFrequency" value={formData.contributionFrequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
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
