// FIX: Created JobsPage.tsx to resolve module not found error.
import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Application, Company } from '../types';
import { BriefcaseIcon, MapPinIcon, ClockIcon, BookmarkIcon, PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useApplications } from '../contexts/ApplicationContext';
import { USERS, COMPANIES } from '../constants';
import NewJobModal from '../components/ui/NewJobModal';
import ApplicationStatusTracker from '../components/ui/ApplicationStatusTracker';
import ScheduleInterviewModal from '../components/ui/ScheduleInterviewModal';
import CompanyProfileModal from '../components/ui/CompanyProfileModal';

const JobsPage: React.FC = () => {
    const { user } = useAuth();
    const isEmployer = user?.role === UserRole.EMPLOYER;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{isEmployer ? 'Job Management' : 'Find Your Next Opportunity'}</h1>
                {isEmployer && <NewJobButton />}
            </div>
            {isEmployer ? <EmployerJobsView /> : <SeekerJobsView />}
        </div>
    );
};

const NewJobButton: React.FC = () => {
    const { createJob } = useJobs();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // FIX: Updated handleSave to correctly pass jobData with companyId from the modal.
    const handleSave = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
        createJob(jobData);
    }
    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                Post New Job
            </Button>
            <NewJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </>
    );
};


const SeekerJobsView: React.FC = () => {
    const { jobs, toggleSaveJob } = useJobs();
    const { user } = useAuth();
    const { applications, applyForJob } = useApplications();
    const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    
    const jobsWithCompany = useMemo(() => {
        return jobs.map(job => {
            const company = COMPANIES.find(c => c.id === job.companyId);
            return { ...job, companyName: company?.name || 'Unknown Company' };
        });
    }, [jobs]);

    const userApplicationForSelectedJob = useMemo(() => {
        if (!user || !selectedJob) return null;
        return applications.find(app => app.userId === user.id && app.jobId === selectedJob.id);
    }, [applications, user, selectedJob]);

    const handleApply = () => {
        if (user && selectedJob && !userApplicationForSelectedJob) {
            applyForJob(selectedJob.id, user.id);
        }
    }

    const handleCompanyClick = (companyId: string) => {
        const company = COMPANIES.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            setIsCompanyModalOpen(true);
        }
    };
    
    const selectedJobCompany = COMPANIES.find(c => c.id === selectedJob?.companyId);


    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card title="Job Listings" className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {jobsWithCompany.map(job => (
                        <div key={job.id} onClick={() => setSelectedJob(job)} className={`p-4 rounded-lg cursor-pointer mb-2 ${selectedJob?.id === job.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-light dark:hover:bg-dark'}`}>
                            <div className="flex justify-between">
                                <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
                                <button onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}>
                                    <BookmarkIcon className={`h-5 w-5 ${job.isSaved ? 'text-primary' : 'text-gray-400'}`} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName}</p>
                        </div>
                    ))}
                </Card>
            </div>
            <div className="lg:col-span-2">
                {selectedJob && selectedJobCompany ? (
                    <Card>
                        <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h2>
                        <button onClick={() => handleCompanyClick(selectedJob.companyId)} className="text-md font-semibold text-primary hover:underline mb-4">{selectedJobCompany.name}</button>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1"/>{selectedJob.location}</span>
                            <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1"/>{selectedJob.type}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedJob.description}</p>
                        <h4 className="font-bold text-dark dark:text-light mb-2">Requirements</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-6">
                            {selectedJob.requirements.map(req => <li key={req}>{req}</li>)}
                        </ul>
                        
                        {userApplicationForSelectedJob ? (
                            <ApplicationStatusTracker status={userApplicationForSelectedJob.status} />
                        ) : (
                             <Button onClick={handleApply} className="w-full">Apply Now</Button>
                        )}
                       
                    </Card>
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">Select a job to see details.</p>
                    </Card>
                )}
            </div>
        </div>
        {selectedCompany && (
            <CompanyProfileModal 
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
                company={selectedCompany}
                jobs={jobs.filter(j => j.companyId === selectedCompany.id)}
            />
        )}
        </>
    );
};

const EmployerJobsView: React.FC = () => {
    const { jobs, updateJob, updateJobStatus } = useJobs();
    const { applications } = useApplications();
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // FIX: Updated handleSave to correctly pass jobData with companyId from the modal.
    const handleSave = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
        if (editingJob) {
            updateJob(editingJob.id, jobData);
        }
    };
    
    const jobsWithCompany = useMemo(() => {
        return jobs.map(job => {
            const company = COMPANIES.find(c => c.id === job.companyId);
            return { ...job, companyName: company?.name || 'Unknown Company' };
        });
    }, [jobs]);


    return (
        <div className="space-y-4">
            {jobsWithCompany.map(job => {
                const jobApps = applications.filter(app => app.jobId === job.id);
                return (
                    <JobPostingCard 
                        key={job.id} 
                        job={job} 
                        applications={jobApps} 
                        onEdit={() => { setEditingJob(job); setIsEditModalOpen(true); }}
                        onStatusChange={(status) => updateJobStatus(job.id, status)}
                    />
                )
            })}
             <NewJobModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onSave={handleSave} 
                job={editingJob} 
            />
        </div>
    );
};


const JobPostingCard: React.FC<{
    job: Job & { companyName: string };
    applications: Application[];
    onEdit: () => void;
    onStatusChange: (status: Job['status']) => void;
}> = ({ job, applications, onEdit, onStatusChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const { updateApplicationStatus } = useApplications();

    return (
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{applications.length} applicant(s)</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                    <Button variant="secondary" onClick={onEdit}><PencilIcon className="h-4 w-4"/></Button>
                    <Button variant="danger"><TrashIcon className="h-4 w-4"/></Button>
                    {applications.length > 0 && <Button variant="secondary" onClick={() => setExpanded(!expanded)}><ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}/></Button>}
                </div>
            </div>
            {expanded && (
                 <div className="mt-4 border-t pt-4 dark:border-gray-700">
                     <h4 className="font-semibold mb-2 text-dark dark:text-light">Applicants</h4>
                     <div className="space-y-2">
                         {applications.map(app => {
                            const applicant = USERS.find(u => u.id === app.userId);
                            if (!applicant) return null;
                            return (
                                <div key={app.id} className="flex items-center justify-between p-2 bg-light dark:bg-gray-700/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <img src={applicant.avatarUrl} alt={applicant.name} className="h-10 w-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-dark dark:text-light">{applicant.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{app.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {app.status === 'Reviewed' && <Button onClick={() => { setSelectedApp(app); setIsScheduleModalOpen(true); }}>Schedule Interview</Button>}
                                        {app.status === 'Applied' && <Button variant="secondary" onClick={() => updateApplicationStatus(app.id, 'Reviewed')}>Mark as Reviewed</Button>}
                                    </div>
                                </div>
                            )
                         })}
                     </div>
                 </div>
            )}
            {selectedApp && <ScheduleInterviewModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} application={selectedApp} />}
        </Card>
    );
}


export default JobsPage;