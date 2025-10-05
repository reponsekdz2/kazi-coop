import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { COOPERATIVES, USERS } from '../constants';
import { Loan, UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon, PlusIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const mockLoans: Loan[] = [
    { id: 1, userId: 'user1', amount: 500000, interestRate: 5, status: 'Approved', repaymentProgress: 25, dueDate: '2024-12-31' },
    { id: 2, userId: 'user4', amount: 200000, interestRate: 5, status: 'Pending', repaymentProgress: 0, dueDate: '2025-02-28' },
];

const MemberCooperativeView: React.FC = () => {
    const { user } = useAuth();
    const addToast = useToast().addToast;
    const myCooperative = COOPERATIVES[0]; // Assume user is in the first one
    const myLoans = mockLoans.filter(l => l.userId === user?.id);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [loanAmount, setLoanAmount] = useState(0);

    const handleApplyForLoan = (e: React.FormEvent) => {
        e.preventDefault();
        addToast(`Successfully applied for a loan of RWF ${loanAmount.toLocaleString()}`, 'success');
        setIsLoanModalOpen(false);
        setLoanAmount(0);
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark">{myCooperative.name}</h1>
                <Button onClick={() => setIsLoanModalOpen(true)}>Apply for Loan</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Total Members"><p className="text-3xl font-bold">{myCooperative.members}</p></Card>
                <Card title="Total Savings"><p className="text-3xl font-bold">RWF {myCooperative.totalSavings.toLocaleString()}</p></Card>
                <Card title="Available for Loans"><p className="text-3xl font-bold">RWF {myCooperative.loanPool.toLocaleString()}</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card title="Your Contribution">
                     <div className="text-center">
                        <p className="text-lg text-gray-500">Your Share</p>
                        <p className="text-4xl font-bold text-primary my-2">RWF {(user?.cooperativeShare || 0).toLocaleString()}</p>
                        <Button variant="secondary" className="mt-4"><ArrowUpOnSquareIcon className="h-5 w-5 mr-2 inline" />Make a Contribution</Button>
                     </div>
                 </Card>
                 <Card title="Your Loans">
                     {myLoans.length > 0 ? myLoans.map(loan => (
                         <div key={loan.id} className="mb-4">
                             <div className="flex justify-between items-center">
                                 <p>Amount: RWF {loan.amount.toLocaleString()}</p>
                                 <p className="text-sm font-semibold">{loan.status}</p>
                             </div>
                             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-primary h-2.5 rounded-full" style={{width: `${loan.repaymentProgress}%`}}></div>
                            </div>
                         </div>
                     )) : <p className="text-gray-500">You have no active loans.</p>}
                 </Card>
            </div>
            
            <Modal isOpen={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} title="Apply for a New Loan">
                <form onSubmit={handleApplyForLoan} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (RWF)</label>
                        <input 
                            type="number" 
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                            min="10000"
                        />
                    </div>
                    <p className="text-xs text-gray-500">The standard interest rate is 5%. Your application will be reviewed by the cooperative committee.</p>
                    <Button type="submit" className="w-full">Submit Application</Button>
                </form>
            </Modal>
        </div>
    );
};

const AdminCooperativeView: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark">Manage Cooperatives</h1>
                 <Button><PlusIcon className="h-5 w-5 mr-2 inline" /> Create New Cooperative</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COOPERATIVES.map(coop => (
                    <Card key={coop.id} className="flex items-center gap-4">
                        <img src={coop.logoUrl} alt={coop.name} className="h-16 w-16" />
                        <div>
                            <h2 className="text-xl font-bold text-dark">{coop.name}</h2>
                            <p className="text-gray-500">{coop.members} members</p>
                            <p className="font-semibold text-primary">RWF {coop.totalSavings.toLocaleString()} saved</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}


const CooperativesPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.role === UserRole.SEEKER && <MemberCooperativeView />}
      {user.role === UserRole.COOP_ADMIN && <AdminCooperativeView />}
    </>
  );
};

export default CooperativesPage;
