
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from './Button';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { PaymentProvider } from '../../types';
import { DevicePhoneMobileIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';


interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, currentBalance }) => {
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const { addToast } = useToast();
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState<PaymentProvider>('Mobile Money');
  const [providerDetails, setProviderDetails] = useState({
      momoNumber: '078',
      paypalEmail: '',
      bankAccount: ''
  });
  
  const canWithdraw = amount > 0 && amount <= currentBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canWithdraw) {
        addToast('Invalid withdrawal amount.', 'error');
        return;
    }

    addTransaction({
      userId: user.id,
      date: new Date().toISOString(),
      description: `Withdrawal via ${provider}`,
      amount: -amount,
      category: 'Withdrawal',
      provider: provider
    });

    setAmount(0);
    onClose();
  };
  
   const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setProviderDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const providerOptions = [
      { name: 'Mobile Money', icon: DevicePhoneMobileIcon },
      { name: 'PayPal', icon: () => <svg role="img" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.854 16.237c.454.92 1.34 1.543 2.548 1.543h.02c2.184 0 3.6-1.55 3.94-3.815.113-.75.01-1.31-.223-1.688-.234-.378-.65-.658-1.18-.81l-.26-.073c-.42-.116-.72-.22-.88-.35-.205-.168-.28-.38-.24-.6s.18-.46.46-.62c.28-.16.635-.233 1.01-.233h.02c1.42 0 2.484 1.04 2.754 2.73l.02.158h2.32c-.04-.2-.09-.41-.15-.62-.353-1.22-.98-2.26-1.82-3.04-.84-.78-1.85-1.32-2.98-1.57-.35-.08-.71-.11-1.07-.11H9.424c-2.81 0-4.98 1.55-5.52 4.06-.33 1.55.15 2.76.92 3.6.77.84 1.83 1.35 2.98 1.56.37.07.74.1 1.11.1z"/></svg> },
      { name: 'Bank Transfer', icon: BuildingLibraryIcon },
  ]


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Transfer money from your wallet.</p>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">Current Balance: <span className="font-bold">RWF {currentBalance.toLocaleString()}</span></p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (RWF)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={e => setAmount(parseInt(e.target.value) || 0)}
            required
            max={currentBalance}
            className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-2xl font-bold"
            placeholder="10,000"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Withdraw To</label>
            <div className="grid grid-cols-3 gap-2">
                {providerOptions.map(opt => (
                    <button type="button" key={opt.name} onClick={() => setProvider(opt.name as PaymentProvider)}
                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-colors ${provider === opt.name ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}`}>
                        <opt.icon />
                        <span className="text-xs mt-1">{opt.name}</span>
                    </button>
                ))}
            </div>
        </div>
         {provider === 'Mobile Money' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Money Number</label>
                <input type="tel" name="momoNumber" value={providerDetails.momoNumber} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="078 XXX XXXX" />
            </div>
        )}
         {provider === 'PayPal' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PayPal Email</label>
                <input type="email" name="paypalEmail" value={providerDetails.paypalEmail} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="your.email@example.com" />
            </div>
        )}
         {provider === 'Bank Transfer' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Account Number</label>
                <input type="text" name="bankAccount" value={providerDetails.bankAccount} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="1000..." />
            </div>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!canWithdraw}>Confirm Withdrawal</Button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;