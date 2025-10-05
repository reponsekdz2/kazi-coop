import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Cooperative, MemberContribution } from '../types';
import { COOPERATIVES, CONTRIBUTIONS, USERS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';

const CooperativesPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const coop = COOPERATIVES[0];
  const userContributions = CONTRIBUTIONS.filter(c => c.memberId === user?.id);

  const [isLoanModalOpen, setLoanModalOpen] = useState(false);

  const handleLoanRequestSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addToast('Loan request submitted successfully!', 'success');
      setLoanModalOpen(false);
  }

  const MemberView = () => (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Cooperative</h1>
      <Card title={coop.name}>
        <p className="text-gray-600 mb-6">{coop.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
            <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">My Total Savings</p>
                <p className="text-2xl font-bold text-accent">RWF 100,000</p>
            </div>
             <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">My Active Loan</p>
                <p className="text-2xl font-bold text-red-500">RWF 50,000</p>
            </div>
             <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">Next Contribution Due</p>
                <p className="text-2xl font-bold text-dark">Aug 1, 2024</p>
            </div>
        </div>
        <div className="space-x-2">
            <Button onClick={() => addToast('Contribution successful!', 'success')}>Make Contribution</Button>
            <Button variant="secondary" onClick={() => setLoanModalOpen(true)}>Request Loan</Button>
        </div>
      </Card>
      
      <Card title="My Contribution History" className="mt-6">
        <ContributionTable contributions={userContributions} />
      </Card>
    </div>
  );

  const AdminView = () => (
     <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Manage Cooperative</h1>
        <Button>Add New Member</Button>
      </div>
      <Card title={`${coop.name} Overview`}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
            <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-primary">{coop.membersCount}</p>
            </div>
             <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">Total Savings</p>
                <p className="text-2xl font-bold text-accent">RWF {coop.totalSavings.toLocaleString()}</p>
            </div>
             <div className="p-4 bg-light rounded-md">
                <p className="text-sm text-gray-500">Total Loans</p>
                <p className="text-2xl font-bold text-red-500">RWF {coop.totalLoans.toLocaleString()}</p>
            </div>
        </div>
      </Card>
      <Card title="All Member Contributions" className="mt-6">
         <ContributionTable contributions={CONTRIBUTIONS} showMember={true} />
      </Card>
     </div>
  );

  return (
    <>
      {user?.role === UserRole.COOP_ADMIN ? <AdminView /> : <MemberView />}
      <Modal 
        isOpen={isLoanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        title="Request a Loan"
      >
        <form onSubmit={handleLoanRequestSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount (RWF)</label>
                <input type="number" placeholder="e.g. 200000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Loan</label>
                <textarea rows={4} placeholder="e.g. For expanding my small business" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div className="flex justify-end gap-2 !mt-6">
                <Button variant="secondary" type="button" onClick={() => setLoanModalOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
            </div>
        </form>
      </Modal>
    </>
  );
};

interface ContributionTableProps {
    contributions: MemberContribution[];
    showMember?: boolean;
}
const ContributionTable: React.FC<ContributionTableProps> = ({ contributions, showMember = false }) => {
    const getUserName = (id: string) => USERS.find(u => u.id === id)?.name || 'Unknown';
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        {showMember && <th className="p-4">Member</th>}
                        <th className="p-4">Date</th>
                        <th className="p-4">Type</th>
                        <th className="p-4 text-right">Amount (RWF)</th>
                    </tr>
                </thead>
                <tbody>
                    {contributions.map(c => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            {showMember && <td className="p-4">{getUserName(c.memberId)}</td>}
                            <td className="p-4">{c.date}</td>
                            <td className="p-4">{c.type}</td>
                            <td className="p-4 text-right font-semibold">{c.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CooperativesPage;