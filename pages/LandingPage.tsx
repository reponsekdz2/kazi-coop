
import React from 'react';
// FIX: Changed import to 'react-router' to resolve module export errors.
import { Link } from 'react-router';
import Button from '../components/layout/Button';
import Typewriter from '../components/ui/Typewriter';
import { BriefcaseIcon, UserGroupIcon, WalletIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative py-20 lg:py-32 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Unlock Your Potential in Rwanda's
            <br />
            <span className="text-secondary">
              <Typewriter strings={['Job Market.', 'Community.', 'Future.']} />
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-200 mb-8">
            KaziCoop connects you with job opportunities, empowers your savings through community cooperatives (Ikimina), and provides learning resources to accelerate your career.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button className="!px-8 !py-3">Get Started</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" className="!px-8 !py-3">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-light dark:bg-dark">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-light">A Platform for Growth</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Everything you need to succeed in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center !p-8">
              <BriefcaseIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">Find Jobs</h3>
              <p className="text-gray-600 dark:text-gray-400">Discover job listings tailored to your skills and career goals in Rwanda.</p>
            </Card>
            <Card className="text-center !p-8">
              <UserGroupIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">Join Cooperatives</h3>
              <p className="text-gray-600 dark:text-gray-400">Save and borrow with your community through modern digital Ikimina.</p>
            </Card>
            <Card className="text-center !p-8">
              <WalletIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">Manage Finances</h3>
              <p className="text-gray-600 dark:text-gray-400">Track your earnings, savings, and loans with our integrated digital wallet.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;