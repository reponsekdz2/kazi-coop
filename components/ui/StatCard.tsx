import React from 'react';
import Card from './Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number; // Positive for up, negative for down, 0 for neutral
  icon?: React.ElementType;
  data?: number[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, data = [] }) => {
    const chartData = data.map((val, index) => ({ name: index, value: val }));
  return (
    <Card className="relative overflow-hidden">
      {Icon && <Icon className="absolute -right-4 -bottom-4 h-24 w-24 text-gray-50 opacity-60" />}
      <div className="flex justify-between items-start">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-dark mt-2">{value}</p>
        </div>
        <div className={`flex items-center text-sm font-semibold ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {trend > 0 && <ArrowUpIcon className="h-4 w-4 mr-1" />}
            {trend < 0 && <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(trend)}%
        </div>
      </div>
      {data.length > 0 && (
         <div className="h-16 mt-4 -mb-6 -mx-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke={trend >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
         </div>
      )}
    </Card>
  );
};

export default StatCard;
