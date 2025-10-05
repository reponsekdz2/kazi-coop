import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TRANSACTIONS } from '../constants';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WalletPage: React.FC = () => {
  const currentBalance = TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <p className="text-gray-500">Current Balance</p>
            <p className="text-4xl font-bold text-primary my-4">RWF {currentBalance.toLocaleString()}</p>
            <div className="flex space-x-2 justify-center">
              <Button>Deposit</Button>
              <Button variant="secondary">Withdraw</Button>
            </div>
          </Card>
          <Card title="Balance History">
             <ResponsiveContainer width="100%" height={200}>
                <LineChart data={processedTransactions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="balance" stroke="#005A9C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Transaction History">
            <div className="space-y-2">
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
      </div>
    </div>
  );
};

export default WalletPage;