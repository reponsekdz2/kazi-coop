import React from 'react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { LEARNING_MODULES, LEARNING_PATHS } from '../constants';
import { LearningModule } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { RocketLaunchIcon, LockClosedIcon, VideoCameraIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import RingProgress from '../components/ui/RingProgress';

const PersonalizedLearningPath: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const path = LEARNING_PATHS.find(p => p.relevantGoal === user?.careerGoal);

    if (!user || !path) {
        return null; // Don't show if no user or no matching path
    }
    
    const pathModules = path.moduleIds.map(id => LEARNING_MODULES.find(m => m.id === id)).filter(Boolean) as LearningModule[];
    const careerGoalText = user.careerGoal || 'your goal';
    
    const completedCount = pathModules.filter(m => user.completedModuleIds?.includes(m.id)).length;
    const overallProgress = pathModules.length > 0 ? Math.round((completedCount / pathModules.length) * 100) : 0;


    return (
        <Card className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{t('learning.yourPersonalizedPath')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t('learning.pathDescription').replace('{goal}', careerGoalText)}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex-shrink-0 text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('learning.pathProgress')}</p>
                    <RingProgress percentage={overallProgress} size={80} strokeWidth={8} />
                </div>
            </div>

            <div className="space-y-0">
                {pathModules.map((module, index) => {
                    const isCompleted = user.completedModuleIds?.includes(module.id);
                    const isCurrent = !isCompleted && (index === 0 || user.completedModuleIds?.includes(pathModules[index - 1].id));
                    const isLocked = !isCompleted && !isCurrent;

                    let statusIcon, statusBgColor, statusText, statusTextColor;

                    if (isCompleted) {
                        statusIcon = <CheckCircleIcon className="w-5 h-5 text-white" />;
                        statusBgColor = 'bg-accent';
                        statusText = t('learning.completed');
                        statusTextColor = 'bg-accent/10 text-accent';
                    } else if (isCurrent) {
                        statusIcon = <RocketLaunchIcon className="w-5 h-5 text-white" />;
                        statusBgColor = 'bg-primary animate-pulse';
                        statusText = t('learning.current');
                        statusTextColor = 'bg-primary/10 text-primary';
                    } else { // Locked
                        statusIcon = <LockClosedIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
                        statusBgColor = 'bg-gray-200 dark:bg-gray-600';
                        statusText = t('learning.locked');
                        statusTextColor = 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400';
                    }

                    return (
                        <div key={module.id} className="flex">
                            {/* Stepper Visuals */}
                            <div className="flex flex-col items-center mr-6">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-light dark:ring-dark ${statusBgColor}`}>
                                    {statusIcon}
                                </div>
                                {index < pathModules.length - 1 && (
                                    <div className={`w-0.5 flex-grow my-2 ${isCompleted ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                )}
                            </div>

                            {/* Module Card */}
                            <div className="flex-1 pb-8">
                                <Link 
                                    to={`/learning/${module.id}`}
                                    className={`block p-4 rounded-lg border-2 transition-all duration-300 ${
                                        isCurrent ? 'border-primary bg-primary/5 shadow-lg' : 'border-transparent bg-light dark:bg-dark'
                                    } ${
                                        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-secondary'
                                    }`}
                                    onClick={(e) => isLocked && e.preventDefault()}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('learning.step').replace('{number}', (index + 1).toString())}</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusTextColor}`}>{statusText}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-dark dark:text-light">{module.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">{module.content.summary}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t pt-2 dark:border-gray-700">
                                        <div className="flex items-center gap-1.5">
                                            {module.type === 'video' ? <VideoCameraIcon className="h-4 w-4" /> : <DocumentTextIcon className="h-4 w-4" />}
                                            <span className="capitalize">{module.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="h-4 w-4" />
                                            <span>{module.duration}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
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