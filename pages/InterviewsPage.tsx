
import React, { useState } from 'react';
import { useInterviews } from '../contexts/InterviewContext';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { USERS, COMPANIES } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { CalendarIcon, ClockIcon, UserIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import VideoCallModal from '../components/ui/VideoCallModal';
import { UserRole } from '../types';

const InterviewsPage: React.FC = () => {
    const { interviews } = useInterviews();
    const { user } = useAuth();
    const { jobs } = useJobs();
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [selectedParticipantName, setSelectedParticipantName] = useState('');

    const upcomingInterviews = interviews.filter(i => new Date(i.date) >= new Date() && i.status === 'Scheduled');
    const pastInterviews = interviews.filter(i => new Date(i.date) < new Date() || i.status !== 'Scheduled');

    const handleJoinCall = (interview: typeof interviews[0]) => {
        const participant = user?.role === UserRole.SEEKER 
            ? USERS.find(u => u.role === UserRole.EMPLOYER) // Simplified for demo
            : USERS.find(u => u.id === interview.userId);
        
        setSelectedParticipantName(participant?.name || 'Participant');
        setIsVideoCallOpen(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">My Interviews</h1>
            
            <section>
                <h2 className="text-xl font-semibold text-dark dark:text-light mb-4">Upcoming Interviews</h2>
                {upcomingInterviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingInterviews.map(interview => {
                            const job = jobs.find(j => j.id === interview.jobId);
                            const company = COMPANIES.find(c => c.id === job?.companyId);
                            const participant = user?.role === UserRole.SEEKER
                                ? company?.name
                                : USERS.find(u => u.id === interview.userId)?.name;

                            return (
                                <Card key={interview.id}>
                                    <p className="font-bold text-primary text-lg">{job?.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">with {participant}</p>
                                    
                                    <div className="space-y-2 text-sm text-dark dark:text-light">
                                        <p className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-primary" />{new Date(interview.date).toLocaleDateString()}</p>
                                        <p className="flex items-center"><ClockIcon className="h-4 w-4 mr-2 text-primary" />{new Date(interview.date).toLocaleTimeString()}</p>
                                        <p className="flex items-center"><UserIcon className="h-4 w-4 mr-2 text-primary" />{interview.type} Interview</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                        <Button onClick={() => handleJoinCall(interview)}>
                                            <VideoCameraIcon className="h-5 w-5 mr-2 inline" />
                                            Join Video Call
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No upcoming interviews scheduled.</p>
                )}
            </section>
            
            <section className="mt-8">
                <h2 className="text-xl font-semibold text-dark dark:text-light mb-4">Past Interviews</h2>
                {pastInterviews.length > 0 ? (
                     <Card>
                         <div className="divide-y dark:divide-gray-700">
                            {pastInterviews.map(interview => {
                                const job = jobs.find(j => j.id === interview.jobId);
                                return (
                                <div key={interview.id} className="p-3">
                                    <p className="font-semibold text-dark dark:text-light">{job?.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(interview.date).toLocaleString()}</p>
                                    <p className="text-xs mt-1">Status: <span className="font-bold">{interview.status}</span></p>
                                </div>
                                )
                            })}
                         </div>
                    </Card>
                ) : (
                    <p className="text-gray-500">No past interviews.</p>
                )}
            </section>
            
            <VideoCallModal 
                isOpen={isVideoCallOpen} 
                onClose={() => setIsVideoCallOpen(false)} 
                participantName={selectedParticipantName}
            />
        </div>
    );
};

export default InterviewsPage;
