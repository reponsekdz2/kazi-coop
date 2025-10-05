
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NOTIFICATIONS } from '../../constants';
import { BellIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div>
        <h1 className="text-xl font-bold text-dark">Welcome, {user?.name.split(' ')[0]}!</h1>
        <p className="text-sm text-gray-500">Here's your overview for today.</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-500 hover:text-primary">
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2">
                <div className="px-4 py-2 font-bold text-dark border-b">Notifications</div>
                {NOTIFICATIONS.map(notif => (
                  <div key={notif.id} className={`p-4 border-b hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
            <img src={user?.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full" />
            <div>
                <p className="font-semibold text-dark text-sm">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.role}</p>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
