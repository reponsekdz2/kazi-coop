import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
import { SAVINGS_GOALS, TRANSACTIONS } from '../constants';
import { ArrowUpRightIcon, ArrowDownLeftIcon, BanknotesIcon, CreditCardIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../contexts/AppContext';
import { useLoan } from '../contexts/LoanContext';

const WalletPage: React.FC = () => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-light">{t('wallet.title')}</h1>
        <div className="flex gap-2">
          <Button variant="secondary">
            <ArrowDownLeftIcon className="h-4 w-4 mr-2 inline" />
            {t('wallet.request')}
          </Button>
          <Button>
            <ArrowUpRightIcon className="h-4 w-4 mr-2 inline" />
            {t('wallet.send')}
          </Button>
        </div>
      </div>

      <Card className="!p-0 mb-6">
         <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                {t('wallet.overview')}
            </button>
            <button 
                onClick={() => setActiveTab('loans')}
                className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'loans' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                {t('wallet.loanApplications')}
            </button>
        </div>
      </Card>
      
      {activeTab === 'overview' && <OverviewView />}
      {activeTab === 'loans' && <LoanApplicationsView />}

    </div>
  );
};

const OverviewView = () => {
    const { t } = useAppContext();
    const balance = TRANSACTIONS.reduce((acc, t) => t.type === 'deposit' ? acc + t.amount : acc - t.amount, 550000);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-primary to-blue-700 text-white">
            <p className="opacity-80">{t('wallet.totalBalance')}</p>
            <p className="text-4xl font-bold mt-2">RWF {balance.toLocaleString()}</p>
          </Card>
          <Card title={t('wallet.recentTransactions')} className="dark:bg-dark">
            <div className="space-y-3">
              {TRANSACTIONS.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between items-center p-2 rounded hover:bg-light dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${t.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                      {t.type === 'deposit' ? <ArrowDownLeftIcon className="h-5 w-5 text-green-600 dark:text-green-400"/> : <ArrowUpRightIcon className="h-5 w-5 text-red-600 dark:text-red-400"/>}
                    </div>
                    <div>
                      <p className="font-semibold text-dark dark:text-light">{t.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${t.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-dark dark:text-light'}`}>
                    {t.type === 'deposit' ? '+' : '-'} RWF {t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <FinancialMetricCard title={t('wallet.income')} value="RWF 800k" change="+5% MoM" isPositive={true} icon={BanknotesIcon}/>
                <FinancialMetricCard title={t('wallet.expenses')} value="RWF 250k" change="+2% MoM" isPositive={false} icon={CreditCardIcon}/>
            </div>
          <Card title={t('wallet.savingsGoals')} className="dark:bg-dark">
            <div className="space-y-4">
              {SAVINGS_GOALS.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <p className="font-medium text-dark dark:text-light">{goal.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div className="h-2 bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              })}
              <Button variant="secondary" className="w-full mt-4">
                <PlusIcon className="h-4 w-4 mr-2 inline" />
                {t('wallet.newGoal')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
}

const LoanApplicationsView = () => {
    const { applications } = useLoan();
    const { t } = useAppContext();

    const statusColors: { [key: string]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

    return (
        <Card title={t('wallet.loanApplications')} className="dark:bg-dark">
            {applications.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">{t('wallet.loanAmountHeader')}</th>
                                <th className="px-6 py-3">{t('wallet.loanPurposeHeader')}</th>
                                <th className="px-6 py-3">{t('wallet.loanPeriodHeader')}</th>
                                <th className="px-6 py-3">{t('wallet.loanStatusHeader')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id} className="bg-white border-b dark:bg-dark dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">RWF {app.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{app.purpose}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{app.repaymentPeriod} {t('common.months')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}>
                                            {t(`loanStatus.${app.status.toLowerCase()}`)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('wallet.noLoanApplications')}</p>
            )}
        </Card>
    );
};

export default WalletPage;