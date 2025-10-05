import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { TRANSACTIONS } from '../constants';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useToast } from '../contexts/ToastContext';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [autoSave, setAutoSave] = useState(false);
  
  const balance = user?.savingsBalance ?? 0;
  
  const handleToggleAutoSave = (checked: boolean) => {
      setAutoSave(checked);
      addToast(`Autosave has been ${checked ? 'enabled' : 'disabled'}.`, 'info');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Current Balance</p>
                <p className="text-4xl font-bold text-dark">RWF {balance.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary"><ArrowDownTrayIcon className="h-5 w-5 mr-2 inline"/>Deposit</Button>
                <Button><ArrowUpTrayIcon className="h-5 w-5 mr-2 inline"/>Send</Button>
              </div>
            </div>
          </Card>
          
          <Card title="Recent Transactions">
            <div className="space-y-3">
              {TRANSACTIONS.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 rounded-md hover:bg-light">
                  <div>
                    <p className="font-semibold text-dark capitalize">{tx.type}: {tx.description}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-dark'}`}>
                    {tx.type === 'deposit' ? '+' : '-'} RWF {tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Smart Savings">
            <div className="flex justify-between items-center">
              <p className="font-medium text-dark">Autosave 10% of Deposits</p>
              <ToggleSwitch checked={autoSave} onChange={handleToggleAutoSave} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Automatically move 10% of every incoming salary or deposit into your savings goal.
            </p>
          </Card>
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button className="w-full" variant="secondary">Pay Bills</Button>
              <Button className="w-full" variant="secondary">Buy Airtime</Button>
              <Button className="w-full" variant="secondary"><ArrowPathIcon className="h-5 w-5 mr-2 inline"/>Link Mobile Money</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
