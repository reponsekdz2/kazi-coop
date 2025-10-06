import React, { useState, useEffect } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Job } from '../../types';
import { COMPANIES } from '../../constants';

interface NewJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (jobData: Omit<Job, 'id' | 'employerId' | 'isSaved'>) => void;
    job?: Job | null;
}

const NewJobModal: React.FC<NewJobModalProps> = ({ isOpen, onClose, onSave, job }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time' as Job['type'],
        description: '',
        requirements: '',
        status: 'Open' as Job['status'],
        salary: '',
        workersNeeded: '',
        rating: '',
        imageUrl: '',
    });
    
    useEffect(() => {
        if(job) {
            const companyName = COMPANIES.find(c => c.id === job.companyId)?.name || '';
            setFormData({
                title: job.title,
                company: companyName,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: job.requirements.join(', '),
                status: job.status || 'Open',
                salary: job.salary?.toString() || '',
                workersNeeded: job.workersNeeded?.toString() || '',
                rating: job.rating?.toString() || '',
                imageUrl: job.imageUrl || '',
            });
        } else {
             setFormData({
                title: '', company: '', location: '', type: 'Full-time',
                description: '', requirements: '', status: 'Open',
                salary: '', workersNeeded: '', rating: '', imageUrl: '',
            });
        }
    }, [job, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const foundCompany = COMPANIES.find(c => c.name.toLowerCase() === formData.company.toLowerCase());
        
        let companyId: string;
        if (job) {
            companyId = foundCompany ? foundCompany.id : job.companyId;
        } else {
            companyId = foundCompany ? foundCompany.id : COMPANIES[0].id;
        }

        const jobData = {
            title: formData.title,
            companyId,
            location: formData.location,
            type: formData.type,
            description: formData.description,
            requirements: formData.requirements.split(',').map(req => req.trim()),
            status: formData.status,
            salary: parseInt(formData.salary) || undefined,
            workersNeeded: parseInt(formData.workersNeeded) || undefined,
            rating: parseInt(formData.rating) || undefined,
            imageUrl: formData.imageUrl || undefined,
        };
        onSave(jobData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={job ? 'Edit Job Posting' : 'Create New Job Posting'}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary (RWF)</label>
                        <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workers Needed</label>
                        <input type="number" name="workersNeeded" value={formData.workersNeeded} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements (comma-separated)</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{job ? 'Save Changes' : 'Post Job'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default NewJobModal;
