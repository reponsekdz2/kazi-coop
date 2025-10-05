import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Job, Application, User, ApplicationStatus } from '../types';
import { JOBS, APPLICATIONS, USERS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import { BuildingOffice2Icon, MapPinIcon, ClockIcon, PlusIcon, CalendarDaysIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


// Main Page Component
const JobsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.EMPLOYER) {
    return <EmployerJobsView />;
  }
  return <SeekerJobsView />;
};

// Seeker View Components
const SeekerJobsView = () => {
  const [activeTab, setActiveTab] = useState('find');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Jobs</h1>
        <div className="flex border-b border-gray-200">
            <button onClick={() => setActiveTab('find')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'find' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Find Jobs</button>
            <button onClick={() => setActiveTab('applied')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'applied' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>My Applications</button>
        </div>
      </div>
      {activeTab === 'find' ? <FindJobs /> : <MyApplications />}
    </div>
  );
};

const FindJobs = () => {
  const { addToast } = useToast();
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);
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

  return (
    <>
      <div className="space-y-4">
        {JOBS.map(job => (
          <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
        ))}
      </div>
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
    </>
  );
};

const MyApplications = () => {
    const { user } = useAuth();
    const myApplications = APPLICATIONS.filter(app => app.seekerId === user?.id);

    const getStatusColor = (status: ApplicationStatus) => {
        const colors: Record<ApplicationStatus, string> = {
            'Applied': 'bg-blue-100 text-blue-800',
            'Under Review': 'bg-yellow-100 text-yellow-800',
            'Interviewing': 'bg-purple-100 text-purple-800',
            'Offered': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return colors[status];
    };

    if (myApplications.length === 0) {
        return <Card><p className="text-center text-gray-500">You haven't applied to any jobs yet.</p></Card>;
    }
    
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4">Job Title</th><th className="p-4">Company</th><th className="p-4">Applied On</th><th className="p-4">Status</th></tr></thead>
                    <tbody>
                    {myApplications.map(app => {
                        const job = JOBS.find(j => j.id === app.jobId);
                        if (!job) return null;
                        return (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-semibold text-primary">{job.title}</td>
                                <td className="p-4 text-gray-700">{job.company}</td>
                                <td className="p-4 text-gray-700">{app.appliedDate}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const JobCard: React.FC<{ job: Job; onApplyClick: (job: Job) => void; }> = ({ job, onApplyClick }) => {
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


// Employer View Components
const EmployerJobsView = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isPostJobModalOpen, setPostJobModalOpen] = useState(false);
    const [isApplicantsModalOpen, setApplicantsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handlePostJobSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addToast('New job posted successfully!', 'success');
      setPostJobModalOpen(false);
    };

    const handleViewApplicantsClick = (job: Job) => {
        setSelectedJob(job);
        setApplicantsModalOpen(true);
    };

    const myJobs = JOBS.filter(j => j.employerId === user?.id);
    const getApplicantsCount = (jobId: string) => APPLICATIONS.filter(a => a.jobId === jobId).length;

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark">Manage Job Postings</h1>
          <Button onClick={() => setPostJobModalOpen(true)} className="flex items-center"><PlusIcon className="h-5 w-5 mr-2" />Post New Job</Button>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b"><th className="p-4">Job Title</th><th className="p-4">Applicants</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
              <tbody>
                {myJobs.map(job => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold text-primary">{job.title}</td><td className="p-4">{getApplicantsCount(job.id)}</td>
                    <td className="p-4"><span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span></td>
                    <td className="p-4"><Button variant="secondary" className="text-sm" onClick={() => handleViewApplicantsClick(job)}>View Applicants</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={isPostJobModalOpen} onClose={() => setPostJobModalOpen(false)} title="Post a New Job">
            <form onSubmit={handlePostJobSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700">Job Title</label><input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Location</label><input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Job Type</label><select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required /></div>
                <div className="flex justify-end gap-2 !mt-6"><Button variant="secondary" type="button" onClick={() => setPostJobModalOpen(false)}>Cancel</Button><Button type="submit">Post Job</Button></div>
            </form>
        </Modal>

        <Modal isOpen={isApplicantsModalOpen} onClose={() => setApplicantsModalOpen(false)} title={`Applicants for ${selectedJob?.title}`}>
            <ApplicantKanban job={selectedJob} />
        </Modal>
      </>
    );
};

const ApplicantKanban: React.FC<{job: Job | null}> = ({ job }) => {
    const jobApplicants = APPLICATIONS.filter(app => app.jobId === job?.id);
    const [applicants, setApplicants] = useState<Application[]>(jobApplicants);
    const [selectedApplicant, setSelectedApplicant] = useState<User | null>(null);

    const navigate = useNavigate();

    const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
        setApplicants(prev => prev.map(app => app.id === applicationId ? {...app, status: newStatus} : app));
    };

    const handleViewProfile = (seekerId: string) => {
        const user = USERS.find(u => u.id === seekerId);
        if(user) setSelectedApplicant(user);
    }
    
    const handleMessage = () => {
        navigate('/messages');
    }

    const statuses: ApplicationStatus[] = ['Applied', 'Under Review', 'Interviewing', 'Offered', 'Rejected'];

    return (
        <>
            <div className="flex space-x-4 overflow-x-auto p-2 bg-light rounded-md min-h-[400px]">
                {statuses.map(status => (
                    <div key={status} className="bg-gray-100 rounded-lg p-3 w-64 flex-shrink-0">
                        <h3 className="font-semibold text-dark mb-3 text-center">{status} ({applicants.filter(a => a.status === status).length})</h3>
                        <div className="space-y-3">
                            {applicants.filter(a => a.status === status).map(app => (
                                <ApplicantCard 
                                    key={app.id} 
                                    application={app} 
                                    onStatusChange={handleStatusChange} 
                                    onViewProfile={() => handleViewProfile(app.seekerId)}
                                    onMessage={handleMessage}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)} title="Applicant Profile">
                <ApplicantProfile applicant={selectedApplicant} />
            </Modal>
        </>
    );
};

const ApplicantCard: React.FC<{ application: Application; onStatusChange: (id: string, status: ApplicationStatus) => void; onViewProfile: () => void; onMessage: () => void; }> = ({ application, onStatusChange, onViewProfile, onMessage }) => {
    const applicant = USERS.find(u => u.id === application.seekerId);
    if (!applicant) return null;
    return (
        <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="flex items-center mb-2">
                <img src={applicant.avatarUrl} alt={applicant.name} className="h-10 w-10 rounded-full mr-3" />
                <div>
                    <p className="font-bold text-sm text-dark">{applicant.name}</p>
                    <p className="text-xs text-gray-500">{applicant.profile.title}</p>
                </div>
            </div>
            <div className="flex items-center justify-between border-t pt-2 mt-2">
                 <div className="flex items-center gap-1">
                    <button onClick={onViewProfile} className="p-1 text-gray-400 hover:text-primary"><UserCircleIcon className="h-5 w-5"/></button>
                    <button onClick={onMessage} className="p-1 text-gray-400 hover:text-primary"><ChatBubbleLeftRightIcon className="h-5 w-5"/></button>
                 </div>
                <select 
                    value={application.status} 
                    onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
                    className="text-xs border-none bg-gray-100 rounded focus:ring-primary"
                >
                    <option>Applied</option>
                    <option>Under Review</option>
                    <option>Interviewing</option>
                    <option>Offered</option>
                    <option>Rejected</option>
                </select>
            </div>
        </div>
    );
};

const ApplicantProfile: React.FC<{applicant: User | null}> = ({ applicant }) => {
    if(!applicant) return null;
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <img src={applicant.avatarUrl} alt={applicant.name} className="h-20 w-20 rounded-full" />
                <div>
                    <h3 className="text-xl font-bold text-dark">{applicant.name}</h3>
                    <p className="text-primary">{applicant.profile.title}</p>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800">Bio</h4>
                <p className="text-gray-600 text-sm mt-1">{applicant.profile.bio}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {applicant.profile.skills?.map(skill => (
                        <span key={skill} className="bg-light px-2 py-1 text-sm text-gray-700 rounded-md">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default JobsPage;
