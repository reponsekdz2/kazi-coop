
import React from 'react';
import Modal from '../layout/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from './Button';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

interface FinancialForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const forecastData = [
  { name: 'This Month', savings: 120000 },
  { name: '+1 Mo', savings: 185000 },
  { name: '+2 Mo', savings: 250000 },
  { name: '+3 Mo', savings: 315000 },
  { name: '+4 Mo', savings: 380000 },
  { name: '+6 Mo', savings: 445000 },
];

const FinancialForecastModal: React.FC<FinancialForecastModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="6-Month Savings Forecast">
        <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="h-5 w-5"/>
                    Based on your current income and savings rate, your wallet balance is projected to grow.
                </p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={forecastData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `RWF ${Number(value) / 1000}k`} />
                        <Tooltip formatter={(value) => [`RWF ${Number(value).toLocaleString()}`, "Projected Savings"]} />
                        <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <div className="flex justify-end pt-4">
                <Button onClick={onClose}>Close</Button>
            </div>
        </div>
    </Modal>
  );
};

export default FinancialForecastModal;
