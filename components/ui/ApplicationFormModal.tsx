
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Job, ApplicantInfo } from '../../types';
import { useApplications } from '../../contexts/ApplicationContext';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ isOpen, onClose, job }) => {
    const { applyForJob } = useApplications();
    const [formData, setFormData] = useState({
        educationLevel: 'Bachelors',
        fieldOfStudy: 'Computer Science',
        yearsOfExperience: '3',
        resumeUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const applicationData: ApplicantInfo = {
            ...formData,
            yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
            resumeUrl: formData.resumeUrl || null,
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
                    <label className="label-text">Resume (Link or Filename)</label>
                    <input type="text" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} className="input-field" placeholder="e.g., my_resume.pdf or a URL"/>
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
