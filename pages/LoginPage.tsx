
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';


const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const { addToast } = useToast();
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      addToast('Login successful! Welcome back.', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      addToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-light dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark dark:text-light text-center mb-2">Welcome Back to KaziCoop!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Log in to continue your journey toward success.</p>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            onClick={() => setRole(UserRole.SEEKER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.SEEKER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            I'm a Job Seeker
          </button>
          <button 
            onClick={() => setRole(UserRole.EMPLOYER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.EMPLOYER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            I'm an Employer
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
            {isLoading ? 'Logging in...' : `Login as ${role}`}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign Up for Free</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;