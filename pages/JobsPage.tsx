import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useJobs } from '../contexts/JobContext';
import { Job, User, Application, UserRole, Interview } from '../types';
import { MapPinIcon, BriefcaseIcon, MagnifyingGlassIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationContext';
import { useAppContext } from '../contexts/AppContext';
import { USERS } from '../constants';
import { useInterviews } from '../contexts/InterviewContext';

const JobsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();

    if (user?.role === UserRole.EMPLOYER) {
        return <EmployerJobsView />;
    }
    return <SeekerJobsView />;
};

const SeekerJobsView: React.FC = () => {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const { applications, applyForJob } = useApplications();
  const { t } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const appliedJobIds = new Set(applications.map(app => app.jobId));

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  }
  
  const confirmApply = () => {
      if(selectedJob && user) {
          applyForJob(selectedJob.id, user.id);
      }
      setIsApplyModalOpen(false);
      setSelectedJob(null);
  }

  return (
    <div>
      <div className="mb-6 bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">{t('sidebar.findJobs')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{t('jobs.searchSubtitle').replace('{count}', jobs.length.toString())}</p>
        <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t('jobs.searchPlaceholder')}
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
              <Button onClick={() => setSelectedJob(job)} className="flex-1">{t('dashboard.view')}</Button>
              <Button 
                variant={appliedJobIds.has(job.id) ? 'secondary' : 'primary'}
                onClick={() => handleApplyClick(job)} 
                disabled={appliedJobIds.has(job.id)}
                className="flex-1"
              >
                {appliedJobIds.has(job.id) ? t('jobs.applied') : t('jobs.apply')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedJob && (
          <JobDetailsModal 
            isOpen={!!selectedJob && !isApplyModalOpen} 
            onClose={() => setSelectedJob(null)} 
            job={selectedJob} 
            onApply={() => handleApplyClick(selectedJob)}
            isApplied={appliedJobIds.has(selectedJob.id)}
          />
      )}
      {selectedJob && isApplyModalOpen && (
          <ApplyConfirmationModal
            isOpen={isApplyModalOpen}
            onClose={() => { setIsApplyModalOpen(false); setSelectedJob(null); }}
            onConfirm={confirmApply}
            job={selectedJob}
          />
      )}
    </div>
  );
};

const EmployerJobsView: React.FC = () => {
    const { jobs } = useJobs();
    const { t } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingApplicantsFor, setViewingApplicantsFor] = useState<Job | null>(null);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark dark:text-light">{t('sidebar.jobManagement')}</h1>
                 <Button onClick={() => setIsCreateModalOpen(true)}>{t('jobs.postNewJob')}</Button>
            </div>
            <div className="space-y-4">
                {jobs.map(job => <JobManagementCard key={job.id} job={job} onViewApplicants={() => setViewingApplicantsFor(job)} />)}
            </div>

            {viewingApplicantsFor && (
                <ViewApplicantsModal
                    isOpen={!!viewingApplicantsFor}
                    onClose={() => setViewingApplicantsFor(null)}
                    job={viewingApplicantsFor}
                />
            )}
            {/* Add NewJobModal here */}
        </div>
    )
};

const JobManagementCard: React.FC<{ job: Job, onViewApplicants: () => void }> = ({ job, onViewApplicants }) => {
    const { applications } = useApplications();
    // FIX: Cannot find name 't'.
    const { t } = useAppContext();
    const applicantCount = applications.filter(a => a.jobId === job.id).length;
    return (
        <Card className="flex justify-between items-center">
            <div>
                <h2 className="font-bold text-xl text-dark dark:text-light">{job.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} - {job.type}</p>
                <p className="text-sm font-semibold text-primary mt-2">{applicantCount} Applicant(s)</p>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary">Edit</Button>
                <Button onClick={onViewApplicants}>{t('jobs.viewApplicants')}</Button>
            </div>
        </Card>
    );
};

