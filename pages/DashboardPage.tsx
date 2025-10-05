import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import { APPLICATIONS, JOBS, USERS } from '../constants';
import { ArrowTrendingUpIcon, BanknotesIcon, BriefcaseIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('dashboard.welcome').replace('{name}', user?.name.split(' ')[0] || '')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title={t('dashboard.activeApplications')} value={3} trend={1} data={[1,2,2,3]}/>
                <StatCard icon={UserGroupIcon} title={t('dashboard.interviewsScheduled')} value={1} trend={1} data={[0,0,1,1]}/>
                <StatCard icon={BanknotesIcon} title={t('dashboard.totalSavings')} value="RWF 550k" trend={10} data={[200, 300, 450, 550]}/>
                <StatCard icon={ArrowTrendingUpIcon} title={t('dashboard.profileViews')} value={28} trend={15} data={[10, 15, 22, 28]}/>
            </div>
            <Card title={t('dashboard.careerJourney')} className="mb-6">
                <CareerProgressTracker currentStep={3} />
            </Card>
            <Card title={t('dashboard.recommendedJobs')}>
                {JOBS.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-b-0">
                        <div>
                            <p className="font-bold text-dark dark:text-light">{job.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} - {job.location}</p>
                        </div>
                        <Link to="/jobs"><Button variant="secondary">{t('dashboard.view')}</Button></Link>
                    </div>
                ))}
            </Card>
        </div>
    );
};

const EmployerDashboard: React.FC = () => {
    const { t } = useAppContext();
    const applicantsData = JOBS.map(job => ({
        name: job.title.split(' ').slice(0,2).join(' '),
        applicants: APPLICATIONS.filter(a => a.jobId === job.id).length
    }));

    const { theme } = useAppContext();
    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.3)';
    const tooltipBg = theme === 'dark' ? '#2D3748' : '#FFFFFF';
    const tooltipBorder = theme === 'dark' ? '#4A5568' : '#E5E7EB';

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('dashboard.employerDashboard')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title={t('dashboard.activePostings')} value={JOBS.length} trend={0} data={[3,4,4,4]}/>
                <StatCard icon={UserPlusIcon} title={t('dashboard.newApplicants')} value={APPLICATIONS.length} trend={5} data={[10, 12, 15, 18]}/>
                <StatCard icon={UserGroupIcon} title={t('dashboard.interviewsToday')} value={2} trend={-1} data={[3,3,2,2]}/>
                <StatCard icon={ArrowTrendingUpIcon} title={t('dashboard.avgMatchScore')} value="85%" trend={2} data={[80, 82, 83, 85]}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={t('dashboard.applicantsPerJob')}>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={applicantsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                            <XAxis dataKey="name" tick={{ fill: axisColor }} />
                            <YAxis allowDecimals={false} tick={{ fill: axisColor }} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
                            <Legend wrapperStyle={{ color: axisColor }} />
                            <Bar dataKey="applicants" fill="#005A9C" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title={t('dashboard.recentApplicants')}>
                    {APPLICATIONS.slice(0,4).map(app => {
                        const user = USERS.find(u => u.id === app.userId);
                        const job = JOBS.find(j => j.id === app.jobId);
                        if(!user || !job) return null;
                        return (
                            <div key={app.id} className="flex items-center justify-between p-3 border-b dark:border-gray-700 last:border-b-0">
                                <div className="flex items-center">
                                    <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full mr-3"/>
                                    <div>
                                        <p className="font-bold text-dark dark:text-light">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.appliedFor').replace('{jobTitle}', job.title)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary">{app.matchScore}%</p>
                                    <p className="text-xs text-gray-400">Match</p>
                                </div>
                            </div>
                        )
                    })}
                </Card>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    if (user?.role === UserRole.SEEKER) {
        return <SeekerDashboard />;
    }
    if (user?.role === UserRole.EMPLOYER) {
        return <EmployerDashboard />;
    }
    // Fallback or Admin dashboard
    return <EmployerDashboard />;
};

export default DashboardPage;