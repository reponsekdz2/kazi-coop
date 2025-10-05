import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserGroupIcon, AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-light">
            <section className="relative bg-primary text-white text-center py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 opacity-90"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10" 
                    style={{backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')"}}
                ></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Unlock Your Potential in Rwanda</h1>
                    <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">The leading platform connecting job seekers with employers and empowering communities through cooperatives.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button className="w-full sm:w-auto text-lg px-8 py-3 bg-accent hover:bg-green-700 transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                                Find a Job <ArrowRightIcon className="h-5 w-5 inline ml-2" />
                            </Button>
                        </Link>
                         <Link to="/register">
                            <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-3 bg-white text-primary hover:bg-gray-200 transform hover:scale-105 transition-transform duration-300">
                                Hire Talent
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-dark mb-4">Everything You Need in One Platform</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12">Whether you're looking for a job, hiring talent, or managing a cooperative, KaziCoop has you covered.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<BriefcaseIcon className="h-6 w-6" />}
                            title="Discover Job Opportunities"
                            description="Access a wide range of jobs from top companies in Rwanda. Apply easily and track your application status."
                        />
                        <FeatureCard 
                            icon={<UserGroupIcon className="h-6 w-6" />}
                            title="Empower Your Cooperative"
                            description="Manage members, contributions, and loans with our intuitive tools. Gain insights with powerful analytics."
                        />
                         <FeatureCard 
                            icon={<AcademicCapIcon className="h-6 w-6" />}
                            title="Grow Your Skills"
                            description="Enhance your knowledge with our learning resources, from financial literacy to career development."
                        />
                    </div>
                </div>
            </section>
            
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-dark mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-700 mb-8">Join thousands of others and take the next step in your career or business.</p>
                    <Link to="/register">
                        <Button className="text-lg px-10 py-4 bg-accent hover:bg-green-700 transform hover:scale-105 transition-transform duration-300">
                            Join KaziCoop Today
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;