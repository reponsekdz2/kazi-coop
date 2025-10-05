import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FinancialMetricCard from '../components/ui/FinancialMetricCard';
import { ArrowUpRightIcon, ArrowDownLeftIcon, BanknotesIcon, CreditCardIcon, PlusIcon, QuestionMarkCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../contexts/AppContext';
import { useLoan } from '../contexts/LoanContext';
import { useTransactions } from '../contexts/TransactionContext';
import Modal from '../components/ui/Modal';
import { useSavingsGoals } from '../contexts/SavingsGoalContext';
import RingHub from '../components/ui/RingHub';
import RingProgress from '../components/ui/RingProgress';
import { Link } from 'react-router-dom';
import { LoanApplication } from '../types';
// FIX: Import useCooperatives hook
import { useCooperatives } from '../contexts/CooperativeContext';

// This is a mock starting balance. In a real app, this would come from an API.
const MOCK_STARTING_BALANCE = 550000;

const WalletPage: React.FC = () => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState('overview');
    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-light">{t('wallet.title')}</h1>
        <div className="flex gap-2">
           <Link to="/help">
              <Button variant="secondary">
                <QuestionMarkCircleIcon className="h-4 w-4 mr-2 inline" />
                {t('common.help')}
              </Button>
            </Link>
           <Button variant="secondary" onClick={() => setIsAddTransactionModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2 inline" />
            {t('wallet.addTransaction')}
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
                onClick={() => setActiveTab('savings')}
                className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'savings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                {t('wallet.savingsGoalsTab')}
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
      {activeTab === 'savings' && <SavingsGoalsView />}
      {activeTab === 'loans' && <LoanApplicationsView />}

      <AddTransactionModal isOpen={isAddTransactionModalOpen} onClose={() => setIsAddTransactionModalOpen(false)} />
    </div>
  );
};

const LoanReminder: React.FC = () => {
    const { applications } = useLoan();
    const { t } = useAppContext();
    const now = new Date();

    const upcomingLoans = applications
        .filter(app => app.status === 'Approved')
        .map(app => {
            const nextPayment = app.repaymentSchedule.find(p => p.status === 'pending');
            if (!nextPayment) return null;
            const dueDate = new Date(nextPayment.dueDate);
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
            if (daysUntilDue <= 30 && daysUntilDue >= 0) {
                return { ...app, daysUntilDue, nextPaymentAmount: nextPayment.amount };
            }
            return null;
        })
        .filter(Boolean) as (LoanApplication & { daysUntilDue: number; nextPaymentAmount: number })[];

    if (upcomingLoans.length === 0) return null;

    return (
        <Card title={t('wallet.upcomingPayments')} className="dark:bg-dark">
            <div className="space-y-3">
                {upcomingLoans.map(loan => (
                     <div key={loan.id} className="flex justify-between items-center p-2 rounded bg-light dark:bg-gray-700">
                         <div className="flex items-center">
                             <div className="p-2 rounded-full mr-3 bg-blue-100 dark:bg-blue-900/50">
                                 <CalendarDaysIcon className="h-5 w-5 text-primary"/>
                             </div>
                             <div>
                                 <p className="font-semibold text-dark dark:text-light">{loan.purpose}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {/* FIX: The translation function `t` does not support interpolation as an argument. Use string.replace instead. */}
                                    {t('wallet.dueInDays').replace('{days}', loan.daysUntilDue.toString())}
                                </p>
                             </div>
                         </div>
                         <p className="font-bold text-dark dark:text-light">
                             RWF {loan.nextPaymentAmount.toLocaleString()}
                         </p>
                     </div>
                ))}
            </div>
        </Card>
    );
};


