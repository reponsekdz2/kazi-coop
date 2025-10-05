import React from 'react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { ACTIVITY_LOG, USERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserPlusIcon, BriefcaseIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const userGrowthData = [
  { name: 'Jan', users: 400, jobs: 240 },
  { name: 'Feb', users: 300, jobs: 139 },
  { name: 'Mar', users: 200, jobs: 980 },
  { name: 'Apr', users: 278, jobs: 390 },
  { name: 'May', users: 189, jobs: 480 },
  { name: 'Jun', users: 239, jobs: 380 },
  { name: 'Jul', users: 349, jobs: 430 },
];

const memberRoleData = USERS.reduce((acc, user) => {
    const role = user.role;
    const existing = acc.find(item => item.name === role);
    if(existing) {
        existing.value += 1;
    } else {
        acc.push({ name: role, value: 1 });
    }
    return acc;
}, [] as {name: string, value: number}[]);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={UserPlusIcon} title="Total Users" value={USERS.length} trend={5} data={[15,18,20,22,25,26]}/>
        <StatCard icon={BriefcaseIcon} title="Active Jobs" value={4} trend={-1} data={[5,5,4,3,4,4]}/>
        <StatCard icon={BanknotesIcon} title="Total Savings (RWF)" value="48.7M" trend={8} data={[40,42,44,45,47,48.7]}/>
        <StatCard icon={ArrowTrendingUpIcon} title="User Growth (MoM)" value="5.2%" trend={2} data={[4,4.5,4.8,5.0,5.2]}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <Card title="User Growth vs. Job Postings">
               <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" name="New Users" fill="#005A9C" />
                      <Bar dataKey="jobs" name="New Jobs" fill="#5E96C3" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Member Demographics by Role">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={memberRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {memberRoleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Platform Activity Feed">
                <div className="space-y-4 max-h-[720px] overflow-y-auto">
                    {ACTIVITY_LOG.map(log => (
                        <div key={log.id} className="flex items-start">
                            <div className="bg-light p-2 rounded-full mr-3 mt-1">
                                {log.type === 'NEW_MEMBER' && <UserPlusIcon className="h-5 w-5 text-primary"/>}
                                {log.type === 'NEW_JOB' && <BriefcaseIcon className="h-5 w-5 text-primary"/>}
                                {log.type === 'SAVINGS_GOAL' && <ArrowTrendingUpIcon className="h-5 w-5 text-accent"/>}
                                {log.type === 'LARGE_DEPOSIT' && <BanknotesIcon className="h-5 w-5 text-green-500"/>}
                            </div>
                            <div>
                                <p className="text-sm text-dark">{log.description}</p>
                                <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;