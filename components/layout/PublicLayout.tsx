import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Button from '../ui/Button';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-light">
            <header className="bg-white shadow-md sticky top-0 z-50">
                <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        KaziCoop
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
                        <Link to="/register">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-dark text-white pt-16 pb-8">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">KaziCoop</h3>
                            <p className="text-gray-400 text-sm">Empowering Rwanda's workforce and communities through technology.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#/jobs" className="text-gray-400 hover:text-white">Find Jobs</a></li>
                                <li><a href="#/cooperatives" className="text-gray-400 hover:text-white">Cooperatives</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-4">Legal</h4>
                             <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-200 mb-4">Stay Updated</h4>
                            <p className="text-gray-400 text-sm mb-3">Subscribe to our newsletter for the latest updates.</p>
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
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;