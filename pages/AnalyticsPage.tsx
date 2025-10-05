
import React from 'react';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400, jobs: 240 },
  { name: 'Feb', users: 300, jobs: 139 },
  { name: 'Mar', users: 200, jobs: 980 },
  { name: 'Apr', users: 278, jobs: 390 },
  { name: 'May', users: 189, jobs: 480 },
  { name: 'Jun', users: 239, jobs: 380 },
  { name: 'Jul', users: 349, jobs: 430 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Platform Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Growth">
           <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#005A9C" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
        <Card title="Job Postings">
           <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs" fill="#5E96C3" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
