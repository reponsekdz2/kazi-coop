import React from 'react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { LEARNING_MODULES } from '../constants';
import { LearningModule } from '../types';

const LearningPage: React.FC = () => {
  const categories = [...new Set(LEARNING_MODULES.map(m => m.category))];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-2">Learning Hub</h1>
      <p className="text-gray-600 mb-8">Acquire new skills to boost your career and financial well-being.</p>
      
      <div className="space-y-12">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-dark mb-4 capitalize">{category.replace('-', ' ')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEARNING_MODULES.filter(m => m.category === category).map(module => (
                <LearningModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LearningModuleCard: React.FC<{ module: LearningModule }> = ({ module }) => {
  return (
    <Link to={`/learning/${module.id}`}>
        <Card className="!p-0 overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
                <img src={module.coverImageUrl} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40"></div>
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full text-white ${module.type === 'video' ? 'bg-red-500' : 'bg-blue-500'}`}>{module.type}</span>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{module.title}</h3>
                <p className="text-sm text-gray-500 mt-2 flex-grow">{module.content.summary}</p>
                <p className="text-xs text-gray-400 mt-4 self-start">{module.duration}</p>
            </div>
        </Card>
    </Link>
  );
};


export default LearningPage;
