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
    Cog6ToothIcon, 
    ArrowLeftOnRectangleIcon,
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const commonLinks = [
  { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/messages', icon: ChatBubbleLeftEllipsisIcon, label: 'Messages' },
  { to: '/profile', icon: Cog6ToothIcon, label: 'Settings' },
];

const seekerLinks = [
  { to: '/jobs', icon: BriefcaseIcon, label: 'Find Jobs' },
  { to: '/interviews', icon: CalendarDaysIcon, label: 'My Interviews' },
  { to: '/cooperatives', icon: UserGroupIcon, label: 'My Cooperative' },
  { to: '/wallet', icon: WalletIcon, label: 'My Wallet' },
  { to: '/learning', icon: AcademicCapIcon, label: 'Learning Hub' },
];

const employerLinks = [
  { to: '/jobs', icon: BriefcaseIcon, label: 'Job Postings' },
  { to: '/analytics/user', icon: ChartBarIcon, label: 'User Analytics' },
];

const adminLinks = [
  { to: '/analytics', icon: ChartBarIcon, label: 'Platform Analytics' },
  { to: '/cooperatives', icon: UserGroupIcon, label: 'Manage Co-ops' },
];


const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    
    const links = React.useMemo(() => {
        switch(user?.role) {
            case UserRole.SEEKER:
                return [...seekerLinks];
            case UserRole.EMPLOYER:
                return [...employerLinks];
            case UserRole.COOP_ADMIN:
                return [...adminLinks];
            default:
                return [];
        }
    }, [user]);

    const allLinks = [ ...commonLinks.slice(0, 1), ...links, ...commonLinks.slice(1) ];

  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">KaziCoop</Link>
        </div>
        <nav className="flex-1 overflow-y-auto">
            <ul className="py-4 px-2">
                {allLinks.map(({ to, icon: Icon, label }) => (
                    <li key={to}>
                        <NavLink 
                            to={to} 
                            className={({isActive}) => 
                                `flex items-center p-3 my-1 rounded-lg transition-colors text-gray-600 hover:bg-light hover:text-primary ${isActive ? '!bg-primary !text-white' : ''}`
                            }
                        >
                            <Icon className="h-6 w-6 mr-3" />
                            <span className="font-medium">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="p-4 border-t">
            <button onClick={logout} className="flex items-center p-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3"/>
                <span className="font-medium">Logout</span>
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;
