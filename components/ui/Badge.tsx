
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'blue', className = '' }) => {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center ${colorStyles[color]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
