import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  // FIX: Added an optional onClick prop to allow cards to be clickable.
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-md p-6 dark:bg-dark dark:border dark:border-gray-700 ${className}`}>
      {title && <h3 className="text-xl font-bold text-dark dark:text-light mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;