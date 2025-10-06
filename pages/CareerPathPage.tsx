import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { LEARNING_MODULES, JOBS } from '../constants';
import { User, LearningModule, Job } from '../types';
import { ArrowTrendingUpIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';

interface AIResponse {
    next_role: string;
    skills_to_learn: string[];
    advice: string;
}

const CareerPathPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAdvice = async () => {
        if (!user) return;
        setIsLoading(true);
        setAiResponse(null);

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `
                Based on the user profile below, provide a concise and actionable career plan.
                - Current Skills: ${user.skills?.join(', ') || 'Not specified'}
                - Career Goal: ${user.careerGoal || 'Not specified'}
                - Current Role: ${user.role}

                Return a JSON object with the following structure:
                {
                  "next_role": "A suggested next job title.",
                  "skills_to_learn": ["A list of 3 key skills to learn for that role."],
                  "advice": "A short paragraph (2-3 sentences) of personalized advice."
                }
            `;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            // Gemini can return the JSON wrapped in markdown, so we need to clean it
            const cleanedText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedResponse: AIResponse = JSON.parse(cleanedText);
            setAiResponse(parsedResponse);
            addToast("AI career advice generated!", "success");

        } catch (error) {
            console.error("Error generating AI advice:", error);
            addToast("Failed to get AI advice. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const recommendedModules = aiResponse ? LEARNING_MODULES.filter(module => 
        aiResponse.skills_to_learn.some(skill => 
            module.title.toLowerCase().includes(skill.toLowerCase()) || 
            module.content.summary.toLowerCase().includes(skill.toLowerCase())
        )
    ) : [];
    
    const recommendedJobs = aiResponse ? JOBS.filter(job => 
        job.title.toLowerCase().includes(aiResponse.next_role.toLowerCase())
    ) : [];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light">My Career Path</h1>
                    <p className="text-gray-500 dark:text-gray-400">Your personalized roadmap to success.</p>
                </div>
                <Button onClick={handleGenerateAdvice} disabled={isLoading}>
                     <SparklesIcon className={`h-5 w-5 mr-2 inline ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Generating...' : 'Get AI Next Step'}
                </Button>
            </div>

            <Card>
                {isLoading && <LoadingState />}
                
                {!isLoading && !aiResponse && <InitialState />}

                {!isLoading && aiResponse && (
                    <ResultsState 
                        response={aiResponse} 
                        modules={recommendedModules}
                        jobs={recommendedJobs}
                    />
                )}
            </Card>
        </div>
    );
};

const InitialState = () => (
    <div className="text-center py-12">
        <ArrowTrendingUpIcon className="h-16 w-16 text-primary mx-auto mb-4"/>
        <h2 className="text-xl font-bold text-dark dark:text-light">Ready to Discover Your Next Career Move?</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">Click the "Get AI Next Step" button to receive personalized advice, suggested skills, and job recommendations based on your profile and goals.</p>
    </div>
);

const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
       <div className="animate-pulse flex flex-col items-center space-y-3">
           <SparklesIcon className="h-12 w-12 text-primary"/>
           <p className="text-gray-500 dark:text-gray-400 font-semibold">Our AI is analyzing your profile to craft your personalized career plan...</p>
       </div>
   </div>
);

const ResultsState: React.FC<{ response: AIResponse, modules: LearningModule[], jobs: Job[] }> = ({ response, modules, jobs }) => (
    <div className="space-y-8">
        <div>
            <p className="text-sm font-semibold uppercase text-primary">Your Next Role</p>
            <h2 className="text-3xl font-bold text-dark dark:text-light mt-1">{response.next_role}</h2>
        </div>
        <div>
            <h3 className="text-xl font-bold text-dark dark:text-light mb-3">Personalized Advice</h3>
            <p className="text-gray-600 dark:text-gray-300 bg-light dark:bg-dark p-4 rounded-lg">{response.advice}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-dark dark:text-light mb-3">Skills to Learn</h3>
                <ul className="space-y-2">
                    {response.skills_to_learn.map(skill => (
                        <li key={skill} className="flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-accent"/>
                            <span className="text-dark dark:text-light">{skill}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-dark dark:text-light mb-3">Recommended Learning</h3>
                 <div className="space-y-3">
                    {modules.length > 0 ? modules.map(m => (
                        <Link to={`/learning/${m.id}`} key={m.id} className="block p-3 bg-light dark:bg-dark rounded-lg hover:bg-primary/10">
                            <p className="font-semibold text-dark dark:text-light">{m.title}</p>
                            <p className="text-xs text-primary">{m.category}</p>
                        </Link>
                    )) : <p className="text-gray-500">No specific modules found. Explore the Learning Hub!</p>}
                </div>
            </div>
        </div>
         <div>
            <h3 className="text-xl font-bold text-dark dark:text-light mb-3">Suggested Jobs</h3>
            <div className="space-y-3">
                {jobs.length > 0 ? jobs.map(j => (
                     <Link to="/jobs" key={j.id} className="block p-3 bg-light dark:bg-dark rounded-lg hover:bg-primary/10">
                        <p className="font-semibold text-dark dark:text-light">{j.title}</p>
                        <p className="text-xs text-gray-500">{j.location}</p>
                    </Link>
                )): <p className="text-gray-500">No direct job matches found right now. Keep an eye on the jobs page!</p>}
            </div>
        </div>
    </div>
);


export default CareerPathPage;