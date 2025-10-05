import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useJobs } from '../contexts/JobContext';
import { Application, Job, User, UserRole } from '../types';
import { BriefcaseIcon, MapPinIcon, BanknotesIcon, MagnifyingGlassIcon, UserGroupIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon, DocumentCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationContext';
import Modal from '../components/ui/Modal';
import { USERS } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { Tab } from '@headlessui/react';
import RingProgress from '../components/ui/RingProgress';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.EMPLOYER) {
    return <EmployerJobsView />;
  }
  
  return <SeekerJobsView />;
};

// ==================================
// Seeker View
// ==================================
const SeekerJobsView: React.FC = () => {
  const { t } = useAppContext();
  const { user } = useAuth();
  const { applications } = useApplications();
  const { jobs } = useJobs();
  
  const myApplications = applications
    .filter(app => app.userId === user?.id)
    .sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

  const tabs = [
    { name: t('jobs.tabs.findJobs'), component: <FindJobsView /> },
    { name: t('jobs.tabs.myApplications'), component: <MyApplicationsView applications={myApplications} allJobs={jobs} /> }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('jobs.title')}</h1>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary/10 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>{tab.component}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

const FindJobsView: React.FC = () => {
  const { jobs } = useJobs();
  const { t } = useAppContext();
  const { applications, applyForJob } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasApplied = (jobId: string) => applications.some(app => app.jobId === jobId && app.status !== 'Rejected');
  
  const employer = USERS.find(u => u.id === selectedJob?.employerId);

  return (
    <>
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('jobs.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button>{t('jobs.search')}</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1 lg:col-span-1 h-[calc(100vh-320px)] overflow-y-auto pr-2 space-y-3">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedJob?.id === job.id ? 'bg-primary/10 border-primary shadow-md' : 'bg-white dark:bg-dark hover:shadow-md hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start">
                  <h2 className="font-bold text-dark dark:text-light">{job.title}</h2>
                   {job.matchScore && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{job.matchScore}% Match</span>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{job.location}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          {selectedJob ? (
            <Card className="h-full overflow-y-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4 pb-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <img src={selectedJob.companyLogoUrl} alt={`${selectedJob.company} logo`} className="h-16 w-16 rounded-lg object-contain bg-light p-1" />
                    <div>
                        <h1 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h1>
                        <p className="text-md text-gray-600 dark:text-gray-400">{selectedJob.company}</p>
                    </div>
                </div>
                <Button onClick={() => applyForJob(selectedJob.id, selectedJob.matchScore || 0)} disabled={hasApplied(selectedJob.id)} className="flex-shrink-0">
                  {hasApplied(selectedJob.id) ? t('jobs.applied') : t('jobs.applyNow')}
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 my-4">
                  <div className="flex items-center gap-2 bg-light dark:bg-dark px-3 py-1 rounded-full"><BriefcaseIcon className="h-4 w-4 text-primary"/> {selectedJob.type}</div>
                  <div className="flex items-center gap-2 bg-light dark:bg-dark px-3 py-1 rounded-full"><MapPinIcon className="h-4 w-4 text-primary"/> {selectedJob.location}</div>
                  <div className="flex items-center gap-2 bg-light dark:bg-dark px-3 py-1 rounded-full"><BanknotesIcon className="h-4 w-4 text-primary"/> {selectedJob.salary}</div>
              </div>

              {/* Main Content */}
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-dark dark:text-light mb-2">{t('jobs.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-dark dark:text-light mb-2">{t('jobs.requirements')}</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {selectedJob.requirements.map((req, index) => 
                        <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircleIcon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                        </li>
                    )}
                  </ul>
                </div>

                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                    <div>
                        <h3 className="font-bold text-dark dark:text-light mb-3">{t('jobs.requiredSkills')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.requiredSkills.map(skill => (
                                <span key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-blue-900/50 dark:text-blue-300">
                                    <SparklesIcon className="h-4 w-4 mr-1.5 text-blue-500"/>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {selectedJob.requiredDocuments && selectedJob.requiredDocuments.length > 0 && (
                     <div>
                        <h3 className="font-bold text-dark dark:text-light mb-3">{t('jobs.requiredDocuments')}</h3>
                        <div className="flex flex-wrap gap-2">
                             {selectedJob.requiredDocuments.map(doc => (
                                <span key={doc} className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-gray-700 dark:text-gray-300">
                                    <DocumentCheckIcon className="h-4 w-4 mr-1.5 text-gray-500"/>
                                    {doc}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                {employer && (
                     <div>
                        <h3 className="font-bold text-dark dark:text-light mb-2">{t('jobs.aboutTheCompany').replace('{companyName}', employer.companyName || '')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{employer.companyDescription}</p>
                        <div className="mt-3">
                            <span className="text-xs text-gray-500">{t('jobs.postedBy')}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <img src={employer.avatarUrl} alt={employer.name} className="h-8 w-8 rounded-full" />
                                <span className="font-semibold text-sm text-dark dark:text-light">{employer.name}</span>
                            </div>
                        </div>
                    </div>
                )}

              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full text-gray-500">
              <p>{t('jobs.selectJob')}</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

const MyApplicationsView: React.FC<{applications: Application[], allJobs: Job[]}> = ({ applications, allJobs }) => {
  const { t } = useAppContext();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setIsDetailsModalOpen(true);
  };
  
  const statusStyles: {[key: string]: string} = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Reviewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Offered: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  if (applications.length === 0) {
    return <Card><p className="text-center text-gray-500">{t('jobs.noApplicationsYet')}</p></Card>
  }

  return (
    <>
      <Card>
        <div className="space-y-4">
          {applications.map(app => {
            const job = allJobs.find(j => j.id === app.jobId);
            if (!job) return null;
            return (
              <div key={app.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <img src={job.companyLogoUrl} alt={job.company} className="h-12 w-12 rounded-md object-contain bg-light p-1"/>
                  <div>
                    <h2 className="font-bold text-dark dark:text-light">{job.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.company} - {job.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{t('jobs.applicationDate')}: {new Date(app.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[app.status] || ''}`}>
                    {t(`applicationStatus.${app.status}`)}
                  </span>
                  <Button variant="secondary" onClick={() => handleViewDetails(app)}>{t('jobs.viewDetails')}</Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {selectedApplication && (
        <ApplicationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          application={selectedApplication}
          job={allJobs.find(j => j.id === selectedApplication.jobId)}
        />
      )}
    </>
  );
};

// ==================================
// Application Details Modal
// ==================================
interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  job?: Job;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ isOpen, onClose, application, job }) => {
  const { t } = useAppContext();

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('jobs.applicationDetails')}>
      <div className="pb-4 border-b dark:border-gray-700">
        <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{job.company}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          {/* Job Info */}
          <div>
            <h4 className="font-bold text-dark dark:text-light mb-3">{t('jobs.details.jobInfo')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">{t('jobs.details.salary')}</p>
                    <p className="font-semibold text-dark dark:text-light">{job.salary}</p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">{t('jobs.details.location')}</p>
                    <p className="font-semibold text-dark dark:text-light">{job.location}</p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">{t('jobs.details.jobType')}</p>
                    <p className="font-semibold text-dark dark:text-light">{job.type}</p>
                </div>
            </div>
          </div>
          {/* Status History */}
          <div>
            <h4 className="font-bold text-dark dark:text-light mb-4">{t('jobs.statusHistory')}</h4>
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {application.statusHistory.map((historyItem, index) => {
                const isLast = index === application.statusHistory.length - 1;
                return (
                  <li key={index} className={`ml-6 ${!isLast ? 'pb-6' : ''}`}>
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white dark:ring-dark ${isLast ? 'bg-primary' : 'bg-accent'}`}>
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </span>
                    <h3 className="font-semibold text-dark dark:text-light">{t(`applicationStatus.${historyItem.status}`)}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {new Date(historyItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="md:col-span-1">
          <Card className="text-center">
            <h4 className="font-bold text-dark dark:text-light mb-2">{t('jobs.matchScore')}</h4>
            <div className="flex justify-center">
              <RingProgress percentage={application.matchScore} size={120} strokeWidth={10} />
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

// ==================================
// Employer View
// ==================================
const EmployerJobsView: React.FC = () => {
    const { user } = useAuth();
    const { jobs } = useJobs();
    const { applications } = useApplications();
    const { t } = useAppContext();
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const myJobs = user ? jobs.filter(job => job.employerId === user.id) : [];

    const openApplicantsModal = (job: Job) => {
        setSelectedJob(job);
        setIsApplicantsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('jobs.myPostings')}</h1>
                <Button onClick={() => setIsNewJobModalOpen(true)}>{t('jobs.postNewJob')}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJobs.map(job => {
                    const applicantCount = applications.filter(app => app.jobId === job.id).length;
                    return (
                        <Card key={job.id} className="flex flex-col">
                            <h2 className="text-xl font-bold text-dark dark:text-light">{job.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
                            <div className="flex-grow my-4 py-4 border-y dark:border-gray-700">
                                <div className="flex items-center justify-center text-center">
                                    <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                                    <span className="font-semibold text-dark dark:text-light">{applicantCount} {t('jobs.applicants')}</span>
                                </div>
                            </div>
                            <Button onClick={() => openApplicantsModal(job)} className="w-full mt-auto">{t('jobs.viewApplicants')}</Button>
                        </Card>
                    );
                })}
            </div>

            {selectedJob && (
                <ApplicantsModal
                    isOpen={isApplicantsModalOpen}
                    onClose={() => setIsApplicantsModalOpen(false)}
                    job={selectedJob}
                />
            )}
             <NewJobModal
                isOpen={isNewJobModalOpen}
                onClose={() => setIsNewJobModalOpen(false)}
            />
        </div>
    );
};

// ==================================
// Applicants Modal Component
// ==================================
interface ApplicantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ isOpen, onClose, job }) => {
    const { t } = useAppContext();
    const { applications, updateApplicationStatus } = useApplications();
    const { addToast } = useToast();
    
    const jobApplicants = applications.filter(app => app.jobId === job.id);
    const applicationStatuses: Application['status'][] = ['Applied', 'Reviewed', 'Interviewing', 'Offered', 'Rejected'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('jobs.applicantsFor').replace('{jobTitle}', job.title)}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {jobApplicants.length > 0 ? jobApplicants.map(app => {
                    const applicantUser = USERS.find(u => u.id === app.userId);
                    if (!applicantUser) return null;

                    return (
                        <div key={app.id} className="grid grid-cols-5 items-center gap-4 p-3 rounded-lg bg-light dark:bg-gray-700">
                            {/* Applicant Info */}
                            <div className="col-span-2 flex items-center">
                                <img src={applicantUser.avatarUrl} alt={applicantUser.name} className="h-10 w-10 rounded-full mr-3"/>
                                <div>
                                    <p className="font-semibold text-dark dark:text-light">{applicantUser.name}</p>
                                    <p className="text-sm text-primary font-bold">{app.matchScore}% {t('jobs.match')}</p>
                                </div>
                            </div>
                            {/* Status Dropdown */}
                            <div className="col-span-2">
                                <select
                                    value={app.status}
                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application['status'])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    {applicationStatuses.map(status => (
                                        <option key={status} value={status}>{t(`applicationStatus.${status}`)}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Actions */}
                            <div className="col-span-1 text-right">
                                <Button variant="secondary" onClick={() => addToast(`Message to ${applicantUser.name} sent (simulation).`, 'info')}>
                                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>{t('jobs.noApplicants')}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

// ==================================
// New Job Modal
// ==================================
const NewJobModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useAppContext();
    const { addJob } = useJobs();
    const { user } = useAuth();
    const [jobDetails, setJobDetails] = useState({
        title: '',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: '',
        requiredSkills: '',
    });
    const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
    
    const availableDocuments = ['CV', 'Cover Letter', 'Diploma', 'Portfolio'];

    const handleDocChange = (doc: string) => {
        setRequiredDocuments(prev => 
            prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || user.role !== UserRole.EMPLOYER) return;

        const newJob: Omit<Job, 'id'> = {
            ...jobDetails,
            company: user.companyName || 'Unknown Company',
            companyLogoUrl: user.companyLogoUrl || '',
            employerId: user.id,
            requirements: jobDetails.requirements.split('\n').filter(r => r.trim() !== ''),
            requiredSkills: jobDetails.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
            requiredDocuments: requiredDocuments
        };
        addJob(newJob);
        onClose();
        // Reset form
        setJobDetails({ title: '', location: 'Kigali, Rwanda', type: 'Full-time', salary: '', description: '', requirements: '', requiredSkills: '' });
        setRequiredDocuments([]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('jobs.newJobModal.title')}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.jobTitle')}</label>
                        <input name="title" value={jobDetails.title} onChange={handleChange} className="w-full input-field" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.location')}</label>
                        <input name="location" value={jobDetails.location} onChange={handleChange} className="w-full input-field" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.jobType')}</label>
                        <select name="type" value={jobDetails.type} onChange={handleChange} className="w-full input-field">
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.salary')}</label>
                        <input name="salary" value={jobDetails.salary} onChange={handleChange} className="w-full input-field" placeholder="e.g., RWF 1.5M - 2M" required />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.description')}</label>
                    <textarea name="description" value={jobDetails.description} onChange={handleChange} className="w-full input-field" rows={4} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.requirements')}</label>
                    <textarea name="requirements" value={jobDetails.requirements} onChange={handleChange} className="w-full input-field" rows={4} required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.skillsLabel')}</label>
                    <input name="requiredSkills" value={jobDetails.requiredSkills} onChange={handleChange} className="w-full input-field" placeholder="e.g., React, TypeScript, Figma" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.newJobModal.requiredDocumentsLabel')}</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {availableDocuments.map(doc => (
                            <label key={doc} className="flex items-center space-x-2 p-2 rounded-md bg-light dark:bg-gray-700 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={requiredDocuments.includes(doc)} 
                                    onChange={() => handleDocChange(doc)} 
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-dark dark:text-light">{t(`jobs.documents.${doc.toLowerCase().replace(' ', '')}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};


export default JobsPage;