const OverviewView = () => {
    const { t } = useAppContext();
    const { transactions } = useTransactions();
    
    const balance = transactions.reduce((acc, t) => acc + t.amount, MOCK_STARTING_BALANCE);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-primary to-blue-700 text-white">
            <p className="opacity-80">{t('wallet.totalBalance')}</p>
            <p className="text-4xl font-bold mt-2">RWF {balance.toLocaleString()}</p>
          </Card>
          <LoanReminder />
          <Card title={t('wallet.recentTransactions')} className="dark:bg-dark">
            <div className="space-y-3">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between items-center p-2 rounded hover:bg-light dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${t.amount > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                      {t.amount > 0 ? <ArrowDownLeftIcon className="h-5 w-5 text-green-600 dark:text-green-400"/> : <ArrowUpRightIcon className="h-5 w-5 text-red-600 dark:text-red-400"/>}
                    </div>
                    <div>
                      <p className="font-semibold text-dark dark:text-light">{t.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${t.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-dark dark:text-light'}`}>
                    {t.amount > 0 ? '+' : ''} RWF {t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <FinancialMetricCard title={t('wallet.income')} value="RWF 800k" change="+5% MoM" isPositive={true} icon={BanknotesIcon}/>
                <FinancialMetricCard title={t('wallet.expenses')} value="RWF 250k" change="+2% MoM" isPositive={false} icon={CreditCardIcon}/>
            </div>
        </div>
      </div>
    )
}

const SavingsGoalsView = () => {
    const { t } = useAppContext();
    const { savingsGoals } = useSavingsGoals();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(savingsGoals.length > 0 ? savingsGoals[0].id : null);

    const goalImages = [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=464", // Laptop
        "https://images.unsplash.com/photo-1593079904748-497ace848491?q=80&w=870", // Piggy bank
        "https://images.unsplash.com/photo-1502920514358-90b8f7272111?q=80&w=870", // Car
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=870", // House
    ];

    const ringHubItems = savingsGoals.map((goal, index) => ({
        id: goal.id,
        label: goal.name,
        imageUrl: goalImages[index % goalImages.length],
    }));

    const selectedGoal = savingsGoals.find(g => g.id === selectedGoalId);
    const progress = selectedGoal ? Math.min((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100, 100) : 0;

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-2 inline" />
                    {t('wallet.createNewGoal')}
                </Button>
            </div>
            {savingsGoals.length > 0 ? (
                 <Card className="flex flex-col md:flex-row items-center justify-center gap-8 p-8">
                     <RingHub items={ringHubItems} onSelect={setSelectedGoalId} size={400}>
                         {selectedGoal ? (
                              <div className="text-center">
                                  <h3 className="text-xl font-bold text-dark">{selectedGoal.name}</h3>
                                  <p className="text-3xl font-bold text-primary my-2">RWF {selectedGoal.currentAmount.toLocaleString()}</p>
                                  <p className="text-sm text-gray-500">of RWF {selectedGoal.targetAmount.toLocaleString()}</p>
                              </div>
                         ) : <p className="text-gray-500 text-center">{t('wallet.selectGoal')}</p>}
                     </RingHub>
                     <div className="flex-shrink-0">
                         <RingProgress 
                            percentage={Math.round(progress)}
                            size={200}
                            strokeWidth={15}
                         />
                     </div>
                 </Card>
            ) : (
                <Card className="text-center py-12">
                     <p className="text-gray-500 dark:text-gray-400">{t('wallet.noSavingsGoals')}</p>
                </Card>
            )}
             <AddSavingsGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

const AddSavingsGoalModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {
    const { t } = useAppContext();
    const { addSavingsGoal } = useSavingsGoals();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const target = parseFloat(targetAmount);
        const current = parseFloat(currentAmount) || 0;

        if (isNaN(target) || target <= 0 || isNaN(current) || current < 0 || current > target) return;
        
        addSavingsGoal({
            name,
            targetAmount: target,
            currentAmount: current,
        });

        onClose();
        setName('');
        setTargetAmount('');
        setCurrentAmount('');
    }

    const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.newGoalTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.goalNameLabel')}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New Laptop" className={commonInputStyles} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.targetAmountLabel')}</label>
                    <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="e.g. 1500000" className={commonInputStyles} required min="1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.currentAmountLabel')}</label>
                    <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="e.g. 450000" className={commonInputStyles} min="0" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddTransactionModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {
    const { t } = useAppContext();
    const { addTransaction } = useTransactions();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'deposit' | 'withdrawal' | 'payment'>('payment');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;

        addTransaction({
            description,
            amount: type === 'deposit' ? numericAmount : -numericAmount,
            type,
            date: new Date(date).toISOString(),
        });

        onClose();
        setDescription('');
        setAmount('');
        setType('payment');
        setDate(new Date().toISOString().split('T')[0]);
    }

    const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.newTransactionTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.descriptionLabel')}</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Coffee with a client" className={commonInputStyles} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.amountLabel')}</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className={commonInputStyles} required min="0.01" step="0.01" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.typeLabel')}</label>
                        <select value={type} onChange={(e) => setType(e.target.value as any)} className={commonInputStyles}>
                            <option value="payment">{t('wallet.payment')}</option>
                            <option value="withdrawal">{t('wallet.withdrawal')}</option>
                            <option value="deposit">{t('wallet.deposit')}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.dateLabel')}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={commonInputStyles} required />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};


const LoanApplicationsView = () => {
    const { applications } = useLoan();
    const { t } = useAppContext();
    const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
    const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

    const openRepayModal = (loan: LoanApplication) => {
        setSelectedLoan(loan);
        setIsRepayModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {applications.length > 0 ? (
                applications.map(app => (
                    <LoanCard key={app.id} loan={app} onRepay={() => openRepayModal(app)} />
                ))
            ) : (
                <Card className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t('wallet.noLoanApplications')}</p>
                </Card>
            )}
            {selectedLoan && isRepayModalOpen && (
                <RepaymentModal 
                    isOpen={isRepayModalOpen}
                    onClose={() => setIsRepayModalOpen(false)}
                    loan={selectedLoan}
                />
            )}
        </div>
    );
};

