
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useLearning } from '../contexts/LearningContext';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import NewModuleModal from '../components/learning/NewModuleModal';

const AdminContentPage: React.FC = () => {
    const { learningModules } = useLearning();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">Content Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2 inline" />
                    Create New Module
                </Button>
            </div>
            <Card>
                <div className="divide-y dark:divide-gray-700">
                    {learningModules.map(module => (
                        <div key={module.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-dark dark:text-light">{module.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{module.category} • <span className="capitalize">{module.type}</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" size="sm"><PencilIcon className="h-4 w-4"/></Button>
                                <Button variant="danger" size="sm"><TrashIcon className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <NewModuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default AdminContentPage;
