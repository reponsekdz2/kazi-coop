
import React, { useState } from 'react';
import ProfilePage from './ProfilePage';
import { UserCircleIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';

type Tab = 'profile' | 'notifications' | 'security';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationSettings />;
       case 'security':
        return <SecuritySettings />;
      default:
        return <ProfilePage />;
    }
  };

  const tabs: { id: Tab, name: string, icon: React.ElementType }[] = [
      { id: 'profile', name: 'Profile', icon: UserCircleIcon },
      { id: 'notifications', name: 'Notifications', icon: BellIcon },
      { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
             <aside className="md:w-1/4">
                <Card className="!p-4">
                     <nav className="space-y-1">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                                    activeTab === tab.id
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
                                }`}
                            >
                                <tab.icon className="h-5 w-5 mr-3"/>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </Card>
            </aside>
            <main className="md:w-3/4">
                {/* The content is rendered directly without a Card because ProfilePage and others already have their own layout */}
                {renderContent()}
            </main>
        </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(user?.notificationSettings || {
        jobAlerts: true,
        messageAlerts: true,
        coopUpdates: false,
    });
    
    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <Card title="Notification Settings">
            <div className="space-y-4 divide-y dark:divide-gray-700">
                <div className="flex justify-between items-center pt-4 first:pt-0">
                    <div>
                        <h4 className="font-semibold text-dark dark:text-light">Job Alerts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new jobs matching your profile.</p>
                    </div>
                    <ToggleSwitch checked={settings.jobAlerts} onChange={() => handleToggle('jobAlerts')} />
                </div>
                 <div className="flex justify-between items-center pt-4">
                    <div>
                        <h4 className="font-semibold text-dark dark:text-light">Message Alerts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for new messages from employers.</p>
                    </div>
                    <ToggleSwitch checked={settings.messageAlerts} onChange={() => handleToggle('messageAlerts')} />
                </div>
                 <div className="flex justify-between items-center pt-4">
                    <div>
                        <h4 className="font-semibold text-dark dark:text-light">Cooperative Updates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Stay informed about your Ikimina activities.</p>
                    </div>
                    <ToggleSwitch checked={settings.coopUpdates} onChange={() => handleToggle('coopUpdates')} />
                </div>
            </div>
        </Card>
    );
};

const SecuritySettings: React.FC = () => {
    return (
        <Card title="Account Security">
            <p className="text-gray-500">Security settings will be available here in a future update.</p>
        </Card>
    )
}


export default SettingsPage;
