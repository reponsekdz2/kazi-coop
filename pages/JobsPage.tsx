import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Application, User } from '../types';
import { JOBS, APPLICATIONS, USERS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { BuildingOffice2Icon, MapPinIcon, ClockIcon, PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);
  const [isPostJobModalOpen, setPostJobModalOpen] = useState(false);
  const [isApplicantsModalOpen, setApplicantsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = () => {
    addToast(`Successfully applied for ${selectedJob?.title}`, 'success');
    setApplyModalOpen(false);
    setSelectedJob(null);
  };
  
  const handlePostJobSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addToast('New job posted successfully!', 'success');
      setPostJobModalOpen(false);
  }

  const handleViewApplicantsClick = (job: Job) => {
      setSelectedJob(job);
      setApplicantsModalOpen(true);
  }
  
  const handleScheduleInterview = (applicantName: string) => {
    addToast(`Interview scheduled with ${applicantName}`, 'info');
  }

  const SeekerJobsView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Find Your Next Job</h1>
        <input type="text" placeholder="Search jobs..." className="px-4 py-2 border rounded-md w-full md:w-1/3" />
      </div>
      <div className="space-y-4">
        {JOBS.map(job => (
          <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
        ))}
      </div>
    </div>
  );

  const EmployerJobsView = () => {
    const myJobs = JOBS.filter(j => j.employerId === user?.id);
    const getApplicantsCount = (jobId: string) => APPLICATIONS.filter(a => a.jobId === jobId).length;

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark">Manage Job Postings</h1>
          <Button onClick={() => setPostJobModalOpen(true)} className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Post New Job
          </Button>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map(job => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold text-primary">{job.title}</td>
                    <td className="p-4">{getApplicantsCount(job.id)}</td>
                    <td className="p-4"><span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span></td>
                    <td className="p-4">
                      <Button variant="secondary" className="text-sm" onClick={() => handleViewApplicantsClick(job)}>
                        View Applicants
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <>
      {user?.role === UserRole.EMPLOYER ? <EmployerJobsView /> : <SeekerJobsView />}
      
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${selectedJob?.title}`}
      >
        <div>
            <p className="mb-4 text-gray-700">You are about to apply for the position of <strong>{selectedJob?.title}</strong> at <strong>{selectedJob?.company}</strong>. Please confirm your application.</p>
            <p className="text-sm text-gray-500 mb-6">A notification will be sent to the employer. You can track the status of your application in your dashboard.</p>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setApplyModalOpen(false)}>Cancel</Button>
                <Button onClick={handleApplySubmit}>Confirm Application</Button>
            </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isPostJobModalOpen} 
        onClose={() => setPostJobModalOpen(false)}
        title="Post a New Job"
      >
        <form onSubmit={handlePostJobSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div className="flex justify-end gap-2 !mt-6">
                <Button variant="secondary" type="button" onClick={() => setPostJobModalOpen(false)}>Cancel</Button>
                <Button type="submit">Post Job</Button>
            </div>
        </form>
      </Modal>

       <Modal
        isOpen={isApplicantsModalOpen}
        onClose={() => setApplicantsModalOpen(false)}
        title={`Applicants for ${selectedJob?.title}`}
      >
        <ApplicantList job={selectedJob} onScheduleInterview={handleScheduleInterview} />
      </Modal>
    </>
  );
};

const ApplicantList: React.FC<{job: Job | null, onScheduleInterview: (applicantName: string) => void}> = ({ job, onScheduleInterview }) => {
    if (!job) return null;
    const applicants = APPLICATIONS.filter(app => app.jobId === job.id)
        .map(app => USERS.find(u => u.id === app.seekerId))
        .filter((u): u is User => u !== undefined);

    if (applicants.length === 0) {
        return <p className="text-gray-600">No applicants yet for this position.</p>
    }

    return (
        <div className="space-y-4">
            {applicants.map(applicant => (
                <div key={applicant.id} className="flex items-center justify-between p-3 rounded-md bg-light">
                    <div className="flex items-center">
                        <img src={applicant.avatarUrl} alt={applicant.name} className="h-12 w-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-dark">{applicant.name}</p>
                            <p className="text-sm text-gray-500">{applicant.profile.title}</p>
                        </div>
                    </div>
                    <Button onClick={() => onScheduleInterview(applicant.name)} className="flex items-center text-sm">
                        <CalendarDaysIcon className="h-4 w-4 mr-2" />
                        Schedule Interview
                    </Button>
                </div>
            ))}
        </div>
    )
}

interface JobCardProps {
    job: Job;
    onApplyClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-bold text-primary">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
            <span className="flex items-center"><BuildingOffice2Icon className="h-4 w-4 mr-1" />{job.company}</span>
            <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" />{job.location}</span>
            <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1" />{job.type}</span>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
            <Button onClick={() => onApplyClick(job)}>Apply Now</Button>
            <p className="text-xs text-gray-400 mt-2">Posted on {job.postedDate}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{job.description}</p>
    </Card>
  );
};

export default JobsPage;