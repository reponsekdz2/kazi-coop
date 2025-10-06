import React, { useState } from 'react';
import { LEARNING_MODULES } from '../constants';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { PlayCircleIcon, DocumentTextIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';

const LearningPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Entrepreneurship', 'Web Development', 'Soft Skills'];
  const featuredModule = LEARNING_MODULES.find(m => m.id === 'lm-3'); // Feature the new entrepreneurship module

  const filteredModules = activeCategory === 'All' 
    ? LEARNING_MODULES 
    : LEARNING_MODULES.filter(m => m.category === activeCategory);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">Learning Hub</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
        Enhance your skills with our curated collection of courses and articles designed to help you succeed in your career.
      </p>
      
      {featuredModule && <FeaturedModuleCard module={featuredModule} />}

      <div className="my-8">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
            {categories.map(category => (
                <button 
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                        activeCategory === category 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => <LearningModuleCard key={module.id} module={module} />)}
        </div>
      </div>
    </div>
  );
};

const FeaturedModuleCard: React.FC<{ module: typeof LEARNING_MODULES[0] }> = ({ module }) => (
    <Card className="!p-0 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {module.type === 'video' ? <PlayCircleIcon className="h-24 w-24 text-primary/50" /> : <DocumentTextIcon className="h-24 w-24 text-primary/50" />}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-2 text-sm font-semibold text-yellow-500 mb-2">
                <StarIcon className="h-5 w-5" />
                <span>Featured Module</span>
            </div>
            <p className="text-sm font-semibold text-primary">{module.category}</p>
            <h2 className="text-2xl font-bold text-dark dark:text-light mt-1 mb-2">{module.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{module.content.summary}</p>
            <Link to={`/learning/${module.id}`}>
                <button className="w-full md:w-auto px-4 py-2 rounded-md font-semibold text-sm transition-colors bg-primary text-white hover:bg-secondary">
                    Start Learning Now
                </button>
            </Link>
        </div>
    </Card>
);

const LearningModuleCard: React.FC<{ module: typeof LEARNING_MODULES[0] }> = ({ module }) => (
    <Card className="flex flex-col hover:shadow-xl transition-shadow">
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
);


export default LearningPage;