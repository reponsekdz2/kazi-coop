import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { USERS } from '../constants';
import { UserRole } from '../types';
import SeekerProfileModal from '../components/ui/SeekerProfileModal';

const experienceData = [
    { name: '0-1 Years', count: 5 },
    { name: '1-3 Years', count: 12 },
    { name: '3-5 Years', count: 8 },
    { name: '5+ Years', count: 4 },
];

const COLORS = ['#005A9C', '#10B981', '#5E96C3', '#F59E0B', '#8B5CF6'];

const UserAnalyticsPage: React.FC = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<(typeof USERS[0]) | null>(null);

    const handleViewProfile = (user: typeof USERS[0]) => {
        setSelectedUser(user);
        setIsProfileModalOpen(true);
    };

    const topSkillsData = useMemo(() => {
        const skillCounts: {[key: string]: number} = {};
        USERS.filter(u => u.role === UserRole.SEEKER && u.skills).forEach(user => {
            user.skills!.forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });
        return Object.entries(skillCounts)
            .sort(([,a],[,b]) => b-a)
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
    }, []);

  return (
    <div>
        <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">User Talent Pool Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Top Skills Distribution">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={topSkillsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                             {topSkillsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip />
                    </PieChart>
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
            <Card title="Talent Pool Browser">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {USERS.filter(u => u.role === 'Job Seeker').map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-light dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => handleViewProfile(user)}>
                            <div className="flex items-center gap-4">
                                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-dark dark:text-light">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.skills?.slice(0,3).join(', ')}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-primary">View Profile</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        {selectedUser && (
            <SeekerProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={selectedUser}
            />
        )}
    </div>
  );
};

export default UserAnalyticsPage;
