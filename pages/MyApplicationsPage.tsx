import React, { useState, useMemo } from 'react';
import { useApplications } from '../contexts/ApplicationContext';
import { useJobs } from '../contexts/JobContext';
import { COMPANIES } from '../constants';
import { Application, Job } from '../types';
import Card from '../components/ui/Card';
import ApplicationStatusTracker from '../components/ui/ApplicationStatusTracker';
import { Link } from 'react-router-dom';
import Button from '../components/layout/Button';
import { BriefcaseIcon } from '@heroicons/react/24/solid';

const MyApplicationsPage: React.FC = () => {
    const { applications } = useApplications();
    const { jobs } = useJobs();

    const applicationsWithJobs = useMemo(() => {
        return applications
            .map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return job ? { ...app, job } : null;
            })
            .filter((app): app is Application & { job: Job } => app !== null)
            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [applications, jobs]);

    const [selectedApplication, setSelectedApplication] = useState<(Application & { job: Job }) | null>(
        applicationsWithJobs[0] || null
    );

    if (applicationsWithJobs.length === 0) {
        return (
            <div className="text-center">
                 <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                 <h1 className="text-2xl font-bold text-dark dark:text-light mt-4">No Applications Yet</h1>
                 <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't applied for any jobs. Let's find your next opportunity!</p>
                 <Link to="/jobs" className="mt-6">
                    <Button>Browse Jobs</Button>
                 </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
                <h1 className="text-3xl font-bold text-dark dark:text-light">My Applications</h1>
                {applicationsWithJobs.map(app => {
                    const company = COMPANIES.find(c => c.id === app.job.companyId);
                    return (
                        <Card 
                            key={app.id} 
                            className={`!p-4 cursor-pointer ${selectedApplication?.id === app.id ? 'border-2 border-primary' : ''}`} 
                            onClick={() => setSelectedApplication(app)}
                        >
                            <h3 className="font-bold text-dark dark:text-light">{app.job.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{company?.name}</p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Applied: {new Date(app.submissionDate).toLocaleDateString()}
                            </div>
                            <div className="mt-2">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{app.status}</span>
                            </div>
                        </Card>
                    );
                })}
            </div>
            <div className="lg:col-span-2 overflow-y-auto pr-2">
                {selectedApplication ? (
                    <ApplicationDetailView application={selectedApplication} />
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select an application to view its details.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};


const ApplicationDetailView: React.FC<{ application: Application & { job: Job } }> = ({ application }) => {
    const company = COMPANIES.find(c => c.id === application.job.companyId);

    return (
        <Card>
            <h2 className="text-2xl font-bold text-dark dark:text-light">{application.job.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">{company?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Applied on {new Date(application.submissionDate).toLocaleDateString()}</p>
            <div className="my-6 py-6 border-y dark:border-gray-700">
                <ApplicationStatusTracker status={application.status} />
            </div>
            <div>
                 <h3 className="text-lg font-bold text-dark dark:text-light mb-2">Next Steps</h3>
                 <p className="text-gray-600 dark:text-gray-300">
                    The employer is currently reviewing applications. You will receive a notification if your status changes. Good luck!
                 </p>
                 <Link to="/jobs">
                    <Button variant="secondary" className="mt-4">View Original Job Post</Button>
                 </Link>
            </div>
        </Card>
    );
}


export default MyApplicationsPage;