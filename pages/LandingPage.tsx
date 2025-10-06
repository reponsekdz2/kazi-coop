import React from 'react';
// FIX: Changed import to 'react-router' to resolve module export errors.
import { Link } from 'react-router';
import Button from '../components/layout/Button';
import Typewriter from '../components/ui/Typewriter';
import { BriefcaseIcon, UserGroupIcon, WalletIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import RingProgress from '../components/layout/RingProgress';

const LandingPage: React.FC = () => {
  const testimonials = [
    { name: 'Aline U.', role: 'Frontend Developer', quote: 'KaziCoop helped me land my dream job in tech. The platform is intuitive and connected me directly with top employers in Kigali.', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Jean M.', role: 'CEO, TechSolutions', quote: 'Managing our employee cooperative has never been easier. The financial tools are powerful yet simple to use, fostering a great savings culture.', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Chris K.', role: 'Data Analyst', quote: 'The learning hub is fantastic. I took a course on advanced SQL that directly helped me get recognized for a promotion.', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'Fatima N.', role: 'UX Designer', quote: 'Joining a freelancers\' cooperative through KaziCoop gave me the financial stability to grow my business. It truly feels like a community.', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'Samuel B.', role: 'Project Manager', quote: 'The integrated wallet and budgeting tools are a game-changer for my personal finance. I can finally track my spending and savings goals effectively.', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { name: 'Grace I.', role: 'HR Manager, Innovate RW', quote: 'We found our last three hires through KaziCoop. The quality of candidates is excellent, and the platform simplifies our recruitment process.', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
             <Card className="text-center !p-8">
              <AcademicCapIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">Develop Skills</h3>
              <p className="text-gray-600 dark:text-gray-400">Access curated learning modules to advance your career and knowledge.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl font-bold text-dark dark:text-light">Why KaziCoop Works</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">We leverage technology to create tangible results for Rwanda's workforce.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <RingProgress percentage={85} size={150} strokeWidth={10} progressColorClassName="text-accent" />
                    <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">Successful Placements</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">of users find a job within 3 months.</p>
                </div>
                <div className="flex flex-col items-center">
                     <div className="relative flex items-center justify-center" style={{ width: 150, height: 150 }}>
                        <svg width={150} height={150}>
                            <circle cx="75" cy="75" r="65" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="10"/>
                        </svg>
                        <p className="absolute font-bold text-2xl text-dark dark:text-light">RWF 78M+</p>
                    </div>
                     <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">Savings Mobilized</h3>
                     <p className="text-gray-600 dark:text-gray-400 mt-1">in community cooperatives across the platform.</p>
                </div>
                <div className="flex flex-col items-center">
                     <RingProgress percentage={92} size={150} strokeWidth={10} progressColorClassName="text-secondary" />
                     <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">User Satisfaction</h3>
                     <p className="text-gray-600 dark:text-gray-400 mt-1">report improved financial literacy and stability.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-light dark:bg-dark">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-light">What Our Community Says</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Real stories from people growing with KaziCoop.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <div className="flex-grow text-gray-600 dark:text-gray-300 mb-4">
                  <p>"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-dark dark:text-light">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;