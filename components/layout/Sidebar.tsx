import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartPieIcon,
  UserGroupIcon,
  BriefcaseIcon,
  WalletIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useAppContext();

  const seekerLinks = [
    { name: t('sidebar.dashboard'), to: '/dashboard', icon: ChartPieIcon },
    { name: t('sidebar.findJobs'), to: '/jobs', icon: BriefcaseIcon },
    { name: t('sidebar.interviews'), to: '/interviews', icon: UsersIcon },
    { name: t('sidebar.cooperatives'), to: '/cooperatives', icon: UserGroupIcon },
    { name: t('sidebar.wallet'), to: '/wallet', icon: WalletIcon },
    { name: t('sidebar.learningHub'), to: '/learning', icon: AcademicCapIcon },
    { name: t('sidebar.messages'), to: '/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const employerLinks = [
    { name: t('sidebar.dashboard'), to: '/dashboard', icon: ChartPieIcon },
    { name: t('sidebar.jobManagement'), to: '/jobs', icon: BriefcaseIcon },
    { name: t('sidebar.cooperativeManagement'), to: '/cooperatives', icon: UserGroupIcon },
    { name: t('sidebar.walletManagement'), to: '/wallet', icon: WalletIcon },
    { name: t('sidebar.talentPool'), to: '/user-analytics', icon: UsersIcon },
    { name: t('sidebar.platformAnalytics'), to: '/analytics', icon: BuildingOffice2Icon },
    { name: t('sidebar.messages'), to: '/messages', icon: ChatBubbleLeftRightIcon },
  ];
  
  const bottomLinks = [
    { name: t('sidebar.settings'), to: '/settings', icon: Cog6ToothIcon },
    { name: t('sidebar.helpCenter'), to: '/help', icon: QuestionMarkCircleIcon },
  ];

  const links = user?.role === UserRole.EMPLOYER ? employerLinks : seekerLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-dark border-r dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary">KaziCoop</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
              }`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t dark:border-gray-700 space-y-2">
        {bottomLinks.map((link) => (
             <NavLink
             key={link.name}
             to={link.to}
             className={({ isActive }) =>
               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                 isActive
                   ? 'bg-primary text-white'
                   : 'text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700'
               }`
             }
           >
             <link.icon className="h-5 w-5 mr-3" />
             {link.name}
           </NavLink>
        ))}
         <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-light dark:hover:bg-gray-700"
        >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;