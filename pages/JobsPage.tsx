import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Application, Company, User } from '../types';
import { BriefcaseIcon, MapPinIcon, ClockIcon, BookmarkIcon, PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, EnvelopeIcon, StarIcon, UsersIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { useApplications } from '../contexts/ApplicationContext';
import { USERS, COMPANIES } from '../constants';
import NewJobModal from '../components/ui/NewJobModal';
import ApplicationStatusTracker from '../components/ui/ApplicationStatusTracker';
import ScheduleInterviewModal from '../components/ui/ScheduleInterviewModal';
import CompanyProfileModal from '../components/ui/CompanyProfileModal';
import ApplicationFormModal from '../components/ui/ApplicationFormModal';
import ApplicantDetailsModal from '../components/ui/ApplicantDetailsModal';


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
    const { applications } = useApplications();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

    const jobsWithCompany = useMemo(() => {
        const jobsToFilter = activeTab === 'saved' ? jobs.filter(j => j.isSaved) : jobs;
        return jobsToFilter.map(job => {
            const company = COMPANIES.find(c => c.id === job.companyId);
            return { ...job, companyName: company?.name || 'Unknown Company' };
        });
    }, [jobs, activeTab]);

    // Set initial selected job
    React.useEffect(() => {
        if (jobsWithCompany.length > 0) {
            setSelectedJob(jobsWithCompany[0]);
        } else {
            setSelectedJob(null);
        }
    }, [jobsWithCompany]);


    const userApplicationForSelectedJob = useMemo(() => {
        if (!user || !selectedJob) return null;
        return applications.find(app => app.userId === user.id && app.jobId === selectedJob.id);
    }, [applications, user, selectedJob]);

    const handleApplyClick = () => {
        if (user && selectedJob && !userApplicationForSelectedJob) {
            setIsApplyModalOpen(true);
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
                 <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                         <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            All Jobs
                         </button>
                         <button onClick={() => setActiveTab('saved')} className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            Saved Jobs
                         </button>
                    </nav>
                </div>
                <Card className="max-h-[calc(100vh-260px)] overflow-y-auto">
                    {jobsWithCompany.length > 0 ? jobsWithCompany.map(job => (
                        <div key={job.id} onClick={() => setSelectedJob(job)} className={`p-4 rounded-lg cursor-pointer mb-2 ${selectedJob?.id === job.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-light dark:hover:bg-dark'}`}>
                            <div className="flex justify-between">
                                <h3 className="font-bold text-dark dark:text-light">{job.title}</h3>
                                <button onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}>
                                    <BookmarkIcon className={`h-5 w-5 ${job.isSaved ? 'text-primary' : 'text-gray-400'}`} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName}</p>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-gray-500">
                            <BriefcaseIcon className="h-12 w-12 mx-auto mb-2"/>
                            {activeTab === 'saved' ? 'You have no saved jobs.' : 'No jobs available at the moment.'}
                        </div>
                    )}
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
                             <Button onClick={handleApplyClick} className="w-full">Apply Now</Button>
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
        {user && selectedJob && (
             <ApplicationFormModal 
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                user={user}
                job={selectedJob}
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
    
    const handleSave = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
        if (editingJob) {
            updateJob(editingJob.id, jobData);
        }
    };
    
    const jobsWithDetails = useMemo(() => {
        return jobs.map(job => {
            const company = COMPANIES.find(c => c.id === job.companyId);
            const employer = USERS.find(u => u.id === job.employerId);
            return { ...job, companyName: company?.name || 'Unknown', employer };
        });
    }, [jobs]);


    return (
        <div className="space-y-6">
            {jobsWithDetails.map(job => {
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
    job: Job & { companyName: string, employer: User | undefined };
    applications: Application[];
    onEdit: () => void;
    onStatusChange: (status: Job['status']) => void;
}> = ({ job, applications, onEdit, onStatusChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    const handleViewApplicant = (application: Application) => {
        setSelectedApplication(application);
        setIsApplicantModalOpen(true);
    };

    const RatingStars = ({ rating = 0 }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );

    return (
        <Card className="!p-0 overflow-hidden">
            <div 
                className="h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${job.imageUrl || 'https://placehold.co/600x400'})` }}
            >
                <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <img src={job.employer?.avatarUrl} alt={job.employer?.name} className="h-10 w-10 rounded-full border-2 border-white" />
                            <div>
                                <p className="font-bold text-white">{job.companyName}</p>
                                <p className="text-xs text-gray-200">Posted by {job.employer?.name}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 my-2">
                    <span className="flex items-center gap-1"><BanknotesIcon className="h-4 w-4"/> RWF {job.salary?.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><UsersIcon className="h-4 w-4"/> {job.workersNeeded} needed</span>
                    <RatingStars rating={job.rating} />
                </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-dark dark:text-light">
                        {applications.length} Applicant(s)
                    </div>
                    <div className="flex items-center gap-2">
                        {applications.length > 0 && <Button variant="primary" onClick={() => setExpanded(!expanded)}>View Applicants</Button>}
                        <Button variant="secondary" onClick={onEdit}><PencilIcon className="h-4 w-4"/></Button>
                    </div>
                </div>
            </div>
            {expanded && (
                 <div className="p-4 border-t dark:border-gray-700 bg-light dark:bg-dark">
                     <h4 className="font-semibold mb-2 text-dark dark:text-light">Applicants</h4>
                     <div className="space-y-2 max-h-60 overflow-y-auto">
                         {applications.map(app => {
                            const applicant = USERS.find(u => u.id === app.userId);
                            if (!applicant) return null;
                            return (
                                <div key={app.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <img src={applicant.avatarUrl} alt={applicant.name} className="h-10 w-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-dark dark:text-light">{applicant.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{app.status}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleViewApplicant(app)}>View Details</Button>
                                </div>
                            )
                         })}
                     </div>
                 </div>
            )}
            {selectedApplication && (
                <ApplicantDetailsModal 
                    isOpen={isApplicantModalOpen}
                    onClose={() => setIsApplicantModalOpen(false)}
                    application={selectedApplication}
                />
            )}
        </Card>
    );
}


export default JobsPage;
