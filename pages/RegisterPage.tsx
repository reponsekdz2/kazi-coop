
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const RegisterPage: React.FC = () => {
  const { register, user } = useAuth();
  const { addToast } = useToast();
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        await register({ ...formData, role });
        addToast('Registration successful! Welcome to KaziCoop.', 'success');
    } catch (err: any) {
        setError(err.message || 'Failed to register.');
        addToast(err.message || 'Registration failed.', 'error');
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-light dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark dark:text-light text-center mb-2">Create Your Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Join KaziCoop and start your journey today.</p>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
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
           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Aline Umutoni"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : `Create ${role} Account`}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;