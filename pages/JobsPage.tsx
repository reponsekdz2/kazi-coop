
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Job } from '../types';
import { useJobs } from '../contexts/JobContext';
import { useApplications } from '../contexts/ApplicationContext';
import { useAuth } from '../contexts/AuthContext';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useToast } from '../contexts/ToastContext';

const JobsPage: React.FC = () => {
    const { jobs } = useJobs();
    const { user } = useAuth();
    const { applications, applyForJob } = useApplications();
    const { addToast } = useToast();
    const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const appliedJobIds = new Set(applications.filter(app => app.userId === user?.id).map(app => app.jobId));

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        job.location.toLowerCase().includes(location.toLowerCase())
    );

    const handleApply = (job: Job) => {
        // Mock match score
        const matchScore = Math.floor(Math.random() * (95 - 75 + 1) + 75);
        applyForJob(job.id, matchScore);
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Find Your Next Opportunity</h1>
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Job title or keyword" 
                            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <MapPinIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <Button>Search</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="md:col-span-1 lg:col-span-1 h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    <h2 className="text-lg font-semibold mb-2 text-dark dark:text-light">{filteredJobs.length} Jobs Found</h2>
                    <div className="space-y-3">
                        {filteredJobs.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => setSelectedJob(job)}
                                className={`p-4 rounded-lg cursor-pointer border-2 ${selectedJob?.id === job.id ? 'border-primary bg-primary/10' : 'bg-white dark:bg-dark border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                            >
                                <p className="font-bold text-dark dark:text-light">{job.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{job.location}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3 h-[calc(100vh-250px)] overflow-y-auto">
                    {selectedJob ? (
                        <Card>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-light">{selectedJob.title}</h2>
                                    <p className="text-md text-gray-600 dark:text-gray-400">{selectedJob.company} - {selectedJob.location}</p>
                                </div>
                                <Button onClick={() => handleApply(selectedJob)} disabled={appliedJobIds.has(selectedJob.id)}>
                                    {appliedJobIds.has(selectedJob.id) ? 'Applied' : 'Apply Now'}
                                </Button>
                            </div>
                            <div className="mt-4 border-t pt-4 dark:border-gray-700 space-y-4">
                               <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                   <span className="flex items-center gap-2"><BriefcaseIcon className="h-5 w-5"/>{selectedJob.type}</span>
                                   <span>{selectedJob.salaryRange}</span>
                               </div>
                               <div>
                                 <h3 className="font-semibold mb-2 text-dark dark:text-light">Job Description</h3>
                                 <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{selectedJob.longDescription}</p>
                               </div>
                               <div>
                                 <h3 className="font-semibold mb-2 text-dark dark:text-light">Required Skills</h3>
                                 <div className="flex flex-wrap gap-2">
                                     {selectedJob.skills.map(skill => (
                                         <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-blue-900/50 dark:text-blue-300">{skill}</span>
                                     ))}
                                 </div>
                               </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">Select a job to see details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
