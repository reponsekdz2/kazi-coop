
import React from 'react';
import Modal from '../layout/Modal';
import { LightBulbIcon, SparklesIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Button from './Button';

interface InterviewPrepKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

const InterviewPrepKitModal: React.FC<InterviewPrepKitModalProps> = ({ isOpen, onClose, jobTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI-Powered Interview Prep Kit">
      <div className="space-y-4">
        <div className="p-4 bg-primary/10 rounded-lg text-center">
            <SparklesIcon className="h-8 w-8 text-primary mx-auto mb-2"/>
            <h3 className="font-bold text-lg text-dark dark:text-light">Preparing for: {jobTitle}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Here are some AI-generated tips and questions to help you succeed.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-dark dark:text-light flex items-center gap-2 mb-2">
            <QuestionMarkCircleIcon className="h-5 w-5 text-primary" />
            Common Questions
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>"Can you tell me about your experience with [Key Skill from Job Description]?"</li>
            <li>"Describe a challenging project you worked on and how you handled it."</li>
            <li>"Why are you interested in this role at our company?"</li>
          </ul>
        </div>

        <div>
           <h4 className="font-semibold text-dark dark:text-light flex items-center gap-2 mb-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-500" />
            Pro Tips
          </h4>
           <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>Research the company's recent projects and mention them.</li>
            <li>Prepare 2-3 questions to ask the interviewer about the team or role.</li>
            <li>Use the STAR method (Situation, Task, Action, Result) to structure your answers.</li>
          </ul>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Got it, thanks!</Button>
        </div>
      </div>
    </Modal>
  );
};

export default InterviewPrepKitModal;
