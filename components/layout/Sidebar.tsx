import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { 
  ChartBarIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  WalletIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  TicketIcon
} from '@heroicons/react/24/outline';

const seekerLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
  { name: 'Jobs', path: '/jobs', icon: BriefcaseIcon },
  { name: 'Messages', path: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Interviews', path: '/interviews', icon: TicketIcon },
  { name: 'Cooperatives', path: '/cooperatives', icon: UserGroupIcon },
  { name: 'My Wallet', path: '/wallet', icon: WalletIcon },
  { name: 'Learning', path: '/learning', icon: AcademicCapIcon },
];

const employerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
    { name: 'Jobs', path: '/jobs', icon: BriefcaseIcon },
    { name: 'Messages', path: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Interviews', path: '/interviews', icon: TicketIcon },
];

const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
    { name: 'Cooperatives', path: '/cooperatives', icon: UserGroupIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  let navLinks = seekerLinks;
  if (user?.role === UserRole.EMPLOYER) {
    navLinks = employerLinks;
  } else if (user?.role === UserRole.COOP_ADMIN) {
    navLinks = adminLinks;
  }

  const activeLinkClass = "bg-primary text-white";
  const inactiveLinkClass = "text-gray-600 hover:bg-blue-100 hover:text-primary";
  
  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">KaziCoop</Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t">
         <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md mb-2 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Cog6ToothIcon className="h-5 w-5 mr-3" />
            My Profile
          </NavLink>
        <button onClick={logout} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${inactiveLinkClass}`}>
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;