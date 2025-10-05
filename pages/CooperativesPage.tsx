// FIX: Populated the empty CooperativesPage.tsx file.
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import RingHub from '../components/ui/RingHub';
import { USERS } from '../constants';
import { UserGroupIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const myCooperative = {
    id: 'coop1',
    name: 'TechSolutions Innovators Circle',
    totalSavings: 5250000,
    members: 5,
    nextMeeting: '2024-09-01T18:00:00Z',
    goal: "Purchase new laptops for all members",
    goalProgress: 68,
};

const membersForHub = USERS.slice(0, 5).map(u => ({ id: u.id, imageUrl: u.avatarUrl, label: u.name }));

const CooperativesPage: React.FC = () => {
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const selectedUserInfo = USERS.find(u => u.id === selectedMember);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Cooperative</h1>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card title={myCooperative.name}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <StatCard icon={BanknotesIcon} title="Total Savings" value={`RWF ${myCooperative.totalSavings.toLocaleString()}`} trend={12} data={[3, 4, 4.5, 4.8, 5.25]}/>
                     <StatCard icon={UserGroupIcon} title="Members" value={myCooperative.members} trend={1} data={[4, 4, 4, 5, 5]}/>
                     <StatCard icon={ArrowTrendingUpIcon} title="Goal Progress" value={`${myCooperative.goalProgress}%`} trend={5} data={[40, 50, 60, 65, 68]}/>
                </div>
                <div className="p-4 bg-light rounded-lg">
                    <h4 className="font-bold text-dark">Next Goal: {myCooperative.goal}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${myCooperative.goalProgress}%` }}></div>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <Button>Contribute Funds</Button>
                    <Button variant="secondary">View Transactions</Button>
                </div>
            </Card>
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
    </div>
  );
};

export default CooperativesPage;
