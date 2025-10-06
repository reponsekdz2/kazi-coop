import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User, Contribution, CooperativeLoan, RepaymentInstallment } from '../types';
import { UserGroupIcon, Cog6ToothIcon, ArrowUpRightIcon, CheckIcon, XMarkIcon, CalendarDaysIcon, CurrencyDollarIcon, ChevronDownIcon, InformationCircleIcon, UserMinusIcon, MegaphoneIcon, ShareIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/layout/Modal';
import { USERS } from '../constants';
import RingProgress from '../components/layout/RingProgress';
import SeekerProfileModal from '../components/ui/SeekerProfileModal';

type CooperativeTab = 'overview' | 'members' | 'announcements' | 'management' | 'finance';

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

    useEffect(() => {
        // Reset to overview tab when cooperative changes
        setActiveTab('overview');
    }, [cooperative]);


    const tabs: {id: CooperativeTab, label: string}[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'members', label: 'Members' },
        { id: 'announcements', label: 'Announcements' },
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
            {activeTab === 'announcements' && <AnnouncementsTab cooperative={cooperative} />}
            {activeTab === 'finance' && isMember && <FinanceTab cooperative={cooperative} onRequestLoan={onRequestLoan} />}
            {activeTab === 'management' && isCreator && <ManagementTab cooperative={cooperative} />}
        </Modal>
    )
}

const OverviewTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
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

const AnnouncementsTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    return (
        <Card>
             <h4 className="font-bold text-lg text-dark dark:text-light mb-4">Announcements</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {cooperative.announcements.length > 0 ? cooperative.announcements.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-light dark:bg-gray-700/50">
                        <p className="text-sm text-dark dark:text-light">{item.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{new Date(item.date).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No announcements yet.</p>
                )}
            </div>
        </Card>
    );
}


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
                <Card title="My Contribution History">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {user && cooperative.contributions.filter(c => c.userId === user.id).length > 0 ? cooperative.contributions.filter(c => c.userId === user.id).map((c, i) => {
                            return (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-dark dark:text-light">Contribution</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-semibold text-green-600">+RWF {c.amount.toLocaleString()}</p>
                                </div>
                            )
                        }) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No contributions made yet.</p>
                        )}
                    </div>
                </Card>
            </div>
             <Card title="My Loans">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {myLoans.length > 0 ? myLoans.map(loan => (
                        <div key={loan.id} className="p-3 rounded-lg bg-light dark:bg-gray-700/50">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleLoanDetails(loan.id)}>
                                <div>
                                    <p className="font-bold text-dark dark:text-light">RWF {loan.amount.toLocaleString()} <span className="text-sm font-normal text-gray-500">- for {loan.purpose}</span></p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${loanStatusColors[loan.status]}`}>{loan.status}</span>
                                </div>
                                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedLoanId === loan.id ? 'rotate-180' : ''}`}/>
                            </div>
                            {expandedLoanId === loan.id && <LoanRepaymentDetails loan={loan} cooperativeId={cooperative.id} />}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">You have no active loans in this cooperative.</p>
                    )}
                </div>
                 <Button onClick={onRequestLoan} className="w-full !mt-6">Request a New Loan</Button>
            </Card>
        </div>
    );
};

