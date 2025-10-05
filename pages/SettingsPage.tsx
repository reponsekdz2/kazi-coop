import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PencilIcon, CheckBadgeIcon, UserCircleIcon, SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import RingProgress from '../components/ui/RingProgress';
import { useAppContext } from '../contexts/AppContext';

type SettingsTab = 'profile' | 'preferences';

const languages: { [key: string]: string } = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
};

const SettingsPage: React.FC = () => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: t('settings.tabs.profile') },
    { id: 'preferences', label: t('settings.tabs.preferences') },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('settings.title')}</h1>
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
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
      </div>
    </div>
  );
};

const ProfileTab: React.FC = () => {
    const { user } = useAuth();
    const { t } = useAppContext();
    
    if (!user) return null;

    const userSkills = user.skills || ['React', 'TypeScript', 'Project Management', 'Agile'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card className="text-center">
                    <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                    <Button variant="secondary" className="mt-4 w-full">{t('settings.changePicture')}</Button>
                </Card>
                 <Card title={t('settings.profileStrength')}>
                    <div className="flex flex-col items-center">
                        <RingProgress percentage={Math.round((user.careerProgress || 0) / 5 * 100)} size={150} strokeWidth={12} />
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">{t('settings.completeProfilePrompt')}</p>
                        <Button variant="secondary" className="mt-4">{t('settings.completeProfileBtn')}</Button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark dark:text-light">{t('settings.personalInfo')}</h3>
                    <Button variant="secondary">
                        <PencilIcon className="h-4 w-4 mr-2 inline" />
                        {t('settings.edit')}
                    </Button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('settings.fullName')}</label>
                            <p className="text-dark dark:text-light font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('settings.email')}</label>
                            <p className="text-dark dark:text-light font-semibold">{user.email}</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('settings.password')}</label>
                            <button className="text-primary text-sm font-semibold">{t('settings.changePassword')}</button>
                        </div>
                    </div>
                </Card>
                <Card title={t('settings.skills')}>
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

const PreferencesTab: React.FC = () => {
    const { t, theme, toggleTheme, language, changeLanguage } = useAppContext();
    return (
        <Card>
            <div className="max-w-md space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-light">{t('settings.theme')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose how KaziCoop looks to you. Select a theme below.</p>
                    <div className="flex gap-4">
                        <button onClick={() => theme !== 'light' && toggleTheme()} className={`flex-1 p-4 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                            <SunIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500"/>
                            <span className="font-semibold">{t('settings.themeLight')}</span>
                        </button>
                        <button onClick={() => theme !== 'dark' && toggleTheme()} className={`flex-1 p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                            <MoonIcon className="h-8 w-8 mx-auto mb-2 text-indigo-400"/>
                            <span className="font-semibold">{t('settings.themeDark')}</span>
                        </button>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-light">{t('settings.language')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select your preferred language for the interface.</p>
                     <div className="relative">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <select 
                            value={language} 
                            onChange={(e) => changeLanguage(e.target.value as 'en' | 'fr' | 'rw')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                        >
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default SettingsPage;