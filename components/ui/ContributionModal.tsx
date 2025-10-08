
import React, { useState, useEffect } from 'react';
import Modal from '../layout/Modal';
import Button from './Button';
import { Cooperative } from '../../types';
import { useToast } from '../../contexts/ToastContext';

interface ContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    cooperative: Cooperative | null;
}

const ContributionModal: React.FC<ContributionModalProps> = ({ isOpen, onClose, cooperative }) => {
    const [amount, setAmount] = useState(0);
    const { addToast } = useToast();

    useEffect(() => {
        if (cooperative) {
            setAmount(cooperative.contributionAmount);
        }
    }, [cooperative, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cooperative || amount <= 0) return;
        addToast(`Successfully contributed RWF ${amount.toLocaleString()} to ${cooperative.name}.`, 'success');
        onClose();
    };
    
    if (!cooperative) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Contribute to ${cooperative.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">The standard contribution is RWF {cooperative.contributionAmount.toLocaleString()}.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Amount (RWF)</label>
                    <input 
                        type="number" 
                        value={amount || ''}
                        onChange={e => setAmount(parseInt(e.target.value) || 0)}
                        required
                        min="1"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Confirm Contribution</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ContributionModal;