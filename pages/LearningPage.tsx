import React from 'react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { LEARNING_MODULES, LEARNING_PATHS } from '../constants';
import { LearningModule } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { RocketLaunchIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const PersonalizedLearningPath: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const path = LEARNING_PATHS.find(p => p.relevantGoal === user?.careerGoal);

    if (!user || !path) {
        return null; // Don't show if no user or no matching path
    }
    
    const pathModules = path.moduleIds.map(id => LEARNING_MODULES.find(m => m.id === id)).filter(Boolean) as LearningModule[];
    const careerGoalText = user.careerGoal || 'your goal';

    return (
        <Card className="mb-12">
            <h2 className="text-2xl font-bold text-dark dark:text-light">{t('learning.yourPersonalizedPath')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('learning.pathDescription').replace('{goal}', careerGoalText)}</p>

            <div className="mt-8">
                <ol className="relative border-l border-gray-200 dark:border-gray-700">                  
                    {pathModules.map((module, index) => {
                        const isCompleted = user.completedModuleIds?.includes(module.id);
                        const isCurrent = !isCompleted && (index === 0 || user.completedModuleIds?.includes(pathModules[index - 1].id));
                        
                        let statusIcon;
                        let statusBgColor = '';
                        let statusText = '';

                        if(isCompleted) {
                            statusIcon = <CheckCircleIcon className="w-5 h-5 text-white" />;
                            statusBgColor = 'bg-accent';
                            statusText = t('learning.completed');
                        } else if (isCurrent) {
                            statusIcon = <RocketLaunchIcon className="w-5 h-5 text-white" />;
                            statusBgColor = 'bg-primary animate-pulse';
                            statusText = t('learning.current');
                        } else {
                            statusIcon = <LockClosedIcon className="w-4 h-4 text-gray-500" />;
                            statusBgColor = 'bg-gray-200 dark:bg-gray-600';
                            statusText = t('learning.locked');
                        }

                        return (
                            <li key={module.id} className="mb-10 ml-8">            
                                <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-dark ${statusBgColor}`}>
                                    {statusIcon}
                                </span>
                                <Link 
                                    to={`/learning/${module.id}`} 
                                    className={`block p-4 rounded-lg border transition-all duration-300 ${isCurrent ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-gray-700'} ${isCompleted || isCurrent ? 'hover:bg-light dark:hover:bg-gray-700' : 'opacity-60 cursor-not-allowed'}`}
                                    onClick={(e) => !(isCompleted || isCurrent) && e.preventDefault()}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('learning.step').replace('{number}', (index + 1).toString())}</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCompleted ? 'bg-accent/10 text-accent' : isCurrent ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>{statusText}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg text-dark dark:text-light mt-1">{module.title}</h3>
                                </Link>
                            </li>
                        )
                    })}
                </ol>
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