import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User, CooperativeActivity, CooperativeActivityType, CooperativeMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { USERS, COOPERATIVE_ACTIVITIES } from '../constants';
import Modal from '../components/ui/Modal';
import { UserGroupIcon, UserPlusIcon, BanknotesIcon, TrophyIcon, CalendarDaysIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react';
import RingProgress from '../components/ui/RingProgress';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const CooperativesPage: React.FC = () => {
    const { cooperatives, joinCooperative } = useCooperatives();
    const { user } = useAuth();
    const { t } = useAppContext();
    const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

    const isMemberOf = (coop: Cooperative) => user && coop.memberIds.includes(user.id);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('cooperatives.title')}</h1>
                <Button><UserPlusIcon className="h-5 w-5 mr-2 inline"/>{t('cooperatives.create')}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map(coop => (
                    <Card key={coop.id} className="!p-0 flex flex-col overflow-hidden">
                        <img src={coop.coverImageUrl} alt={coop.name} className="h-48 w-full object-cover"/>
                        <div className="p-6 flex-grow flex flex-col">
                            <h2 className="text-xl font-bold text-dark dark:text-light">{coop.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow">{coop.description}</p>
                            
                            <div className="my-4">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-dark dark:text-light">{t('cooperatives.goal')}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{coop.goalProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${coop.goalProgress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <UserGroupIcon className="h-5 w-5 mr-2"/>
                                    {coop.memberIds.length} {t('cooperatives.members')}
                                </div>
                                <Button 
                                    variant={isMemberOf(coop) ? 'secondary' : 'primary'}
                                    onClick={() => isMemberOf(coop) ? setSelectedCoop(coop) : joinCooperative(coop.id)}
                                >
                                    {isMemberOf(coop) ? t('cooperatives.view') : t('cooperatives.join')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

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

interface CooperativeDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cooperative: Cooperative;
}

const CooperativeDetailsModal: React.FC<CooperativeDetailsModalProps> = ({ isOpen, onClose, cooperative }) => {
    const { t } = useAppContext();
    const members = USERS.filter(u => cooperative.memberIds.includes(u.id));
    const coopActivities = COOPERATIVE_ACTIVITIES.filter(act => act.cooperativeId === cooperative.id)
      .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const tabs = [
        { name: t('cooperatives.tabs.overview'), component: <OverviewTab cooperative={cooperative} /> },
        { name: t('cooperatives.tabs.members'), component: <MembersTab members={members} /> },
        { name: t('cooperatives.tabs.activity'), component: <ActivityTab activities={coopActivities} /> },
        { name: t('cooperatives.tabs.community'), component: <CommunityHubTab cooperative={cooperative} /> },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={cooperative.name}>
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
                <Tab.Panels className="mt-2">
                    {tabs.map((tab, idx) => (
                        <Tab.Panel key={idx} className="focus:outline-none">{tab.component}</Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </Modal>
    );
};

const OverviewTab: React.FC<{cooperative: Cooperative}> = ({ cooperative }) => {
    const { t } = useAppContext();
    const loanPoolPercentage = cooperative.totalSavings > 0 ? Math.round((cooperative.loanPoolAmount / cooperative.totalSavings) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={t('cooperatives.totalSavings')}>
                <p className="text-4xl font-bold text-dark dark:text-light">RWF {cooperative.totalSavings.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total contributed by all members.</p>
            </Card>
            <Card title={t('cooperatives.loanPool')}>
                 <div className="flex items-center gap-4">
                    <RingProgress percentage={loanPoolPercentage} size={80} strokeWidth={8} />
                    <div>
                        <p className="text-2xl font-bold text-dark dark:text-light">RWF {cooperative.loanPoolAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('cooperatives.availableForLoans')}</p>
                    </div>
                 </div>
            </Card>
            <Card title={t('cooperatives.goal')} className="md:col-span-2">
                <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-dark dark:text-light">{cooperative.goal}</span>
                    <span className="text-gray-500 dark:text-gray-400">{cooperative.goalProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div className="bg-accent h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: `${cooperative.goalProgress}%` }}>
                        {cooperative.goalProgress}%
                    </div>
                </div>
            </Card>
        </div>
    );
};

const MembersTab: React.FC<{ members: User[]}> = ({ members }) => {
    const { t } = useAppContext();
    return (
         <div>
            <h4 className="font-semibold text-dark dark:text-light mb-2">{members.length} {t('cooperatives.members')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {members.map(member => (
                    <div key={member.id} className="flex flex-col items-center text-center p-2 bg-light dark:bg-gray-700 rounded-lg">
                        <img src={member.avatarUrl} alt={member.name} className="h-16 w-16 rounded-full"/>
                        <p className="text-sm mt-2 font-semibold text-dark dark:text-light">{member.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityTab: React.FC<{ activities: CooperativeActivity[] }> = ({ activities }) => {
    const { t } = useAppContext();
    const iconMap: Record<CooperativeActivityType, React.ElementType> = {
        [CooperativeActivityType.NEW_MEMBER]: UserPlusIcon,
        [CooperativeActivityType.CONTRIBUTION]: BanknotesIcon,
        [CooperativeActivityType.LOAN_APPROVED]: BanknotesIcon,
        [CooperativeActivityType.MEETING_SCHEDULED]: CalendarDaysIcon,
        [CooperativeActivityType.GOAL_REACHED]: TrophyIcon,
    };
    
    return (
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {activities.map(activity => {
                const Icon = iconMap[activity.type];
                return (
                    <div key={activity.id} className="flex items-start">
                        <div className="bg-light dark:bg-gray-700 p-2 rounded-full mr-4 mt-1">
                            <Icon className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                            <p className="text-sm text-dark dark:text-light">{activity.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

const CommunityHubTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { t } = useAppContext();
    const { postMessageToCooperative } = useCooperatives();
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            postMessageToCooperative(cooperative.id, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-[50vh]">
            <div className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4">
                {cooperative.messages.length > 0 ? (
                    cooperative.messages.map(message => (
                        <div key={message.id} className="flex items-start gap-3">
                            <img src={message.userAvatar} alt={message.userName} className="h-10 w-10 rounded-full" />
                            <div className="flex-1 bg-light dark:bg-gray-700 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-dark dark:text-light">{message.userName}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-dark dark:text-gray-300 mt-1">{message.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>{t('cooperatives.community.noMessages')}</p>
                    </div>
                )}
            </div>
            <div className="mt-auto pt-4 border-t dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('cooperatives.community.postPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={2}
                    />
                    <Button type="submit" className="self-stretch">
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CooperativesPage;