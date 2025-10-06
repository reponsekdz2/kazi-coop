import React, { Fragment, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon, BellIcon, SparklesIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
// FIX: Changed import to 'react-router-dom' to resolve module export errors.
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useNotifications } from '../../contexts/NotificationContext';
import { UserPlusIcon, BriefcaseIcon, ArrowTrendingUpIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { ActivityLog } from '../../types';

const notificationIcons: { [key in ActivityLog['type'] | 'default']: React.ElementType } = {
    NEW_MEMBER: UserPlusIcon,
    NEW_JOB: BriefcaseIcon,
    SAVINGS_GOAL: ArrowTrendingUpIcon,
    LARGE_DEPOSIT: BanknotesIcon,
    default: SparklesIcon,
};


const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b dark:bg-dark dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-400">
            <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="relative hidden lg:block">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
             </div>
             <input
                type="text"
                placeholder="Search jobs, co-ops, users..."
                className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
             />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden p-2 text-gray-500 rounded-full hover:bg-light dark:hover:bg-gray-700">
            {isSearchOpen ? <XMarkIcon className="h-6 w-6"/> : <MagnifyingGlassIcon className="h-6 w-6"/>}
        </button>
        
        {isSearchOpen && (
            <div className="absolute top-16 left-0 right-0 p-4 bg-white dark:bg-dark border-b dark:border-gray-700 lg:hidden z-20">
                 <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full bg-light dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    autoFocus
                 />
            </div>
        )}

        <Menu as="div" className="relative">
          <Menu.Button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-light dark:hover:bg-gray-700">
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-30">
                <div className="p-2 flex justify-between items-center border-b dark:border-gray-700">
                    <h3 className="font-semibold text-sm text-dark dark:text-light">Notifications</h3>
                    {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all as read</button>}
                </div>
                <div className="py-1 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => {
                       const Icon = notificationIcons[notif.type] || notificationIcons.default;
                       return (
                        <Menu.Item key={notif.id}>
                            <div className={`p-3 flex items-start gap-3 transition-colors hover:bg-light dark:hover:bg-gray-700 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <div className="bg-light dark:bg-gray-700/50 p-2 rounded-full mt-1">
                                    <Icon className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <p className="text-sm text-dark dark:text-light">{notif.description}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        </Menu.Item>
                       )
                    }) : (
                        <div className="p-4 text-center text-sm text-gray-500">You're all caught up!</div>
                    )}
                </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {user && (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2">
              <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-dark dark:text-light hidden md:inline">{user.name}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Menu.Button>
             <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 z-30">
                   <div className="px-1 py-1">
                     <Menu.Item>
                       {({ active }) => (
                         <Link to="/settings" className={`${active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                            Settings
                         </Link>
                       )}
                     </Menu.Item>
                   </div>
                   <div className="px-1 py-1">
                     <Menu.Item>
                        {({ active }) => (
                           <button onClick={logout} className={`${active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                             Logout
                           </button>
                        )}
                     </Menu.Item>
                   </div>
                </Menu.Items>
             </Transition>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default Header;