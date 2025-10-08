

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, CheckIcon, LightBulbIcon, PhotoIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { QuizQuestion } from '../types';
import Button from '../components/ui/Button';
import { useLearning } from '../contexts/LearningContext';

const LearningModulePage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const { learningModules } = useLearning();
    const module = learningModules.find(m => m.id === moduleId);

    if (!module) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Module not found</h1>
                <Link to="/learning" className="text-primary hover:underline mt-4 inline-block">Back to Learning Hub</Link>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (module.type) {
            case 'video':
                return module.content.videoUrl && (
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
                );
            case 'image':
                return module.content.imageUrl && (
                    <div className="mb-6">
                        <img src={module.content.imageUrl} alt={module.title} className="rounded-lg max-h-[500px] w-auto mx-auto"/>
                    </div>
                );
            case 'file':
                 return module.content.fileUrl && (
                    <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center text-center">
                        <DocumentArrowDownIcon className="h-12 w-12 text-primary" />
                        <p className="font-semibold mt-2">{module.content.fileName || 'Downloadable File'}</p>
                        <a href={module.content.fileUrl} download={module.content.fileName}>
                            <Button className="mt-4">Download</Button>
                        </a>
                    </div>
                );
            case 'article':
            default:
                return null; // Article content is handled below in the main body
        }
    }

    return (
        <div>
            <Link to="/learning" className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Learning Hub
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <p className="font-semibold text-primary mb-2">{module.category}</p>
                        <h1 className="text-4xl font-extrabold text-dark dark:text-light mb-4">{module.title}</h1>
                        <p className="text-gray-500 mb-6">{module.duration}</p>
                        
                        {renderContent()}

                        <div className="prose max-w-none text-gray-700 dark:prose-invert">
                             <p className="lead text-lg mb-4">{module.content.summary}</p>
                             {module.type === 'article' && module.content.articleText?.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </Card>
                    
                    {module.quiz && <QuizComponent quiz={module.quiz} />}
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

const QuizComponent: React.FC<{ quiz: QuizQuestion[] }> = ({ quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = quiz[currentQuestionIndex];

    const handleAnswer = (answerIndex: number) => {
        if (isAnswered) return;
        setSelectedAnswer(answerIndex);
        setIsAnswered(true);
        if(answerIndex === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };
    
    const handleNext = () => {
        if(currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
        }
    };
    
    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setIsFinished(false);
    }
    
    if (isFinished) {
        return (
            <Card title="Quiz Results">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-dark dark:text-light">You scored {score} out of {quiz.length}!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {score / quiz.length > 0.7 ? "Excellent work!" : "Great effort! Review the key takeaways and try again."}
                    </p>
                    <Button onClick={handleRestart} className="mt-4">Retake Quiz</Button>
                </div>
            </Card>
        )
    }

    return (
        <Card title={`Quiz: Test Your Knowledge (${currentQuestionIndex + 1}/${quiz.length})`}>
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">{currentQuestion.question}</h3>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswerIndex;
                    const isSelected = selectedAnswer === index;
                    let optionClass = "border-gray-300 dark:border-gray-600 hover:border-primary";
                    if(isAnswered) {
                        if(isCorrect) optionClass = "border-green-500 bg-green-50 dark:bg-green-900/30";
                        else if(isSelected) optionClass = "border-red-500 bg-red-50 dark:bg-red-900/30";
                    }
                    
                    return (
                        <button 
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={isAnswered}
                            className={`w-full text-left p-3 border-2 rounded-lg flex items-center justify-between transition-colors ${optionClass}`}
                        >
                            <span>{option}</span>
                            {isAnswered && (isCorrect ? <CheckCircleIcon className="h-5 w-5 text-green-500"/> : isSelected && <XCircleIcon className="h-5 w-5 text-red-500"/>)}
                        </button>
                    )
                })}
            </div>
            {isAnswered && (
                <div className="text-right mt-4">
                     <Button onClick={handleNext}>
                        {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                </div>
            )}
        </Card>
    )
}

export default LearningModulePage;