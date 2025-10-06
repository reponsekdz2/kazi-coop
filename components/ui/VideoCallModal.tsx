
import React from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { PhoneIcon, VideoCameraIcon, VideoCameraSlashIcon, MicrophoneIcon, NoSymbolIcon } from '@heroicons/react/24/solid';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, participantName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Interview with ${participantName}`}>
      <div className="bg-black aspect-video rounded-lg relative flex items-center justify-center">
        <p className="text-white z-10">Video call simulation</p>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-gray-800/50 rounded-full">
            <Button variant="secondary" className="!p-3 !rounded-full"><MicrophoneIcon className="h-6 w-6" /></Button>
            <Button variant="secondary" className="!p-3 !rounded-full"><VideoCameraIcon className="h-6 w-6" /></Button>
            <Button variant="danger" className="!p-3 !rounded-full" onClick={onClose}><PhoneIcon className="h-6 w-6" /></Button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoCallModal;
