import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { APPLICATIONS } from '../constants';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
import RingHub from '../components/ui/RingHub';
import CareerProgressTracker from '../components/ui/CareerProgressTracker';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  WalletIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  UserCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedHubItem, setSelectedHubItem] = useState<string | null>(null);

    const savings = user?.savingsBalance ?? 0;
    const shares = user?.cooperativeShare ?? 0;
    const netWorth = savings + shares;

    const activityHubItems = [
        { id: 'profile', imageUrl: user?.avatarUrl || '', label: 'Profile Strength' },
        { id: 'apps', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png', label: 'Active Apps' },
        { id: 'savings', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2489/2489633.png', label: 'Savings Goal' },
        { id: 'coop', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', label: 'Co-op Health' },
    ];
    
    const hubDetails: {[key: string]: React.ReactNode} = {
        profile: <HubDetail icon={UserCircleIcon} title="Profile Strength" value="85%" description="A strong profile attracts more employers." />,
        apps: <HubDetail icon={BriefcaseIcon} title="Active Applications" value={APPLICATIONS.filter(a => a.userId === user?.id).length} description="Keep applying to increase your chances!"/>,
        savings: <HubDetail icon={BanknotesIcon} title="Savings Goal" value="68%" description="You're on track to buy your new laptop."/>,
        coop: <HubDetail icon={CheckBadgeIcon} title="Co-op Health" value="Good" description="You are in good standing with your Ikimina."/>,
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Financial Snapshot */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-dark mb-4">Financial Snapshot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FinancialMetricCard title="Personal Savings" value={`RWF ${savings.toLocaleString()}`} change="+ RWF 5,000 this month" isPositive={true} icon={WalletIcon} />
                        <FinancialMetricCard title="Cooperative Share" value={`RWF ${shares.toLocaleString()}`} change="+ RWF 10,000 this month" isPositive={true} icon={UserGroupIcon} />
                    </div>
                </div>

                <Card title="Career Progression">
                    <CareerProgressTracker currentStep={user?.careerProgress || 1} />
                </Card>

                <Card title="Recommended Jobs For You">
                    <div className="space-y-4">
                        <JobRecommendation title="Senior Accountant" company="Kigali Financials" match="95%" />
                        <JobRecommendation title="React Native Developer" company="Mobile Innovations" match="88%" />
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="My Activity Hub" className="flex flex-col items-center">
                    <RingHub items={activityHubItems} onSelect={setSelectedHubItem} size={320}>
                        <div className="text-center p-2">
                         {selectedHubItem ? hubDetails[selectedHubItem] : <HubDetail icon={UserGroupIcon} title="Select an Item" value="" description="Click an icon to see details."/>}
                        </div>
                    </RingHub>
                </Card>
                 <Card title="Quick Actions">
                    <div className="space-y-3">
                       <Link to="/jobs"><Button className="w-full justify-start text-left !p-4"><BriefcaseIcon className="h-5 w-5 mr-3 inline"/>Find New Jobs</Button></Link>
                       <Link to="/cooperatives"><Button className="w-full justify-start text-left !p-4"><UserGroupIcon className="h-5 w-5 mr-3 inline"/>View My Cooperative</Button></Link>
                       <Link to="/wallet"><Button className="w-full justify-start text-left !p-4"><WalletIcon className="h-5 w-5 mr-3 inline"/>Manage My Wallet</Button></Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const HubDetail: React.FC<{icon: React.ElementType, title: string, value: string | number, description: string}> = ({icon: Icon, title, value, description}) => (
    <>
        <Icon className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="font-bold text-dark">{title}</p>
        {value && <p className="text-2xl font-bold text-primary my-1">{value}</p>}
        <p className="text-xs text-gray-500">{description}</p>
    </>
);


const JobRecommendation: React.FC<{title: string, company: string, match: string}> = ({ title, company, match }) => (
    <div className="flex justify-between items-center p-4 bg-light rounded-lg hover:bg-gray-200 transition-colors">
        <div>
            <p className="font-bold text-dark">{title}</p>
            <p className="text-sm text-gray-500">{company}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-center">
                <p className="font-bold text-primary text-lg">{match}</p>
                <p className="text-xs text-gray-500">Match</p>
            </div>
            <Link to="/jobs">
                <Button variant="secondary">View <ArrowRightIcon className="h-4 w-4 ml-1 inline"/></Button>
            </Link>
        </div>
    </div>
);


const EmployerDashboard: React.FC = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title="Active Postings" value={3} trend={1} data={[2,2,3,3,3]}/>
                <StatCard icon={UserGroupIcon} title="New Applicants" value={5} trend={2} data={[1,2,3,4,5]}/>
                <StatCard icon={ChatBubbleLeftRightIcon} title="Unread Messages" value={2} trend={-1} data={[4,3,3,2,2]}/>
                <StatCard icon={BanknotesIcon} title="Hiring Budget Used" value="45%" trend={5} data={[20,30,40,45]}/>
            </div>
             <Card title="Recent Applicants">
                <p className="text-center py-8 text-gray-500">A list of recent applicants would be displayed here.</p>
            </Card>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={UserGroupIcon} title="Total Members" value={256} trend={5} data={[240,245,250,256]}/>
                <StatCard icon={BriefcaseIcon} title="Total Cooperatives" value={12} trend={1} data={[10,11,11,12]}/>
                <StatCard icon={BanknotesIcon} title="Total Platform Savings" value="RWF 48.7M" trend={8} data={[40,42,44,48.7]}/>
                <StatCard icon={ChartBarIcon} title="Platform Growth" value="5.2%" trend={2} data={[4,4.5,4.8,5.2]}/>
            </div>
            <Card title="Platform Analytics Overview">
                <p className="text-center py-8 text-gray-500">
                    A comprehensive chart showing platform growth would be displayed here.
                    <Link to="/analytics" className="block mt-4"><Button>Go to Full Analytics</Button></Link>
                </p>
            </Card>
        </div>
    );
};


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const renderDashboard = () => {
      switch (user?.role) {
          case UserRole.SEEKER:
              return <SeekerDashboard />;
          case UserRole.EMPLOYER:
              return <EmployerDashboard />;
          case UserRole.COOP_ADMIN:
              return <AdminDashboard />;
          default:
              return <p>Loading dashboard...</p>;
      }
  }

  return (
    <div>
        {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
