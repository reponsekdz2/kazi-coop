// FIX: Populated the empty FinancialMetricCard.tsx file.
import React from 'react';
import Card from './Card';

interface FinancialMetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon?: React.ElementType;
}

const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({ title, value, change, isPositive, icon: Icon }) => {
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {Icon && <Icon className="h-6 w-6 text-gray-400" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-dark mt-2">{value}</p>
        {change && <p className={`text-sm font-semibold mt-1 ${changeColor}`}>{change}</p>}
      </div>
    </Card>
  );
};

export default FinancialMetricCard;
