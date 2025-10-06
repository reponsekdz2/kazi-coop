import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/layout/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { User } from '../types';
import { useToast } from '../contexts/ToastContext';

type SettingsTab = 'profile' | 'preferences' | 'security';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'preferences':
                return <PreferencesSettings />;
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
                                label="My Profile"
                                isActive={activeTab === 'profile'}
                                onClick={() => setActiveTab('profile')}
                            />
                            <SettingsTabButton
                                label="Preferences"
                                isActive={activeTab === 'preferences'}
                                onClick={() => setActiveTab('preferences')}
                            />
                            <SettingsTabButton
                                label="Security & Account"
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
    const { user, updateUserProfile } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        if(user) {
            setFormData({
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                skills: user.skills || [],
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, skills: e.target.value.split(',').map(s => s.trim())}));
    };
    
    const handleSave = () => {
        if(user) {
            updateUserProfile({ ...user, ...formData });
            setIsEditing(false);
            addToast('Profile updated successfully!', 'success');
        }
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        if(user) setFormData(user); // Reset changes
    };

    if(!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-dark dark:text-light">Profile Information</h2>
                 {!isEditing && <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>}
            </div>
            
            <div className="flex flex-col items-center space-y-4">
                <img src={formData.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full"/>
                {isEditing && <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="input-field w-full text-sm" placeholder="Enter new image URL"/>}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="label-text">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="input-field"/>
                </div>
                <div>
                    <label className="label-text">Email Address</label>
                    <input type="email" name="email" value={formData.email} disabled className="input-field bg-gray-100 dark:bg-gray-800"/>
                </div>
                 <div>
                    <label className="label-text">Skills (comma-separated)</label>
                    <input type="text" name="skills" value={formData.skills?.join(', ')} onChange={handleSkillsChange} disabled={!isEditing} className="input-field"/>
                </div>
            </div>
             {isEditing && (
                <div className="pt-4 border-t dark:border-gray-700 flex justify-end gap-2">
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            )}
        </div>
    );
};

const PreferencesSettings: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();
    const { user, updateUserProfile } = useAuth();
    const [settings, setSettings] = useState(user?.notificationSettings || { jobAlerts: true, messageAlerts: true, coopUpdates: false });
    
    const handleToggle = (key: keyof typeof settings) => {
        const newSettings = {...settings, [key]: !settings[key]};
        setSettings(newSettings);
        if(user) {
            updateUserProfile({...user, notificationSettings: newSettings});
        }
    };

    return (
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark dark:text-light">Preferences</h2>
            <div>
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">Notifications</h3>
                <div className="space-y-4">
                    <NotificationToggle label="New Job Alerts" checked={settings.jobAlerts} onChange={() => handleToggle('jobAlerts')} />
                    <NotificationToggle label="New Messages" checked={settings.messageAlerts} onChange={() => handleToggle('messageAlerts')} />
                    <NotificationToggle label="Cooperative Updates" checked={settings.coopUpdates} onChange={() => handleToggle('coopUpdates')} />
                </div>
            </div>
            <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">Appearance</h3>
                <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-300">Dark Mode</p>
                    <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
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
    const { addToast } = useToast();
    
    const handleUpdatePassword = () => {
        addToast('Password updated successfully!', 'success');
    };
    
    const handleDeactivate = () => {
        addToast('Account deactivation requested.', 'info');
    };

    return (
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark dark:text-light">Change Password</h2>
            <div className="space-y-4">
                <div>
                    <label className="label-text">Current Password</label>
                    <input type="password"  className="input-field"/>
                </div>
                 <div>
                    <label className="label-text">New Password</label>
                    <input type="password"  className="input-field"/>
                </div>
                 <div>
                    <label className="label-text">Confirm New Password</label>
                    <input type="password" className="input-field"/>
                </div>
            </div>
            <div className="pt-4 border-t dark:border-gray-700 text-right">
                <Button onClick={handleUpdatePassword}>Update Password</Button>
            </div>
            
            <div className="pt-6 border-t border-red-500/30">
                 <h2 className="text-xl font-bold text-red-600 dark:text-red-500">Deactivate Account</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm my-2">This action is irreversible. All your data will be permanently deleted.</p>
                 <Button variant="danger" onClick={handleDeactivate}>I understand, deactivate my account</Button>
            </div>
        </div>
    );
}

export default SettingsPage;