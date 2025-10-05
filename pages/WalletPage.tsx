import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { TRANSACTIONS, SAVINGS_GOALS } from '../constants';
import { SavingsGoal } from '../types';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WalletPage: React.FC = () => {
  const currentBalance = TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const processedTransactions = [...TRANSACTIONS]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
        const lastBalance = acc.length > 0 ? acc[acc.length-1].balance : 0;
        acc.push({
            date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: lastBalance + t.amount
        });
        return acc;
    }, [] as {date: string; balance: number}[]);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addToast('New savings goal created!', 'success');
      setIsModalOpen(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card title="Financial Overview" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 rounded-lg bg-light">
                        <p className="text-gray-500">Current Balance</p>
                        <p className="text-4xl font-bold text-primary my-2">RWF {currentBalance.toLocaleString()}</p>
                         <div className="flex space-x-2 justify-center">
                            <Button>Deposit</Button>
                            <Button variant="secondary">Withdraw</Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-dark mb-2 text-center">Balance History</h3>
                         <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={processedTransactions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="balance" stroke="#005A9C" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                    </div>
                </div>
           </Card>
           <Card title="Transaction History">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {TRANSACTIONS.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-md hover:bg-light">
                  <div className="flex items-center">
                    {t.amount > 0 ? 
                      <ArrowDownCircleIcon className="h-8 w-8 text-accent mr-4" /> :
                      <ArrowUpCircleIcon className="h-8 w-8 text-red-500 mr-4" />}
                    <div>
                      <p className="font-semibold text-dark">{t.description}</p>
                      <p className="text-sm text-gray-500">{t.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${t.amount > 0 ? 'text-accent' : 'text-red-500'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} RWF
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-dark">Savings Goals</h2>
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>New Goal</Button>
                </div>
                 <div className="space-y-4">
                    {SAVINGS_GOALS.map(goal => (
                        <GoalProgress key={goal.id} goal={goal} />
                    ))}
                </div>
            </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Savings Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="e.g., New Phone" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Target Amount (RWF)</label>
                <input type="number" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="500000" required />
            </div>
            <Button type="submit" className="w-full">Create Goal</Button>
        </form>
      </Modal>
    </div>
  );
};

const GoalProgress: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
    const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
    return (
        <div className="p-3 bg-light rounded-md">
            <p className="font-bold text-dark">{goal.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">RWF {goal.currentAmount.toLocaleString()}</span> / {goal.targetAmount.toLocaleString()} ({progress}%)
            </p>
        </div>
    )
}

export default WalletPage;