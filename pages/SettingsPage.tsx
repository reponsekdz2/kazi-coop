

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { PencilIcon, CheckBadgeIcon, SunIcon, MoonIcon, BriefcaseIcon } from '@heroicons/react/24/solid';
import RingProgress from '../components/layout/RingProgress';
import { useAppContext } from '../contexts/AppContext';
import { COMPANIES, JOBS } from '../constants';
import { UserRole } from '../types';

type SettingsTab = 'profile' | 'preferences';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { user } = useAuth();

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: 'My Profile' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Settings</h1>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'profile' && (
            user?.role === UserRole.SEEKER ? <SeekerProfileTab /> : <EmployerProfileTab />
        )}
        {activeTab === 'preferences' && <PreferencesTab />}
      </div>
    </div>
  );
};

const SeekerProfileTab: React.FC = () => {
    const { user } = useAuth();
    
    if (!user) return null;

    const userSkills = user.skills || [];
    const profileData = user.profileData || {};
    
    const calculateAge = (dob: string | undefined) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card className="text-center">
                    <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                    <Button variant="secondary" className="mt-4 w-full">Change Picture</Button>
                </Card>
                 <Card title="Profile Strength">
                    <div className="flex flex-col items-center">
                        <RingProgress percentage={Math.round((user.careerProgress || 0) / 5 * 100)} size={150} strokeWidth={12} />
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">A complete profile increases your visibility to top employers.</p>
                        <Button variant="secondary" className="mt-4">Enhance Your Profile</Button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark dark:text-light">Personal Information</h3>
                    <Button variant="secondary">
                        <PencilIcon className="h-4 w-4 mr-2 inline" />
                        Edit
                    </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                            <p className="text-dark dark:text-light font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                            <p className="text-dark dark:text-light font-semibold">{user.email}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
                            <p className="text-dark dark:text-light font-semibold">{calculateAge(profileData.dateOfBirth)}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                            <p className="text-dark dark:text-light font-semibold">{profileData.gender || 'N/A'}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Education</label>
                            <p className="text-dark dark:text-light font-semibold">{profileData.educationLevel || 'N/A'}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Field of Study</label>
                            <p className="text-dark dark:text-light font-semibold">{profileData.fieldOfStudy || 'N/A'}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Years of Experience</label>
                            <p className="text-dark dark:text-light font-semibold">{profileData.yearsOfExperience} years</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</label>
                            <button className="text-primary text-sm font-semibold">Change Password</button>
                        </div>
                    </div>
                </Card>
                <Card title="My Skills">
                    <div className="flex flex-wrap gap-2">
                        {userSkills.map(skill => (
                            <div key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-blue-900/50 dark:text-blue-300">
                                {skill}
                                <CheckBadgeIcon className="h-4 w-4 ml-1 text-primary" title="Endorsed"/>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

const EmployerProfileTab: React.FC = () => {
    const { user } = useAuth();
    if (!user || !user.companyId) return null;

    const company = COMPANIES.find(c => c.id === user.companyId);
    const companyJobs = JOBS.filter(j => j.employerId === user.id);

    if (!company) return <p>Company not found.</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card className="text-center">
                     <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                </Card>
                 <Card title="Company Info">
                    <h3 className="font-bold text-lg text-dark dark:text-light">{company.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{company.description}</p>
                </Card>
            </div>
             <div className="lg:col-span-2 space-y-6">
                <Card title="Active Job Postings">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {companyJobs.length > 0 ? companyJobs.map(job => (
                            <div key={job.id} className="p-3 rounded-lg bg-light dark:bg-gray-700/50">
                                <p className="font-semibold text-dark dark:text-light">{job.title}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500">{job.location}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-center">No active job postings.</p>}
                    </div>
                </Card>
            </div>
        </div>
    )
}

const PreferencesTab: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();
    return (
        <Card>
            <div className="max-w-md space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-light">Appearance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose how KaziCoop looks to you. Select a theme below.</p>
                    <div className="flex gap-4">
                        <button onClick={() => theme !== 'light' && toggleTheme()} className={`flex-1 p-4 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                            <SunIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500"/>
                            <span className="font-semibold">Light</span>
                        </button>
                        <button onClick={() => theme !== 'dark' && toggleTheme()} className={`flex-1 p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                            <MoonIcon className="h-8 w-8 mx-auto mb-2 text-indigo-400"/>
                            <span className="font-semibold">Dark</span>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default SettingsPage;
