import React from 'react';
import { Application } from '../../types';

interface ApplicationStatusTrackerProps {
  status: Application['status'];
}

const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({ status }) => {
    const steps: Application['status'][] = ['Applied', 'Reviewed', 'Interviewing', 'Interview Scheduled', 'Offered', 'Rejected'];
    const currentStepIndex = steps.indexOf(status);

    if (status === 'Rejected') {
        return (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-center">
                <h4 className="font-bold text-red-800 dark:text-red-200">Application Update</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Unfortunately, the employer has decided not to move forward with your application at this time.
                </p>
            </div>
        )
    }

    return (
        <div>
            <h4 className="font-bold text-dark dark:text-light mb-4">Application Status</h4>
            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-2 lg:space-x-4">
                    {steps.map((step, stepIdx) => {
                        if (step === 'Rejected') return null;
                        const isCompleted = currentStepIndex >= stepIdx;

                        return (
                            <li key={step} className="md:flex-1">
                                <div className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 transition-colors
                                    ${isCompleted ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <span className={`text-xs font-semibold uppercase transition-colors ${isCompleted ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>{`Step ${stepIdx + 1}`}</span>
                                    <span className="text-sm font-medium text-dark dark:text-light">{step}</span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};

export default ApplicationStatusTracker;
