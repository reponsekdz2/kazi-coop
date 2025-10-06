import React from 'react';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { USERS } from '../constants';

const skillData = [
  { skill: 'React', count: 15, fullMark: 20 },
  { skill: 'TypeScript', count: 12, fullMark: 20 },
  { skill: 'Node.js', count: 10, fullMark: 20 },
  { skill: 'Project Mgmt', count: 18, fullMark: 20 },
  { skill: 'SQL', count: 9, fullMark: 20 },
  { skill: 'UX/UI', count: 7, fullMark: 20 },
];

const experienceData = [
    { name: '0-1 Years', count: 5 },
    { name: '1-3 Years', count: 12 },
    { name: '3-5 Years', count: 8 },
    { name: '5+ Years', count: 4 },
];

const UserAnalyticsPage: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-dark mb-6">User Talent Pool Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Available Skills in Talent Pool">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis />
                        <Radar name="Users" dataKey="count" stroke="#005A9C" fill="#005A9C" fillOpacity={0.6} />
                         <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Candidate Experience Levels">
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={experienceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Candidates" fill="#5E96C3" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
        <div className="mt-6">
            <Card title="Recent Job Seeker Signups">
                <div className="space-y-3">
                    {USERS.filter(u => u.role === 'Job Seeker').slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center p-2 rounded hover:bg-light">
                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-dark">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.skills?.slice(0,3).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default UserAnalyticsPage;