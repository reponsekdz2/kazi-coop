
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  ChartBarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  CreditCardIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: Cog6ToothIcon },
  ];

  const seekerNav = [
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Cooperatives', href: '/cooperatives', icon: UserGroupIcon },
    { name: 'Wallet', href: '/wallet', icon: CreditCardIcon },
    { name: 'Learning', href: '/learning', icon: AcademicCapIcon },
  ];

  const employerNav = [
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  ];
  
  const coopAdminNav = [
    { name: 'Cooperatives', href: '/cooperatives', icon: UserGroupIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  let navLinks = baseNav;
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
                  `flex items-center px-4 py-3 my-1 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
