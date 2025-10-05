import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Message, User } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { JOBS, APPLICATIONS, COOPERATIVES, TRANSACTIONS, INTERVIEWS, MESSAGES, USERS } from '../constants';
import { ArrowTrendingUpIcon, BriefcaseIcon, BanknotesIcon, UsersIcon, CreditCardIcon, CalendarDaysIcon, VideoCameraIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const myMessages = MESSAGES.filter(m => m.receiverId === user?.id || m.senderId === user?.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);

  const SeekerDashboard = () => {
      const myInterviews = INTERVIEWS.filter(i => i.seekerId === user?.id && i.status === 'Scheduled');
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Recommended Jobs" value={JOBS.length} icon={<BriefcaseIcon className="h-8 w-8 text-primary" />} />
                    <StatCard title="Active Applications" value={APPLICATIONS.filter(a => a.seekerId === user?.id).length} icon={<ArrowTrendingUpIcon className="h-8 w-8 text-accent" />} />
                    <StatCard title="Wallet Balance" value={`RWF ${TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`} icon={<BanknotesIcon className="h-8 w-8 text-yellow-500" />} />
                    <StatCard title="My Cooperatives" value={1} icon={<UsersIcon className="h-8 w-8 text-red-500" />} />
                </div>
                 {myInterviews.length > 0 && (
                    <div className="mt-6">
                        <Card title="Upcoming Interviews">
                            {myInterviews.map(interview => {
                                const job = JOBS.find(j => j.id === interview.jobId);
                                return (
                                    <div key={interview.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-md bg-light mb-2">
                                        <div>
                                            <p className="font-bold text-dark">Interview for {job?.title}</p>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                                {interview.date} at {interview.time} with {job?.company}
                                            </p>
                                        </div>
                                        <Button className="mt-2 sm:mt-0 flex items-center">
                                            <VideoCameraIcon className="h-5 w-5 mr-2" />
                                            Join Online Interview
                                        </Button>
                                    </div>
                                )
                            })}
                        </Card>
                    </div>
                )}
            </div>
            <div className="lg:col-span-1">
                <MessageCard messages={myMessages} currentUser={user} />
            </div>
        </div>
      )
  };

  const EmployerDashboard = () => {
      const myJobs = JOBS.filter(j => j.employerId === user?.id);
      const totalApplicants = APPLICATIONS.filter(a => myJobs.some(j => j.id === a.jobId)).length;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Active Job Postings" value={myJobs.length} icon={<BriefcaseIcon className="h-8 w-8 text-primary" />} />
                    <StatCard title="Total Applicants" value={totalApplicants} icon={<UsersIcon className="h-8 w-8 text-accent" />} />
                </div>
            </div>
             <div className="lg:col-span-1">
                <MessageCard messages={myMessages} currentUser={user} />
            </div>
        </div>
      );
  };
  
  const CoopAdminDashboard = () => {
      const coop = COOPERATIVES[0];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Members" value={coop.membersCount} icon={<UsersIcon className="h-8 w-8 text-primary" />} />
            <StatCard title="Total Savings" value={`RWF ${coop.totalSavings.toLocaleString()}`} icon={<BanknotesIcon className="h-8 w-8 text-accent" />} />
            <StatCard title="Total Loans" value={`RWF ${coop.totalLoans.toLocaleString()}`} icon={<CreditCardIcon className="h-8 w-8 text-yellow-500" />} />
        </div>
      );
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.SEEKER:
        return <SeekerDashboard />;
      case UserRole.EMPLOYER:
        return <EmployerDashboard />;
      case UserRole.COOP_ADMIN:
        return <CoopAdminDashboard />;
      default:
        return <p>No dashboard available for this role.</p>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Dashboard</h1>
      {renderDashboard()}
    </div>
  );
};

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <Card className="flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
        <div className="bg-light p-3 rounded-full">
            {icon}
        </div>
    </Card>
);

const MessageCard: React.FC<{ messages: Message[], currentUser: User | null }> = ({ messages, currentUser }) => {
    const getOtherUser = (msg: Message) => {
        const otherId = msg.senderId === currentUser?.id ? msg.receiverId : msg.senderId;
        return USERS.find(u => u.id === otherId);
    }
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-dark">Recent Messages</h2>
                <Link to="/messages" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
            {messages.length > 0 ? messages.map(msg => (
                <Link to="/messages" key={msg.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-light">
                    <img src={getOtherUser(msg)?.avatarUrl} alt="avatar" className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="font-semibold text-sm text-dark">{getOtherUser(msg)?.name}</p>
                            {!msg.read && msg.receiverId === currentUser?.id && (
                                <span className="h-2 w-2 rounded-full bg-primary mt-1"></span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{msg.text}</p>
                    </div>
                </Link>
            )) : (
                <div className="text-center py-8 text-gray-500">
                    <ChatBubbleLeftEllipsisIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm">No recent messages.</p>
                </div>
            )}
            </div>
        </Card>
    )
}

export default DashboardPage;
