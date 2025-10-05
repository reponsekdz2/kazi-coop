
import React from 'react';
import Card from '../components/ui/Card';
import { LEARNING_RESOURCES, BADGES } from '../constants';
import { Badge } from '../types';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const LearningPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Learning & Gamification</h1>
      
      <Card title="My Achievements" className="mb-6">
        <div className="flex flex-wrap gap-4">
            {BADGES.map(badge => (
                <BadgeItem key={badge.id} badge={badge} />
            ))}
        </div>
      </Card>
      
      <Card title="Learning Center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_RESOURCES.map(resource => (
            <div key={resource.id} className="rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <div className="relative">
                    <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircleIcon className="h-16 w-16 text-white"/>
                    </div>
                </div>
                <div className="p-4 bg-white">
                    <h3 className="font-bold text-dark">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{resource.duration}</p>
                </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const BadgeItem: React.FC<{badge: Badge}> = ({badge}) => (
    <div className={`text-center p-4 rounded-lg w-36 ${badge.unlocked ? 'bg-amber-100 border border-amber-300' : 'bg-gray-100 border border-gray-200'}`}>
        <span className="text-4xl">{badge.icon}</span>
        <p className={`font-bold mt-2 ${badge.unlocked ? 'text-amber-800' : 'text-gray-600'}`}>{badge.name}</p>
        <p className={`text-xs ${badge.unlocked ? 'text-amber-600' : 'text-gray-400'}`}>{badge.description}</p>
        {!badge.unlocked && <div className="absolute inset-0 bg-white bg-opacity-50"></div>}
    </div>
);


export default LearningPage;
