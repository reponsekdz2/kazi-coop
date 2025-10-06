

import React, { Fragment } from 'react';
// FIX: Changed import to 'react-router-dom' to resolve module export errors.
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
  ArrowLeftOnRectangleIcon,
  ArrowTrendingUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Transition } from '@headlessui/react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const seekerLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: ChartPieIcon },
    { name: 'Find Jobs', to: '/jobs', icon: BriefcaseIcon },
    { name: 'My Interviews', to: '/interviews', icon: UsersIcon },
    { name: 'Career Path', to: '/career-path', icon: ArrowTrendingUpIcon },
    { name: 'Cooperatives (Ikimina)', to: '/cooperatives', icon: UserGroupIcon },
    { name: 'My Wallet', to: '/wallet', icon: WalletIcon },
    { name: 'Learning Hub', to: '/learning', icon: AcademicCapIcon },
    { name: 'Messages', to: '/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const employerLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: ChartPieIcon },
    { name: 'Job Management', to: '/jobs', icon: BriefcaseIcon },
    { name: 'Cooperative Management', to: '/cooperatives', icon: UserGroupIcon },
    { name: 'Company Wallet', to: '/wallet', icon: WalletIcon },
    { name: 'Talent Pool', to: '/user-analytics', icon: UsersIcon },
    { name: 'Platform Analytics', to: '/analytics', icon: BuildingOffice2Icon },
    { name: 'Messages', to: '/messages', icon: ChatBubbleLeftRightIcon },
  ];
  
  const bottomLinks = [
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    { name: 'Help Center', to: '/help', icon: QuestionMarkCircleIcon },
  ];

  const links = user?.role === UserRole.EMPLOYER ? employerLinks : seekerLinks;

  const SidebarContent = () => (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-dark border-r dark:border-gray-700 flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700 flex-shrink-0">
          <h1 className="text-2xl font-bold text-primary">KaziCoop</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
              <XMarkIcon className="h-6 w-6"/>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
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
        <div className="px-4 py-6 border-t dark:border-gray-700 space-y-2 flex-shrink-0">
          {bottomLinks.map((link) => (
               <NavLink
               key={link.name}
               to={link.to}
               onClick={() => setIsOpen(false)}
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
              Logout
          </button>
        </div>
    </aside>
  );

  return (
    <>
      {/* Static sidebar for large screens */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <SidebarContent />
      </div>

       {/* Mobile sidebar with transition */}
      <Transition show={isOpen} as={Fragment}>
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 z-30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="fixed inset-y-0 left-0 z-40">
                <SidebarContent />
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;