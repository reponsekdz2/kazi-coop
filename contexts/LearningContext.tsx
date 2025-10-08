
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { LearningModule } from '../types';
import { useToast } from './ToastContext';

// Initial data that used to be in constants.ts
const INITIAL_LEARNING_MODULES: LearningModule[] = [
    { 
      id: 'lm-1', title: 'Advanced React Patterns', category: 'Web Development', type: 'video', duration: '1h 45m', progress: 50, 
      content: { summary: 'Deep dive into advanced React concepts like higher-order components, render props, and context API.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', keyTakeaways: ['Understand render props pattern', 'Master Higher-Order Components (HOCs)', 'Effectively use the Context API for state management'] } 
    },
    { 
      id: 'lm-2', title: 'Effective Communication', category: 'Soft Skills', type: 'article', duration: '30m read', progress: 0, 
      content: { summary: 'Learn the fundamentals of clear, concise, and professional communication in the workplace.', articleText: 'Effective communication is the cornerstone of any successful team...', keyTakeaways: ['Active Listening techniques', 'Providing constructive feedback', 'Clarity in written communication'] } 
    },
    { 
      id: 'lm-3', title: 'Startup Fundamentals', category: 'Entrepreneurship', type: 'video', duration: '2h 15m', progress: 0, 
      content: { 
        summary: 'From idea to MVP. Learn the essential first steps to starting your own business in the tech space.', 
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
        keyTakeaways: ['Validating your business idea', 'Creating a Minimum Viable Product (MVP)', 'Basics of market research', 'Pitching to investors'] 
      },
      quiz: [
          {
              question: "What does MVP stand for?",
              options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Mainstream Viable Project"],
              correctAnswerIndex: 1
          },
          {
              question: "What is the primary goal of market research?",
              options: ["To sell your product", "To understand customer needs and market size", "To design a logo", "To hire employees"],
              correctAnswerIndex: 1
          }
      ]
    },
    { 
      id: 'lm-4', 
      title: 'Mastering Your Budget in Rwanda', 
      category: 'Financial Literacy', 
      type: 'article', 
      duration: '25m read', 
      progress: 0, 
      content: { 
        summary: 'Learn practical budgeting techniques tailored for the Rwandan context. From tracking expenses on Mobile Money to planning for long-term goals, this guide will help you take control of your finances.', 
        articleText: 'Budgeting is the first step toward financial freedom. A popular method is the 50/30/20 rule: 50% of your income goes to needs (rent, food, transport), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. In Rwanda, a significant portion of transactions happen via Mobile Money. Make it a habit to review your MoMo statement weekly to understand where your money is going. Setting SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals is crucial. Instead of "save money," a SMART goal is "save RWF 100,000 for an emergency fund in the next 6 months by saving RWF 4,200 per week."', 
        keyTakeaways: ['The 50/30/20 rule (Needs/Wants/Savings)', 'Using apps or notebooks to track Mobile Money transactions', 'Setting SMART financial goals', 'How to adjust your budget for irregular income'] 
      },
      quiz: [
          {
              question: "What percentage of income is recommended for savings in the 50/30/20 rule?",
              options: ["10%", "20%", "30%", "50%"],
              correctAnswerIndex: 1
          },
          {
              question: "What does the 'M' in SMART goals stand for?",
              options: ["Money", "Monthly", "Measurable", "Memorable"],
              correctAnswerIndex: 2
          }
      ]
    },
];


interface LearningContextType {
    learningModules: LearningModule[];
    addModule: (moduleData: Omit<LearningModule, 'id' | 'progress'>) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [learningModules, setLearningModules] = useState<LearningModule[]>(INITIAL_LEARNING_MODULES);
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
