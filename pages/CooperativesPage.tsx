// FIX: Created CooperativesPage.tsx to display cooperative information.
import React, { useState } from 'react';
import { useCooperative } from '../contexts/CooperativeContext';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { BuildingOffice2Icon, UsersIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { USERS } from '../constants';
import { Cooperative } from '../types';

const CooperativesPage: React.FC = () => {
    const { cooperatives } = useCooperative();
    const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(cooperatives[0] || null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
                <h1 className="text-3xl font-bold text-dark dark:text-light">Cooperatives (Ikimina)</h1>
                {cooperatives.map(coop => (
                    <Card key={coop.id} className={`!p-4 cursor-pointer ${selectedCooperative?.id === coop.id ? 'border-2 border-primary' : ''}`} onClick={() => setSelectedCooperative(coop)}>
                        <h3 className="font-bold text-dark dark:text-light">{coop.name}</h3>
                        <p className="text-sm text-gray-500">{coop.members.length} members</p>
                    </Card>
                ))}
            </div>
            <div className="lg:col-span-2 overflow-y-auto pr-2">
                {selectedCooperative && (
                    <Card>
                        <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedCooperative.name}</h2>
                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 my-2">
                            <span className="flex items-center"><BuildingOffice2Icon className="h-4 w-4 mr-1"/> Created by {USERS.find(u => u.id === selectedCooperative.creatorId)?.name}</span>
                            <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1"/> {selectedCooperative.members.length} Members</span>
                            <span className="flex items-center"><BanknotesIcon className="h-4 w-4 mr-1"/> RWF {selectedCooperative.totalSavings.toLocaleString()} Total Savings</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mt-4">{selectedCooperative.description}</p>
                        <h3 className="font-bold text-dark dark:text-light mt-4 mb-2">Rules & Regulations</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedCooperative.rulesAndRegulations}</p>
                        <div className="mt-6">
                            <Button>Join Cooperative</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CooperativesPage;
