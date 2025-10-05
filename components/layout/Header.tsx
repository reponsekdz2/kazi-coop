import React, { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon, BellIcon, SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAppContext } from '../../contexts/AppContext';

const languages = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, changeLanguage, t } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b dark:bg-dark dark:border-gray-700">
      <div>
        {/* Can be dynamic based on route */}
      </div>
      <div className="flex items-center space-x-4">
        
        {/* Language Selector */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-500 rounded-full hover:bg-light dark:hover:bg-gray-700 dark:text-gray-400">
            <GlobeAltIcon className="h-6 w-6" />
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
            <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
              <div className="px-1 py-1 ">
                {Object.entries(languages).map(([langCode, langName]) => (
                    <Menu.Item key={langCode}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(langCode as 'en' | 'fr' | 'rw')}
                        className={`${
                          (active || language === langCode) ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {langName}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="p-2 text-gray-500 rounded-full hover:bg-light dark:hover:bg-gray-700 dark:text-gray-400">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>

        <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-dark dark:text-light">{user.name}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block dark:bg-gray-800 dark:border dark:border-gray-700">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">{t('header.profile')}</Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                {t('header.logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;