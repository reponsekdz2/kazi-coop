import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight mb-4">
            Your Gateway to Opportunity in Rwanda
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
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">Why Choose KaziCoop?</h2>
            <p className="text-gray-600 mt-2">A unified platform for career and financial empowerment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-primary mb-2">Job Matching</h3>
              <p className="text-gray-600">Discover job opportunities that match your skills and ambitions.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-primary mb-2">Cooperatives</h3>
              <p className="text-gray-600">Join savings and credit cooperatives to build your financial future.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-primary mb-2">Skill Development</h3>
              <p className="text-gray-600">Access learning resources to enhance your career prospects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Create an account today and take the next step in your career and financial life. It's free and only takes a minute.
          </p>
          <Link to="/register">
            <Button className="!bg-white !text-primary hover:!bg-blue-100 !px-10 !py-3 !text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
