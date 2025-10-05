
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };
  
  return (
    <div className="bg-light flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark text-center mb-2">Welcome Back!</h1>
        <p className="text-gray-500 text-center mb-6">Log in to continue your journey.</p>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setRole(UserRole.SEEKER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.SEEKER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Job Seeker
          </button>
          <button 
            onClick={() => setRole(UserRole.EMPLOYER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.EMPLOYER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Employer
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder={role === UserRole.SEEKER ? 'aline@example.com' : 'jean@example.com'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required
            />
          </div>
          <Button type="submit" className="w-full !mt-6">
            Log In as {role}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
