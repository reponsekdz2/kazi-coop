import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Job, ApplicantInfo } from '../../types';
import { useApplications } from '../../contexts/ApplicationContext';
import { useToast } from '../../contexts/ToastContext';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ isOpen, onClose, job }) => {
    const { applyForJob } = useApplications();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        educationLevel: 'Bachelors',
        fieldOfStudy: 'Computer Science',
        yearsOfExperience: '3',
        resume: {
            fileName: '',
            dataUrl: null as string | null
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                addToast('File is too large. Please upload a file smaller than 2MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    resume: {
                        fileName: file.name,
                        dataUrl: reader.result as string
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const applicationData: ApplicantInfo = {
            educationLevel: formData.educationLevel,
            fieldOfStudy: formData.fieldOfStudy,
            yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
            resumeUrl: formData.resume.dataUrl,
        };
        applyForJob(job.id, applicationData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job.title}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your profile information will be shared with the employer.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label-text">Highest Education Level</label>
                        <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="input-field">
                            <option>High School</option>
                            <option>Bachelors</option>
                            <option>Masters</option>
                            <option>PhD</option>
                        </select>
                    </div>
                     <div>
                        <label className="label-text">Field of Study</label>
                        <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required className="input-field"/>
                    </div>
                </div>
                 <div>
                    <label className="label-text">Years of Professional Experience</label>
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="input-field"/>
                </div>
                 <div>
                    <label className="label-text">Upload Resume</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-dark rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX up to 2MB</p>
                            {formData.resume.fileName && <p className="text-sm font-semibold text-green-600 pt-2">Selected: {formData.resume.fileName}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Application</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ApplicationFormModal;