

import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User, Contribution, CooperativeLoan, RepaymentInstallment } from '../types';
import { UserGroupIcon, Cog6ToothIcon, ArrowUpRightIcon, CheckIcon, XMarkIcon, CalendarDaysIcon, CurrencyDollarIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/layout/Modal';
import { USERS } from '../constants';
import RingProgress from '../components/layout/RingProgress';
import SeekerProfileModal from '../components/ui/SeekerProfileModal';

type CooperativeTab = 'overview' | 'members' | 'management' | 'finance';

const loanStatusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Repaid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { cooperatives, createCooperative } = useCooperatives();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);


    const isEmployer = user?.role === UserRole.EMPLOYER;

    const handleViewDetails = (coop: Cooperative) => {
        setSelectedCoop(coop);
    }

    const handleCloseDetails = () => {
        setSelectedCoop(null);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">
                        {isEmployer ? 'Cooperative Management' : 'Community Cooperatives (Ikimina)'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        {isEmployer ? 'Oversee your cooperatives or create a new one to empower your team and community.' : 'Join a savings group to build your financial future with the community. Save, borrow, and grow together.'}
                    </p>
                </div>
                {isEmployer && <Button onClick={() => setIsCreateModalOpen(true)}>Create Cooperative</Button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map(coop => (
                    <CooperativeCard 
                        key={coop.id} 
                        coop={coop} 
                        onViewDetails={() => handleViewDetails(coop)}
                    />
                ))}
            </div>

            {cooperatives.length === 0 && isEmployer && (
                 <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">You have not created any cooperatives yet.</p>
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
                    onClose={handleCloseDetails}
                    cooperative={selectedCoop}
                    onRequestLoan={() => setIsLoanModalOpen(true)}
                />
            )}
            {selectedCoop && isLoanModalOpen && (
                <RequestLoanModal
                    isOpen={isLoanModalOpen}
                    onClose={() => setIsLoanModalOpen(false)}
                    cooperative={selectedCoop}
                />
            )}
        </div>
    );
};

const CooperativeCard: React.FC<{coop: Cooperative, onViewDetails: () => void}> = ({ coop, onViewDetails }) => {
    const { user } = useAuth();
    const { requestToJoin } = useCooperatives();
    const isEmployer = user?.role === UserRole.EMPLOYER;

    const loanPercentage = coop.totalSavings > 0 ? Math.round((coop.totalLoans / coop.totalSavings) * 100) : 0;

    const handleJoinClick = (coop: Cooperative) => {
        if (!user || isEmployer) return;
        if (coop.members.includes(user.id) || coop.joinRequests.includes(user.id)) return;
        requestToJoin(coop.id);
    }
    
    const getJoinButtonState = (): { text: string; disabled: boolean; } => {
        if (!user || isEmployer) return { text: '', disabled: true };
        if (coop.members.includes(user.id)) {
            return { text: "You're a Member", disabled: true };
        }
        if (coop.joinRequests.includes(user.id)) {
            return { text: 'Request Pending', disabled: true };
        }
        return { text: 'Request to Join', disabled: false };
    }
    
    const joinButtonState = getJoinButtonState();

    return (
        <Card className="flex flex-col">
            <div className="flex-grow">
                <h2 className="text-xl font-bold text-dark dark:text-light mb-2">{coop.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{coop.description}</p>
                 <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                        <span>{coop.members.length} Members</span>
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Savings Pool</span>
                            <span className="font-bold text-dark dark:text-light">RWF {coop.totalSavings.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                            <div 
                                className="bg-yellow-500 h-2.5 rounded-full" 
                                style={{ width: `${loanPercentage}%` }}
                                title={`${loanPercentage}% loaned out`}
                            ></div>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Loaned Out: RWF {coop.totalLoans.toLocaleString()}</span>
                            <span>{loanPercentage}% Utilized</span>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-700 dark:text-gray-300 pt-2">
                        <ArrowUpRightIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span>RWF {coop.contributionSettings.amount.toLocaleString()} / {coop.contributionSettings.frequency}</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                <Button variant="secondary" onClick={onViewDetails} className="flex-1">
                    {isEmployer ? 'Manage' : 'View Details'}
                </Button>
                {!isEmployer && <Button onClick={() => handleJoinClick(coop)} disabled={joinButtonState.disabled} className="flex-1">{joinButtonState.text}</Button>}
            </div>
        </Card>
    );
}

const CooperativeDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; cooperative: Cooperative; onRequestLoan: () => void; }> = ({ isOpen, onClose, cooperative, onRequestLoan }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<CooperativeTab>('overview');
    
    const isCreator = user?.id === cooperative.creatorId;
    const isMember = user ? cooperative.members.includes(user.id) : false;

    const tabs: {id: CooperativeTab, label: string}[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'members', label: 'Members' },
    ];
    if (isMember) {
        tabs.push({ id: 'finance', label: 'My Finances' });
    }
    if (isCreator) {
        tabs.push({ id: 'management', label: 'Management' });
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
            {activeTab === 'finance' && isMember && <FinanceTab cooperative={cooperative} onRequestLoan={onRequestLoan} />}
            {activeTab === 'management' && isCreator && <ManagementTab cooperative={cooperative} />}
        </Modal>
    )
}

const OverviewTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    // FIX: Changed 'coop' to 'cooperative' to match the prop name.
    const loanPoolPercentage = cooperative.totalSavings > 0 ? Math.round((cooperative.totalLoans / cooperative.totalSavings) * 100) : 0;
    const communityGoal = 20000000; // Example goal
    // FIX: Changed 'coop' to 'cooperative' to match the prop name.
    const goalProgressPercentage = Math.min(Math.round((cooperative.totalSavings / communityGoal) * 100), 100);
    const availableForLoan = cooperative.totalSavings - cooperative.totalLoans;

    return (
        <div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cooperative.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modern Card for Total Savings & Goal */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">Cooperative Savings</h4>
                        <p className="text-4xl font-bold text-dark dark:text-light mt-2">RWF {cooperative.totalSavings.toLocaleString()}</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                           <span>Community Savings Goal</span>
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
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">Loan Pool</h4>
                        <p className="text-4xl font-bold text-dark dark:text-light mt-2">RWF {cooperative.totalLoans.toLocaleString()}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Disbursed</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex-1">
                             <h5 className="text-sm font-semibold text-dark dark:text-light">RWF {availableForLoan.toLocaleString()}</h5>
                             <p className="text-xs text-gray-400">Available for Loan</p>
                        </div>
                        <RingProgress percentage={loanPoolPercentage} size={70} strokeWidth={7} progressColorClassName="text-yellow-500"/>
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

const FinanceTab: React.FC<{ cooperative: Cooperative, onRequestLoan: () => void }> = ({ cooperative, onRequestLoan }) => {
    const { makeContribution } = useCooperatives();
    const { user } = useAuth();
    const myLoans = user ? cooperative.loans.filter(l => l.userId === user.id) : [];
    const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

    const handleContribute = () => {
        if (!user) return;
        const amount = cooperative.contributionSettings.amount;
        makeContribution(cooperative.id, amount);
    }
    
    const getNextDueDate = (lastContribution: Contribution | undefined, frequency: 'Weekly' | 'Monthly'): Date => {
        const lastDate = lastContribution ? new Date(lastContribution.date) : new Date(Date.now() - 31 * 86400000); // Assume a month ago if none
        if (frequency === 'Weekly') {
            return new Date(lastDate.getTime() + 7 * 86400000);
        } else {
            return new Date(new Date(lastDate).setMonth(lastDate.getMonth() + 1));
        }
    };

    const myLastContribution = useMemo(() => {
        if (!user) return undefined;
        const userContributions = cooperative.contributions.filter(c => c.userId === user.id);
        if (userContributions.length === 0) return undefined;
        // Sort by date descending to find the most recent contribution
        return userContributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }, [cooperative.contributions, user]);

    const nextDueDate = getNextDueDate(myLastContribution, cooperative.contributionSettings.frequency);
    const isContributionDue = new Date() > nextDueDate;

    const toggleLoanDetails = (loanId: string) => {
        setExpandedLoanId(prevId => prevId === loanId ? null : loanId);
    }

    return (
        <div className="space-y-6">
            {isContributionDue && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-start gap-4">
                    <InformationCircleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Contribution Due</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                           {`Your regular contribution of RWF ${cooperative.contributionSettings.amount.toLocaleString()} is due. Please make a payment to stay on track.`}
                        </p>
                         <Button onClick={handleContribute} className="!mt-3 !py-1 !px-3 !text-sm">Contribute Now</Button>
                    </div>
                </div>
            )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card title="Contribution Settings">
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
                            <span className="font-medium text-gray-600 dark:text-gray-300">Next Contribution Due</span>
                            <span className="font-bold text-dark dark:text-light">{nextDueDate.toLocaleDateString()}</span>
                        </div>
                        <Button onClick={handleContribute} className="w-full !mt-6">
                            {`Make Contribution (RWF ${cooperative.contributionSettings.amount.toLocaleString()})`}
                        </Button>
                    </div>
                </Card>
                <Card title="Contribution History">
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
                        }) : <p className="text-center text-gray-500 py-8">No contributions have been made yet.</p>}
                    </div>
                </Card>
            </div>
             <Card title="My Loans">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {myLoans.length > 0 ? myLoans.map(loan => (
                        <div key={loan.id} className="p-3 rounded-lg bg-light dark:bg-gray-700/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-dark dark:text-light">RWF {loan.amount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{loan.purpose}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${loanStatusColors[loan.status]}`}>
                                        {loan.status}
                                    </span>
                                    {loan.status === 'Approved' && (
                                         <Button variant="secondary" onClick={() => toggleLoanDetails(loan.id)} className="!p-2">
                                            <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedLoanId === loan.id ? 'rotate-180' : ''}`} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {expandedLoanId === loan.id && loan.status === 'Approved' && loan.repaymentSchedule.length > 0 && (
                                <RepaymentScheduleTable 
                                    schedule={loan.repaymentSchedule}
                                    cooperativeId={cooperative.id}
                                    loanId={loan.id}
                                />
                            )}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">You have no active or pending loans with this cooperative.</p>
                    )}
                </div>
                <Button onClick={onRequestLoan} className="w-full !mt-6">
                    Apply for a Loan
                </Button>
            </Card>
        </div>
    );
};

