import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { JOBS, APPLICATIONS, COOPERATIVES, TRANSACTIONS, INTERVIEWS } from '../constants';
import { ArrowTrendingUpIcon, BriefcaseIcon, BanknotesIcon, UsersIcon, CreditCardIcon, CalendarDaysIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const SeekerDashboard = () => {
      const myInterviews = INTERVIEWS.filter(i => i.seekerId === user?.id && i.status === 'Scheduled');
      return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Recommended Jobs" value={JOBS.length} icon={<BriefcaseIcon className="h-8 w-8 text-primary" />} />
                <StatCard title="Active Applications" value={APPLICATIONS.length} icon={<ArrowTrendingUpIcon className="h-8 w-8 text-accent" />} />
                <StatCard title="Wallet Balance" value={`RWF ${TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`} icon={<BanknotesIcon className="h-8 w-8 text-yellow-500" />} />
                <StatCard title="My Cooperatives" value={1} icon={<UsersIcon className="h-8 w-8 text-red-500" />} />
            </div>
            {myInterviews.length > 0 && (
                <div className="mt-8">
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
        </>
      )
  };

  const EmployerDashboard = () => {
      const myJobs = JOBS.filter(j => j.employerId === user?.id);
      const totalApplicants = APPLICATIONS.filter(a => myJobs.some(j => j.id === a.jobId)).length;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Active Job Postings" value={myJobs.length} icon={<BriefcaseIcon className="h-8 w-8 text-primary" />} />
            <StatCard title="Total Applicants" value={totalApplicants} icon={<UsersIcon className="h-8 w-8 text-accent" />} />
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

export default DashboardPage;