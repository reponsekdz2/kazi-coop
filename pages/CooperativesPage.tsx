import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative, User, Contribution, CooperativeLoan, RepaymentInstallment } from '../types';
import { UserGroupIcon, BanknotesIcon, ArrowUpRightIcon, CheckIcon, XMarkIcon, CalendarDaysIcon, CurrencyDollarIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { USERS } from '../constants';
import RingProgress from '../components/ui/RingProgress';

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
    const { t } = useAppContext();
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
                        onViewDetails={() => handleViewDetails(coop)}
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
    const { t } = useAppContext();
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
                 <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                        <span>{coop.members.length} Members</span>
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{t('cooperatives.savingsPool')}</span>
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
                            <span>{t('cooperatives.loaned')}: RWF {coop.totalLoans.toLocaleString()}</span>
                            <span>{loanPercentage}% {t('cooperatives.used')}</span>
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
                    {isEmployer ? t('cooperatives.manageBtn') : t('cooperatives.viewDetails')}
                </Button>
                {!isEmployer && <Button onClick={() => handleJoinClick(coop)} disabled={joinButtonState.disabled} className="flex-1">{joinButtonState.text}</Button>}
            </div>
        </Card>
    );
}

const CooperativeDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; cooperative: Cooperative; onRequestLoan: () => void; }> = ({ isOpen, onClose, cooperative, onRequestLoan }) => {
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
            {activeTab === 'finance' && isMember && <FinanceTab cooperative={cooperative} onRequestLoan={onRequestLoan} />}
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
    const { t } = useAppContext();
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
            return new Date(lastDate.setMonth(lastDate.getMonth() + 1));
        }
    };

    const myLastContribution = user ? cooperative.contributions.find(c => c.userId === user.id) : undefined;
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
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">{t('cooperatives.contributionDueTitle')}</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                           {t('cooperatives.contributionDueText').replace('{amount}', cooperative.contributionSettings.amount.toLocaleString())}
                        </p>
                         <Button onClick={handleContribute} className="!mt-3 !py-1 !px-3 !text-sm">{t('cooperatives.contributeNow')}</Button>
                    </div>
                </div>
            )}
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
                            <span className="font-bold text-dark dark:text-light">{nextDueDate.toLocaleDateString()}</span>
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
             <Card title={t('cooperatives.myLoans')}>
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
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('cooperatives.noActiveLoans')}</p>
                    )}
                </div>
                <Button onClick={onRequestLoan} className="w-full !mt-6">
                    {t('cooperatives.requestLoan')}
                </Button>
            </Card>
        </div>
    );
};

const RepaymentScheduleTable: React.FC<{ schedule: RepaymentInstallment[], cooperativeId: string, loanId: string }> = ({ schedule, cooperativeId, loanId }) => {
    const { t } = useAppContext();
    const { makeLoanRepayment } = useCooperatives();

    return (
        <div className="mt-4 border-t pt-3 dark:border-gray-600">
            <h4 className="font-semibold text-sm mb-2 text-dark dark:text-light">{t('cooperatives.repaymentSchedule')}</h4>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-2">{t('cooperatives.dueDate')}</th>
                        <th className="px-4 py-2">{t('wallet.loans.amount')}</th>
                        <th className="px-4 py-2">{t('cooperatives.status')}</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((item) => {
                        const isOverdue = item.status === 'pending' && new Date() > new Date(item.dueDate);
                        const statusText = isOverdue ? t('cooperatives.overdue') : t(`cooperatives.${item.status}`);
                        
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
    const { t } = useAppContext();
    const { approveJoinRequest, denyJoinRequest, approveLoan, rejectLoan } = useCooperatives();
    const pendingRequests = USERS.filter(u => cooperative.joinRequests.includes(u.id));
    const pendingLoans = cooperative.loans.filter(l => l.status === 'Pending');
    const availableForLoan = cooperative.totalSavings - cooperative.totalLoans;


    return (
        <div className="space-y-6">
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
             <Card>
                <h4 className="font-bold text-lg text-dark dark:text-light mb-4">{t('cooperatives.loanRequests')} ({pendingLoans.length})</h4>
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
                                        <Button onClick={() => approveLoan(cooperative.id, loan.id)} className="!p-2" disabled={!canAfford} title={canAfford ? 'Approve' : t('cooperatives.insufficientFunds')}>
                                            <CheckIcon className="h-5 w-5"/>
                                        </Button>
                                        <Button onClick={() => rejectLoan(cooperative.id, loan.id)} variant="danger" className="!p-2" title="Reject">
                                            <XMarkIcon className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                    {!canAfford && <p className="text-xs text-red-500">{t('cooperatives.insufficientFunds')}</p>}
                                </div>
                            </div>
                        )
                    }) : (
                         <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('cooperatives.noLoanRequests')}</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

const NewCooperativeModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onCreate: (details: Omit<Cooperative, 'id' | 'creatorId' | 'members' | 'joinRequests' | 'totalSavings' | 'totalLoans' | 'contributions'|'loans' | 'loanSettings'>) => void;
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

const RequestLoanModal: React.FC<{ isOpen: boolean, onClose: () => void, cooperative: Cooperative }> = ({ isOpen, onClose, cooperative }) => {
    const { t } = useAppContext();
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
        <Modal isOpen={isOpen} onClose={onClose} title={t('cooperatives.requestLoanModalTitle').replace('{coopName}', cooperative.name)}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {t('cooperatives.availableFunds').replace('{amount}', availableForLoan.toLocaleString())}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.loanAmount')}</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.repaymentPeriod')}</label>
                    <select value={repaymentPeriod} onChange={e => setRepaymentPeriod(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months</option>
                        <option value={9}>9 Months</option>
                        <option value={12}>12 Months</option>
                        <option value={24}>24 Months</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.loanPurpose')}</label>
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
                     <h4 className="font-semibold text-sm text-dark dark:text-light mb-2">{t('cooperatives.loanTerms')}</h4>
                     <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('cooperatives.interestRate')}</span>
                            <span className="font-medium text-dark dark:text-light">{cooperative.loanSettings.interestRate}% ({t('cooperatives.annual')})</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('cooperatives.totalInterest')}</span>
                            <span className="font-medium text-dark dark:text-light">RWF {Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('cooperatives.totalRepayment')}</span>
                            <span className="font-medium text-dark dark:text-light">RWF {Math.round(totalRepayment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t dark:border-gray-600 pt-2 mt-2">
                            <span className="text-gray-500 dark:text-gray-400">{t('cooperatives.estimatedPayment')}</span>
                            <span className="font-bold text-primary">RWF {Math.round(estimatedPayment).toLocaleString()} / mo.</span>
                        </div>
                     </div>
                </Card>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" disabled={amount <= 0 || amount > availableForLoan || !purpose}>{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};


export default CooperativesPage;
