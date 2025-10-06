

import React, { useState, useEffect } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Cooperative } from '../../types';

interface EditCooperativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedDetails: Partial<Cooperative>) => void;
    cooperative: Cooperative;
}

const EditCooperativeModal: React.FC<EditCooperativeModalProps> = ({ isOpen, onClose, onSave, cooperative }) => {
    const [details, setDetails] = useState({
        name: '',
        description: '',
        contributionAmount: 5000,
        contributionFrequency: 'Monthly',
        rulesAndRegulations: ''
    });

    useEffect(() => {
        if (cooperative) {
            setDetails({
                name: cooperative.name,
                description: cooperative.description,
                contributionAmount: cooperative.contributionAmount,
                contributionFrequency: cooperative.contributionFrequency,
                rulesAndRegulations: cooperative.rulesAndRegulations
            });
        }
    }, [cooperative, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: name === 'contributionAmount' ? parseInt(value) : value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Cast `contributionFrequency` to the correct union type to resolve the type error.
        onSave({
            ...details,
            contributionFrequency: details.contributionFrequency as 'Weekly' | 'Monthly'
        });
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${cooperative.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooperative Name</label>
                    <input type="text" name="name" value={details.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={details.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution Amount (RWF)</label>
                        <input type="number" name="contributionAmount" value={details.contributionAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                        <select name="contributionFrequency" value={details.contributionFrequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rules & Regulations</label>
                    <textarea name="rulesAndRegulations" value={details.rulesAndRegulations} onChange={handleChange} rows={5} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditCooperativeModal;