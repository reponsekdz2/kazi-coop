
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { UserGroupIcon, BanknotesIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';

const CooperativesPage: React.FC = () => {
    const { cooperatives } = useCooperatives();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">Community Cooperatives (Ikimina)</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                    Join a savings group to build your financial future with the community. Save, borrow, and grow together.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map(coop => (
                    <Card key={coop.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-dark dark:text-light mb-2">{coop.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{coop.description}</p>
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                                    <span>{coop.members.length} Members</span>
                                </div>
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <BanknotesIcon className="h-5 w-5 mr-2 text-green-500" />
                                    <span>RWF {coop.totalSavings.toLocaleString()} Total Savings</span>
                                </div>
                                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <ArrowUpRightIcon className="h-5 w-5 mr-2 text-blue-500" />
                                    <span>RWF {coop.contributionAmount.toLocaleString()} / {coop.contributionFrequency}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Button variant="secondary" className="flex-1">View Details</Button>
                            <Button className="flex-1">Request to Join</Button>
                        </div>
                    </Card>
                ))}
            </div>
             <div className="mt-8 text-center">
                <Button>Create a New Cooperative</Button>
            </div>
        </div>
    );
};

export default CooperativesPage;
