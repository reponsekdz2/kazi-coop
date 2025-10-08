
// FIX: Created TransferModal.tsx to resolve module not found error.
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from './Button';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
// FIX: Import mock data from the new constants file.
import { USERS } from '../../constants';
import { useToast } from '../../contexts/ToastContext';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, currentBalance }) => {
  const { user } = useAuth();
  const { addTransfer } = useTransactions();
  const { addToast } = useToast();
  const [amount, setAmount] = useState(0);
  const [recipientId, setRecipientId] = useState('');
  const [note, setNote] = useState('');

  const canTransfer = amount > 0 && amount <= currentBalance && !!recipientId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canTransfer) {
      addToast('Please select a recipient and enter a valid amount.', 'error');
      return;
    }
    addTransfer(recipientId, amount, note);
    setAmount(0);
    setRecipientId('');
    setNote('');
    onClose();
  };
  
  const recipients = USERS.filter(u => u.id !== user?.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Money">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Send funds to another KaziCoop user instantly.</p>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">Available Balance: <span className="font-bold">RWF {currentBalance.toLocaleString()}</span></p>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
            <select
                value={recipientId}
                onChange={e => setRecipientId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
                <option value="" disabled>Select a user</option>
                {recipients.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g., For lunch"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!canTransfer}>Send</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;