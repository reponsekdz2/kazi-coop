import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  ChartBarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  WalletIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  TicketIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useAppContext();
  
  const seekerNavItems = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: ChartBarIcon },
    { to: '/jobs', label: t('sidebar.findJobs'), icon: BriefcaseIcon },
    { to: '/interviews', label: t('sidebar.interviews'), icon: TicketIcon },
    { to: '/cooperatives', label: t('sidebar.cooperatives'), icon: UserGroupIcon },
    { to: '/wallet', label: t('sidebar.wallet'), icon: WalletIcon },
    { to: '/learning', label: t('sidebar.learningHub'), icon: AcademicCapIcon },
    { to: '/messages', label: t('sidebar.messages'), icon: ChatBubbleLeftRightIcon },
  ];
  
  const employerNavItems = [
      { to: '/dashboard', label: t('sidebar.dashboard'), icon: ChartBarIcon },
      { to: '/jobs', label: t('sidebar.jobPostings'), icon: BriefcaseIcon },
      { to: '/user-analytics', label: t('sidebar.talentPool'), icon: UserGroupIcon },
      { to: '/messages', label: t('sidebar.messages'), icon: ChatBubbleLeftRightIcon },
  ];
  
  const adminNavItems = [
      { to: '/dashboard', label: t('sidebar.dashboard'), icon: ChartBarIcon },
      { to: '/analytics', label: t('sidebar.platformAnalytics'), icon: PresentationChartLineIcon },
  ];

  const navItems = user?.role === UserRole.SEEKER ? seekerNavItems :
                   user?.role === UserRole.EMPLOYER ? employerNavItems :
                   adminNavItems;

  return (
    <div className="flex flex-col w-64 bg-dark text-white dark:bg-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-700 dark:border-gray-700">
        <Link to="/dashboard" className="text-2xl font-bold text-white">KaziCoop</Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-gray-700 dark:border-gray-700">
         <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600'
              }`
            }
          >
            <Cog6ToothIcon className="h-5 w-5 mr-3" />
            {t('sidebar.myProfile')}
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600'
              }`
            }
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
            {t('sidebar.helpCenter')}
          </NavLink>
        <button onClick={logout} className="w-full flex items-center px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 mt-2">
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          {t('header.logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;