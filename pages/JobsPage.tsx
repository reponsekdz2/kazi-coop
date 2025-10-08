import React, { useState, useMemo } from 'react';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Company, Application } from '../types';
import { useApplications } from '../contexts/ApplicationContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MagnifyingGlassIcon, MapPinIcon, BuildingOffice2Icon, BookmarkIcon, PencilIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutlineIcon, PlusIcon } from '@heroicons/react/24/outline';
import { COMPANIES, USERS, APPLICATIONS } from '../constants';
import ApplicationFormModal from '../components/ui/ApplicationFormModal';
import ApplicantDetailsModal from '../components/ui/ApplicantDetailsModal';
import NewJobModal from '../components/ui/NewJobModal';
import CompanyProfileModal from '../components/ui/CompanyProfileModal';

const JobsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === UserRole.SEEKER ? <SeekerJobsView /> : <EmployerJobsView />;
};

// =====================================================================
// Seeker View
// =====================================================================

const SeekerJobsView: React.FC = () => {
  const { jobs, isLoading, toggleSaveJob } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job =>
      job.status === 'Open' &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [jobs, searchTerm]);
  
  // Set initial selected job
  useEffect(() => {
    if (!selectedJob && filteredJobs.length > 0) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);


  const handleViewCompany = (companyId: string) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (company) {
        setSelectedCompany(company);
        setIsCompanyModalOpen(true);
    }
  };


  if (isLoading) return <Card>Loading jobs...</Card>;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Job List */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Find Jobs</h1>
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field w-full !pl-10"
          />
        </div>
        <div className="overflow-y-auto pr-2 flex-grow">
          {filteredJobs.map(job => (
            <Card
              key={job.id}
              className={`!p-4 mb-3 cursor-pointer ${selectedJob?.id === job.id ? 'border-2 border-primary' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
              <p className="text-sm text-gray-500">{COMPANIES.find(c => c.id === job.companyId)?.name}</p>
              <div className="text-xs text-gray-500 mt-2">{job.location} • {job.type}</div>
            </Card>
          ))}
        </div>
      </div>
      {/* Job Details */}
      <div className="lg:col-span-2 overflow-y-auto pr-2">
        {selectedJob ? (
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h2>
                <button onClick={() => handleViewCompany(selectedJob.companyId)} className="text-lg text-primary hover:underline">{COMPANIES.find(c => c.id === selectedJob.companyId)?.name}</button>
              </div>
              <button onClick={() => toggleSaveJob(selectedJob.id)}>
                {selectedJob.isSaved ? <BookmarkIcon className="h-6 w-6 text-primary" /> : <BookmarkOutlineIcon className="h-6 w-6 text-gray-400" />}
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 my-3">
              <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1"/>{selectedJob.location}</span>
              <span className="flex items-center"><BuildingOffice2Icon className="h-4 w-4 mr-1"/>{selectedJob.type}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedJob.description}</p>
            <h3 className="font-bold text-dark dark:text-light mt-4 mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              {selectedJob.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
            <div className="mt-6 pt-4 border-t dark:border-gray-700">
              <Button onClick={() => setIsApplyModalOpen(true)}>Apply Now</Button>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a job to view details.</p>
          </Card>
        )}
      </div>
       {selectedJob && <ApplicationFormModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={selectedJob} />}
       {selectedCompany && <CompanyProfileModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} company={selectedCompany} jobs={jobs.filter(j => j.companyId === selectedCompany.id && j.status === 'Open')} />}
    </div>
  );
};

// =====================================================================
// Employer View
// =====================================================================

const EmployerJobsView: React.FC = () => {
    const { user } = useAuth();
    const { jobs, createJob, updateJob } = useJobs();
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    const myJobs = jobs.filter(j => j.employerId === user?.id);

    const handleOpenNewJobModal = () => {
        setEditingJob(null);
        setIsJobModalOpen(true);
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setIsJobModalOpen(true);
    };
    
    const handleViewApplicant = (application: Application) => {
        setSelectedApplication(application);
        setIsApplicantModalOpen(true);
    }

    const handleSaveJob = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
        if (editingJob) {
            updateJob(editingJob.id, jobData);
        } else {
            createJob(jobData);
        }
    };

    const getApplicantsForJob = (jobId: string) => {
        return APPLICATIONS.filter(app => app.jobId === jobId);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">Job Management</h1>
                <Button onClick={handleOpenNewJobModal}>
                    <PlusIcon className="h-5 w-5 mr-2 inline" />
                    Post New Job
                </Button>
            </div>
            <div className="space-y-4">
                {myJobs.map(job => (
                    <Card key={job.id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => handleEditJob(job)}><PencilIcon className="h-4 w-4"/></Button>
                        </div>
                        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                            <h4 className="font-semibold mb-2">Applicants ({getApplicantsForJob(job.id).length})</h4>
                            <div className="space-y-2">
                                {getApplicantsForJob(job.id).map(app => {
                                    const applicant = USERS.find(u => u.id === app.userId);
                                    return (
                                        <div key={app.id} className="flex items-center justify-between p-2 rounded bg-light dark:bg-dark">
                                            <p>{applicant?.name}</p>
                                            <button className="text-primary text-sm font-semibold hover:underline" onClick={() => handleViewApplicant(app)}>View Profile</button>
                                        </div>
                                    )
                                })}
                                {getApplicantsForJob(job.id).length === 0 && <p className="text-sm text-gray-500">No applicants yet.</p>}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <NewJobModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSave={handleSaveJob} job={editingJob}/>
            {selectedApplication && <ApplicantDetailsModal isOpen={isApplicantModalOpen} onClose={() => setIsApplicantModalOpen(false)} application={selectedApplication} />}
        </div>
    );
};

export default JobsPage;