const LoanRepaymentDetails: React.FC<{ loan: CooperativeLoan, cooperativeId: string }> = ({ loan, cooperativeId }) => {
    const { makeLoanRepayment } = useCooperatives();
    if (loan.status !== 'Approved') return <p className="text-sm text-gray-500 mt-2">Repayment schedule will be available upon loan approval.</p>;
    
    return (
        <div className="mt-4 border-t dark:border-gray-600 pt-3">
            <h5 className="font-semibold text-dark dark:text-light mb-2">Repayment Schedule</h5>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
                {loan.repaymentSchedule.map(installment => (
                    <li key={installment.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="text-dark dark:text-light">Due: {new Date(installment.dueDate).toLocaleDateString()}</p>
                            <p className={`font-semibold ${installment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>RWF {installment.amount.toLocaleString()}</p>
                        </div>
                        {installment.status === 'pending' ? (
                            <Button variant="secondary" className="!py-1 !px-2 !text-xs" onClick={() => makeLoanRepayment(cooperativeId, loan.id, installment.id)}>Pay Now</Button>
                        ) : (
                            <CheckIcon className="h-5 w-5 text-green-500"/>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const ManagementTab: React.FC<{ cooperative: Cooperative }> = ({ cooperative }) => {
    const { approveJoinRequest, denyJoinRequest, removeMember, approveLoan, rejectLoan, broadcastMessage, sendReminder, distributeShares } = useCooperatives();
    const joinRequestUsers = USERS.filter(u => cooperative.joinRequests.includes(u.id));
    const members = USERS.filter(u => cooperative.members.includes(u.id));
    const pendingLoans = cooperative.loans.filter(l => l.status === 'Pending');

    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [isSharesModalOpen, setIsSharesModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setIsProfileModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title={`Join Requests (${joinRequestUsers.length})`}>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {joinRequestUsers.length > 0 ? joinRequestUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-light dark:bg-gray-700/50 rounded-md">
                                <div className="flex items-center gap-2">
                                    <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                                    <p className="font-semibold text-dark dark:text-light">{user.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => approveJoinRequest(cooperative.id, user.id)} className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><CheckIcon className="h-4 w-4"/></button>
                                    <button onClick={() => denyJoinRequest(cooperative.id, user.id)} className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><XMarkIcon className="h-4 w-4"/></button>
                                </div>
                            </div>
                        )) : <p className="text-sm text-gray-500 text-center">No pending requests.</p>}
                    </div>
                </Card>

                <Card title={`Pending Loans (${pendingLoans.length})`}>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {pendingLoans.length > 0 ? pendingLoans.map(loan => {
                            const applicant = USERS.find(u => u.id === loan.userId);
                            return (
                               <div key={loan.id} className="flex items-center justify-between p-2 bg-light dark:bg-gray-700/50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <img src={applicant?.avatarUrl} alt={applicant?.name} className="h-8 w-8 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-dark dark:text-light">{applicant?.name}</p>
                                            <p className="text-xs text-gray-500">RWF {loan.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => approveLoan(cooperative.id, loan.id)} className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><CheckIcon className="h-4 w-4"/></button>
                                        <button onClick={() => rejectLoan(cooperative.id, loan.id)} className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><XMarkIcon className="h-4 w-4"/></button>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-sm text-gray-500 text-center">No pending loan applications.</p>}
                    </div>
                </Card>

                <Card title="Manage Members" className="md:col-span-2">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {members.map(member => (
                             <div key={member.id} className="flex items-center justify-between p-2 bg-light dark:bg-gray-700/50 rounded-md">
                                <div className="flex items-center gap-3">
                                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-dark dark:text-light">{member.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button variant="secondary" className="!py-1 !px-2 !text-xs" onClick={() => handleViewProfile(member)}>View Profile</Button>
                                    <Button variant="secondary" className="!py-1 !px-2 !text-xs" onClick={() => setIsReminderModalOpen(true)}>Send Reminder</Button>
                                    {member.id !== cooperative.creatorId && <button onClick={() => removeMember(cooperative.id, member.id)} className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><UserMinusIcon className="h-4 w-4"/></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Communication & Finance" className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => setIsBroadcastModalOpen(true)} className="flex-1">
                            <MegaphoneIcon className="h-5 w-5 mr-2 inline"/>
                            Broadcast Message
                        </Button>
                        <Button onClick={() => setIsSharesModalOpen(true)} variant="secondary" className="flex-1">
                            <ShareIcon className="h-5 w-5 mr-2 inline"/>
                            Distribute Shares
                        </Button>
                    </div>
                </Card>
            </div>
            {/* Modals */}
            <ActionModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                title="Send Reminder"
                actionText="Send"
                onAction={(text) => sendReminder('user-id', text)} // In a real app, you'd need the specific user ID
            />
             <ActionModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setIsBroadcastModalOpen(false)}
                title="Broadcast Announcement"
                actionText="Broadcast"
                onAction={(text) => broadcastMessage(cooperative.id, text)}
            />
            <DistributeSharesModal 
                isOpen={isSharesModalOpen}
                onClose={() => setIsSharesModalOpen(false)}
                onDistribute={(amount) => distributeShares(cooperative.id, amount)}
                cooperative={cooperative}
            />
             {selectedUser && (
                <SeekerProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={selectedUser}
                />
            )}
        </>
    );
};

const ActionModal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, actionText: string, onAction: (text: string) => void }> = ({ isOpen, onClose, title, actionText, onAction }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAction(text);
        setText('');
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Type your message here..."
                />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{actionText}</Button>
                </div>
            </form>
        </Modal>
    );
};

const DistributeSharesModal: React.FC<{ isOpen: boolean, onClose: () => void, cooperative: Cooperative, onDistribute: (amount: number) => void }> = ({ isOpen, onClose, cooperative, onDistribute }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof amount === 'number' && amount > 0) {
            onDistribute(amount);
            setAmount('');
            onClose();
        }
    }
    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Distribute Shares">
            <form onSubmit={handleSubmit}>
                <p className="text-sm text-gray-500 mb-2">Total savings available for distribution: RWF {cooperative.totalSavings.toLocaleString()}</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : '')}
                    max={cooperative.totalSavings}
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter total amount to distribute"
                />
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Distribute</Button>
                </div>
            </form>
        </Modal>
    );
};


const NewCooperativeModal: React.FC<{ isOpen: boolean, onClose: () => void, onCreate: (details: any) => void }> = ({ isOpen, onClose, onCreate }) => {
    const [details, setDetails] = useState({
        name: '',
        description: '',
        contributionAmount: 5000,
        contributionFrequency: 'Monthly' as 'Weekly' | 'Monthly',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: name === 'contributionAmount' ? parseInt(value) : value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cooperativeData = {
            name: details.name,
            description: details.description,
            contributionSettings: {
                amount: details.contributionAmount,
                frequency: details.contributionFrequency,
            }
        };
        onCreate(cooperativeData);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Cooperative">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooperative Name</label>
                    <input type="text" name="name" value={details.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={details.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Amount (RWF)</label>
                        <input type="number" name="contributionAmount" value={details.contributionAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                        <select name="contributionFrequency" value={details.contributionFrequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Cooperative</Button>
                </div>
            </form>
        </Modal>
    );
};

const RequestLoanModal: React.FC<{isOpen: boolean, onClose: () => void, cooperative: Cooperative}> = ({ isOpen, onClose, cooperative }) => {
    const { applyForLoan } = useCooperatives();
    const [details, setDetails] = useState({ amount: 0, purpose: '', repaymentPeriod: 6 });
    
    const maxLoanable = (cooperative.totalSavings - cooperative.totalLoans) * (cooperative.loanSettings.maxLoanPercentage / 100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyForLoan(cooperative.id, details);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request a Loan">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">Max Loan Amount Available to You: <span className="font-bold">RWF {Math.floor(maxLoanable).toLocaleString()}</span></p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount (RWF)</label>
                    <input type="number" value={details.amount || ''} onChange={e => setDetails({...details, amount: parseInt(e.target.value) || 0})} required max={maxLoanable} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of Loan</label>
                    <input type="text" value={details.purpose} onChange={e => setDetails({...details, purpose: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repayment Period (in months)</label>
                    <select value={details.repaymentPeriod} onChange={e => setDetails({...details, repaymentPeriod: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months</option>
                        <option value={12}>12 Months</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Request</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CooperativesPage;
