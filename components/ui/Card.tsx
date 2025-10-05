import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 dark:bg-dark dark:border dark:border-gray-700 ${className}`}>
      {title && <h3 className="text-xl font-bold text-dark dark:text-light mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;