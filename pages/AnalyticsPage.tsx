
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';

const savingsData = [
  { name: 'Jan', savings: 4000, loans: 2400 },
  { name: 'Feb', savings: 3000, loans: 1398 },
  { name: 'Mar', savings: 2000, loans: 9800 },
  { name: 'Apr', savings: 2780, loans: 3908 },
  { name: 'May', savings: 1890, loans: 4800 },
  { name: 'Jun', savings: 2390, loans: 3800 },
  { name: 'Jul', savings: 3490, loans: 4300 },
];

const memberDistributionData = [
  { name: 'Entrepreneurs', value: 25 },
  { name: 'Farmers', value: 12 },
  { name: 'Artisans', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Cooperative Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Savings vs Loans (RWF 000s)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="savings" fill="#3B82F6" />
              <Bar dataKey="loans" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Member Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={memberDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {memberDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
