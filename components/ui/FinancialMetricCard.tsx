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
    <Card className="p-4">
      <div className="flex items-center">
        {Icon && <Icon className="h-8 w-8 text-gray-400 mr-4" />}
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
      </div>
      <p className={`text-sm font-semibold mt-2 ${changeColor}`}>{change}</p>
    </Card>
  );
};

export default FinancialMetricCard;