const ViewApplicantsModal: React.FC<{ isOpen: boolean; onClose: () => void; job: Job }> = ({ isOpen, onClose, job }) => {
    const { applications, updateApplicationStatus } = useApplications();
    const { t } = useAppContext();
    const [isSchedulingInterview, setIsSchedulingInterview] = useState<Application | null>(null);
    const applicants = applications.filter(a => a.jobId === job.id);
    // FIX: Type 'boolean' is not assignable to type 'string | number'.
    const applicationStatuses: Application['status'][] = ['Applied', 'Reviewed', 'Interviewing', 'Interview Scheduled', 'Offered', 'Rejected'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Applicants for ${job.title}`}>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {applicants.length > 0 ? applicants.map(app => {
                    const applicant = USERS.find(u => u.id === app.userId);
                    if (!applicant) return null;

                    return (
                        <div key={app.id} className="flex flex-col md:flex-row justify-between md:items-center p-3 rounded-lg bg-light dark:bg-gray-700/50 gap-4">
                           <div className="flex items-center">
                                <img src={applicant.avatarUrl} alt={applicant.name} className="h-10 w-10 rounded-full mr-3"/>
                                <div>
                                    <p className="font-bold text-dark dark:text-light">{applicant.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Applied on: {new Date(app.submissionDate).toLocaleDateString()}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <select 
                                    value={app.status} 
                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application['status'])}
                                    className="bg-white border border-gray-300 rounded-md text-sm p-1.5 dark:bg-gray-800 dark:border-gray-600"
                                >
                                    {applicationStatuses.map(status => (
                                        <option key={status} value={status}>{t(`applicationStatus.${status}`)}</option>
                                    ))}
                                </select>
                                {app.status === 'Interviewing' && (
                                    <Button onClick={() => setIsSchedulingInterview(app)} className="!p-2" title={t('jobs.scheduleInterview')}>
                                        <CalendarDaysIcon className="h-5 w-5"/>
                                    </Button>
                                )}
                                <Button variant="secondary">Profile</Button>
                           </div>
                        </div>
                    );
                }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('jobs.noApplicants')}</p>}
            </div>

            {isSchedulingInterview && (
                <ScheduleInterviewModal 
                    isOpen={!!isSchedulingInterview}
                    onClose={() => setIsSchedulingInterview(null)}
                    application={isSchedulingInterview}
                />
            )}
        </Modal>
    )
};

const ScheduleInterviewModal: React.FC<{isOpen: boolean, onClose: () => void, application: Application}> = ({isOpen, onClose, application}) => {
    const { scheduleInterview } = useInterviews();
    const { updateApplicationStatus } = useApplications();
    const { t } = useAppContext();
    const [details, setDetails] = useState({ date: '', type: 'Technical', details: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const interviewData: Omit<Interview, 'id' | 'status'> = {
            userId: application.userId,
            jobId: application.jobId,
            date: new Date(details.date).toISOString(),
            type: details.type as Interview['type'],
            details: details.details,
        }
        scheduleInterview(interviewData);
        updateApplicationStatus(application.id, 'Interview Scheduled');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('jobs.newInterviewTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.interviewDate')}</label>
                    <input type="datetime-local" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.interviewType')}</label>
                    <select value={details.type} onChange={e => setDetails({...details, type: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Phone Screen</option>
                        <option>Technical</option>
                        <option>On-site</option>
                        <option>Final</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('jobs.interviewDetails')}</label>
                    <textarea value={details.details} onChange={e => setDetails({...details, details: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('jobs.scheduleInterview')}</Button>
                </div>
            </form>
        </Modal>
    )
};


const JobDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; job: Job; onApply: () => void; isApplied: boolean }> = ({ isOpen, onClose, job, onApply, isApplied }) => {
    // FIX: Cannot find name 't'.
    const { t } = useAppContext();
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
                    <Button variant="secondary" onClick={onClose}>{t('common.close')}</Button>
                    <Button onClick={onApply} disabled={isApplied}>{isApplied ? t('jobs.applied') : t('jobs.apply')}</Button>
                </div>
            </div>
        </Modal>
    )
}

const ApplyConfirmationModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, job: Job}> = ({ isOpen, onClose, onConfirm, job }) => {
    const { t } = useAppContext();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('jobs.apply')} for ${job.title}`}>
             <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">You are about to apply for the position of <strong>{job.title}</strong> at <strong>{job.company}</strong>. Please confirm your submission.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your profile and documents are up-to-date for the best chance of success.</p>
                <div className="flex justify-end gap-2 pt-6">
                    <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button onClick={onConfirm}>{t('common.submit')}</Button>
                </div>
             </div>
        </Modal>
    );
};


export default JobsPage;