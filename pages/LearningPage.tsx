
import React from 'react';
import Card from '../components/ui/Card';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const courses = [
  { id: 1, title: 'CV Writing Masterclass', duration: '45 mins', category: 'Job Seeking' },
  { id: 2, title: 'Interview Preparation Techniques', duration: '1 hr 15 mins', category: 'Job Seeking' },
  { id: 3, title: 'Introduction to Financial Literacy', duration: '2 hrs', category: 'Finance' },
  { id: 4, title: 'Starting a Small Business', duration: '3 hrs', category: 'Entrepreneurship' },
];

const LearningPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Learning Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Card key={course.id} className="!p-0 overflow-hidden">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
                <PlayCircleIcon className="h-16 w-16 text-white" />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-primary">{course.category}</p>
              <h2 className="text-lg font-bold text-dark mt-1">{course.title}</h2>
              <p className="text-xs text-gray-500 mt-2">{course.duration}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
