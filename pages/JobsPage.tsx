
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useJobs } from '../contexts/JobContext';
import { Job } from '../types';
import { MapPinIcon, BriefcaseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '../components/ui/Modal';

const JobsPage: React.FC = () => {
  const { jobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Search from {jobs.length} open positions.</p>
        <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <Card key={job.id} className="flex flex-col">
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-dark dark:text-light">{job.title}</h2>
              <p className="font-semibold text-primary">{job.company}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                <BriefcaseIcon className="h-4 w-4 mr-1 ml-4" />
                <span>{job.type}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 line-clamp-3">{job.description}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setSelectedJob(job)} className="flex-1">View Details</Button>
              <Button variant="secondary" className="flex-1">Apply Now</Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedJob && (
          <JobDetailsModal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} job={selectedJob} />
      )}
    </div>
  );
};

interface JobDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, job }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={job.title}>
            <div className="space-y-4">
                <p className="font-semibold text-primary text-lg">{job.company}</p>
                 <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                    <BriefcaseIcon className="h-4 w-4 mr-1 ml-4" />
                    <span>{job.type}</span>
                </div>
                <div>
                    <h4 className="font-bold text-dark dark:text-light mb-2">Job Description</h4>
                    <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                </div>
                <div>
                    <h4 className="font-bold text-dark dark:text-light mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {job.requirements.map(req => <li key={req}>{req}</li>)}
                    </ul>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button>Apply Now</Button>
                </div>
            </div>
        </Modal>
    )
}

export default JobsPage;
