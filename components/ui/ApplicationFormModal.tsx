import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { Job, User, SeekerProfileData } from '../../types';
import { useApplications } from '../../contexts/ApplicationContext';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  user: User;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ isOpen, onClose, job, user }) => {
  const { applyForJob } = useApplications();
  const [formData, setFormData] = useState<SeekerProfileData>({
      dateOfBirth: user.profileData?.dateOfBirth || '',
      gender: user.profileData?.gender || 'Prefer not to say',
      educationLevel: user.profileData?.educationLevel || 'Bachelors',
      fieldOfStudy: user.profileData?.fieldOfStudy || '',
      yearsOfExperience: user.profileData?.yearsOfExperience || 0,
      resumeUrl: '',
      profileImage: user.avatarUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
        setFormData(prev => ({ ...prev, [name]: files[0].name }));
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyForJob(job.id, user.id, formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${job.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Please confirm your details before submitting.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highest Level of Education</label>
                <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option>High School</option>
                    <option>Diploma</option>
                    <option>Bachelors</option>
                    <option>Masters</option>
                    <option>PhD</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field of Study</label>
                <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Resume/CV (PDF)</label>
            <input type="file" name="resumeUrl" onChange={handleFileChange} required accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            {formData.resumeUrl && <p className="text-xs text-gray-500 mt-1">Selected: {formData.resumeUrl}</p>}
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
