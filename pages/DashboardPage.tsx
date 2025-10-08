import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import { useJobs } from '../contexts/JobContext';
import { useApplications } from '../contexts/ApplicationContext';
import { useCooperative } from '../contexts/CooperativeContext';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import StatCard from '../components/ui/StatCard';
import { BriefcaseIcon, UserGroupIcon, DocumentDuplicateIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Card>Loading dashboard...</Card>;
  }

  if (!user) {
    // This case should ideally be handled by PrivateRoute, but as a fallback:
    return <Card>Please log in to view the dashboard.</Card>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-4">
        Welcome back, {user.name.split(' ')[0]}!
      </h1>
      {user.role === UserRole.SEEKER ? <SeekerDashboard /> : <EmployerDashboard />}
    </div>
  );
};

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { jobs } = useJobs();
    const { applications } = useApplications();
    const { userCooperatives } = useCooperative();

    const savedJobs = jobs.filter(j => j.isSaved).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Applications" value={applications.length} trend={0} icon={DocumentDuplicateIcon} data={[1,2,2,3,4,4]} />
                <StatCard title="Saved Jobs" value={savedJobs} trend={0} icon={BriefcaseIcon} data={[1,1,2,2,3,2]}/>
                <StatCard title="My Cooperatives" value={userCooperatives.length} trend={0} icon={UserGroupIcon} data={[0,1,1,1,1,1]}/>
                <StatCard title="Completed Courses" value={0} trend={0} icon={UserPlusIcon} data={[0,0,0,0,0,0]}/>
            </div>
            <Card title="My Career Path">
                <p className="text-gray-500 mb-4">You're on your way! Here's a look at your progress toward landing your next role.</p>
                <CareerProgressTracker currentStep={user?.careerProgress || 0} />
            </Card>
            <Card title="Recommended for You">
                <p>Based on your profile, here are some jobs you might be interested in.</p>
                {/* A more complex component would go here */}
                <div className="mt-4">
                    <Link to="/jobs"><Button>Browse all jobs</Button></Link>
                </div>
            </Card>
        </div>
    );
};

const EmployerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { jobs } = useJobs();
    
    // In a real app, applications would be fetched for the employer's jobs
    const myJobs = jobs.filter(j => j.employerId === user?.id);
    const totalApplicants = 5; // Mocked

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Open Positions" value={myJobs.filter(j => j.status === 'Open').length} trend={0} icon={BriefcaseIcon} />
                <StatCard title="Total Applicants" value={totalApplicants} trend={0} icon={UserPlusIcon} />
                <StatCard title="Cooperatives Managed" value={1} trend={0} icon={UserGroupIcon} />
            </div>
            <Card title="Recent Applicants">
                 <p>Review the latest candidates who have applied to your job postings.</p>
                 <div className="mt-4">
                    <Link to="/user-analytics"><Button>View Talent Pool</Button></Link>
                </div>
            </Card>
        </div>
    );
};


export default DashboardPage;
