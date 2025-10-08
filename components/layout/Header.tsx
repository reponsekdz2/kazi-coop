import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, Bars3Icon, UserCircleIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../contexts/NotificationContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-dark border-b dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
      {/* Menu button for mobile */}
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-400">
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Search Bar (optional) */}
      <div className="hidden md:block">
        {/* Can add a search bar here if needed */}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <BellIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary">
              <img src={user?.avatarUrl} alt={user?.name} className="h-8 w-8 rounded-full" />
              <span className="hidden md:inline">{user?.name}</span>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings" // Profile is part of settings now
                      className={`${
                        active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <UserCircleIcon className="mr-2 h-5 w-5" />
                      My Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                     <Link
                      to="/settings"
                      className={`${
                        active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <Cog6ToothIcon className="mr-2 h-5 w-5" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                 <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
