// FIX: Populated the empty CooperativesPage.tsx file.
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import RingHub from '../components/ui/RingHub';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { USERS, COOPERATIVES, PUNISHMENTS } from '../constants';
import { UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    
    // Find the cooperative the current user is a member of
    const myCooperative = COOPERATIVES.find(c => c.members.includes(user?.id ?? ''));
    const myPunishments = PUNISHMENTS.filter(p => p.userId === user?.id && p.cooperativeId === myCooperative?.id && p.status === 'Pending');

    if (!myCooperative) {
        return <Card><p className="text-center text-gray-500">You are not yet a member of any cooperative.</p></Card>;
    }
    
    const membersForHub = USERS.filter(u => myCooperative.members.includes(u.id)).map(u => ({ id: u.id, imageUrl: u.avatarUrl, label: u.name }));
    const selectedUserInfo = USERS.find(u => u.id === selectedMember);

    const handleLoanRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form data and send it to a server
        addToast("Loan request submitted successfully!", "success");
        setIsLoanModalOpen(false);
    }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Cooperative</h1>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card title={myCooperative.name}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <StatCard icon={BanknotesIcon} title="Total Savings" value={`RWF ${myCooperative.totalSavings.toLocaleString()}`} trend={12} data={[3, 4, 4.5, 4.8, 5.25]}/>
                     <StatCard icon={UserGroupIcon} title="Members" value={myCooperative.members.length} trend={1} data={[4, 4, 4, 5, 5]}/>
                     <StatCard icon={ArrowTrendingUpIcon} title="Goal Progress" value={`${myCooperative.goalProgress}%`} trend={5} data={[40, 50, 60, 65, 68]}/>
                </div>
                <div className="p-4 bg-light rounded-lg">
                    <h4 className="font-bold text-dark">Next Goal: {myCooperative.goal}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${myCooperative.goalProgress}%` }}></div>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                    <Button>Make Contribution</Button>
                    <Button variant="secondary" onClick={() => setIsLoanModalOpen(true)}>Request a Loan</Button>
                    <Button variant="secondary">View Transactions</Button>
                </div>
            </Card>
            {myPunishments.length > 0 && (
                <Card title="Outstanding Punishments">
                    <div className="space-y-3">
                        {myPunishments.map(pun => (
                            <div key={pun.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                                    <div>
                                        <p className="font-semibold text-dark">{pun.reason}</p>
                                        <p className="text-xs text-gray-500">Due: {new Date(pun.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-600">RWF {pun.amount.toLocaleString()}</p>
                                    <Button variant="danger" className="!px-2 !py-1 !text-xs mt-1">Pay Now</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
        <div className="lg:col-span-1">
             <Card title="Members Hub" className="flex flex-col items-center">
                <RingHub items={membersForHub} onSelect={setSelectedMember} size={320}>
                    <div className="text-center">
                    {selectedUserInfo ? (
                        <>
                            <img src={selectedUserInfo.avatarUrl} alt={selectedUserInfo.name} className="h-16 w-16 rounded-full mx-auto mb-2" />
                            <p className="font-bold text-dark">{selectedUserInfo.name}</p>
                            <p className="text-sm text-gray-500">{selectedUserInfo.role}</p>
                        </>
                    ) : (
                        <>
                            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="font-bold text-dark">Select a member</p>
                            <p className="text-xs text-gray-500">to see details</p>
                        </>
                    )}
                    </div>
                </RingHub>
             </Card>
        </div>
       </div>

       <Modal isOpen={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} title="Request a Loan">
           <form onSubmit={handleLoanRequest} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Requested (RWF)</label>
                    <input type="number" placeholder="e.g., 150000" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Loan</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                        <option>Small Business Startup</option>
                        <option>Emergency Medical Bills</option>
                        <option>Home Improvement</option>
                        <option>Education</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Period</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                        <option>6 Months</option>
                        <option>12 Months</option>
                        <option>18 Months</option>
                        <option>24 Months</option>
                    </select>
                </div>
                <div className="pt-4 flex justify-end">
                    <Button type="submit">Submit Request</Button>
                </div>
           </form>
       </Modal>
    </div>
  );
};

export default CooperativesPage;
