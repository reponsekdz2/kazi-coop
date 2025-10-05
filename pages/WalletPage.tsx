// FIX: Populated the empty WalletPage.tsx file.
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import ToggleSwitch from '../components/ui/ToggleSwitch';

const transactions = [
    { id: 't1', type: 'in', description: 'Salary from TechSolutions Ltd.', amount: 750000, date: '2024-08-01' },
    { id: 't2', type: 'out', description: 'Co-op Contribution', amount: -50000, date: '2024-08-02' },
    { id: 't3', type: 'out', description: 'MTN Airtime', amount: -5000, date: '2024-08-05' },
    { id: 't4', type: 'in', description: 'Loan Disbursment', amount: 150000, date: '2024-08-10' },
];


const WalletPage: React.FC = () => {
    const [isAutoSaveOn, setIsAutoSaveOn] = useState(true);
    const balance = 85000; // Mock balance
    
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card className="text-center bg-primary text-white">
                    <p className="opacity-80">Current Balance</p>
                    <p className="text-4xl font-bold mt-2">RWF {balance.toLocaleString()}</p>
                    <div className="flex gap-4 mt-6">
                        <Button className="flex-1 !bg-white !text-primary hover:!bg-blue-100">Deposit</Button>
                        <Button className="flex-1 !bg-white/20 hover:!bg-white/30">Withdraw</Button>
                    </div>
                </Card>
                <Card title="Smart Savings">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-dark">Auto-save 5%</p>
                        <ToggleSwitch checked={isAutoSaveOn} onChange={setIsAutoSaveOn} />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Automatically save 5% of every incoming transaction to your cooperative savings.</p>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Recent Transactions">
                    <div className="space-y-3">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center p-3 bg-light rounded-md">
                                <div className="flex items-center">
                                    {tx.type === 'in' ? <ArrowDownCircleIcon className="h-8 w-8 text-green-500 mr-3" /> : <ArrowUpCircleIcon className="h-8 w-8 text-red-500 mr-3" />}
                                    <div>
                                        <p className="font-semibold text-dark">{tx.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-dark'}`}>
                                    {tx.type === 'in' ? '+' : ''}RWF {tx.amount.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default WalletPage;
