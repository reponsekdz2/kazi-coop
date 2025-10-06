import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/layout/Button';
import Typewriter from '../components/ui/Typewriter';
import { BriefcaseIcon, UserGroupIcon, WalletIcon, AcademicCapIcon, UserCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { TESTIMONIALS, JOBS, COMPANIES } from '../constants';
import RingProgress from '../components/layout/RingProgress';

const LandingPage: React.FC = () => {
  const featuredJobs = JOBS.filter(job => job.status === 'Open').slice(0, 3);
  
  return (
    <div className="bg-light dark:bg-gray-800">
      {/* Hero Section */}
      <section className="bg-light dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark dark:text-light leading-tight mb-4">
            Unlock Your Potential with KaziCoop
          </h1>
          <div className="text-lg md:text-2xl text-primary font-semibold mb-8 h-8 md:h-10">
            <Typewriter strings={['Find Jobs.', 'Save Together.', 'Build Your Future.']} />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            The all-in-one platform for job seekers and employers in Rwanda, integrated with powerful community savings tools (Ikimina).
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button>Get Started for Free</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-light">Why KaziCoop?</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need for career and financial growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <FeatureCard icon={BriefcaseIcon} title="Find Opportunities" description="Connect with top employers and discover jobs that match your skills." />
            <FeatureCard icon={UserGroupIcon} title="Save with Ikimina" description="Join or create digital savings cooperatives to achieve your financial goals." />
            <FeatureCard icon={WalletIcon} title="Manage Your Wallet" description="A secure, integrated digital wallet to manage your earnings and savings." />
            <FeatureCard icon={AcademicCapIcon} title="Develop Skills" description="Access curated learning modules to advance your career and knowledge." />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-light dark:bg-gray-900">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dark dark:text-light">How It Works</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">A simple, streamlined process for everyone.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* For Job Seekers */}
              <div>
                <div className="flex items-center mb-4">
                    <UserCircleIcon className="h-8 w-8 text-primary mr-3"/>
                    <h3 className="text-2xl font-semibold text-dark dark:text-light">For Job Seekers</h3>
                </div>
                <ol className="relative border-l border-gray-300 dark:border-gray-600">
                    <StepItem title="Create Your Profile" description="Build a professional profile that showcases your skills and experience." />
                    <StepItem title="Find Jobs & Apply" description="Browse opportunities and apply with a single click." />
                    <StepItem title="Join a Cooperative" description="Join an Ikimina to start saving with your community." />
                    <StepItem title="Get Hired & Grow" description="Land your dream job and continue learning with our resources." />
                </ol>
              </div>
              {/* For Employers */}
              <div>
                <div className="flex items-center mb-4">
                    <BuildingOffice2Icon className="h-8 w-8 text-primary mr-3"/>
                    <h3 className="text-2xl font-semibold text-dark dark:text-light">For Employers</h3>
                </div>
                <ol className="relative border-l border-gray-300 dark:border-gray-600">
                    <StepItem title="Post a Job" description="Easily create and publish job listings to attract top talent." />
                    <StepItem title="Manage Applicants" description="Review candidate profiles and manage your hiring pipeline." />
                    <StepItem title="Create a Cooperative" description="Foster financial wellness and team cohesion for your employees." />
                    <StepItem title="Build Your Team" description="Hire the best candidates and grow your organization." />
                </ol>
              </div>
            </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-white dark:bg-dark">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dark dark:text-light">Featured Jobs</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Explore the latest opportunities from top employers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredJobs.map(job => {
                    const company = COMPANIES.find(c => c.id === job.companyId);
                    return (
                        <div key={job.id} className="bg-light dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
                            <h3 className="text-xl font-bold text-dark dark:text-light">{job.title}</h3>
                            <p className="text-primary font-semibold mb-3">{company?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">{job.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{job.type}</span>
                                <Link to={`/jobs`}>
                                    <Button variant="secondary">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

       {/* Platform in Numbers Section */}
      <section className="py-20 bg-light dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-light">Platform in Numbers</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Our proven track record of success and community growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-md flex flex-col items-center">
                <RingProgress percentage={89} size={140} strokeWidth={10} progressColorClassName="text-accent"/>
                <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">Successful Placements</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Placement rate for verified candidates.</p>
             </div>
             <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-md flex flex-col items-center">
                <RingProgress percentage={95} size={140} strokeWidth={10}/>
                <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">User Satisfaction</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Based on feedback from our community.</p>
             </div>
              <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-md flex flex-col items-center">
                <RingProgress percentage={75} size={140} strokeWidth={10} progressColorClassName="text-yellow-500"/>
                <h3 className="text-xl font-semibold text-dark dark:text-light mt-4">Community Savings</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Of total Ikimina funds disbursed as loans.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
       <section className="py-20 bg-white dark:bg-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-light">What Our Community Says</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Real stories from people who transformed their lives with KaziCoop.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="bg-light dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
                <p className="text-gray-600 dark:text-gray-300 flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center mt-6">
                  <img src={testimonial.avatarUrl} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4"/>
                  <div>
                    <p className="font-bold text-dark dark:text-light">{testimonial.name}</p>
                    <p className="text-sm text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
       </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="bg-light dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform">
    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const StepItem: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <li className="mb-8 ml-6">
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-light dark:ring-gray-900 dark:bg-blue-900">
            <BriefcaseIcon className="w-3 h-3 text-primary"/>
        </span>
        <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">{description}</p>
    </li>
);

export default LandingPage;