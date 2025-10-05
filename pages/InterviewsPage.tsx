
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const interviews = [
  { id: 1, jobTitle: 'Frontend Developer', company: 'TechSolutions Ltd.', date: '2024-08-15T10:00:00Z', type: 'Online', status: 'Scheduled' },
  { id: 2, jobTitle: 'UX/UI Designer', company: 'Creative Minds Inc.', date: '2024-08-18T14:30:00Z', type: 'In-Person', status: 'Scheduled' },
  { id: 3, jobTitle: 'Project Manager', company: 'BuildIt Rwanda', date: '2024-08-12T09:00:00Z', type: 'Online', status: 'Completed' },
];

const statusColors: { [key: string]: string } = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Canceled: 'bg-red-100 text-red-800',
};

const InterviewsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Interviews</h1>
      <Card>
        <div className="space-y-4">
          {interviews.map(interview => (
            <div key={interview.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-bold text-dark">{interview.jobTitle}</h2>
                <p className="text-sm text-gray-600">{interview.company}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(interview.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} ({interview.type})
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[interview.status] || ''}`}>
                  {interview.status}
                </span>
                <Button variant="secondary">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InterviewsPage;
