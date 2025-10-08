
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import Button from './Button';
import { useInterviews } from '../../contexts/InterviewContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { Application, Interview } from '../../types';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, application }) => {
    const { scheduleInterview } = useInterviews();
    const { updateApplicationStatus } = useApplications();
    const [details, setDetails] = useState({ date: '', type: 'Technical', details: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const interviewData: Omit<Interview, 'id' | 'status'> = {
            userId: application.userId,
            jobId: application.jobId,
            date: new Date(details.date).toISOString(),
            type: details.type as Interview['type'],
            details: details.details,
        }
        scheduleInterview(interviewData);
        updateApplicationStatus(application.id, 'Interview Scheduled');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Date & Time</label>
                    <input type="datetime-local" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Type</label>
                    <select value={details.type} onChange={e => setDetails({...details, type: e.target.value})} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>Phone Screen</option>
                        <option>Technical</option>
                        <option>On-site</option>
                        <option>Final</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details (e.g., location, video link)</label>
                    <textarea value={details.details} onChange={e => setDetails({...details, details: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Schedule Interview</Button>
                </div>
            </form>
        </Modal>
    )
};

export default ScheduleInterviewModal;