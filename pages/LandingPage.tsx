import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import RingProgress from '../components/ui/RingProgress';
import Typewriter from '../components/ui/Typewriter'; // New component
import { BriefcaseIcon, UserGroupIcon, WalletIcon, ArrowRightIcon, AcademicCapIcon, ShieldCheckIcon, PresentationChartLineIcon, LightBulbIcon, CurrencyDollarIcon, ScaleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  return (
    <div className="text-gray-800 bg-light">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-secondary/10"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight mb-4">
            <Typewriter 
              strings={[
                "Your Gateway to Opportunity",
                "Your Path to Financial Freedom",
                "Your Connection to Community"
              ]}
            />
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            KaziCoop connects talented job seekers with Rwanda's top employers and fosters financial growth through community cooperatives.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/jobs">
              <Button className="!px-8 !py-3 !text-lg">Find a Job</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="!px-8 !py-3 !text-lg">Post a Job</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">A Unified Platform for Your Future</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">KaziCoop isn't just an app; it's your partner in building a successful career and a secure financial life. Here's how we help you thrive:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1: Jobs */}
            <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-8 rounded-xl shadow-2xl flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-grow">
                <BriefcaseIcon className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Find Your Dream Job</h3>
                <p className="opacity-90 mb-6">
                  Stop endlessly searching. Our intelligent platform matches your skills to the perfect job, connecting you directly with Rwanda's leading companies. We streamline the application process so you can focus on what matters: landing the interview.
                </p>
              </div>
              <div className="mt-auto bg-white/10 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold">AI Match Score</p>
                  <p className="text-sm opacity-80">Relevant opportunities.</p>
                </div>
                <RingProgress 
                  percentage={92} 
                  size={80} 
                  strokeWidth={8}
                  trackColorClassName="text-white/30"
                  progressColorClassName="text-white"
                  textColorClassName="text-white"
                />
              </div>
            </div>

            {/* Feature Card 2: Cooperatives */}
            <div className="bg-gradient-to-br from-accent to-green-600 text-white p-8 rounded-xl shadow-2xl flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-grow">
                <UserGroupIcon className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Grow with Community</h3>
                <p className="opacity-90 mb-6">
                  Unlock the power of community finance. Join or create cooperatives to save together, access low-interest loans, and invest in shared goals. It's a modern approach to traditional savings circles, built for security and growth.
                </p>
              </div>
              <div className="mt-auto bg-white/10 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold">Community Savings</p>
                  <p className="text-sm opacity-80">Achieve more, together.</p>
                </div>
                <RingProgress 
                  percentage={78} 
                  size={80} 
                  strokeWidth={8}
                  trackColorClassName="text-white/30"
                  progressColorClassName="text-white"
                  textColorClassName="text-white"
                />
              </div>
            </div>

            {/* Feature Card 3: Wallet */}
            <div className="bg-gradient-to-br from-gray-800 to-dark text-white p-8 rounded-xl shadow-2xl flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-grow">
                <WalletIcon className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Master Your Finances</h3>
                <p className="opacity-90 mb-6">
                  Take control of your money with an integrated digital wallet. Receive your salary, pay bills, contribute to your co-op, and track every franc. Set personal savings goals and watch your wealth grow, all in one secure place.
                </p>
              </div>
              <div className="mt-auto bg-white/10 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold">Savings Goal</p>
                  <p className="text-sm opacity-80">New laptop progress!</p>
                </div>
                <RingProgress 
                  percentage={68} 
                  size={80} 
                  strokeWidth={8}
                  trackColorClassName="text-white/30"
                  progressColorClassName="text-white"
                  textColorClassName="text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advanced Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">More Than a Platform, It's a Partnership</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">We've built advanced tools to accelerate your growth and simplify your life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AdvancedFeatureCard 
              icon={LightBulbIcon} 
              title="AI Career Coach" 
              description="Get personalized feedback on your CV and practice for interviews with our AI-powered coach."
            />
            <AdvancedFeatureCard 
              icon={ShieldCheckIcon} 
              title="Mobile Money Integration" 
              description="Securely link your MoMo wallet for instant salary deposits, payments, and savings contributions."
            />
            <AdvancedFeatureCard 
              icon={UserGroupIcon} 
              title="Co-op Project Funding" 
              description="Launch and manage cooperative projects, from funding proposals to progress tracking."
            />
            <AdvancedFeatureCard 
              icon={PresentationChartLineIcon} 
              title="Real-time Analytics" 
              description="Employers and admins get actionable insights on hiring trends and co-op performance."
            />
          </div>
        </div>
      </section>

      {/* NEW: Wealth Acceleration Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-dark">Accelerate Your Wealth</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Go beyond saving. Actively grow your money with our suite of modern financial tools, designed for accessibility and community growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <WealthCard
                    icon={CurrencyDollarIcon}
                    title="Investment Pods"
                    description="Invest in diversified, AI-recommended portfolios with your cooperative. Start small and grow steadily, from low-risk agriculture bonds to high-growth tech startups."
                    gradient="from-yellow-500 to-amber-600"
                />
                <WealthCard
                    icon={ScaleIcon}
                    title="P2P Loan Marketplace"
                    description="Access fair, community-funded loans for your next big idea. Or, become a lender and earn interest by supporting fellow members. Transparent, secure, and better than traditional banks."
                    gradient="from-teal-500 to-cyan-600"
                />
                <WealthCard
                    icon={SparklesIcon}
                    title="Smart Savings Automations"
                    description="Put your savings on autopilot. Set rules like 'Round up purchases' or 'Save 10% of every deposit'. Our smart system does the work, so you reach your goals faster."
                    gradient="from-purple-600 to-indigo-700"
                />
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">What Our Users Say</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Thousands of Rwandans trust KaziCoop to build their future. Here are their stories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="KaziCoop's AI matching found me a job I didn't even know I was qualified for. I got an interview in less than a week!"
              name="Aline U."
              role="Frontend Developer"
              avatar="https://i.pravatar.cc/150?u=user1"
            />
            <TestimonialCard
              quote="Managing our cooperative's savings has never been easier. The transparency and automation have been a game-changer for our members."
              name="Samuel M."
              role="Co-op Member"
              avatar="https://i.pravatar.cc/150?u=user5"
            />
            <TestimonialCard
              quote="As an employer, finding qualified candidates used to be a challenge. Now, KaziCoop delivers pre-vetted, high-match applicants right to my dashboard."
              name="Jean-Claude D."
              role="Hiring Manager, TechSolutions Ltd."
              avatar="https://i.pravatar.cc/150?u=user2"
            />
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Create an account today and take the next step in your career and financial life. It's free and only takes a minute.
          </p>
          <Link to="/register">
            <Button className="!bg-primary hover:!bg-blue-700 !text-white !px-10 !py-3 !text-lg group">
              Get Started Now <ArrowRightIcon className="inline h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};


const AdvancedFeatureCard: React.FC<{icon: React.ElementType, title: string, description: string}> = ({icon: Icon, title, description}) => (
    <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

const WealthCard: React.FC<{icon: React.ElementType, title: string, description: string, gradient: string}> = ({icon: Icon, title, description, gradient}) => (
    <div className={`p-8 rounded-xl shadow-2xl text-white bg-gradient-to-br ${gradient} transform hover:-translate-y-2 transition-transform duration-300`}>
        <Icon className="h-10 w-10 mb-4" />
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="opacity-90">{description}</p>
    </div>
);


const TestimonialCard: React.FC<{quote: string, name: string, role: string, avatar: string}> = ({quote, name, role, avatar}) => (
    <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <p className="text-gray-700 italic mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img src={avatar} alt={name} className="h-12 w-12 rounded-full mr-4" />
            <div>
                <p className="font-bold text-dark">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    </div>
);

export default LandingPage;