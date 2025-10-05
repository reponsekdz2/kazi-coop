import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PencilIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { BriefcaseIcon, UserGroupIcon, WalletIcon } from '@heroicons/react/24/outline';
import RingProgress from '../components/ui/RingProgress';
import { useAppContext } from '../contexts/AppContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppContext();

  if (!user) {
    return <p>Loading profile...</p>;
  }
  
  const userSkills = user.skills || ['React', 'TypeScript', 'Project Management', 'Agile'];

  const activityTimeline = [
      {icon: BriefcaseIcon, text: "Applied for Frontend Developer", date: "2 days ago"},
      {icon: WalletIcon, text: "Contributed RWF 50,000 to Ikimina", date: "5 days ago"},
      {icon: UserGroupIcon, text: "Joined TechSolutions Innovators Circle", date: "1 week ago"},
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">{t('profile.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-primary" />
            <h2 className="text-2xl font-bold text-dark dark:text-light">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
            <Button variant="secondary" className="mt-4 w-full">{t('profile.changePicture')}</Button>
          </Card>
          <Card title={t('profile.skills')}>
            <div className="flex flex-wrap gap-2">
                {userSkills.map(skill => (
                    <div key={skill} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold dark:bg-blue-900/50 dark:text-blue-300">
                        {skill}
                        <CheckBadgeIcon className="h-4 w-4 ml-1 text-primary" title="Endorsed by TechSolutions Ltd."/>
                    </div>
                ))}
            </div>
          </Card>
          <Card title={t('profile.profileStrength')}>
            <div className="flex flex-col items-center">
                <RingProgress percentage={Math.round((user.careerProgress || 0) / 5 * 100)} size={150} strokeWidth={12} />
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">{t('profile.completeProfilePrompt')}</p>
                <Button variant="secondary" className="mt-4">{t('profile.completeProfileBtn')}</Button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark dark:text-light">{t('profile.personalInfo')}</h3>
              <Button variant="secondary">
                <PencilIcon className="h-4 w-4 mr-2 inline" />
                {t('profile.edit')}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.fullName')}</label>
                <p className="text-dark dark:text-light font-semibold">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.email')}</label>
                <p className="text-dark dark:text-light font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.role')}</label>
                <p className="text-dark dark:text-light font-semibold">{user.role}</p>
              </div>
               <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.password')}</label>
                <button className="text-primary text-sm font-semibold">{t('profile.changePassword')}</button>
              </div>
            </div>
          </Card>
           <Card title={t('profile.activityTimeline')}>
            <div className="space-y-4">
                {activityTimeline.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div className="bg-light dark:bg-gray-700 p-2 rounded-full mr-4">
                            <item.icon className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                            <p className="text-dark dark:text-light font-medium">{item.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;