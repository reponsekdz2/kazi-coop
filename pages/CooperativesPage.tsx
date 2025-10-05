import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { Cooperative } from '../types';
import { UserGroupIcon, ArrowTrendingUpIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import { useLoan } from '../contexts/LoanContext';
import { useAppContext } from '../contexts/AppContext';

const CooperativesPage: React.FC = () => {
    const { cooperatives, userCooperatives } = useCooperatives();
    const { t } = useAppContext();
    const [view, setView] = useState('all'); // 'all' or 'my'
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

    const cooperativesToShow = view === 'my' ? userCooperatives : cooperatives;

    const openLoanModal = (coop: Cooperative) => {
        setSelectedCoop(coop);
        setIsLoanModalOpen(true);
    };

    const closeLoanModal = () => {
        setIsLoanModalOpen(false);
        setSelectedCoop(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark dark:text-light">{t('cooperatives.title')}</h1>
                <Button>{t('cooperatives.create')}</Button>
            </div>
            
            <Card className="!p-0 mb-6">
                 <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setView('all')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${view === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {t('cooperatives.exploreAll')}
                    </button>
                    <button 
                        onClick={() => setView('my')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${view === 'my' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {t('cooperatives.myCooperatives')} ({userCooperatives.length})
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperativesToShow.map(coop => (
                    <CooperativeCard key={coop.id} cooperative={coop} onLoanRequest={() => openLoanModal(coop)} />
                ))}
                 {cooperativesToShow.length === 0 && view === 'my' && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">{t('cooperatives.notJoined')}</p>
                        <Button className="mt-4" onClick={() => setView('all')}>{t('cooperatives.explore')}</Button>
                    </div>
                )}
            </div>

            {selectedCoop && (
                <LoanRequestModal
                    isOpen={isLoanModalOpen}
                    onClose={closeLoanModal}
                    cooperativeName={selectedCoop.name}
                />
            )}
        </div>
    );
};


const CooperativeCard: React.FC<{ cooperative: Cooperative, onLoanRequest: () => void }> = ({ cooperative, onLoanRequest }) => {
    const { user } = useAuth();
    const { t } = useAppContext();
    const isMember = user?.cooperativeIds?.includes(cooperative.id);

    return (
        <Card className="!p-0 overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-dark">
            <div className="relative h-40">
                <img src={cooperative.imageUrl} alt={cooperative.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{cooperative.name}</h3>
                    <p className="text-sm text-gray-200">{t('cooperatives.createdBy')} {cooperative.creator}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="grid grid-cols-3 gap-4 text-center mb-4 border-b pb-4 dark:border-gray-700">
                    <div>
                        <UserGroupIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">{cooperative.members}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.members')}</p>
                    </div>
                    <div>
                        <BanknotesIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">RWF {cooperative.totalSavings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.totalSavings')}</p>
                    </div>
                    <div>
                        <ArrowTrendingUpIcon className="h-6 w-6 mx-auto text-primary mb-1"/>
                        <p className="font-bold text-dark dark:text-light">RWF {cooperative.loanPool.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('cooperatives.loanPool')}</p>
                    </div>
                </div>
                <div className="mt-auto pt-2 space-y-2">
                    {isMember ? (
                        <>
                            <Button variant="secondary" className="w-full">{t('cooperatives.viewDashboard')}</Button>
                            <Button onClick={onLoanRequest} className="w-full">{t('cooperatives.requestLoan')}</Button>
                        </>
                    ) : (
                         <Button className="w-full">{t('cooperatives.requestToJoin')}</Button>
                    )}
                </div>
            </div>
        </Card>
    )
};

interface LoanRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    cooperativeName: string;
}

const LoanRequestModal: React.FC<LoanRequestModalProps> = ({ isOpen, onClose, cooperativeName }) => {
    const { submitLoanApplication } = useLoan();
    const { t } = useAppContext();
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [period, setPeriod] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitLoanApplication({
            amount: Number(amount),
            purpose,
            repaymentPeriod: Number(period),
        });
        onClose();
        // Reset form
        setAmount('');
        setPurpose('');
        setPeriod('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('cooperatives.loanRequestTitle')} ${cooperativeName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.loanAmountLabel')}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 500000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.purposeLabel')}</label>
                    <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g. Business equipment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.repaymentPeriodLabel')}</label>
                    <input
                        type="number"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
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

export default CooperativesPage;