const RepaymentScheduleTable: React.FC<{ schedule: RepaymentInstallment[], cooperativeId: string, loanId: string }> = ({ schedule, cooperativeId, loanId }) => {
    const { makeLoanRepayment } = useCooperatives();

    return (
        <div className="mt-4 border-t pt-3 dark:border-gray-600">
            <h4 className="font-semibold text-sm mb-2 text-dark dark:text-light">Repayment Schedule</h4>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item) => {
                        const isOverdue = item.status === 'pending' && new Date() > new Date(item.dueDate);
                        const statusText = isOverdue ? 'Overdue' : item.status;
                        
                        let statusClasses = 'dark:bg-gray-900/50';
                        if (isOverdue) {
                            statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
                        } else if (item.status === 'paid') {
                            statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
                        } else {
                            statusClasses = 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
                        }

                        return (
                            <tr key={item.id} className="border-b dark:border-gray-600">
                               <td className="px-4 py-2">{new Date(item.dueDate).toLocaleDateString()}</td>
                               <td className="px-4 py-2">RWF {item.amount.toLocaleString()}</td>
                               <td className="px-4 py-2 capitalize">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                                        {statusText}
                                    </span>
                               </td>
                               <td className="px-4 py-2 text-right">
                                   {item.status === 'pending' && <Button onClick={() => makeLoanRepayment(cooperativeId, loanId, item.id)} variant="secondary" className="!py-1 !px-2 !text-xs">Pay</Button>}
                               </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}


const ManagementTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { approveJoinRequest, denyJoinRequest, approveLoan, rejectLoan } = useCooperatives();
    const pendingRequests = USERS.filter(u => cooperative.joinRequests.includes(u.id));
    const pendingLoans = cooperative.loans.filter(l => l.status === 'Pending');
    const availableForLoan = cooperative.totalSavings - cooperative.totalLoans;
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg text-dark dark:text-light">{`Pending Join Requests (${pendingRequests.length})`}</h4>
                    <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
                        <Cog6ToothIcon className="h-5 w-5 mr-2 inline"/>
                        Cooperative Settings
                    </Button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingRequests.length > 0 ? pendingRequests.map(requestUser => (
                        <div key={requestUser.id} className="flex items-center justify-between p-2 rounded-lg bg-light dark:bg-gray-700/50">
                            <div className="flex items-center">
                                <img src={requestUser.avatarUrl} alt={requestUser.name} className="h-10 w-10 rounded-full mr-4" />
                                <p className="font-bold text-dark dark:text-light">{requestUser.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => setViewingUser(requestUser)}>Profile</Button>
                                <Button onClick={() => approveJoinRequest(cooperative.id, requestUser.id)} className="!p-2">
                                    <CheckIcon className="h-5 w-5"/>
                                </Button>
                                <Button onClick={() => denyJoinRequest(cooperative.id, requestUser.id)} variant="danger" className="!p-2">
                                    <XMarkIcon className="h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">There are no pending join requests.</p>
                    )}
                </div>
            </Card>
             <Card>
                <h4 className="font-bold text-lg text-dark dark:text-light mb-4">{`Loan Requests (${pendingLoans.length})`}</h4>
                 <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingLoans.length > 0 ? pendingLoans.map(loan => {
                        const loanUser = USERS.find(u => u.id === loan.userId);
                        const canAfford = loan.amount <= availableForLoan;
                        return (
                            <div key={loan.id} className="flex flex-col md:flex-row justify-between md:items-center p-3 rounded-lg bg-light dark:bg-gray-700/50 gap-3">
                                <div className="flex items-center">
                                    <img src={loanUser?.avatarUrl} alt={loanUser?.name} className="h-10 w-10 rounded-full mr-4" />
                                    <div>
                                        <p className="font-bold text-dark dark:text-light">{loanUser?.name}</p>
                                        <p className="font-semibold text-primary">RWF {loan.amount.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{loan.purpose} ({loan.repaymentPeriod} mo.)</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                     <div className="flex gap-2">
                                        <Button onClick={() => approveLoan(cooperative.id, loan.id)} className="!p-2" disabled={!canAfford} title={canAfford ? 'Approve' : 'Insufficient funds to approve.'}>
                                            <CheckIcon className="h-5 w-5"/>
                                        </Button>
                                        <Button onClick={() => rejectLoan(cooperative.id, loan.id)} variant="danger" className="!p-2" title="Reject">
                                            <XMarkIcon className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                    {!canAfford && <p className="text-xs text-red-500">Insufficient funds to approve.</p>}
                                </div>
                            </div>
                        )
                    }) : (
                         <p className="text-gray-500 dark:text-gray-400 text-center py-4">There are no pending loan requests.</p>
                    )}
                </div>
            </Card>

            {viewingUser && (
                <SeekerProfileModal
                    isOpen={!!viewingUser}
                    onClose={() => setViewingUser(null)}
                    user={viewingUser}
                />
            )}
            {isSettingsOpen && (
                <CooperativeSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    cooperative={cooperative}
                />
            )}
        </div>
    );
};

const NewCooperativeModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onCreate: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'joinRequests' | 'totalSavings' | 'totalLoans' | 'contributions'|'loans' | 'loanSettings'>) => void;
}> = ({ isOpen, onClose, onCreate }) => {
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
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Cooperative">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooperative Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Amount (RWF)</label>
                    <input type="number" name="amount" value={formData.contributionSettings.amount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Frequency</label>
                    <select name="frequency" value={formData.contributionSettings.frequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Monthly</option>
                        <option>Weekly</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Cooperative</Button>
                </div>
            </form>
        </Modal>
    );
};

const RequestLoanModal: React.FC<{ isOpen: boolean, onClose: () => void, cooperative: Cooperative }> = ({ isOpen, onClose, cooperative }) => {
    const { applyForLoan } = useCooperatives();
    const [amount, setAmount] = useState(0);
    const [purpose, setPurpose] = useState('');
    const [repaymentPeriod, setRepaymentPeriod] = useState(6);
    const [estimatedPayment, setEstimatedPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalRepayment, setTotalRepayment] = useState(0);
    const availableForLoan = cooperative.totalSavings - cooperative.totalLoans;

    useEffect(() => {
        if (amount > 0 && repaymentPeriod > 0) {
            const principal = amount;
            const annualRate = cooperative.loanSettings.interestRate / 100;
            const months = repaymentPeriod;
            const calculatedTotalInterest = principal * annualRate * (months / 12);
            const calculatedTotalRepayment = principal + calculatedTotalInterest;
            setTotalInterest(calculatedTotalInterest);
            setTotalRepayment(calculatedTotalRepayment);
            setEstimatedPayment(calculatedTotalRepayment / months);
        } else {
            setEstimatedPayment(0);
            setTotalInterest(0);
            setTotalRepayment(0);
        }
    }, [amount, repaymentPeriod, cooperative.loanSettings.interestRate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0 || !purpose) return;
        applyForLoan(cooperative.id, { amount, purpose, repaymentPeriod });
        setAmount(0);
        setPurpose('');
        setRepaymentPeriod(6);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Request a Loan from ${cooperative.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {`Available Funds for Loan: RWF ${availableForLoan.toLocaleString()}`}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount (RWF)</label>
                    <input 
                        type="number" 
                        value={amount || ''} 
                        onChange={e => setAmount(parseInt(e.target.value) || 0)} 
                        required 
                        max={availableForLoan}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repayment Period (Months)</label>
                    <select value={repaymentPeriod} onChange={e => setRepaymentPeriod(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months</option>
                        <option value={9}>9 Months</option>
                        <option value={12}>12 Months</option>
                        <option value={24}>24 Months</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of Loan</label>
                    <input 
                        type="text" 
                        value={purpose} 
                        onChange={e => setPurpose(e.target.value)} 
                        required 
                        placeholder="e.g., School fees, business startup"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <Card className="!p-4 bg-light dark:bg-gray-700/50">
                     <h4 className="font-semibold text-sm text-dark dark:text-light mb-2">Estimated Loan Terms</h4>
                     <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Annual Interest Rate</span>
                            <span className="font-medium text-dark dark:text-light">{cooperative.loanSettings.interestRate}% (annual)</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Estimated Total Interest</span>
                            <span className="font-medium text-dark dark:text-light">RWF {Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Estimated Total Repayment</span>
                            <span className="font-medium text-dark dark:text-light">RWF {Math.round(totalRepayment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t dark:border-gray-600 pt-2 mt-2">
                            <span className="text-gray-500 dark:text-gray-400">Estimated Monthly Payment</span>
                            <span className="font-bold text-primary">RWF {Math.round(estimatedPayment).toLocaleString()} / mo.</span>
                        </div>
                     </div>
                </Card>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={amount <= 0 || amount > availableForLoan || !purpose}>Submit</Button>
                </div>
            </form>
        </Modal>
    );
};

const CooperativeSettingsModal: React.FC<{ isOpen: boolean, onClose: () => void, cooperative: Cooperative }> = ({ isOpen, onClose, cooperative }) => {
    const { updateCooperativeSettings } = useCooperatives();
    const [formData, setFormData] = useState({
        name: cooperative.name,
        description: cooperative.description,
        contributionSettings: cooperative.contributionSettings,
        loanSettings: cooperative.loanSettings,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        if (section === 'contributionSettings' || section === 'loanSettings') {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: field === 'frequency' ? value : parseFloat(value) || 0
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCooperativeSettings(cooperative.id, formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cooperative Settings">
             <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <h4 className="font-bold text-lg mb-3">General</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooperative Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h4 className="font-bold text-lg mb-3">Contributions</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Amount (RWF)</label>
                            <input type="number" name="contributionSettings.amount" value={formData.contributionSettings.amount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Frequency</label>
                            <select name="contributionSettings.frequency" value={formData.contributionSettings.frequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                            </select>
                        </div>
                    </Card>
                    <Card>
                         <h4 className="font-bold text-lg mb-3">Loans</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Interest Rate (%)</label>
                            <input type="number" name="loanSettings.interestRate" value={formData.loanSettings.interestRate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                    </Card>
                </div>
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};


export default CooperativesPage;