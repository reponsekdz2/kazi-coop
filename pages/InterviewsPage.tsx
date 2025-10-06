

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useInterviews } from '../contexts/InterviewContext';
import { useAuth } from '../contexts/AuthContext';
// FIX: Property 'company' does not exist on type 'Job'. Use companyId to find company name from COMPANIES.
import { JOBS, USERS, COMPANIES } from '../constants';
import { CalendarDaysIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import VideoCallModal from '../components/ui/VideoCallModal';

const InterviewsPage: React.FC = () => {
    const { interviews } = useInterviews();
    const { user } = useAuth();
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState('');

    const upcomingInterviews = interviews
        .filter(i => new Date(i.date) >= new Date())
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const pastInterviews = interviews
        .filter(i => new Date(i.date) < new Date())
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleJoinCall = (interviewId: string) => {
        const interview = interviews.find(i => i.id === interviewId);
        if(!interview || !user) return;

        const otherUserId = user.role === 'Employer' ? interview.userId : JOBS.find(j => j.id === interview.jobId)?.employerId;
        const otherUser = USERS.find(u => u.id === otherUserId);
        
        setSelectedParticipant(otherUser?.name || 'Participant');
        setIsCallModalOpen(true);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">My Interviews</h1>
            
            <Card title="Upcoming Interviews" className="mb-6">
                {upcomingInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingInterviews.map(interview => {
                            const job = JOBS.find(j => j.id === interview.jobId);
                            const applicant = USERS.find(u => u.id === interview.userId);
                            if (!job || !applicant) return null;
                            const company = COMPANIES.find(c => c.id === job.companyId);
                            
                            return (
                                <div key={interview.id} className="p-4 rounded-lg bg-light dark:bg-gray-700/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center w-16 flex-shrink-0">
                                            <p className="text-lg font-bold text-primary">{new Date(interview.date).toLocaleDateString('en-US', { day: '2-digit' })}</p>
                                            <p className="text-sm text-gray-500">{new Date(interview.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-dark dark:text-light">{job.title}</p>
                                            {/* FIX: Property 'company' does not exist on type 'Job'. Use companyId to find company name. */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role === 'Employer' ? `With: ${applicant.name}` : `At: ${company?.name}`}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{`${interview.type} | ${new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end md:self-center">
                                         <Button variant="secondary" onClick={() => handleJoinCall(interview.id)}>
                                            <VideoCameraIcon className="h-5 w-5 mr-2 inline" />
                                            Join Call
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No upcoming interviews scheduled.</p>
                )}
            </Card>

            <Card title="Past Interviews">
                {pastInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {pastInterviews.map(interview => {
                             const job = JOBS.find(j => j.id === interview.jobId);
                             const applicant = USERS.find(u => u.id === interview.userId);
                             if (!job || !applicant) return null;
                             const company = COMPANIES.find(c => c.id === job.companyId);

                             return (
                                <div key={interview.id} className="p-4 rounded-lg bg-light dark:bg-gray-700/50 opacity-70">
                                    {/* FIX: Property 'company' does not exist on type 'Job'. Use companyId to find company name. */}
                                    <p className="font-semibold text-dark dark:text-light">{job.title} at {company?.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {`Completed on ${new Date(interview.date).toLocaleDateString()}`}
                                    </p>
                                </div>
                             )
                        })}
                    </div>
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 py-8">No past interviews.</p>
                )}
            </Card>

            <VideoCallModal 
                isOpen={isCallModalOpen}
                onClose={() => setIsCallModalOpen(false)}
                participantName={selectedParticipant}
            />
        </div>
    );
};

export default InterviewsPage;