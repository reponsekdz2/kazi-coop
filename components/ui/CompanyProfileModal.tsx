// FIX: Created CompanyProfileModal.tsx to resolve module not found error.
import React from 'react';
import Modal from '../layout/Modal';
import { Job, Company } from '../../types';
import Card from './Card';
import Button from '../layout/Button';
import { BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  jobs: Job[];
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ isOpen, onClose, company, jobs }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={company.name}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          {company.description}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1"/>{company.industry}</span>
            <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1"/>{company.location}</span>
        </div>
        
        <div className="pt-4">
            <h3 className="font-bold text-dark dark:text-light mb-2">Other open positions at {company.name}</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.map(job => (
                    <div key={job.id} className="p-3 bg-light dark:bg-gray-700/50 rounded-md">
                        <p className="font-semibold text-dark dark:text-light">{job.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyProfileModal;