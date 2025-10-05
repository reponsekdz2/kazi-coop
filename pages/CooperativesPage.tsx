
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { USERS } from '../constants';
import { UserGroupIcon, BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import RingHub from '../components/ui/RingHub';

const CooperativesPage: React.FC = () => {
  const { cooperatives } = useCooperatives();

  const ringHubItems = cooperatives.map(c => ({
      id: c.id,
      imageUrl: c.avatarUrl,
      label: c.name,
  }));
  
  const [selectedCooperative, setSelectedCooperative] = React.useState(cooperatives[0]);

  const handleSelect = (id: string) => {
      const coop = cooperatives.find(c => c.id === id);
      if(coop) setSelectedCooperative(coop);
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-dark dark:text-light">Community Cooperatives (Ikimina)</h1>
            <Button><PlusIcon className="h-4 w-4 mr-2 inline" />Create New Cooperative</Button>
        </div>
        
        <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                    <RingHub items={ringHubItems} onSelect={handleSelect} size={350}>
                        <div className="text-center">
                           <UserGroupIcon className="h-12 w-12 mx-auto text-primary" />
                           <h3 className="font-bold text-lg mt-2 text-dark dark:text-light">Your Cooperatives</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Select a group</p>
                        </div>
                    </RingHub>
                </div>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedCooperative.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">{selectedCooperative.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-light dark:bg-dark rounded-lg">
                            <p className="text-sm text-gray-500 font-medium">Total Savings</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {selectedCooperative.totalSavings.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-light dark:bg-dark rounded-lg">
                            <p className="text-sm text-gray-500 font-medium">Available for Loans</p>
                            <p className="text-2xl font-bold text-dark dark:text-light">RWF {selectedCooperative.loanPool.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Members">
                <div className="space-y-3 h-64 overflow-y-auto">
                    {selectedCooperative.members.map(memberId => {
                        const member = USERS.find(u => u.id === memberId);
                        if (!member) return null;
                        return (
                            <div key={memberId} className="flex items-center p-2 rounded-md hover:bg-light dark:hover:bg-gray-700/50">
                                <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold text-dark dark:text-light">{member.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
             <Card title="Recent Activity">
                <div className="space-y-4 h-64 overflow-y-auto">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3"><BanknotesIcon className="h-5 w-5 text-green-600"/></div>
                        <p className="text-sm text-dark dark:text-light"><span className="font-bold">Aline U.</span> contributed RWF 50,000.</p>
                    </div>
                     <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3"><UserGroupIcon className="h-5 w-5 text-blue-600"/></div>
                        <p className="text-sm text-dark dark:text-light"><span className="font-bold">Jean H.</span> joined the cooperative.</p>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default CooperativesPage;
