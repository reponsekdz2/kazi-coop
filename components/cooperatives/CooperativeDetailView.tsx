
import React, { useState } from 'react';
import { Cooperative, UserRole } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import MemberList from './MemberList';
import { PencilIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { cooperativeFinancialsData } from '../../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../ui/StatCard';
import { UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import AgreeToRulesModal from '../ui/AgreeToRulesModal';
import { useCooperative } from '../../contexts/CooperativeContext';
import ContributionModal from '../ui/ContributionModal';
import EditCooperativeModal from '../ui/EditCooperativeModal';

type Tab = 'overview' | 'members' | 'loans' | 'settings';

const CooperativeDetailView: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { user } = useAuth();
    const { joinCooperative } = useCooperative();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false);
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const isMember = user ? cooperative.members.some(m => m.userId === user.id && m.status === 'active') : false;
    const isCreator = user ? cooperative.creatorId === user.id : false;
    
    const handleJoin = () => {
        joinCooperative(cooperative.id);
        setIsAgreeModalOpen(false);
    };

    const OverviewTab: React.FC = () => (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Members" value={cooperative.members.length} trend={0} icon={UserGroupIcon}/>
                <StatCard title="Total Savings" value={`RWF ${cooperative.totalSavings.toLocaleString()}`} trend={0} icon={BanknotesIcon}/>
                <StatCard title="Total Loans" value={`RWF ${cooperative.totalLoans.toLocaleString()}`} trend={0} icon={ArrowTrendingUpIcon}/>
            </div>
            <Card title="Financial Overview">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cooperativeFinancialsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Total Savings" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Loans Disbursed" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Rules & Regulations">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{cooperative.rulesAndRegulations}</p>
            </Card>
        </div>
    );
    
    const MembersTab: React.FC = () => (
        <Card title="Members">
            <MemberList members={cooperative.members} cooperativeId={cooperative.id} />
        </Card>
    );
    
     const LoansTab: React.FC = () => (
        <Card title="Loans">
            <p>Loan management feature coming soon.</p>
        </Card>
    );
    
    const SettingsTab: React.FC = () => (
         <Card title="Cooperative Settings">
            <Button onClick={() => setIsEditModalOpen(true)}>
                <PencilIcon className="h-4 w-4 mr-2 inline"/>
                Edit Cooperative Details
            </Button>
        </Card>
    );

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'members', label: 'Members' },
        { id: 'loans', label: 'Loans' },
    ];
    
    if (isCreator) {
        tabs.push({ id: 'settings', label: 'Settings' });
    }

    return (
        <div>
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-light">{cooperative.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">{cooperative.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                        {isMember ? (
                             <Button onClick={() => setIsContributeModalOpen(true)}>Make Contribution</Button>
                        ) : (
                             <Button onClick={() => setIsAgreeModalOpen(true)}>
                                <UserPlusIcon className="h-5 w-5 mr-2 inline" />
                                Join Ikimina
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

             <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                     {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                            className={`${
                                activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'members' && <MembersTab />}
                {activeTab === 'loans' && <LoansTab />}
                {activeTab === 'settings' && isCreator && <SettingsTab />}
            </div>
            
            <AgreeToRulesModal isOpen={isAgreeModalOpen} onClose={() => setIsAgreeModalOpen(false)} cooperative={cooperative} onAgree={handleJoin} />
            <ContributionModal isOpen={isContributeModalOpen} onClose={() => setIsContributeModalOpen(false)} cooperative={cooperative} />
            <EditCooperativeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} cooperative={cooperative} onSave={() => {}}/>
        </div>
    );
};

export default CooperativeDetailView;
