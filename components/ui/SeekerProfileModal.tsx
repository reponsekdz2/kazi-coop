

import React from 'react';
import Modal from '../layout/Modal';
import { User } from '../../types';
import Card from './Card';
import RingProgress from '../layout/RingProgress';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import Button from '../layout/Button';
// FIX: Changed import to 'react-router' to resolve module export errors.
import { Link } from 'react-router';

interface SeekerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const SeekerProfileModal: React.FC<SeekerProfileModalProps> = ({ isOpen, onClose, user }) => {
  const userSkills = user.skills || ['React', 'TypeScript', 'Project Management', 'Agile'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${user.name}'s Profile`}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
            <img src={user.avatarUrl} alt={user.name} className="h-24 w-24 rounded-full border-4 border-primary" />
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-dark dark:text-light">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{user.email}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Skills">
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {userSkills.map(skill => (
                        <div key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-blue-900/50 dark:text-blue-300">
                            {skill}
                            <CheckBadgeIcon className="h-4 w-4 ml-1 text-primary" />
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Profile Strength" className="flex flex-col items-center justify-center">
                 <RingProgress percentage={Math.round((user.careerProgress || 0) / 5 * 100)} size={90} strokeWidth={8} />
            </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Link to="/profile" onClick={onClose}>
                <Button>View Full Profile</Button>
            </Link>
        </div>
      </div>
    </Modal>
  );
};

export default SeekerProfileModal;
