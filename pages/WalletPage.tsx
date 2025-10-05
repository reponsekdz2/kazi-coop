// FIX: Populated the empty WalletPage.tsx file.
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useAuth } from '../contexts/AuthContext';
// FIX: Imported 'USERS' to resolve reference error.
import { LOAN_APPLICATIONS, LOAN_INVESTMENTS, USERS } from '../constants';
import { WalletIcon, UserGroupIcon, CurrencyDollarIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isAutoSaveOn, setIsAutoSaveOn] = useState(true);

    const savings = user?.savingsBalance ?? 0;
    const shares = user?.cooperativeShare ?? 0;
    
  return (
    <div>
        <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
        
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Overview
                </button>
                <button onClick={() => setActiveTab('loans')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'loans' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    My Loan Applications
                </button>
                 <button onClick={() => setActiveTab('investments')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'investments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    My Investments
                </button>
            </nav>
        </div>

        <div>
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FinancialMetricCard title="Personal Savings" value={`RWF ${savings.toLocaleString()}`} change="" isPositive={true} icon={WalletIcon}/>
                    <FinancialMetricCard title="Cooperative Share" value={`RWF ${shares.toLocaleString()}`} change="" isPositive={true} icon={UserGroupIcon}/>
                     <Card className="p-4 flex flex-col justify-center">
                        <p className="text-sm text-gray-500">Actions</p>
                        <div className="flex gap-4 mt-2">
                            <Button onClick={() => setIsDepositModalOpen(true)} className="flex-1">Deposit</Button>
                            <Button onClick={() => setIsWithdrawModalOpen(true)} variant="secondary" className="flex-1">Withdraw</Button>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'loans' && <LoanApplicationsView />}
            
            {activeTab === 'investments' && <MyInvestmentsView />}

        </div>

        <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Deposit Funds">
            <p>Deposit form would go here.</p>
        </Modal>
         <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} title="Withdraw Funds">
            <p>Withdrawal form with security checks would go here.</p>
        </Modal>
    </div>
  );
};

const LoanApplicationsView = () => {
    const statusColors: { [key: string]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return (
        <Card title="My Loan Applications">
            <div className="space-y-4">
                {LOAN_APPLICATIONS.map(app => (
                    <div key={app.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="font-bold text-dark">RWF {app.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{app.purpose}</p>
                            <p className="text-xs text-gray-400 mt-1">Requested on: {new Date(app.requestDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}>
                            {app.status}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MyInvestmentsView = () => {
    const [autoTransfer, setAutoTransfer] = useState(true);
    return (
        <Card title="My Investments in P2P Loans">
            <div className="p-4 bg-light rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-dark">Auto-transfer earnings to savings</p>
                        <p className="text-sm text-gray-500">Automatically move your interest earnings to your personal savings account.</p>
                    </div>
                    <ToggleSwitch checked={autoTransfer} onChange={setAutoTransfer} />
                </div>
            </div>
             <div className="space-y-4">
                {LOAN_INVESTMENTS.map(inv => {
                    const borrower = USERS.find(u => u.id === inv.borrowerId);
                    return (
                        <div key={inv.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">Investment to {borrower?.name}</p>
                                    <p className="font-bold text-dark text-lg">RWF {inv.amount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+{inv.interestRate}% APY</p>
                                    <p className="text-xs text-gray-500">Status: {inv.status}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export default WalletPage;