import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { LearningModule } from '../types';
import { useToast } from './ToastContext';
// FIX: Import mock data from the new constants file.
import { LEARNING_MODULES } from '../constants';


interface LearningContextType {
    learningModules: LearningModule[];
    addModule: (moduleData: Omit<LearningModule, 'id' | 'progress'>) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [learningModules, setLearningModules] = useState<LearningModule[]>(LEARNING_MODULES);
    const { addToast } = useToast();

    const addModule = useCallback((moduleData: Omit<LearningModule, 'id' | 'progress'>) => {
        const newModule: LearningModule = {
            id: `lm-${new Date().getTime()}`,
            progress: 0,
            ...moduleData,
        };
        setLearningModules(prev => [newModule, ...prev]);
        addToast('New learning module created successfully!', 'success');
    }, [addToast]);

    return (
        <LearningContext.Provider value={{ learningModules, addModule }}>
            {children}
        </LearningContext.Provider>
    );
};

export const useLearning = (): LearningContextType => {
    const context = useContext(LearningContext);
    if (!context) {
        throw new Error('useLearning must be used within a LearningProvider');
    }
    return context;
};
