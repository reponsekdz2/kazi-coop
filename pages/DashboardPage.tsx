import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RingProgress from '../components/ui/RingProgress';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BriefcaseIcon, UserGroupIcon, WalletIcon, ChartPieIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { JOBS, APPLICATIONS, SAVINGS_GOALS, COOPERATIVES } from '../constants';
// FIX: Imported `CartesianGrid` from recharts.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.SEEKER:
        return <SeekerDashboard />;
      case UserRole.EMPLOYER:
        return <EmployerDashboard />;
      case UserRole.COOP_ADMIN:
        return <AdminDashboard />;
      default:
        return <p>Loading dashboard...</p>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

// --- Seeker Dashboard ---
const SeekerDashboard: React.FC = () => {
  const goal = SAVINGS_GOALS[0];
  const goalProgress = Math.round((goal.currentAmount / goal.targetAmount) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Profile Completeness">
              <div className="flex items-center justify-center h-full">
                <RingProgress percentage={75} size={120} />
              </div>
          </Card>
          <Card title="My Savings Goal">
              <div className="flex flex-col items-center justify-center h-full">
                <RingProgress percentage={goalProgress} size={120} />
                <p className="text-center text-sm mt-2 text-gray-600">Towards '{goal.name}'</p>
              </div>
          </Card>
          <div className="lg:col-span-2">
            <Card title="Quick Actions" className="h-full">
                <div className="grid grid-cols-2 gap-4 h-full content-center">
                    <Button className="!py-4 !text-base"><BriefcaseIcon className="h-5 w-5 mr-2 inline" /> Find Jobs</Button>
                    <Button className="!py-4 !text-base"><UserGroupIcon className="h-5 w-5 mr-2 inline" /> My Cooperative</Button>
                    <Button className="!py-4 !text-base"><WalletIcon className="h-5 w-5 mr-2 inline" /> Go to Wallet</Button>
                    <Button className="!py-4 !text-base"><CheckCircleIcon className="h-5 w-5 mr-2 inline" /> My Applications</Button>
                </div>
            </Card>
          </div>
      </div>
      <Card title="Recommended Jobs For You">
        {JOBS.slice(0, 3).map(job => (
          <div key={job.id} className="flex justify-between items-center p-3 hover:bg-light rounded-md border-b last:border-0">
            <div>
              <p className="font-bold text-dark">{job.title}</p>
              <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
            </div>
            <Link to={`/jobs`}>
              <Button variant="secondary">View Details</Button>
            </Link>
          </div>
        ))}
      </Card>
    </div>
  );
};

// --- Employer Dashboard ---
const EmployerDashboard: React.FC = () => {
    const totalApplicants = APPLICATIONS.length;
    const interviewingApplicants = APPLICATIONS.filter(a => a.status === 'Interviewing').length;
    const interviewRate = totalApplicants > 0 ? Math.round((interviewingApplicants / totalApplicants) * 100) : 0;
    
    const statusCounts = APPLICATIONS.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});
    const funnelData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));

    return (
     <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Active Job Postings" value={JOBS.length} />
            <StatCard title="Total Applicants" value={totalApplicants} />
            <Card title="Interview Rate">
                <div className="flex items-center justify-center h-full">
                    <RingProgress percentage={interviewRate} size={100} />
                </div>
            </Card>
        </div>
        <Card title="Hiring Funnel">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Applicants" fill="#005A9C" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
     </div>
    );
};

// --- Admin Dashboard ---
const AdminDashboard: React.FC = () => {
    const coop = COOPERATIVES.find(c => c.id === 'coop3');
    if(!coop) return null;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const memberData = [
        { name: "Active Members", value: coop.members.filter(m => m.cooperativeStatus === 'Member').length},
        { name: "Pending Members", value: coop.members.filter(m => m.cooperativeStatus === 'Pending').length},
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-dark">Cooperative Management: {coop.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Members" value={coop.members.length} />
                <StatCard title="Total Savings" value={`RWF ${coop.savings.toLocaleString()}`} />
                 <Card title="Loan Repayment Rate">
                    <div className="flex items-center justify-center h-full">
                        <RingProgress percentage={88} size={100} />
                    </div>
                </Card>
                 <Card title="Membership Growth">
                    <div className="flex items-center justify-center h-full">
                        <RingProgress percentage={15} size={100} />
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Member Status">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={memberData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {memberData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Quick Actions">
                    <div className="flex flex-col space-y-4 justify-center h-full">
                        <Link to="/cooperatives"><Button className="!py-4 !text-base w-full">Manage Members</Button></Link>
                        <Link to="/analytics"><Button className="!py-4 !text-base w-full">View Full Analytics</Button></Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <Card>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-dark mt-2">{value}</p>
    </Card>
);

export default DashboardPage;