const LoanCard: React.FC<{ loan: LoanApplication, onRepay: () => void }> = ({ loan, onRepay }) => {
    const { t } = useAppContext();
    const { cooperatives } = useCooperatives();
    const cooperative = cooperatives.find(c => c.id === loan.cooperativeId);
    
    const progress = loan.amount > 0 ? ((loan.amount - loan.remainingAmount) / loan.amount) * 100 : 0;

    const statusColors: { [key: string]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Fully Repaid': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    
    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                         <h3 className="text-lg font-bold text-dark dark:text-light">{loan.purpose}</h3>
                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[loan.status]}`}>
                            {t(`loanStatus.${loan.status.toLowerCase().replace(' ', '')}`)}
                        </span>
                    </div>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('wallet.loanFrom')} {cooperative?.name}</p>
                   
                   {loan.status === 'Approved' && (
                        <div>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('wallet.remainingAmount')}</span>
                                <span className="text-xl font-bold text-dark dark:text-light">RWF {loan.remainingAmount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-right text-gray-500 mt-1">RWF {loan.amount.toLocaleString()} {t('wallet.total')}</p>
                        </div>
                   )}

                   {(loan.status === 'Pending' || loan.status === 'Rejected') && (
                        <p className="text-2xl font-bold text-dark dark:text-light">RWF {loan.amount.toLocaleString()}</p>
                   )}

                </div>
                {(loan.status === 'Approved') && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-2 md:ml-6">
                        <RingProgress percentage={Math.round(progress)} size={80} strokeWidth={8} />
                        <Button onClick={onRepay} className="w-full">{t('wallet.makeRepayment')}</Button>
                    </div>
                )}
            </div>
        </Card>
    );
}

const RepaymentModal: React.FC<{ isOpen: boolean, onClose: () => void, loan: LoanApplication }> = ({ isOpen, onClose, loan }) => {
    const { t } = useAppContext();
    const { makeRepayment } = useLoan();
    const [amount, setAmount] = useState('');
    
    const nextInstallment = loan.repaymentSchedule.find(p => p.status === 'pending');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if(isNaN(numAmount) || numAmount <= 0) return;
        makeRepayment(loan.id, numAmount);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('wallet.repayLoanFor')} ${loan.purpose}`}>
            <div className="mb-4">
                <p><span className="font-semibold">{t('wallet.remainingAmount')}:</span> RWF {loan.remainingAmount.toLocaleString()}</p>
                {nextInstallment && (
                    <p><span className="font-semibold">{t('wallet.nextPaymentDue')}:</span> RWF {nextInstallment.amount.toLocaleString()} on {new Date(nextInstallment.dueDate).toLocaleDateString()}</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.repaymentAmount')}</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder={nextInstallment?.amount.toString() || '0'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required 
                        min="1"
                        max={loan.remainingAmount}
                    />
                </div>
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('common.submit')}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default WalletPage;