

import React from 'react';
// FIX: Changed import to 'react-router-dom' to resolve module export errors.
import { useParams, Link } from 'react-router-dom';
import { LEARNING_MODULES } from '../constants';
import Card from '../components/ui/Card';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const LearningModulePage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const module = LEARNING_MODULES.find(m => m.id === moduleId);

    if (!module) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Module not found</h1>
                <Link to="/learning" className="text-primary hover:underline mt-4 inline-block">Back to Learning Hub</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/learning" className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Learning Hub
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <p className="font-semibold text-primary mb-2">{module.category}</p>
                        <h1 className="text-4xl font-extrabold text-dark mb-4">{module.title}</h1>
                        <p className="text-gray-500 mb-6">{module.duration}</p>
                        
                        {module.type === 'video' && module.content.videoUrl && (
                            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={module.content.videoUrl}
                                    title={module.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        <div className="prose max-w-none text-gray-700 dark:prose-invert">
                             <p className="lead text-lg mb-4">{module.content.summary}</p>
                             {module.type === 'article' && module.content.articleText?.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Key Takeaways">
                        <ul className="space-y-3">
                            {module.content.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LearningModulePage;