

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Application, UserRole } from '../types';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/layout/Button';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import { APPLICATIONS, JOBS, USERS, INTERVIEWS } from '../constants';
import { ArrowTrendingUpIcon, BanknotesIcon, BriefcaseIcon, CalendarDaysIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// FIX: Changed import to 'react-router' to resolve module export errors.
import { Link } from 'react-router';
import { useAppContext } from '../contexts/AppContext';
import RingProgress from '../components/layout/RingProgress';

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{`Welcome back, ${user?.name.split(' ')[0] || ''}!`}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title="Active Applications" value={3} trend={1} data={[1,2,2,3]}/>
                <StatCard icon={UserGroupIcon} title="Scheduled Interviews" value={1} trend={1} data={[0,0,1,1]}/>
                <StatCard icon={BanknotesIcon} title="Cooperative Savings" value="RWF 550k" trend={10} data={[200, 300, 450, 550]}/>
                <Card className="flex flex-col items-center justify-center p-4 dark:bg-dark">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Profile Strength</h3>
                    <RingProgress percentage={Math.round((user?.careerProgress || 0) / 5 * 100)} size={90} strokeWidth={8} />
                </Card>
            </div>
            <Card title="Your Career Journey" className="mb-6 dark:bg-dark">
                <CareerProgressTracker currentStep={user?.careerProgress || 0} />
            </Card>
            <Card title="Jobs Recommended For You" className="dark:bg-dark">
                {JOBS.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-b-0">
                        <div>
                            <p className="font-bold text-dark dark:text-light">{job.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} - {job.location}</p>
                        </div>
                        <Link to="/jobs"><Button variant="secondary">View Details</Button></Link>
                    </div>
                ))}
            </Card>
        </div>
    );
};

const EmployerDashboard: React.FC = () => {
    const { theme } = useAppContext();
    
    // Chart Colors & Config
    const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.3)';
    const tooltipBg = theme === 'dark' ? '#2D3748' : '#FFFFFF';
    const tooltipBorder = theme === 'dark' ? '#4A5568' : '#E5E7EB';
    const COLORS = ['#005A9C', '#5E96C3', '#10B981', '#F59E0B', '#EF4444'];
    
    // Data processing
    const applicationStatuses: Application['status'][] = ['Applied', 'Reviewed', 'Interviewing', 'Offered', 'Rejected'];
    const applicationStatusData = applicationStatuses
        .map((status, index) => ({
            name: status,
            value: APPLICATIONS.filter(a => a.status === status).length,
            fill: COLORS[index % COLORS.length]
        }));
        
    const applicationTrendData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (6 - i) * 86400000);
        const dateString = date.toLocaleDateString('en-CA');
        const count = APPLICATIONS.filter(a => new Date(a.submissionDate).toLocaleDateString('en-CA') === dateString).length;
        return { name: date.toLocaleDateString('en-US', { weekday: 'short' }), applications: count };
    });

    const upcomingInterviews = INTERVIEWS
        .filter(i => new Date(i.date) >= new Date())
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4);

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Employer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title="Active Job Postings" value={JOBS.length} trend={0} data={[3,4,4,4]}/>
                <StatCard icon={UserPlusIcon} title="New Applicants" value={APPLICATIONS.length} trend={5} data={[10, 12, 15, 18]}/>
                <StatCard icon={CalendarDaysIcon} title="Interviews This Week" value={upcomingInterviews.length} trend={-1} data={[3,3,2,2]}/>
                <StatCard icon={ArrowTrendingUpIcon} title="Average Applicant Match" value="85%" trend={2} data={[80, 82, 83, 85]}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Recent Application Trends" className="lg:col-span-3">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={applicationTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                            <XAxis dataKey="name" tick={{ fill: axisColor }} />
                            <YAxis allowDecimals={false} tick={{ fill: axisColor }} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
                            <Legend wrapperStyle={{ color: axisColor }} />
                            <Line type="monotone" dataKey="applications" name="New Applications" stroke="#005A9C" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Applicant Pipeline" className="lg:col-span-1">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: The 'percent' property from recharts can be a non-numeric type, causing a TypeScript error. Explicitly casting it to a Number ensures the multiplication is safe. */}
                            <Pie data={applicationStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(Number(percent ?? 0) * 100).toFixed(0)}%`}>
                                {applicationStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Upcoming Interviews" className="lg:col-span-2">
                    {upcomingInterviews.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingInterviews.map(interview => {
                                const user = USERS.find(u => u.id === interview.userId);
                                const job = JOBS.find(j => j.id === interview.jobId);
                                if (!user || !job) return null;
                                return (
                                    <div key={interview.id} className="flex items-center justify-between p-3 rounded-lg bg-light dark:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-dark dark:text-light">{user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{`For: ${job.title}`}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-dark dark:text-light">{new Date(interview.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(interview.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                             <CalendarDaysIcon className="h-12 w-12 text-gray-400 mb-2"/>
                            <p>No interviews are scheduled for the upcoming week.</p>
                        </div>
                    )}
                     <div className="mt-4 text-right">
                        <Link to="/interviews">
                            <Button variant="secondary">View Full Schedule</Button>
                        </Link>
                    </div>
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