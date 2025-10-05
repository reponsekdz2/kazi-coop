// FIX: Populated the empty DashboardPage.tsx file.
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
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
  ScaleIcon
} from '@heroicons/react/24/outline';

const SeekerDashboard: React.FC = () => {
    const { user } = useAuth();
    const savings = user?.savingsBalance ?? 0;
    const shares = user?.cooperativeShare ?? 0;
    const netWorth = savings + shares;

    return (
        <div>
            {/* Financial Snapshot */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-dark mb-4">Financial Snapshot</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FinancialMetricCard title="Personal Savings" value={`RWF ${savings.toLocaleString()}`} change="+ RWF 5,000 this month" isPositive={true} icon={WalletIcon} />
                    <FinancialMetricCard title="Cooperative Share" value={`RWF ${shares.toLocaleString()}`} change="+ RWF 10,000 this month" isPositive={true} icon={UserGroupIcon} />
                    <FinancialMetricCard title="Total Net Worth" value={`RWF ${netWorth.toLocaleString()}`} change="+ RWF 15,000 this month" isPositive={true} icon={CurrencyDollarIcon} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={BriefcaseIcon} title="Active Applications" value={2} trend={1} data={[1, 1, 2, 2, 2]} />
                <StatCard icon={ChatBubbleLeftRightIcon} title="Unread Messages" value={1} trend={0} data={[3, 2, 2, 1, 1]}/>
                <StatCard icon={UserGroupIcon} title="My Cooperatives" value={1} trend={0} data={[1,1,1,1,1]}/>
                <StatCard icon={WalletIcon} title="Wallet Balance" value="RWF 85,000" trend={15} data={[50000, 60000, 70000, 85000]}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Quick Actions" className="lg:col-span-1">
                    <div className="space-y-3">
                       <Link to="/jobs"><Button className="w-full justify-start text-left !p-4"><BriefcaseIcon className="h-5 w-5 mr-3 inline"/>Find New Jobs</Button></Link>
                       <Link to="/cooperatives"><Button className="w-full justify-start text-left !p-4"><UserGroupIcon className="h-5 w-5 mr-3 inline"/>View My Cooperative</Button></Link>
                       <Link to="/wallet"><Button className="w-full justify-start text-left !p-4"><WalletIcon className="h-5 w-5 mr-3 inline"/>Manage My Wallet</Button></Link>
                    </div>
                </Card>
                <Card title="Recommended Jobs For You" className="lg:col-span-2">
                    <div className="space-y-4">
                        <JobRecommendation title="Senior Accountant" company="Kigali Financials" match="95%" />
                        <JobRecommendation title="React Native Developer" company="Mobile Innovations" match="88%" />
                        <JobRecommendation title="Customer Success Manager" company="GoGetters Inc." match="82%" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

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
