import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const { t } = useAppContext();
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };
  
  return (
    <div className="bg-light dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark dark:text-light text-center mb-2">{t('login.welcome')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{t('login.continue')}</p>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            onClick={() => setRole(UserRole.SEEKER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.SEEKER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('login.jobSeeker')}
          </button>
          <button 
            onClick={() => setRole(UserRole.EMPLOYER)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${role === UserRole.EMPLOYER ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('login.employer')}
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('login.email')}</label>
            <input 
              type="email" 
              placeholder={role === UserRole.SEEKER ? 'aline@example.com' : 'jean@example.com'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('login.password')}</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required
            />
          </div>
          <Button type="submit" className="w-full !mt-6">
            {t('login.loginAs').replace('{role}', role)}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {t('login.noAccount')} <Link to="/register" className="font-medium text-primary hover:underline">{t('login.signUp')}</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;