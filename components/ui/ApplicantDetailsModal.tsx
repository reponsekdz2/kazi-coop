

import React, { useState } from 'react';
import Modal from '../layout/Modal';
import { Application, User } from '../../types';
import { USERS } from '../../constants';
import Card from './Card';
import Button from '../layout/Button';
import { CheckBadgeIcon, BriefcaseIcon, AcademicCapIcon, CalendarDaysIcon, CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useApplications } from '../../contexts/ApplicationContext';
import ScheduleInterviewModal from './ScheduleInterviewModal';

interface ApplicantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({ isOpen, onClose, application }) => {
  const applicant = USERS.find(u => u.id === application.userId);
  const { updateApplicationStatus } = useApplications();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  if (!applicant) return null;

  // FIX: Removed `|| {}` as `applicantInfo` is not optional on Application type, fixing type errors.
  const applicantInfo = application.applicantInfo;
  const userSkills = applicant.skills || [];

  const handleStatusUpdate = (status: Application['status']) => {
    updateApplicationStatus(application.id, status);
    onClose();
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title={`Applicant: ${applicant.name}`}>
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <div className="flex items-start gap-4 p-4 bg-light dark:bg-dark rounded-lg">
            <img src={applicant.avatarUrl} alt={applicant.name} className="h-20 w-20 rounded-full border-4 border-primary" />
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-dark dark:text-light">{applicant.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{applicant.email}</p>
                <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800`}>Status: {application.status}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <InfoPill icon={AcademicCapIcon} label="Education" value={`${applicantInfo.educationLevel} in ${applicantInfo.fieldOfStudy}`} />
            <InfoPill icon={BriefcaseIcon} label="Experience" value={`${applicantInfo.yearsOfExperience} years`} />
            <InfoPill icon={CalendarDaysIcon} label="Applied On" value={new Date(application.submissionDate).toLocaleDateString()} />
        </div>
        
        <Card title="Skills">
             <div className="flex flex-wrap gap-2">
                {userSkills.map(skill => (
                    <div key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-blue-900/50 dark:text-blue-300">
                        {skill}
                        <CheckBadgeIcon className="h-4 w-4 ml-1 text-primary" />
                    </div>
                ))}
            </div>
        </Card>

         <Card title="Documents">
            {applicantInfo.resumeUrl ? (
                <a href="#" className="text-primary hover:underline font-semibold">{applicantInfo.resumeUrl}</a>
            ) : <p className="text-gray-500">No resume submitted.</p>}
        </Card>

        <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="font-bold text-dark dark:text-light mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setIsScheduleModalOpen(true)}>Schedule Interview</Button>
                <Button onClick={() => handleStatusUpdate('Offered')} className="bg-green-600 hover:bg-green-700">
                    <CheckCircleIcon className="h-5 w-5 mr-2 inline" />
                    Make Offer
                </Button>
                <Button variant="danger" onClick={() => handleStatusUpdate('Rejected')}>
                     <XCircleIcon className="h-5 w-5 mr-2 inline" />
                    Reject Application
                </Button>
                 <Button variant="secondary">
                     <EnvelopeIcon className="h-5 w-5 mr-2 inline" />
                    Message Applicant
                </Button>
            </div>
        </div>
      </div>
    </Modal>
    <ScheduleInterviewModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        application={application}
    />
    </>
  );
};

const InfoPill: React.FC<{icon: React.ElementType, label: string, value: string | number | undefined}> = ({icon: Icon, label, value}) => (
    <div className="p-3 bg-light dark:bg-gray-700/50 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Icon className="h-3 w-3 mr-1"/> {label}</p>
        <p className="font-semibold text-dark dark:text-light mt-1">{value || 'N/A'}</p>
    </div>
);

export default ApplicantDetailsModal;