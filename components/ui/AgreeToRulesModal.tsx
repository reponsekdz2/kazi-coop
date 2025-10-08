
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Cooperative } from '../../types';

interface AgreeToRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cooperative: Cooperative | null;
  onAgree: () => void;
}

const AgreeToRulesModal: React.FC<AgreeToRulesModalProps> = ({ isOpen, onClose, cooperative, onAgree }) => {
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = () => {
        if (!cooperative) return;
        onAgree();
    }
    
    if (!cooperative) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Join ${cooperative.name}`}>
            <div className="space-y-4">
                <h3 className="font-bold text-dark dark:text-light">Rules & Regulations</h3>
                <div className="max-h-48 overflow-y-auto p-3 bg-light dark:bg-dark rounded-md border dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{cooperative.rulesAndRegulations}</p>
                </div>
                 <div className="flex items-start">
                    <input 
                        id="agree-checkbox"
                        type="checkbox" 
                        checked={agreed} 
                        onChange={() => setAgreed(!agreed)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="agree-checkbox" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        I have read and agree to the rules and regulations of this cooperative.
                    </label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!agreed}>Agree & Join</Button>
                </div>
            </div>
        </Modal>
    );
};

export default AgreeToRulesModal;
