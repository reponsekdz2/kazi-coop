
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useCooperative } from '../contexts/CooperativeContext';
import { useAuth } from '../contexts/AuthContext';
import { USERS } from '../constants';
import { Cooperative, UserRole, CooperativeMember } from '../types';
import { PlusIcon, UserGroupIcon, BanknotesIcon, Cog6ToothIcon, UserPlusIcon, EnvelopeIcon, ShareIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Modal from '../components/layout/Modal';
import SeekerProfileModal from '../components/ui/SeekerProfileModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import RingProgress from '../components/layout/RingProgress';
import EditCooperativeModal from '../components/ui/EditCooperativeModal';


const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { cooperatives, userCooperatives, joinCooperative, createCooperative } = useCooperative();
    const [selectedCooperativeId, setSelectedCooperativeId] = useState<string | null>(userCooperatives[0]?.id || null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const selectedCooperative = useMemo(() => {
        return cooperatives.find(c => c.id === selectedCooperativeId);
    }, [cooperatives, selectedCooperativeId]);

    const otherCooperatives = cooperatives.filter(c => !userCooperatives.some(uc => uc.id === c.id));

    const handleCreateCooperative = (details: any) => {
        createCooperative(details);
        setIsCreateModalOpen(false);
    }
    
    const isEmployer = user?.role === UserRole.EMPLOYER;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark dark:text-light">Cooperatives (Ikimina)</h1>
                {isEmployer && <Button onClick={() => setIsCreateModalOpen(true)}><PlusIcon className="h-5 w-5 mr-2 inline" />Create New Cooperative</Button>}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="My Cooperatives">
                        <div className="space-y-2">
                            {userCooperatives.length > 0 ? userCooperatives.map(coop => (
                                <div key={coop.id} onClick={() => setSelectedCooperativeId(coop.id)} className={`p-3 rounded-lg cursor-pointer ${selectedCooperative?.id === coop.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-light dark:hover:bg-dark'}`}>
                                    <p className="font-bold text-dark dark:text-light">{coop.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{coop.members.length} members</p>
                                </div>
                            )) : <p className="text-gray-500 text-sm p-4 text-center">You haven't joined any cooperatives yet.</p>}
                        </div>
                    </Card>
                     {!isEmployer && (
                         <Card title="Discover More" className="mt-6">
                             <div className="space-y-2">
                                {otherCooperatives.slice(0, 3).map(coop => (
                                    <div key={coop.id} className="p-3 bg-light dark:bg-dark rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-dark dark:text-light">{coop.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{coop.description}</p>
                                        </div>
                                        {/* FIX: Removed non-existent 'size' prop and used className for styling. */}
                                        <Button variant="secondary" onClick={() => joinCooperative(coop.id)} className="!px-3 !py-1.5 !text-xs">Join</Button>
                                    </div>
                                ))}
                            </div>
                         </Card>
                     )}
                </div>

                <div className="lg:col-span-2">
                    {selectedCooperative ? (
                       isEmployer ? <EmployerCooperativeView coop={selectedCooperative} /> : <SeekerCooperativeView coop={selectedCooperative} />
                    ) : (
                        <Card className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">Select a cooperative to see details.</p>
                        </Card>
                    )}
                </div>
            </div>
            
             <CreateCooperativeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateCooperative} />
        </div>
    );
};

const SeekerCooperativeView: React.FC<{ coop: Cooperative }> = ({ coop }) => {
    const { makeContribution } = useCooperative();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const myMembership = coop.members.find(m => m.userId === user?.id);
    
    // Calculate next due date
    const getNextDueDate = () => {
        if (!myMembership?.lastContributionDate) return "Now";
        const lastDate = new Date(myMembership.lastContributionDate);
        if (coop.contributionFrequency === 'Monthly') {
            lastDate.setMonth(lastDate.getMonth() + 1);
        } else {
            lastDate.setDate(lastDate.getDate() + 7);
        }
        return lastDate.toLocaleDateString();
    };
    
    const isOverdue = myMembership?.lastContributionDate ? (new Date(getNextDueDate()) < new Date()) : true;

    return (
        <Card>
            <h2 className="text-2xl font-bold text-dark dark:text-light">{coop.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">{coop.description}</p>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => setActiveTab('overview')} className={`tab-button ${activeTab === 'overview' && 'tab-active'}`}>Overview</button>
                    <button onClick={() => setActiveTab('finances')} className={`tab-button ${activeTab === 'finances' && 'tab-active'}`}>My Finances</button>
                    <button onClick={() => setActiveTab('members')} className={`tab-button ${activeTab === 'members' && 'tab-active'}`}>Members</button>
                    <button onClick={() => setActiveTab('announcements')} className={`tab-button ${activeTab === 'announcements' && 'tab-active'}`}>Announcements</button>
                </nav>
            </div>
            
            {activeTab === 'overview' && (
                <div>
                     <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="p-4 bg-light dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {coop.walletBalance.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-light dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contribution</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {coop.contributionAmount.toLocaleString()} / {coop.contributionFrequency}</p>
                        </div>
                    </div>
                    <Card title="Rules & Regulations" className="bg-light dark:bg-dark">
                        <p className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-300">{coop.rulesAndRegulations}</p>
                    </Card>
                </div>
            )}
            {activeTab === 'finances' && (
                 <div>
                    <div className={`p-4 rounded-lg mb-4 ${isOverdue ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                        <p className={`font-bold ${isOverdue ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                            {isOverdue ? 'Contribution Overdue' : 'Contribution On Track'}
                        </p>
                        <p className={`text-sm ${isOverdue ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                           Next payment of RWF {coop.contributionAmount.toLocaleString()} is due on {getNextDueDate()}
                        </p>
                    </div>
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button onClick={() => makeContribution(coop.id)} className="flex-1">
                            <BanknotesIcon className="h-5 w-5 mr-2 inline"/>
                            Make Contribution
                        </Button>
                         <Button variant="secondary" className="flex-1">Request Loan</Button>
                    </div>
                     <p className="text-center font-semibold text-dark dark:text-light">Your Total Contribution: RWF {myMembership?.totalContribution.toLocaleString()}</p>
                 </div>
            )}
             {activeTab === 'members' && (
                 <div>
                    <h3 className="font-bold text-dark dark:text-light mb-2">Members ({coop.members.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {coop.members.map(member => {
                            const user = USERS.find(u => u.id === member.userId);
                            return (
                                 <div key={member.userId} className="flex items-center p-2 bg-light dark:bg-gray-700/50 rounded-md">
                                    <img src={user?.avatarUrl} alt={user?.name} className="h-8 w-8 rounded-full mr-3" />
                                    <p className="font-semibold text-dark dark:text-light">{user?.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {activeTab === 'announcements' && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {coop.announcements.length > 0 ? coop.announcements.map(anno => (
                        <div key={anno.id} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">{anno.message}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{new Date(anno.date).toLocaleString()}</p>
                        </div>
                    )) : <p className="text-gray-500 text-center">No announcements yet.</p>}
                </div>
            )}
        </Card>
    );
}

const EmployerCooperativeView: React.FC<{ coop: Cooperative }> = ({ coop }) => {
    const [activeTab, setActiveTab] = useState('management');
    
    return (
         <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{coop.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{coop.description}</p>
                </div>
                <EditCooperativeButton coop={coop} />
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 my-4">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => setActiveTab('management')} className={`tab-button ${activeTab === 'management' && 'tab-active'}`}>Management</button>
                    <button onClick={() => setActiveTab('finance')} className={`tab-button ${activeTab === 'finance' && 'tab-active'}`}>Finance</button>
                    <button onClick={() => setActiveTab('members')} className={`tab-button ${activeTab === 'members' && 'tab-active'}`}>Members</button>
                </nav>
            </div>
             {activeTab === 'management' && <ManagementTab coop={coop} />}
             {activeTab === 'finance' && <FinanceTab coop={coop} />}
             {activeTab === 'members' && <MembersTab coop={coop} />}
        </Card>
    )
}

const ManagementTab: React.FC<{coop: Cooperative}> = ({ coop }) => {
    const { approveJoinRequest, broadcastMessage, sendReminder, distributeShares } = useCooperative();
    const [message, setMessage] = useState('');

    const handleBroadcast = () => {
        if(message.trim()) {
            broadcastMessage(coop.id, message);
            setMessage('');
        }
    }

    return (
        <div className="space-y-6">
            <Card title="Join Requests" className="bg-light dark:bg-dark">
                 {coop.joinRequests.length > 0 ? coop.joinRequests.map(req => {
                     const user = USERS.find(u => u.id === req.userId);
                     if (!user) return null;
                     return (
                         <div key={req.userId} className="flex justify-between items-center p-2">
                             <div className="flex items-center gap-2">
                                <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                                <p className="font-semibold text-dark dark:text-light">{user.name}</p>
                             </div>
                             <div>
                                <Button onClick={() => approveJoinRequest(coop.id, req.userId)}>Approve</Button>
                             </div>
                         </div>
                     )
                 }) : <p className="text-gray-500 text-sm">No pending join requests.</p>}
            </Card>
             <Card title="Communication" className="bg-light dark:bg-dark">
                <div className="space-y-2">
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type an announcement for all members..." rows={3} className="w-full input-field"></textarea>
                    <Button onClick={handleBroadcast}>
                        <EnvelopeIcon className="h-5 w-5 mr-2 inline"/>
                        Broadcast Message
                    </Button>
                </div>
            </Card>
            <Card title="Financial Actions" className="bg-light dark:bg-dark">
                 <Button variant="secondary" onClick={() => distributeShares(coop.id)}>
                    <ShareIcon className="h-5 w-5 mr-2 inline"/>
                    Distribute All Savings to Members
                </Button>
            </Card>
        </div>
    )
}

const FinanceTab: React.FC<{coop: Cooperative}> = ({ coop }) => {
    const membersOnTime = coop.members.filter(m => {
        if (!m.lastContributionDate) return false;
        // Simplified: assumes this month is the deadline
        return new Date(m.lastContributionDate).getMonth() === new Date().getMonth();
    }).length;
    const contributionRate = coop.members.length > 0 ? Math.round((membersOnTime / coop.members.length) * 100) : 0;
    
    const loansValue = coop.loans.reduce((acc, loan) => acc + loan.amount, 0);
    const loanUtilization = coop.walletBalance > 0 ? Math.round((loansValue / coop.walletBalance) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Loan Pool Utilization" className="flex flex-col items-center justify-center">
                    <RingProgress percentage={loanUtilization} size={120} strokeWidth={10} progressColorClassName="text-accent"/>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">RWF {loansValue.toLocaleString()} of {coop.walletBalance.toLocaleString()}</p>
                </Card>
                <Card title="Member Contribution Rate" className="flex flex-col items-center justify-center">
                    <RingProgress percentage={contributionRate} size={120} strokeWidth={10} />
                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{membersOnTime} of {coop.members.length} members paid</p>
                </Card>
            </div>
             <Card title="Contribution History">
                <div className="max-h-60 overflow-y-auto">
                    {/* This would be a list of actual transactions, simplified here */}
                    {coop.members.map(m => (
                        <div key={m.userId} className="text-sm p-2 flex justify-between">
                            <span>{USERS.find(u => u.id === m.userId)?.name}</span>
                            <span className="font-mono">RWF {m.totalContribution.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
};

const MembersTab: React.FC<{coop: Cooperative}> = ({ coop }) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const handleViewProfile = (userId: string) => {
        const user = USERS.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsProfileModalOpen(true);
        }
    }
    
    return (
        <div>
            {coop.members.map(member => {
                const user = USERS.find(u => u.id === member.userId);
                if (!user) return null;
                return (
                    <div key={member.userId} className="flex justify-between items-center p-2 hover:bg-light dark:hover:bg-dark rounded-md">
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                            <div>
                                <p className="font-bold text-dark dark:text-light">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Total Contributed: RWF {member.totalContribution.toLocaleString()}</p>
                            </div>
                        </div>
                        <div>
                            <Button variant="secondary" onClick={() => handleViewProfile(user.id)}>View Profile</Button>
                        </div>
                    </div>
                )
            })}
             {selectedUser && (
                <SeekerProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={selectedUser}
                />
            )}
        </div>
    )
};

const EditCooperativeButton: React.FC<{ coop: Cooperative }> = ({ coop }) => {
    const { updateCooperative } = useCooperative();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSave = (updatedDetails: Partial<Cooperative>) => {
        updateCooperative(coop.id, updatedDetails);
        setIsEditModalOpen(false);
    }
    return (
        <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
                <Cog6ToothIcon className="h-5 w-5 mr-2 inline" />
                Edit Settings
            </Button>
            <EditCooperativeModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                cooperative={coop}
            />
        </>
    );
};

const CreateCooperativeModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (details: any) => void}> = ({isOpen, onClose, onSave}) => {
    const [details, setDetails] = useState({
        name: '',
        description: '',
        contributionAmount: 5000,
        contributionFrequency: 'Monthly',
        rulesAndRegulations: '1. Contributions are due on the 1st of the month.'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: name === 'contributionAmount' ? parseInt(value) : value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(details);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Cooperative">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label-text">Cooperative Name</label>
                    <input type="text" name="name" value={details.name} onChange={handleChange} required className="input-field"/>
                </div>
                <div>
                    <label className="label-text">Description</label>
                    <textarea name="description" value={details.description} onChange={handleChange} required rows={3} className="input-field"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="label-text">Contribution Amount (RWF)</label>
                        <input type="number" name="contributionAmount" value={details.contributionAmount} onChange={handleChange} required className="input-field"/>
                    </div>
                    <div>
                         <label className="label-text">Frequency</label>
                        <select name="contributionFrequency" value={details.contributionFrequency} onChange={handleChange} className="input-field">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="label-text">Rules & Regulations</label>
                    <textarea name="rulesAndRegulations" value={details.rulesAndRegulations} onChange={handleChange} rows={4} className="input-field"></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Cooperative</Button>
                </div>
            </form>
        </Modal>
    )
}

export default CooperativesPage;