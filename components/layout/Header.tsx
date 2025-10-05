import React, { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon, BellIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAppContext } from '../../contexts/AppContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { UserPlusIcon, BriefcaseIcon, ArrowTrendingUpIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const notificationIcons: { [key: string]: React.ElementType } = {
    NEW_MEMBER: UserPlusIcon,
    NEW_JOB: BriefcaseIcon,
    SAVINGS_GOAL: ArrowTrendingUpIcon,
    LARGE_DEPOSIT: BanknotesIcon,
    default: SparklesIcon,
};


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useAppContext();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b dark:bg-dark dark:border-gray-700">
      <div>
        {/* Can be dynamic based on route */}
      </div>
      <div className="flex items-center space-x-4">

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
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                <div className="p-2 flex justify-between items-center border-b dark:border-gray-700">
                    <h3 className="font-semibold text-sm text-dark dark:text-light">{t('notifications.title')}</h3>
                    {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">{t('notifications.markAllRead')}</button>}
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
                        <div className="p-4 text-center text-sm text-gray-500">{t('notifications.noNotifications')}</div>
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                   <div className="px-1 py-1">
                     <Menu.Item>
                       {({ active }) => (
                         <Link to="/settings" className={`${active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                            {t('header.settings')}
                         </Link>
                       )}
                     </Menu.Item>
                   </div>
                   <div className="px-1 py-1">
                     <Menu.Item>
                        {({ active }) => (
                           <button onClick={logout} className={`${active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-200'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                             {t('header.logout')}
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