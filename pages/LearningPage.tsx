

import React from 'react';
import { LEARNING_MODULES } from '../constants';
import Card from '../components/ui/Card';
// FIX: Changed import to 'react-router' to resolve module export errors.
import { Link } from 'react-router';
import { PlayCircleIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/solid';

const LearningPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Learning Hub</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
        Enhance your skills with our curated collection of courses and articles designed to help you succeed in your career.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARNING_MODULES.map(module => (
          <Card key={module.id} className="flex flex-col hover:shadow-xl transition-shadow">
            <div className="flex-grow">
                <div className="relative mb-4">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {module.type === 'video' ? <PlayCircleIcon className="h-16 w-16 text-primary/50" /> : <DocumentTextIcon className="h-16 w-16 text-primary/50" />}
                    </div>
                </div>
                <p className="text-sm font-semibold text-primary">{module.category}</p>
                <h2 className="text-xl font-bold text-dark dark:text-light mt-1 mb-2">{module.title}</h2>
                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4 mb-2">
                    <div className="flex items-center gap-1">
                        {module.type === 'video' ? <PlayCircleIcon className="h-4 w-4" /> : <DocumentTextIcon className="h-4 w-4" />}
                        <span className="capitalize">{module.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{module.duration}</span>
                    </div>
                 </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{module.content.summary}</p>
            </div>
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${module.progress}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                    <span>Progress</span>
                    <span>{module.progress}% complete</span>
                </div>
                <Link to={`/learning/${module.id}`}>
                    <button className="w-full mt-4 px-4 py-2 rounded-md font-semibold text-sm transition-colors bg-primary/10 text-primary hover:bg-primary hover:text-white">
                        {module.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </button>
                </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
