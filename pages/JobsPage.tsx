import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Application, ApplicationStatus, User } from '../types';
import { JOBS, APPLICATIONS as APPLICATIONS_DATA, USERS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { BriefcaseIcon, MapPinIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const APPLICATION_STATUSES: ApplicationStatus[] = ['Applied', 'Under Review', 'Interviewing', 'Offered', 'Rejected'];

// Main Page Component
const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS_DATA);
  const { addToast } = useToast();

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus, seekerName: string) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    addToast(`Status for ${seekerName} updated to ${newStatus}`, 'success');
  };
  
  const handleApply = (job: Job, seekerId: string) => {
    // Prevent re-applying
    if (applications.some(app => app.jobId === job.id && app.seekerId === seekerId)) {
        addToast(`You have already applied for ${job.title}.`, 'info');
        return;
    }
    
    const newApplication: Application = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        seekerId: seekerId,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0]
    };
    setApplications(prevApps => [...prevApps, newApplication]);
    addToast(`Successfully applied for ${job.title}!`, 'success');
  };

  const handleAddJob = (jobData: { title: string; location: string; type: 'Full-time' | 'Part-time' | 'Contract'; description: string; }) => {
    if (!user) return;
    
    const newJob: Job = {
        id: `job-${Date.now()}`,
        employerId: user.id,
        company: user.profile.company || 'KaziCoop Employer',
        postedDate: new Date().toISOString().split('T')[0],
        ...jobData,
    };

    setJobs(prevJobs => [newJob, ...prevJobs]);
    addToast('New job posted successfully!', 'success');
  };

  return (
    <div>
      {user?.role === UserRole.EMPLOYER ? (
        <EmployerView jobs={jobs} applications={applications} onStatusChange={handleStatusChange} onAddJob={handleAddJob} />
      ) : (
        <SeekerView jobs={jobs} applications={applications} onApply={handleApply} />
      )}
    </div>
  );
};

