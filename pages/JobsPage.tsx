



import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
// FIX: Added import for Application type.
import { UserRole, Job, Application, Company } from '../types';
import { useJobs } from '../contexts/JobContext';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { PlusIcon, BookmarkIcon, MapPinIcon, BuildingOffice2Icon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { COMPANIES, USERS } from '../constants';
import { useApplications } from '../contexts/ApplicationContext';
import NewJobModal from '../components/ui/NewJobModal';
import ApplicantDetailsModal from '../components/ui/ApplicantDetailsModal';
import ApplicationFormModal from '../components/ui/ApplicationFormModal';
import CompanyProfileModal from '../components/ui/CompanyProfileModal';

const SeekerJobsView: React.FC = () => {
  const { jobs: allJobs, toggleSaveJob } = useJobs();
  const { applications } = useApplications();
  const [selectedJob, setSelectedJob] = useState<Job | null>(allJobs[0] || null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleApplyClick = (job: Job) => {
      setJobToApply(job);
      setIsApplyModalOpen(true);
  };
  
  const handleCompanyClick = (companyId: string) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (company) {
        setSelectedCompany(company);
        setIsCompanyModalOpen(true);
    }
  };

  const hasApplied = (jobId: string) => applications.some(app => app.jobId === jobId);

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
              <Card>
                 <div className="relative">
                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                     <input type="text" placeholder="Search by title, skill..." className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                 </div>
              </Card>
              {allJobs.map(job => (
                  <Card key={job.id} className={`!p-4 cursor-pointer ${selectedJob?.id === job.id ? 'border-2 border-primary' : ''}`} onClick={() => setSelectedJob(job)}>
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="font-bold text-dark dark:text-light">{job.title}</p>
                              <p onClick={(e) => { e.stopPropagation(); handleCompanyClick(job.companyId); }} className="text-sm text-gray-500 hover:text-primary hover:underline">{COMPANIES.find(c => c.id === job.companyId)?.name}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }} className="text-gray-400 hover:text-primary">
                              {job.isSaved ? <BookmarkIcon className="h-5 w-5 text-primary"/> : <BookmarkOutlineIcon className="h-5 w-5"/>}
                          </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex gap-2">
                         <span>{job.type}</span> • <span>{job.location}</span>
                      </div>
                  </Card>
              ))}
          </div>
          <div className="lg:col-span-2 overflow-y-auto pr-2">
              {selectedJob && (
                  <Card>
                      <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h2>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 my-2">
                        <span onClick={() => handleCompanyClick(selectedJob.companyId)} className="flex items-center cursor-pointer hover:text-primary hover:underline"><BuildingOffice2Icon className="h-4 w-4 mr-1"/> {COMPANIES.find(c => c.id === selectedJob.companyId)?.name}</span>
                        <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1"/> {selectedJob.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mt-4">{selectedJob.description}</p>
                      <h3 className="font-bold text-dark dark:text-light mt-4 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {selectedJob.requirements.map(req => <li key={req}>{req}</li>)}
                      </ul>
                      <div className="mt-6">
                        <Button onClick={() => handleApplyClick(selectedJob)} disabled={hasApplied(selectedJob.id)}>
                            {hasApplied(selectedJob.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                  </Card>
              )}
          </div>
          {jobToApply && <ApplicationFormModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={jobToApply} />}
          {selectedCompany && <CompanyProfileModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} company={selectedCompany} jobs={allJobs.filter(j => j.companyId === selectedCompany.id)} />}
      </div>
  );
};

const EmployerJobsView: React.FC = () => {
  const { jobs, createJob, updateJob } = useJobs();
  const { applications } = useApplications();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
      if (selectedJob) {
          updateJob(selectedJob.id, jobData);
      } else {
          createJob(jobData);
      }
      setIsJobModalOpen(false);
      setSelectedJob(null);
  };
  
  const handleEditJob = (job: Job) => {
      setSelectedJob(job);
      setIsJobModalOpen(true);
  }
  
  const handleViewApplicant = (app: Application) => {
      setSelectedApplication(app);
      setIsApplicantModalOpen(true);
  }

  const jobWithApplicantCount = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      applicantCount: applications.filter(app => app.jobId === job.id).length
    }));
  }, [jobs, applications]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Job Management</h1>
        <Button onClick={() => { setSelectedJob(null); setIsJobModalOpen(true); }}>
          <PlusIcon className="h-5 w-5 mr-2 inline" />
          Post New Job
        </Button>
      </div>
      <Card>
        <div className="divide-y dark:divide-gray-700">
          {jobWithApplicantCount.map(job => (
            <div key={job.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-dark dark:text-light">{job.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} • {job.type}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{job.status}</span>
                    <Button variant="secondary" onClick={() => handleEditJob(job)}>Edit</Button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-dark dark:text-light mb-2">{job.applicantCount} Applicant(s)</h4>
                <div className="space-y-2">
                    {applications.filter(app => app.jobId === job.id).map(app => (
                         <div key={app.id} onClick={() => handleViewApplicant(app)} className="flex justify-between items-center p-2 bg-light dark:bg-dark rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                             <p className="font-semibold text-sm">{USERS.find(u => u.id === app.userId)?.name}</p>
                             <span className="text-xs text-primary">{app.status}</span>
                         </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <NewJobModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSave={handleSaveJob} job={selectedJob} />
      {selectedApplication && <ApplicantDetailsModal isOpen={isApplicantModalOpen} onClose={() => setIsApplicantModalOpen(false)} application={selectedApplication} />}
    </div>
  );
};


const JobsPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return user.role === UserRole.EMPLOYER ? <EmployerJobsView /> : <SeekerJobsView />;
};

export default JobsPage;
