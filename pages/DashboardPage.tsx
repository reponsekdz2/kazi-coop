import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Application, UserRole } from '../types';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/layout/Button';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import { APPLICATIONS, JOBS, USERS, INTERVIEWS, COMPANIES } from '../constants';
// FIX: Imported PlusIcon to resolve 'Cannot find name' error.
import { ArrowTrendingUpIcon, BanknotesIcon, BriefcaseIcon, CalendarDaysIcon, UserGroupIcon, UserPlusIcon, WalletIcon, AcademicCapIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import RingHub from '../components/layout/RingHub';

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { theme } = useAppContext();

    const hubItems = [
      { id: 'jobs', label: 'Find Jobs', imageUrl: `https://i.pravatar.cc/150?u=jobs-icon`},
      { id: 'wallet', label: 'My Wallet', imageUrl: `https://i.pravatar.cc/150?u=wallet-icon` },
      { id: 'cooperatives', label: 'Ikimina', imageUrl: `https://i.pravatar.cc/150?u=coop-icon` },
      { id: 'learning', label: 'Learning Hub', imageUrl: `https://i.pravatar.cc/150?u=learn-icon` }
    ];

    const handleHubSelect = (id: string) => {
      navigate(`/${id}`);
    };

    const userApplications = APPLICATIONS.filter(app => app.userId === user?.id);
    const appStatusColors: { [key in Application['status']]: string } = {
        Applied: '#5E96C3',
        Reviewed: '#F59E0B',
        Interviewing: '#10B981',
        'Interview Scheduled': '#005A9C',
        Offered: '#8B5CF6',
        Rejected: '#EF4444',
    };
    const applicationStatusData = Object.entries(
        userApplications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<Application['status'], number>)
    ).map(([name, value]) => ({ name, value, fill: appStatusColors[name as Application['status']] }));


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{`Welcome back, ${user?.name.split(' ')[0] || ''}!`}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2 flex items-center justify-center p-4">
                     <RingHub items={hubItems} onSelect={handleHubSelect}>
                        <div className="text-center">
                            <img src={user?.avatarUrl} className="h-16 w-16 rounded-full mx-auto border-2 border-primary" alt="user"/>
                            <p className="font-bold text-dark mt-2 text-sm">Main Menu</p>
                        </div>
                    </RingHub>
                </Card>

                <div className="lg:col-span-1 space-y-6">
                    <Card title="Your Career Journey">
                        <CareerProgressTracker currentStep={user?.careerProgress || 0} />
                    </Card>
                    <Card title="Application Status">
                        {userApplications.length > 0 ? (
                             <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={applicationStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={3}
                                    >
                                        {applicationStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} application(s)`} />
                                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-full text-center text-gray-500">
                                <div>
                                    <BriefcaseIcon className="h-10 w-10 mx-auto text-gray-400 mb-2"/>
                                    <p>You haven't applied to any jobs yet.</p>
                                </div>
                            </div>
                        )}
                       
                    </Card>
                </div>
            </div>
           
            <Card title="Jobs Recommended For You" className="dark:bg-dark">
                {JOBS.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-b-0">
                        <div>
                            <p className="font-bold text-dark dark:text-light">{job.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{COMPANIES.find(c => c.id === job.companyId)?.name} - {job.location}</p>
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
    
    // Data processing
    const applicantFunnelData = [
        { name: 'Applied', value: APPLICATIONS.length },
        { name: 'Reviewed', value: APPLICATIONS.filter(a => ['Reviewed', 'Interviewing', 'Offered'].includes(a.status)).length },
        { name: 'Interviewing', value: APPLICATIONS.filter(a => ['Interviewing', 'Offered'].includes(a.status)).length },
        { name: 'Offered', value: APPLICATIONS.filter(a => a.status === 'Offered').length },
    ];
        
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
                <Link to="/jobs"><StatCard icon={BriefcaseIcon} title="Active Job Postings" value={JOBS.filter(j => j.status === 'Open').length} trend={0} data={[3,4,4,4]}/></Link>
                <Link to="/jobs"><StatCard icon={UserPlusIcon} title="New Applicants" value={APPLICATIONS.length} trend={5} data={[10, 12, 15, 18]}/></Link>
                <Link to="/interviews"><StatCard icon={CalendarDaysIcon} title="Interviews This Week" value={upcomingInterviews.length} trend={-1} data={[3,3,2,2]}/></Link>
                <Link to="/user-analytics"><StatCard icon={ArrowTrendingUpIcon} title="Talent Pool Size" value={USERS.filter(u => u.role === UserRole.SEEKER).length} trend={2} data={[80, 82, 83, 85]}/></Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Recent Application Trends" className="lg:col-span-2">
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

                 <Card title="Quick Actions" className="lg:col-span-1">
                    <div className="space-y-3">
                        <QuickActionLink to="/jobs" icon={PlusIcon} text="Post a New Job"/>
                        <QuickActionLink to="/jobs" icon={BriefcaseIcon} text="Manage Applicants"/>
                        <QuickActionLink to="/cooperatives" icon={UserGroupIcon} text="Manage Cooperatives"/>
                        <QuickActionLink to="/wallet" icon={WalletIcon} text="View Company Wallet"/>
                    </div>
                 </Card>

                 <Card title="Applicant Funnel" className="lg:col-span-3">
                     <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={applicantFunnelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                            <XAxis type="number" tick={{ fill: axisColor }} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: axisColor }} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
                            <Bar dataKey="value" name="Applicants" fill="#005A9C" barSize={30}>
                                {applicantFunnelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.2)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </Card>
            </div>
        </div>
    );
};

const QuickActionLink: React.FC<{to: string, icon: React.ElementType, text: string}> = ({ to, icon: Icon, text }) => (
    <Link to={to} className="flex items-center justify-between p-3 rounded-lg bg-light dark:bg-gray-700/50 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary"/>
            <p className="font-semibold text-dark dark:text-light">{text}</p>
        </div>
        <ArrowRightIcon className="h-4 w-4 text-gray-400"/>
    </Link>
);


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