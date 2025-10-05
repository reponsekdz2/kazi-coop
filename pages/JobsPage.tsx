import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useJobs } from '../contexts/JobContext';
import { Application, Job, User, UserRole } from '../types';
import { BriefcaseIcon, MapPinIcon, BanknotesIcon, MagnifyingGlassIcon, UserGroupIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationContext';
import Modal from '../components/ui/Modal';
import { USERS } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { Tab } from '@headlessui/react';

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
                <Button variant="secondary">{t('jobs.viewDetails')}</Button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
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
                <Button>{t('jobs.postNewJob')}</Button>
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


export default JobsPage;