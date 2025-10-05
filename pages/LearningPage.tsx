import React from 'react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { LEARNING_MODULES, LEARNING_PATHS } from '../constants';
import { LearningModule } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../contexts/AppContext';

const PersonalizedLearningPath: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const path = LEARNING_PATHS.find(p => p.relevantGoal === user?.careerGoal);

    if (!user || !path) {
        return null; // Don't show if no user or no matching path
    }
    
    const pathModules = path.moduleIds.map(id => LEARNING_MODULES.find(m => m.id === id)).filter(Boolean) as LearningModule[];

    return (
        <Card className="mb-12 bg-gradient-to-r from-primary to-secondary text-white dark:from-gray-800 dark:to-dark">
            <h2 className="text-xl font-bold mb-1 opacity-80">{t('learning.yourPath')}</h2>
            <h3 className="text-3xl font-bold mb-2">{path.title}</h3>
            <p className="opacity-90 mb-6">{path.description}</p>
            <div className="relative flex items-center py-4">
                {/* Dashed line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50 border-t-2 border-dashed border-white/50 transform -translate-y-1/2"></div>
                
                <div className="relative flex justify-between w-full">
                    {pathModules.map((module, index) => {
                        const isCompleted = user.completedModuleIds?.includes(module.id);
                        const isNext = !isCompleted && (index === 0 || user.completedModuleIds?.includes(pathModules[index - 1].id));
                        
                        return (
                            <Link to={`/learning/${module.id}`} key={module.id} className="flex flex-col items-center text-center z-10 w-1/3 px-2 group">
                                <div className={`relative h-16 w-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isNext ? 'border-accent bg-white scale-110' : isCompleted ? 'border-accent bg-accent' : 'border-white/50 bg-primary'}`}>
                                    {isCompleted ? (
                                        <CheckCircleIcon className="h-8 w-8 text-white" />
                                    ) : (
                                        <div className={`h-12 w-12 rounded-full bg-cover bg-center`} style={{backgroundImage: `url(${module.coverImageUrl})`}} />
                                    )}
                                </div>
                                <p className={`mt-2 text-xs font-semibold group-hover:text-accent transition-colors ${isNext ? 'text-accent' : 'text-white'}`}>{module.title}</p>
                                {isNext && <span className="mt-1 text-xs px-2 py-0.5 bg-accent rounded-full text-white">{t('learning.nextUp')}</span>}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};


const LearningPage: React.FC = () => {
  const { t } = useAppContext();
  const categories = [...new Set(LEARNING_MODULES.map(m => m.category))];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">{t('learning.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{t('learning.subtitle')}</p>
      
      <PersonalizedLearningPath />

      <div className="space-y-12">
        {categories.map(category => {
          const translationKey = `learning.categories.${category.toLowerCase().replace(/[\s-]/g, '')}`;
          const translatedCategory = t(translationKey);
          const categoryDisplayName = translatedCategory === translationKey ? category : translatedCategory;
          
          return (
            <div key={category}>
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4 capitalize">{categoryDisplayName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LEARNING_MODULES.filter(m => m.category === category).map(module => (
                  <LearningModuleCard key={module.id} module={module} />
                ))}
              </div>
            </div>
          );
        })}
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
                <h3 className="text-lg font-bold text-dark dark:text-light group-hover:text-primary transition-colors">{module.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow">{module.content.summary}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 self-start">{module.duration}</p>
            </div>
        </Card>
    </Link>
  );
};


export default LearningPage;