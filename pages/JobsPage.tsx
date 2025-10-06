import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useJobs } from '../contexts/JobContext';
import { Job, User, Application, UserRole, Interview } from '../types';
import { MapPinIcon, BriefcaseIcon, MagnifyingGlassIcon, XMarkIcon, CalendarDaysIcon, SparklesIcon, BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Modal from '../components/layout/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationContext';
import { USERS } from '../constants';
import { useInterviews } from '../contexts/InterviewContext';
import { GoogleGenAI, Type } from '@google/genai';
import RingProgress from '../components/layout/RingProgress';
import SeekerProfileModal from '../components/ui/SeekerProfileModal';
import NewJobModal from '../components/ui/NewJobModal';
import ScheduleInterviewModal from '../components/ui/ScheduleInterviewModal';
import ApplicationStatusTracker from '../components/ui/ApplicationStatusTracker';

type SeekerJobView = 'all' | 'saved';

const JobsPage: React.FC = () => {
    const { user } = useAuth();

    if (user?.role === UserRole.EMPLOYER) {
        return <EmployerJobsView />;
    }
    return <SeekerJobsView />;
};

const SeekerJobsView: React.FC = () => {
  const { jobs, toggleSaveJob } = useJobs();
  const { user } = useAuth();
  const { applications, applyForJob } = useApplications();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SeekerJobView>('all');

  const appliedJobIds = new Set(applications.map(app => app.jobId));

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'saved') {
        return job.isSaved && matchesSearch;
    }
    return matchesSearch;
  });
  
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

  const userApplicationForSelectedJob = applications.find(app => app.jobId === selectedJob?.id);

  return (
    <div>
      <div className="mb-6 bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">Find Your Next Opportunity</h1>
        <div className="border-b border-gray-200 dark:border-gray-700 my-4">
            <nav className="-mb-px flex space-x-6">
                <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    All Jobs
                </button>
                 <button onClick={() => setActiveTab('saved')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    Saved Jobs
                </button>
            </nav>
        </div>
        <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <Card key={job.id} className="flex flex-col relative">
            <button onClick={() => toggleSaveJob(job.id)} className="absolute top-4 right-4 text-gray-400 hover:text-primary">
                {job.isSaved ? <BookmarkSolidIcon className="h-6 w-6 text-primary" /> : <BookmarkOutlineIcon className="h-6 w-6" />}
            </button>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-dark dark:text-light pr-8">{job.title}</h2>
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
              <Button onClick={() => setSelectedJob(job)} className="flex-1">View Details</Button>
              <Button 
                variant={appliedJobIds.has(job.id) ? 'secondary' : 'primary'}
                onClick={() => handleApplyClick(job)} 
                disabled={appliedJobIds.has(job.id)}
                className="flex-1"
              >
                {appliedJobIds.has(job.id) ? 'Application Sent' : 'Apply Now'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
            <p>No jobs found that match your criteria.</p>
        </div>
      )}

      {selectedJob && (
          <JobDetailsModal 
            isOpen={!!selectedJob && !isApplyModalOpen} 
            onClose={() => setSelectedJob(null)} 
            job={selectedJob} 
            onApply={() => handleApplyClick(selectedJob)}
            isApplied={appliedJobIds.has(selectedJob.id)}
            application={userApplicationForSelectedJob}
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
    const { jobs, createJob, updateJob } = useJobs();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [viewingApplicantsFor, setViewingApplicantsFor] = useState<Job | null>(null);

    const handleSaveJob = (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => {
        if (editingJob) {
            updateJob(editingJob.id, jobData);
        } else {
            createJob(jobData);
        }
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setIsCreateModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark dark:text-light">Job Management</h1>
                 <Button onClick={() => { setEditingJob(null); setIsCreateModalOpen(true); }}>Post New Job</Button>
            </div>
            <div className="space-y-4">
                {jobs.map(job => <JobManagementCard key={job.id} job={job} onEdit={() => handleEditJob(job)} onViewApplicants={() => setViewingApplicantsFor(job)} />)}
            </div>

            {viewingApplicantsFor && (
                <ViewApplicantsModal
                    isOpen={!!viewingApplicantsFor}
                    onClose={() => setViewingApplicantsFor(null)}
                    job={viewingApplicantsFor}
                />
            )}
            {(isCreateModalOpen || editingJob) && (
                <NewJobModal 
                    isOpen={isCreateModalOpen || !!editingJob}
                    onClose={() => { setIsCreateModalOpen(false); setEditingJob(null); }}
                    onSave={handleSaveJob}
                    job={editingJob}
                />
            )}
        </div>
    )
};

const statusColors: { [key in Job['status'] & string]: string } = {
    Open: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Closed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const JobManagementCard: React.FC<{ job: Job, onEdit: () => void, onViewApplicants: () => void }> = ({ job, onEdit, onViewApplicants }) => {
    const { applications } = useApplications();
    const { updateJobStatus } = useJobs();
    const applicantCount = applications.filter(a => a.jobId === job.id).length;

    return (
        <Card className="flex justify-between items-center">
            <div>
                <h2 className="font-bold text-xl text-dark dark:text-light">{job.title}</h2>
                <div className="flex items-center gap-4 text-sm mt-1">
                    <p className="text-gray-500 dark:text-gray-400">{job.location} - {job.type}</p>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[job.status || 'Open']}`}>
                        {job.status || 'Open'}
                    </span>
                </div>
                <p className="text-sm font-semibold text-primary mt-2">{applicantCount} Applicant(s)</p>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={job.status || 'Open'} 
                    onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                    className="bg-white border border-gray-300 rounded-md text-sm p-1.5 dark:bg-gray-800 dark:border-gray-600"
                >
                    <option value="Open">Open</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                </select>
                <Button variant="secondary" onClick={onEdit}>Edit</Button>
                <Button onClick={onViewApplicants}>View Applicants</Button>
            </div>
        </Card>
    );
};

type MatchScore = { score: number | null; justification: string; isLoading: boolean };

const ViewApplicantsModal: React.FC<{ isOpen: boolean; onClose: () => void; job: Job }> = ({ isOpen, onClose, job }) => {
    const { applications, updateApplicationStatus } = useApplications();
    const [isSchedulingInterview, setIsSchedulingInterview] = useState<Application | null>(null);
    const [viewingApplicant, setViewingApplicant] = useState<User | null>(null);
    const applicants = applications.filter(a => a.jobId === job.id);
    const applicationStatuses: Application['status'][] = ['Applied', 'Reviewed', 'Interviewing', 'Interview Scheduled', 'Offered', 'Rejected'];
    const [matchScores, setMatchScores] = useState<Record<string, MatchScore>>({});

    useEffect(() => {
        if (isOpen) {
            handleGenerateScores();
        }
    }, [isOpen]);

    const handleGenerateScores = async () => {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
        
        for (const app of applicants) {
            const applicant = USERS.find(u => u.id === app.userId);
            if (!applicant) continue;

            setMatchScores(prev => ({ ...prev, [app.id]: { score: null, justification: '', isLoading: true } }));

            const prompt = `
                Act as an expert HR recruiter specializing in the Rwandan tech market. Analyze the following job requirements and candidate profile.
                Provide a percentage match score from 0 to 100 representing how well the candidate fits the role.
                Also provide a brief, one-sentence justification for your score, highlighting the strongest positive or negative factor.

                Job Title: ${job.title}
                Job Requirements: ${job.requirements.join(', ')}
                Job Description: ${job.description}

                Candidate Skills: ${applicant.skills?.join(', ') || 'Not specified'}

                Respond ONLY with a valid JSON object.
            `;
            
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                      responseMimeType: "application/json",
                      responseSchema: {
                         type: Type.OBJECT,
                         properties: {
                           score: { type: Type.INTEGER, description: 'The match score from 0 to 100.'},
                           justification: { type: Type.STRING, description: 'A brief one-sentence justification.' },
                         },
                         required: ["score", "justification"]
                       },
                    },
                });

                const jsonStr = response.text.trim();
                const result = JSON.parse(jsonStr);
                setMatchScores(prev => ({ ...prev, [app.id]: { score: result.score, justification: result.justification, isLoading: false } }));

            } catch (error) {
                console.error("Error generating match score:", error);
                setMatchScores(prev => ({ ...prev, [app.id]: { score: null, justification: 'Error', isLoading: false } }));
            }
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Applicants for ${job.title}`}>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {applicants.length > 0 ? applicants.map(app => {
                    const applicant = USERS.find(u => u.id === app.userId);
                    if (!applicant) return null;
                    const match = matchScores[app.id];

                    return (
                        <div key={app.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-light dark:bg-gray-700/50 items-center">
                           <div className="md:col-span-1 flex items-center">
                                <img src={applicant.avatarUrl} alt={applicant.name} className="h-10 w-10 rounded-full mr-3"/>
                                <div>
                                    <p className="font-bold text-dark dark:text-light">{applicant.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Applied on: {new Date(app.submissionDate).toLocaleDateString()}</p>
                                </div>
                           </div>
                           <div className="md:col-span-1 flex justify-center items-center gap-3">
                                {match?.isLoading ? (
                                    <div className="text-center text-xs text-gray-500 animate-pulse">Analyzing fit...</div>
                                ) : match?.score !== null ? (
                                    <div className="text-center group relative">
                                        <RingProgress percentage={match.score || 0} size={50} strokeWidth={5} />
                                        <div className="absolute bottom-full mb-2 w-48 text-center left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-dark text-white text-xs rounded-md z-10">
                                            {match.justification}
                                        </div>
                                    </div>
                                ) : <div className="text-xs text-red-500">Error</div>}
                           </div>
                           <div className="md:col-span-1 flex items-center justify-end gap-2">
                                <select 
                                    value={app.status} 
                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application['status'])}
                                    className="bg-white border border-gray-300 rounded-md text-sm p-1.5 dark:bg-gray-800 dark:border-gray-600"
                                >
                                    {applicationStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                {app.status === 'Interviewing' && (
                                    <Button onClick={() => setIsSchedulingInterview(app)} className="!p-2" title="Schedule Interview">
                                        <CalendarDaysIcon className="h-5 w-5"/>
                                    </Button>
                                )}
                                <Button variant="secondary" onClick={() => setViewingApplicant(applicant)}>Profile</Button>
                           </div>
                        </div>
                    );
                }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No one has applied for this job yet.</p>}
            </div>

            {isSchedulingInterview && (
                <ScheduleInterviewModal 
                    isOpen={!!isSchedulingInterview}
                    onClose={() => setIsSchedulingInterview(null)}
                    application={isSchedulingInterview}
                />
            )}
            {viewingApplicant && (
                <SeekerProfileModal 
                    isOpen={!!viewingApplicant}
                    onClose={() => setViewingApplicant(null)}
                    user={viewingApplicant}
                />
            )}
        </Modal>
    )
};

const JobDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; job: Job; onApply: () => void; isApplied: boolean, application?: Application | null }> = ({ isOpen, onClose, job, onApply, isApplied, application }) => {
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
                {isApplied && application && (
                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                        <ApplicationStatusTracker status={application.status} />
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={onApply} disabled={isApplied}>{isApplied ? 'Application Sent' : 'Apply Now'}</Button>
                </div>
            </div>
        </Modal>
    )
}

const ApplyConfirmationModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, job: Job}> = ({ isOpen, onClose, onConfirm, job }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job.title}`}>
             <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">You are about to apply for the position of <strong>{job.title}</strong> at <strong>{job.company}</strong>. Please confirm your submission.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your profile and documents are up-to-date for the best chance of success.</p>
                <div className="flex justify-end gap-2 pt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm}>Submit</Button>
                </div>
             </div>
        </Modal>
    );
};


export default JobsPage;