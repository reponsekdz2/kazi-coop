
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../contexts/AppContext';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const HelpCenterPage: React.FC = () => {
    const { t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('general');

    const faqs = {
        general: [],
        jobs: [
            { q: t('helpCenter.faqs.q1'), a: t('helpCenter.faqs.a1') },
        ],
        cooperatives: [
            { q: t('helpCenter.faqs.q2'), a: t('helpCenter.faqs.a2') },
            { q: t('helpCenter.faqs.q3'), a: t('helpCenter.faqs.a3') },
        ],
        wallet: [
            { q: t('helpCenter.faqs.q4'), a: t('helpCenter.faqs.a4') },
        ]
    };

    const categories = Object.keys(faqs);

    const filteredFaqs = Object.entries(faqs).reduce((acc, [category, questions]) => {
        if (activeCategory !== 'general' && category !== activeCategory) return acc;
        
        const filteredQuestions = questions.filter(faq => 
            faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.a.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if(filteredQuestions.length > 0) {
            acc[category] = filteredQuestions;
        }
        return acc;
    }, {} as typeof faqs);


  return (
    <div>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-dark dark:text-light mb-2">{t('helpCenter.title')}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('helpCenter.subtitle')}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder={t('helpCenter.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <Card className="!p-4">
                    <h3 className="font-bold text-lg mb-4 px-2">{t('sidebar.helpCenter')}</h3>
                    <nav className="space-y-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeCategory === cat 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
                                }`}
                            >
                                {t(`helpCenter.categories.${cat}`)}
                            </button>
                        ))}
                    </nav>
                </Card>
            </aside>
            <main className="md:w-3/4">
                <div className="space-y-4">
                    {Object.entries(filteredFaqs).map(([category, questions]) => (
                        <div key={category}>
                             <h2 className="text-2xl font-bold text-dark dark:text-light mb-4 capitalize">{t(`helpCenter.categories.${category}`)}</h2>
                             <div className="space-y-3">
                                {questions.map((faq, index) => (
                                    <FAQItem key={index} question={faq.q} answer={faq.a} />
                                ))}
                             </div>
                        </div>
                    ))}
                     {Object.keys(filteredFaqs).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No results found for your search.</p>
                        </div>
                     )}
                </div>
            </main>
        </div>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4 focus:outline-none"
            >
                <h3 className="font-semibold text-dark dark:text-light">{question}</h3>
                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">{answer}</p>
                </div>
            )}
        </div>
    );
};


export default HelpCenterPage;