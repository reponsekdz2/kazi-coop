

import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

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
  const [momoNumber, setMomoNumber] = useState('078');
  
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
      description: 'Mobile Money Withdrawal',
      amount: -amount,
      category: 'Withdrawal',
    });

    setAmount(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Transfer money from your wallet to your Mobile Money account.</p>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">Current Balance: <span className="font-bold">RWF {currentBalance.toLocaleString()}</span></p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (RWF)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={e => setAmount(parseInt(e.target.value) || 0)}
            required
            max={currentBalance}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g., 10000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Money Number</label>
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
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!canWithdraw}>Confirm</Button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;
