import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const HelpCenterPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('general');

    const faqs = {
        general: [
            { q: "How do I apply for a job?", a: "Navigate to the \"Find Jobs\" page, browse the listings, and click \"Apply\" on any job you are interested in. Your profile information will be automatically submitted to the employer." },
            { q: "What is a cooperative (Ikimina)?", a: "A cooperative is a community savings group where members contribute money regularly (e.g., weekly or monthly) and can take loans from the collective pool. It's a modern, digital way to manage a traditional Ikimina." },
            { q: "How do I join a cooperative?", a: "You can browse existing cooperatives on the \"Cooperatives\" page and send a request to join. The cooperative's creator will review your request. Employer accounts can also create their own cooperatives for their staff." },
            { q: "How do I add money to my wallet?", a: "Click the \"Deposit\" button on the Wallet page and follow the instructions to deposit funds via Mobile Money. The transaction is usually instant." },
            { q: "Is my money safe in the KaziCoop wallet?", a: "Yes, your funds are held securely with our regulated financial partners. We use industry-standard encryption and security protocols to protect your account." },
            { q: "How can I update my profile information?", a: "Go to the 'Settings' page from the sidebar menu. You can update your personal information, skills, and profile picture in the 'Profile' tab." }
        ],
        jobs: [
            { q: "How do I apply for a job?", a: "Navigate to the \"Find Jobs\" page, browse the listings, and click \"Apply\" on any job you are interested in. Your profile information will be automatically submitted to the employer." },
        ],
        cooperatives: [
            { q: "What is a cooperative (Ikimina)?", a: "A cooperative is a community savings group where members contribute money regularly (e.g., weekly or monthly) and can take loans from the collective pool. It's a modern, digital way to manage a traditional Ikimina." },
            { q: "How do I join a cooperative?", a: "You can browse existing cooperatives on the \"Cooperatives\" page and send a request to join. The cooperative's creator will review your request. Employer accounts can also create their own cooperatives for their staff." },
        ],
        wallet: [
            { q: "How do I add money to my wallet?", a: "Click the \"Deposit\" button on the Wallet page and follow the instructions to deposit funds via Mobile Money. The transaction is usually instant." },
        ],
        account: [
           { q: "How can I update my profile information?", a: "Go to the 'Settings' page from the sidebar menu. You can update your personal information, skills, and profile picture in the 'Profile' tab." }
        ]
    };
    
    const categoryLabels: { [key: string]: string } = {
        general: "Getting Started",
        jobs: "Jobs & Applications",
        cooperatives: "Cooperatives (Ikimina)",
        wallet: "Wallet & Payments",
        account: "Account & Profile"
    };

    const categories = Object.keys(categoryLabels);

    const filteredFaqs = Object.entries(faqs).reduce((acc, [category, questions]) => {
        if (activeCategory !== 'general' && category !== activeCategory) return acc;
        
        const filteredQuestions = questions.filter(faq => 
            faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.a.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if(filteredQuestions.length > 0) {
            acc[category as keyof typeof faqs] = filteredQuestions;
        }
        return acc;
    }, {} as typeof faqs);


  return (
    <div>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-dark dark:text-light mb-2">Help Center</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">How can we help you today?</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <Card className="!p-4">
                    <h3 className="font-bold text-lg mb-4 px-2">Help Center</h3>
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
                                {categoryLabels[cat]}
                            </button>
                        ))}
                    </nav>
                </Card>
            </aside>
            <main className="md:w-3/4">
                <div className="space-y-4">
                    {Object.entries(filteredFaqs).map(([category, questions]) => (
                        <div key={category}>
                             <h2 className="text-2xl font-bold text-dark dark:text-light mb-4 capitalize">{categoryLabels[category]}</h2>
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
