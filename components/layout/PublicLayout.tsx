

import React from 'react';
// FIX: Changed import to 'react-router-dom' to resolve module export errors.
import { Outlet, Link } from 'react-router-dom';
import Button from './Button';
import { BriefcaseIcon, UserGroupIcon, UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-light dark:bg-gray-900">
            <header className="bg-white dark:bg-dark shadow-md sticky top-0 z-50">
                <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        KaziCoop
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">Login</Link>
                        <Link to="/register">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white pt-16 pb-8 relative">
            <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M1440 28.5975V120H0V28.5975C240 7.53247 480 -7.46753 720 7.53247C960 22.5325 1200 52.5975 1440 28.5975Z" className="fill-current text-gray-800 dark:text-gray-900"/>
                </svg>
            </div>
            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    {/* Quick Actions */}
                    <div className="md:col-span-3 lg:col-span-2">
                         <h3 className="font-bold text-lg mb-4 text-white">Quick Actions</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <ActionCard icon={BriefcaseIcon} title="Post a Job" description="Find the perfect candidate for your team."/>
                            <ActionCard icon={MagnifyingGlassIcon} title="Find Talent" description="Browse profiles of skilled professionals."/>
                            <ActionCard icon={UserPlusIcon} title="Join KaziCoop" description="Create your free account today."/>
                            <ActionCard icon={UserGroupIcon} title="Start an Ikimina" description="Begin saving with your community."/>
                         </div>
                    </div>
                    {/* Links */}
                    <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-200 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-200 mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                     <div className="lg:col-span-1">
                        <h4 className="font-semibold text-gray-200 mb-4">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-3">Subscribe to our newsletter.</p>
                        <form className="flex">
                            <input type="email" placeholder="Your email" className="bg-gray-700 text-white px-3 py-2 rounded-l-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            <button type="submit" className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-r-md transition-colors">
                                Go
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center text-center">
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} KaziCoop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const ActionCard: React.FC<{icon: React.ElementType, title: string, description: string}> = ({icon: Icon, title, description}) => (
    <a href="#" className="flex items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
        <Icon className="h-8 w-8 text-primary flex-shrink-0"/>
        <div className="ml-3">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    </a>
)

export default PublicLayout;