

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { BriefcaseIcon, UserGroupIcon, WalletIcon, ArrowUpIcon, BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import { useApplications } from '../contexts/ApplicationContext';
import { useJobs } from '../contexts/JobContext';
import { useCooperative } from '../contexts/CooperativeContext';
import Button from '../components/layout/Button';
import { Link } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
// FIX: Added missing import for USERS constant.
import { USERS } from '../constants';


const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { applications } = useApplications();
    const { balance } = useTransactions();
    const activeApplications = applications.filter(a => a.status !== 'Offered' && a.status !== 'Rejected');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-dark dark:text-light">Welcome back, {user?.name.split(' ')[0]}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BriefcaseIcon} title="Active Applications" value={activeApplications.length} trend={2} />
                <StatCard icon={WalletIcon} title="Wallet Balance" value={`RWF ${balance.toLocaleString()}`} trend={5} />
                <StatCard icon={UserGroupIcon} title="My Cooperatives" value={1} trend={0} />
                <StatCard icon={ArrowUpIcon} title="Profile Views" value="28" trend={15} />
            </div>

            <Card title="Your Career Progress">
                <CareerProgressTracker currentStep={user?.careerProgress || 1} />
            </Card>

             <Card title="Recent Applications">
                {activeApplications.length > 0 ? (
                    <div className="space-y-3">
                        {activeApplications.slice(0, 3).map(app => (
                             <div key={app.id} className="p-3 bg-light dark:bg-dark rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-dark dark:text-light">{useJobs().jobs.find(j => j.id === app.jobId)?.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: <span className="font-semibold text-primary">{app.status}</span></p>
                                </div>
                                <Button size="sm" variant="secondary">View</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">You haven't applied for any jobs yet.</p>
                        <Link to="/jobs"><Button className="mt-4">Find Jobs</Button></Link>
                    </div>
                )}
            </Card>

        </div>
    );
};

const EmployerDashboard: React.FC = () => {
    const { jobs } = useJobs();
    const { applications } = useApplications();
    const { cooperatives } = useCooperative();
    const openJobs = jobs.filter(j => j.status === 'Open').length;
    const newApplicants = applications.filter(a => a.status === 'Applied').length;

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-dark dark:text-light">Employer Dashboard</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BriefcaseIcon} title="Open Positions" value={openJobs} trend={1} />
                <StatCard icon={BellAlertIcon} title="New Applicants" value={newApplicants} trend={5} />
                <StatCard icon={UserGroupIcon} title="Managed Cooperatives" value={cooperatives.length} trend={0} />
                <StatCard icon={ClockIcon} title="Pending Interviews" value={2} trend={-1} />
            </div>
             <Card title="Recent Applicants">
                {applications.length > 0 ? (
                     <div className="space-y-3">
                        {applications.slice(0, 4).map(app => (
                            <div key={app.id} className="p-3 bg-light dark:bg-dark rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-dark dark:text-light">{USERS.find(u => u.id === app.userId)?.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied for {jobs.find(j => j.id === app.jobId)?.title}</p>
                                </div>
                               <Button size="sm" variant="secondary">View Applicant</Button>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500">No applicants yet.</p>}
             </Card>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    if (!user) {
        return <div>Loading...</div>; // Or a spinner
    }

    return user.role === UserRole.EMPLOYER ? <EmployerDashboard /> : <SeekerDashboard />;
};

export default DashboardPage;