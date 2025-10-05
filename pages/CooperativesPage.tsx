import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { COOPERATIVES, CONTRIBUTIONS, USERS } from '../constants';
import { UserPlusIcon, BanknotesIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const CooperativesPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Cooperatives</h1>
      {user?.role === UserRole.COOP_ADMIN ? <CoopAdminView /> : <SeekerView />}
    </div>
  );
};

// Seeker View: Browse cooperatives and view personal contributions
const SeekerView: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isLoanModalOpen, setLoanModalOpen] = useState(false);

    // Assuming seeker is part of the first cooperative for demo purposes
    const myCooperative = COOPERATIVES[0]; 
    const myContributions = CONTRIBUTIONS.filter(c => c.memberId === user?.id);
    const totalContributed = myContributions.reduce((acc, c) => acc + (c.type === 'Contribution' ? c.amount : 0), 0);

    const handleLoanRequest = (e: React.FormEvent) => {
        e.preventDefault();
        setLoanModalOpen(false);
        addToast('Loan request submitted successfully!', 'success');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="Available Cooperatives">
                    {COOPERATIVES.map(coop => (
                        <div key={coop.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md bg-light mb-4 last:mb-0">
                            <div>
                                <h3 className="font-bold text-lg text-primary">{coop.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{coop.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-800">
                                    <span><strong className="font-semibold">{coop.membersCount}</strong> Members</span>
                                    <span><strong className="font-semibold">RWF {coop.totalSavings.toLocaleString()}</strong> in Savings</span>
                                </div>
                            </div>
                            <Button className="mt-4 md:mt-0 flex-shrink-0">View Details & Join</Button>
                        </div>
                    ))}
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card title="My Membership">
                    <div className="mb-4">
                        <p className="text-gray-500 text-sm">Your Cooperative</p>
                        <p className="font-bold text-dark">{myCooperative.name}</p>
                    </div>
                     <div className="mb-4">
                        <p className="text-gray-500 text-sm">My Total Savings</p>
                        <p className="font-bold text-dark text-xl">RWF {totalContributed.toLocaleString()}</p>
                    </div>
                    <Button onClick={() => setLoanModalOpen(true)} className="w-full">Request a Loan</Button>
                    <hr className="my-4" />
                    <h4 className="font-semibold text-dark mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                        {myContributions.length > 0 ? myContributions.slice(0, 3).map(c => (
                            <div key={c.id} className="flex justify-between text-sm">
                                <p className="text-gray-700">{c.type} on {c.date}</p>
                                <p className="font-semibold text-dark">RWF {c.amount.toLocaleString()}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>}
                    </div>
                </Card>
            </div>
             <Modal isOpen={isLoanModalOpen} onClose={() => setLoanModalOpen(false)} title="Request a Loan">
                <form onSubmit={handleLoanRequest} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount (RWF)</label>
                        <input type="number" id="amount" name="amount" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Loan</label>
                        <textarea id="reason" name="reason" rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label htmlFor="repayment" className="block text-sm font-medium text-gray-700">Desired Repayment Period</label>
                         <select id="repayment" name="repayment" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option>3 Months</option>
                            <option>6 Months</option>
                            <option>12 Months</option>
                            <option>18 Months</option>
                        </select>
                    </div>
                    <div className="pt-4 text-right">
                        <Button type="submit">Submit Request</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Cooperative Admin View: Manage the cooperative
const CoopAdminView: React.FC = () => {
    const coop = COOPERATIVES[0];
    // Mock members from the seekers list for demonstration
    const members = USERS.filter(u => u.role === UserRole.SEEKER).slice(0, 5); 

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                            <BanknotesIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Savings</p>
                            <p className="text-2xl font-bold text-dark">RWF {coop.totalSavings.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                     <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 mr-4">
                            <PresentationChartLineIcon className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Loans</p>
                            <p className="text-2xl font-bold text-dark">RWF {coop.totalLoans.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                            <UserPlusIcon className="h-8 w-8 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Members</p>
                            <p className="text-2xl font-bold text-dark">{coop.membersCount}</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            <Card>
                 <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-dark">Members Management</h2>
                    <div className="space-x-2 flex-shrink-0">
                        <Button variant="secondary">Add New Member</Button>
                        <Link to="/analytics">
                            <Button>View Full Analytics</Button>
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Join Date</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total Savings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td className="py-3 px-4 flex items-center">
                                        <img src={member.avatarUrl} alt={member.name} className="h-8 w-8 rounded-full mr-3" />
                                        <span className="font-medium text-dark">{member.name}</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 hidden sm:table-cell">{member.email}</td>
                                    <td className="py-3 px-4 text-gray-700 hidden md:table-cell">2024-01-15</td>
                                    <td className="py-3 px-4 text-right font-semibold text-dark">RWF {Math.floor(Math.random() * 200000).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CooperativesPage;