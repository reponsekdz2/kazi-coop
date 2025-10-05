import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCooperatives } from '../contexts/CooperativeContext';
import { UserGroupIcon, BanknotesIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';

const CooperativesPage: React.FC = () => {
    const { user } = useAuth();
    const { cooperatives, createCooperative } = useCooperatives();
    const { t } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isEmployer = user?.role === UserRole.EMPLOYER;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">
                        {isEmployer ? t('cooperatives.manageTitle') : t('cooperatives.pageTitle')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        {isEmployer ? t('cooperatives.manageSubtitle') : t('cooperatives.pageSubtitle')}
                    </p>
                </div>
                {isEmployer && <Button onClick={() => setIsCreateModalOpen(true)}>{t('cooperatives.create')}</Button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cooperatives.map(coop => (
                    <Card key={coop.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-dark dark:text-light mb-2">{coop.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{coop.description}</p>
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                                    <span>{coop.members.length} Members</span>
                                </div>
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <BanknotesIcon className="h-5 w-5 mr-2 text-green-500" />
                                    <span>RWF {coop.totalSavings.toLocaleString()} Total Savings</span>
                                </div>
                                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <ArrowUpRightIcon className="h-5 w-5 mr-2 text-blue-500" />
                                    <span>RWF {coop.contributionAmount.toLocaleString()} / {coop.contributionFrequency}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Button variant="secondary" className="flex-1">{isEmployer ? t('cooperatives.manageBtn') : t('cooperatives.viewDetails')}</Button>
                            {!isEmployer && <Button className="flex-1">{t('cooperatives.requestJoin')}</Button>}
                        </div>
                    </Card>
                ))}
            </div>

            {cooperatives.length === 0 && isEmployer && (
                 <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t('cooperatives.noCooperatives')}</p>
                </div>
            )}
            
            <NewCooperativeModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreate={createCooperative}
            />
        </div>
    );
};


interface NewCooperativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (details: any) => void;
}

const NewCooperativeModal: React.FC<NewCooperativeModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contributionAmount: 5000,
        contributionFrequency: 'Monthly',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'contributionAmount' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
        setFormData({ name: '', description: '', contributionAmount: 5000, contributionFrequency: 'Monthly' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('cooperatives.createModalTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.name')}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.description')}</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.contributionAmount')}</label>
                    <input type="number" name="contributionAmount" value={formData.contributionAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cooperatives.contributionFrequency')}</label>
                    <select name="contributionFrequency" value={formData.contributionFrequency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Monthly</option>
                        <option>Weekly</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit">{t('cooperatives.create')}</Button>
                </div>
            </form>
        </Modal>
    );
}

export default CooperativesPage;