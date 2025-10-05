import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { MESSAGES } from '../../constants';
import {
  ChartBarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  CreditCardIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const unreadMessagesCount = MESSAGES.filter(m => m.receiverId === user?.id && !m.read).length;

  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: Cog6ToothIcon },
  ];
  
  const messagesNav = { 
    name: 'Messages', 
    href: '/messages', 
    icon: ChatBubbleLeftRightIcon,
    badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
  };

  const seekerNav = [
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    messagesNav,
    { name: 'Cooperatives', href: '/cooperatives', icon: UserGroupIcon },
    { name: 'Wallet', href: '/wallet', icon: CreditCardIcon },
    { name: 'Learning', href: '/learning', icon: AcademicCapIcon },
  ];

  const employerNav = [
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    messagesNav,
  ];
  
  const coopAdminNav = [
    { name: 'Cooperatives', href: '/cooperatives', icon: UserGroupIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  let navLinks: (typeof baseNav[0] & { badge?: number | null })[] = baseNav;

  if (user?.role === UserRole.SEEKER) {
    navLinks = [...baseNav.slice(0, 1), ...seekerNav, ...baseNav.slice(1)];
  } else if (user?.role === UserRole.EMPLOYER) {
    navLinks = [...baseNav.slice(0, 1), ...employerNav, ...baseNav.slice(1)];
  } else if (user?.role === UserRole.COOP_ADMIN) {
    navLinks = [...baseNav.slice(0, 1), ...coopAdminNav, ...baseNav.slice(1)];
  }

  return (
    <aside className="w-64 bg-primary text-white flex flex-col">
      <div className="h-20 flex items-center justify-center text-2xl font-bold">
        KaziCoop
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navLinks.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 my-1 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center">
                  <item.icon className="h-6 w-6 mr-3" />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
