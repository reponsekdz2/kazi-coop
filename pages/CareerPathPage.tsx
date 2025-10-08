
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
// FIX: Import mock data from the new constants file.
import { JOBS } from '../constants';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';

interface CareerPath {
    currentRole: string;
    nextRole: string;
    skillsToDevelop: string[];
    suggestedModules: string[];
}

const CareerPathPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const { learningModules } = useLearning();
    const [isGenerating, setIsGenerating] = useState(false);
    const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
    const [currentRole, setCurrentRole] = useState('Junior Frontend Developer');
    const [targetRole, setTargetRole] = useState('Senior Frontend Developer');

    const handleGeneratePath = async () => {
        setIsGenerating(true);
        setCareerPath(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const prompt = `
                Generate a concise career path plan for a user on the KaziCoop platform.
                Current Role: ${currentRole}
                Target Role: ${targetRole}
                User's current skills: ${user?.skills?.join(', ') || 'React, JavaScript'}
                
                Available learning modules on platform: ${learningModules.map(m => m.title).join(', ')}

                Provide the output in a JSON object with the following structure:
                {
                  "currentRole": "The user's current role",
                  "nextRole": "The user's target role",
                  "skillsToDevelop": ["A list of 3-5 key skills to develop, including both technical and soft skills."],
                  "suggestedModules": ["A list of 2-3 relevant titles from the available learning modules."]
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' },
            });
            
            const jsonText = response.text.trim();
            const parsedPath = JSON.parse(jsonText);
            setCareerPath(parsedPath);
            addToast("Your personalized career path is ready!", "success");

        } catch (error) {
            console.error("Error generating career path:", error);
            addToast("Failed to generate career path. Please try again.", "error");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const relevantJobs = JOBS.filter(job => job.title.toLowerCase().includes(targetRole.split(' ')[0].toLowerCase()));


    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">AI-Powered Career Path</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get a personalized roadmap to achieve your career goals.</p>

            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="label-text">Your Current Role</label>
                        <input type="text" value={currentRole} onChange={e => setCurrentRole(e.target.value)} className="input-field" placeholder="e.g., Junior Developer"/>
                    </div>
                     <div>
                        <label className="label-text">Your Target Role</label>
                        <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field" placeholder="e.g., Senior Developer"/>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <Button onClick={handleGeneratePath} disabled={isGenerating}>
                        <SparklesIcon className={`h-5 w-5 mr-2 inline ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Generating Your Path...' : 'Generate My Career Path'}
                    </Button>
                </div>
            </Card>

            {(isGenerating || careerPath) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isGenerating ? (
                        <Card title="Building Your Roadmap..." className="lg:col-span-2 flex items-center justify-center py-16">
                             <div className="animate-pulse flex flex-col items-center space-y-2">
                                <LightBulbIcon className="h-10 w-10 text-primary"/>
                                <p className="text-gray-500">Analyzing roles and skills...</p>
                            </div>
                        </Card>
                    ) : careerPath && (
                        <>
                            <Card title="Skills to Develop">
                                <ul className="list-disc list-inside space-y-2">
                                    {careerPath.skillsToDevelop.map(skill => <li key={skill}>{skill}</li>)}
                                </ul>
                            </Card>
                            <Card title="Suggested Learning">
                                <div className="space-y-2">
                                {learningModules.filter(m => careerPath.suggestedModules.includes(m.title)).map(module => (
                                    <Link key={module.id} to={`/learning/${module.id}`} className="block p-3 bg-light dark:bg-dark rounded-md hover:bg-primary/10">
                                        <p className="font-semibold text-dark dark:text-light">{module.title}</p>
                                        <p className="text-xs text-primary">{module.category}</p>
                                    </Link>
                                ))}
                                </div>
                            </Card>
                             <Card title={`Relevant Jobs for a ${careerPath.nextRole}`} className="lg:col-span-2">
                                <div className="space-y-2">
                                    {relevantJobs.map(job => (
                                         <Link key={job.id} to="/jobs" className="block p-3 bg-light dark:bg-dark rounded-md hover:bg-primary/10">
                                            <p className="font-semibold text-dark dark:text-light">{job.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CareerPathPage;