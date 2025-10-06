import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useInterviews } from '../contexts/InterviewContext';
import { JOBS, USERS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Interview } from '../types';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, MapPinIcon, VideoCameraIcon, XCircleIcon } from '@heroicons/react/24/solid';

const statusInfo: { [key in Interview['status']]: { color: string; text: string; icon: React.ElementType } } = {
  Scheduled: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', text: 'Scheduled', icon: CalendarDaysIcon },
  Confirmed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', text: 'Confirmed', icon: CheckCircleIcon },
  Completed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', text: 'Completed', icon: CheckCircleIcon },
  Canceled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', text: 'Canceled', icon: XCircleIcon },
};


const InterviewsPage: React.FC = () => {
    const { interviews, updateInterviewStatus } = useInterviews();
    const { user } = useAuth();
    const isSeeker = user?.role === UserRole.SEEKER;

    const upcomingInterviews = interviews.filter(i => new Date(i.date) >= new Date() && i.status !== 'Completed' && i.status !== 'Canceled');
    const pastInterviews = interviews.filter(i => new Date(i.date) < new Date() || i.status === 'Completed' || i.status === 'Canceled');

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{isSeeker ? 'My Interviews' : 'Interview Schedule'}</h1>
            
            <section>
                <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">Upcoming</h2>
                {upcomingInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingInterviews.map(interview => (
                            <InterviewCard key={interview.id} interview={interview} updateStatus={updateInterviewStatus} isSeeker={isSeeker} />
                        ))}
                    </div>
                ) : (
                    <Card><p className="text-center text-gray-500">No upcoming interviews scheduled.</p></Card>
                )}
            </section>

             <section className="mt-8">
                <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">Past & Canceled</h2>
                {pastInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {pastInterviews.map(interview => (
                            <InterviewCard key={interview.id} interview={interview} updateStatus={updateInterviewStatus} isSeeker={isSeeker} />
                        ))}
                    </div>
                ) : (
                    <Card><p className="text-center text-gray-500">No past interviews.</p></Card>
                )}
            </section>
        </div>
    );
};

const InterviewCard: React.FC<{ interview: Interview, updateStatus: (id: string, status: Interview['status']) => void, isSeeker: boolean }> = ({ interview, updateStatus, isSeeker }) => {
    const job = JOBS.find(j => j.id === interview.jobId);
    const interviewee = USERS.find(u => u.id === interview.userId);
    const employer = USERS.find(u => u.id === job?.employerId);
    if (!job || !interviewee) return null;

    const otherParty = isSeeker ? employer : interviewee;
    const StatusIcon = statusInfo[interview.status].icon;

    return (
        <Card className="!p-0 overflow-hidden">
            <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusInfo[interview.status].color}`}>
                            <StatusIcon className="h-4 w-4 mr-1.5" />
                            {statusInfo[interview.status].text}
                        </span>
                        <h2 className="text-xl font-bold text-dark dark:text-light mt-2">{job.title}</h2>
                        <p className="text-sm font-semibold text-primary">{isSeeker ? job.company : interviewee.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="text-right">
                             <p className="font-bold text-dark dark:text-light">{new Date(interview.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(interview.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                        {otherParty && <img src={otherParty.avatarUrl} alt={otherParty.name} className="h-12 w-12 rounded-full hidden md:block"/>}
                    </div>
                </div>
                 <div className="border-t dark:border-gray-700 mt-4 pt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-gray-400"/>
                        <span>Interview Type: <strong>{interview.type}</strong></span>
                    </div>
                    {interview.details && (
                         <div className="flex items-center gap-2">
                            {interview.details.includes('http') ? <VideoCameraIcon className="h-5 w-5 text-gray-400"/> : <MapPinIcon className="h-5 w-5 text-gray-400"/>}
                            <span>Details: <strong>{interview.details}</strong></span>
                        </div>
                    )}
                </div>
            </div>
             {isSeeker && interview.status === 'Scheduled' && (
                <div className="bg-light dark:bg-gray-800/50 p-4 flex justify-end items-center gap-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Do you confirm your attendance?</p>
                    <Button variant="danger" onClick={() => updateStatus(interview.id, 'Canceled')}>Cancel</Button>
                    <Button onClick={() => updateStatus(interview.id, 'Confirmed')}>Confirm</Button>
                </div>
            )}
        </Card>
    );
};

export default InterviewsPage;