
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { login, user } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };
  
  return (
    <div className="bg-light flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark text-center mb-2">Create Your Account</h1>
        <p className="text-gray-500 text-center mb-6">Join KaziCoop and start your journey today.</p>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setRole(UserRole.SEEKER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.SEEKER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I'm a Job Seeker
          </button>
          <button 
            onClick={() => setRole(UserRole.EMPLOYER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.EMPLOYER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            I'm an Employer
          </button>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Aline Umutoni"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required
            />
          </div>
          <Button type="submit" className="w-full !mt-6">
            Create {role} Account
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
