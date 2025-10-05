import React from 'react';

interface RingProgressProps {
  percentage: number;
  strokeWidth?: number;
  size?: number;
  className?: string;
  trackColorClassName?: string;
  progressColorClassName?: string;
  textColorClassName?: string;
}

const RingProgress: React.FC<RingProgressProps> = ({
  percentage,
  strokeWidth = 8,
  size = 100,
  className = '',
  trackColorClassName = 'text-gray-200',
  progressColorClassName = 'text-primary',
  textColorClassName = 'text-dark',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const textFontSizeClass = size < 90 ? 'text-lg' : 'text-xl';

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={trackColorClassName}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={progressColorClassName}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className={`absolute font-bold ${textFontSizeClass} ${textColorClassName}`}>{`${percentage}%`}</span>
    </div>
  );
};

export default RingProgress;
