

import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Add money to your KaziCoop wallet via Mobile Money.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (RWF)</label>
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
          <Button type="submit" disabled={amount <= 0}>Confirm</Button>
        </div>
      </form>
    </Modal>
  );
};

export default DepositModal;
