
import React, { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useInterviews } from '../contexts/InterviewContext';
import { useAuth } from '../contexts/AuthContext';
import { VideoCameraIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { JOBS, USERS } from '../constants';
import VideoCallModal from '../components/ui/VideoCallModal';
import { UserRole } from '../types';

const InterviewsPage: React.FC = () => {
    const { user } = useAuth();
    const { interviews } = useInterviews();
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState('');

    const upcomingInterviews = useMemo(() => {
        return interviews.filter(i => new Date(i.date) >= new Date() && i.status === 'Scheduled')
                         .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [interviews]);

    const pastInterviews = useMemo(() => {
        return interviews.filter(i => new Date(i.date) < new Date() || i.status !== 'Scheduled')
                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [interviews]);

    const handleJoinCall = (interview: typeof interviews[0]) => {
        const participant = user?.role === UserRole.SEEKER 
            ? USERS.find(u => u.id === JOBS.find(j => j.id === interview.jobId)?.employerId)
            : USERS.find(u => u.id === interview.userId);

        if (participant) {
            setSelectedParticipant(participant.name);
            setIsVideoCallOpen(true);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">My Interviews</h1>
            
            <section>
                <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">Upcoming Interviews</h2>
                {upcomingInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingInterviews.map(interview => {
                            const job = JOBS.find(j => j.id === interview.jobId);
                            const participant = user?.role === UserRole.SEEKER 
                                ? USERS.find(u => u.id === job?.employerId)
                                : USERS.find(u => u.id === interview.userId);
                            
                            if (!job || !participant) return null;
                            
                            return (
                                <Card key={interview.id}>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-primary">{interview.type}</p>
                                            <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                                            <p className="text-gray-500">With {participant.name}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="font-semibold flex items-center gap-2">
                                                <CalendarDaysIcon className="h-5 w-5 text-gray-400"/>
                                                {new Date(interview.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                            <Button className="mt-2" onClick={() => handleJoinCall(interview)}>
                                                <VideoCameraIcon className="h-5 w-5 mr-2 inline-block"/>
                                                Join Call
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500">You have no upcoming interviews scheduled.</p>
                    </Card>
                )}
            </section>

             <section className="mt-8">
                <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">Past Interviews</h2>
                 {pastInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {pastInterviews.map(interview => {
                             const job = JOBS.find(j => j.id === interview.jobId);
                             if (!job) return null;
                             return (
                                 <Card key={interview.id} className="opacity-70">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                             <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                                            <p className="text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${interview.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{interview.status}</span>
                                        </div>
                                    </div>
                                 </Card>
                             )
                        })}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500">You have no past interviews.</p>
                    </Card>
                )}
            </section>
            
            <VideoCallModal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} participantName={selectedParticipant} />
        </div>
    );
};

export default InterviewsPage;
