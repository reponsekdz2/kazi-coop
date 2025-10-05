import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { t } = useAppContext();
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState(0);
  const [momoNumber, setMomoNumber] = useState('078');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || amount <= 0) return;

    addTransaction({
      userId: user.id,
      date: new Date().toISOString(),
      description: 'Mobile Money Deposit',
      amount: amount,
      category: 'Income',
    });

    setAmount(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.depositTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('wallet.depositSubtitle')}</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.loans.amount')} (RWF)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={e => setAmount(parseInt(e.target.value) || 0)}
            required
            min="1000"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g., 50000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('wallet.momoNumber')}</label>
          <input
            type="tel"
            value={momoNumber}
            onChange={e => setMomoNumber(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="078 XXX XXXX"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" disabled={amount <= 0}>{t('wallet.confirm')}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default DepositModal;