// Seeker View: Browse and apply for jobs
interface SeekerViewProps {
    jobs: Job[];
    applications: Application[];
    onApply: (job: Job, seekerId: string) => void;
}
const SeekerView: React.FC<SeekerViewProps> = ({ jobs, applications, onApply }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'find' | 'applications'>('find');
    const myApplications = applications.filter(app => app.seekerId === user?.id);

    const getApplicationStatus = (jobId: string) => {
        const application = myApplications.find(app => app.jobId === jobId);
        return application ? application.status : null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Jobs</h1>
            
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('find')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'find' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Find Jobs
                    </button>
                    <button onClick={() => setActiveTab('applications')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        My Applications
                        <span className="bg-gray-200 text-gray-800 text-xs font-bold ml-2 px-2 py-0.5 rounded-full">{myApplications.length}</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'find' && (
                <div>
                    <Card className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full">
                                <MagnifyingGlassIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Job title, keyword, or company" className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <Button className="w-full md:w-auto">Search</Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map(job => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-primary hover:underline cursor-pointer">{job.title}</h2>
                                        <p className="text-md text-dark font-semibold">{job.company}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
                                            <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" /> {job.location}</span>
                                            <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1" /> {job.type}</span>
                                            <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1" /> Posted on {job.postedDate}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex-shrink-0">
                                        {getApplicationStatus(job.id) ? (
                                            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-green-100 text-green-700">Applied</span>
                                        ) : (
                                            <Button onClick={() => onApply(job, user!.id)}>Apply Now</Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'applications' && (
                 <Card title="My Application Status">
                    <div className="space-y-4">
                        {myApplications.length > 0 ? myApplications.map(app => {
                            const job = jobs.find(j => j.id === app.jobId);
                            if (!job) return null;
                            return (
                                <div key={app.id} className="p-4 rounded-md bg-light flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <p className="font-bold text-dark">{job.title}</p>
                                        <p className="text-sm text-gray-600">{job.company} - Applied on {app.appliedDate}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <StatusBadge status={app.status} />
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="text-center text-gray-500 py-8">You haven't applied to any jobs yet.</p>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};


// Employer View: Manage job postings and applicants
interface EmployerViewProps {
    jobs: Job[];
    applications: Application[];
    onStatusChange: (applicationId: string, newStatus: ApplicationStatus, seekerName: string) => void;
    onAddJob: (jobData: { title: string; location: string; type: 'Full-time' | 'Part-time' | 'Contract'; description: string; }) => void;
}
const EmployerView: React.FC<EmployerViewProps> = ({ jobs, applications, onStatusChange, onAddJob }) => {
    const { user } = useAuth();
    const myJobs = jobs.filter(job => job.employerId === user?.id);
    
    const [isApplicantsModalOpen, setApplicantsModalOpen] = useState(false);
    const [isPostJobModalOpen, setPostJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    
    const [newJobData, setNewJobData] = useState({
        title: '',
        location: '',
        type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
        description: ''
    });

    const getApplicantsForJob = (jobId: string) => {
        return applications
            .filter(app => app.jobId === jobId)
            .map(app => {
                const seeker = USERS.find(u => u.id === app.seekerId);
                return { ...app, seeker: seeker };
            });
    };

    const handleViewApplicants = (job: Job) => {
        setSelectedJob(job);
        setApplicantsModalOpen(true);
    };

    const handlePostJobSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddJob(newJobData);
        setPostJobModalOpen(false);
        setNewJobData({ title: '', location: '', type: 'Full-time', description: '' }); // Reset form
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewJobData(prev => ({...prev, [name]: value}));
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark">Manage Job Postings</h1>
                <Button onClick={() => setPostJobModalOpen(true)}>Post New Job</Button>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {myJobs.map(job => {
                    const applicants = getApplicantsForJob(job.id);
                    return (
                        <Card key={job.id}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-dark">{job.title}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" /> {job.location}</span>
                                        <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1" /> {job.type}</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-2 flex-shrink-0">
                                    <span className="text-lg font-bold text-primary">{applicants.length}</span>
                                    <span className="text-gray-600">Applicants</span>
                                    <Button variant="secondary" onClick={() => handleViewApplicants(job)}>View Applicants</Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
            {/* View Applicants Modal */}
            {selectedJob && (
                <Modal 
                    isOpen={isApplicantsModalOpen} 
                    onClose={() => setApplicantsModalOpen(false)} 
                    title={`Applicants for ${selectedJob.title}`}
                >
                    <div className="space-y-4">
                        {getApplicantsForJob(selectedJob.id).map(app => (
                            <div key={app.id} className="flex items-center justify-between p-3 rounded-md bg-light">
                                <div className="flex items-center">
                                    <img src={app.seeker?.avatarUrl} alt={app.seeker?.name} className="h-10 w-10 rounded-full mr-3"/>
                                    <div>
                                        <p className="font-semibold text-dark">{app.seeker?.name}</p>
                                        <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                                    </div>
                                </div>
                                <select 
                                    value={app.status}
                                    onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus, app.seeker?.name || 'Applicant')}
                                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {APPLICATION_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        {getApplicantsForJob(selectedJob.id).length === 0 && (
                            <p className="text-center text-gray-500 py-4">No applicants yet for this position.</p>
                        )}
                    </div>
                </Modal>
            )}
            {/* Post New Job Modal */}
            <Modal 
                isOpen={isPostJobModalOpen} 
                onClose={() => setPostJobModalOpen(false)} 
                title="Post a New Job"
            >
                <form onSubmit={handlePostJobSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input type="text" id="title" name="title" value={newJobData.title} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="location" name="location" value={newJobData.location} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select id="type" name="type" value={newJobData.type} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                        <textarea id="description" name="description" value={newJobData.description} onChange={handleInputChange} rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setPostJobModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Post Job</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
        status === 'Interviewing' ? 'bg-blue-100 text-blue-800' :
        status === 'Rejected' ? 'bg-red-100 text-red-800' :
        status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
        status === 'Offered' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
    }`}>
        {status}
    </span>
);

export default JobsPage;