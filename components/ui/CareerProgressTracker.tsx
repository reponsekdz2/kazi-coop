import React from 'react';
import { UserCircleIcon, CheckBadgeIcon, PaperAirplaneIcon, TicketIcon, TrophyIcon } from '@heroicons/react/24/solid';

const steps = [
    { id: 1, name: 'Profile Complete', icon: UserCircleIcon },
    { id: 2, name: 'Skills Verified', icon: CheckBadgeIcon },
    { id: 3, name: 'First Application', icon: PaperAirplaneIcon },
    { id: 4, name: 'Interview', icon: TicketIcon },
    { id: 5, name: 'Offer Received', icon: TrophyIcon },
];

interface CareerProgressTrackerProps {
  currentStep: number;
}

const CareerProgressTracker: React.FC<CareerProgressTrackerProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
              {/* Connector line */}
              {stepIdx !== steps.length - 1 ? (
                <div className={`absolute left-1/2 top-1/2 -translate-x-0 -translate-y-1/2 h-0.5 w-full ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} aria-hidden="true" />
              ) : null}

              <div className="relative flex flex-col items-center text-center w-24">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-primary' : isCurrent ? 'border-2 border-primary bg-light' : 'border-2 border-gray-300 bg-white'}
                `}>
                  <step.icon 
                    className={`h-6 w-6 
                      ${isCompleted ? 'text-white' : isCurrent ? 'text-primary' : 'text-gray-400'}
                    `} 
                    aria-hidden="true" 
                  />
                </div>
                <p className={`mt-2 text-xs font-semibold ${isCompleted || isCurrent ? 'text-primary' : 'text-gray-500'}`}>
                  {step.name}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CareerProgressTracker;
