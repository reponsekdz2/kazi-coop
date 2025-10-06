
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useInterviews } from '../contexts/InterviewContext';
import { JOBS } from '../constants';

const statusColors: { [key: string]: string } = {
  Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Canceled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const InterviewsPage: React.FC = () => {
  const { interviews } = useInterviews();

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">My Interviews</h1>
      <Card>
        <div className="space-y-4">
          {interviews.map(interview => {
            const job = JOBS.find(j => j.id === interview.jobId);
            if (!job) return null;
            return (
              <div key={interview.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 dark:border-gray-700">
                <div>
                  <h2 className="font-bold text-dark dark:text-light">{job.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default InterviewsPage;