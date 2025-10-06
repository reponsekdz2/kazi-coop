
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';

type SettingsTab = 'profile' | 'notifications' | 'security';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'security':
                return <SecuritySettings />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Settings</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <Card className="!p-2">
                        <nav className="space-y-1">
                            <SettingsTabButton
                                label="Profile"
                                isActive={activeTab === 'profile'}
                                onClick={() => setActiveTab('profile')}
                            />
                            <SettingsTabButton
                                label="Notifications"
                                isActive={activeTab === 'notifications'}
                                onClick={() => setActiveTab('notifications')}
                            />
                            <SettingsTabButton
                                label="Security"
                                isActive={activeTab === 'security'}
                                onClick={() => setActiveTab('security')}
                            />
                        </nav>
                    </Card>
                </aside>
                <main className="md:w-3/4">
                    <Card>{renderContent()}</Card>
                </main>
            </div>
        </div>
    );
};

interface SettingsTabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const SettingsTabButton: React.FC<SettingsTabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

const ProfileSettings: React.FC = () => {
    const { user } = useAuth();
    // Form state would be managed here in a real app
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark dark:text-light">Profile Information</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" defaultValue={user?.email} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600"/>
                </div>
            </div>
             <div className="pt-4 border-t dark:border-gray-700 text-right">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

const NotificationSettings: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();
    const [notifications, setNotifications] = useState({ jobAlerts: true, messageAlerts: true, coopUpdates: false });

    return (
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark dark:text-light">Notifications</h2>
            <div className="space-y-4">
                <NotificationToggle label="New Job Alerts" checked={notifications.jobAlerts} onChange={(val) => setNotifications(p => ({...p, jobAlerts: val}))} />
                <NotificationToggle label="New Messages" checked={notifications.messageAlerts} onChange={(val) => setNotifications(p => ({...p, messageAlerts: val}))} />
                <NotificationToggle label="Cooperative Updates" checked={notifications.coopUpdates} onChange={(val) => setNotifications(p => ({...p, coopUpdates: val}))} />
            </div>
            <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">Appearance</h3>
                <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-300">Dark Mode</p>
                    <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
            </div>
             <div className="pt-4 border-t dark:border-gray-700 text-right">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}

const NotificationToggle: React.FC<{label: string, checked: boolean, onChange: (val: boolean) => void}> = ({label, checked, onChange}) => (
    <div className="flex justify-between items-center p-3 bg-light dark:bg-dark rounded-md">
        <p className="text-gray-700 dark:text-gray-300">{label}</p>
        <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
)

const SecuritySettings: React.FC = () => {
    return (
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark dark:text-light">Security</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input type="password"  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input type="password"  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
            </div>
            <div className="pt-4 border-t dark:border-gray-700 text-right">
                <Button>Update Password</Button>
            </div>
        </div>
    );
}

export default SettingsPage;
