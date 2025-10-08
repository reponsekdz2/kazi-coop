
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../layout/Modal';
import Button from './Button';
import { PhoneIcon, VideoCameraIcon, VideoCameraSlashIcon, MicrophoneIcon, SpeakerXMarkIcon as MicrophoneSlashIcon } from '@heroicons/react/24/solid';


interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, participantName }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      const getMedia = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(mediaStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
          // Simulate remote stream by using the same local stream for demonstration
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing media devices.", err);
          onClose(); // Close modal if permissions are denied
        }
      };
      getMedia();
    } else {
      // Cleanup: stop all tracks when modal is closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const handleHangUp = () => {
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleHangUp} title={`Interview with ${participantName}`}>
      <div className="bg-black aspect-video rounded-lg relative flex items-center justify-center overflow-hidden">
        {/* Remote Video */}
        <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" muted />
        
        {/* Local Video Preview */}
        <div className="absolute top-4 right-4 h-1/4 w-1/4 rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-900">
          {isCameraOn ? (
            <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover transform -scale-x-100" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <VideoCameraSlashIcon className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-gray-800/50 rounded-full">
            <Button variant="secondary" onClick={toggleMicrophone} className="!p-3 !rounded-full">
              {isMicOn ? <MicrophoneIcon className="h-6 w-6" /> : <MicrophoneSlashIcon className="h-6 w-6" />}
            </Button>
            <Button variant="secondary" onClick={toggleCamera} className="!p-3 !rounded-full">
              {isCameraOn ? <VideoCameraIcon className="h-6 w-6" /> : <VideoCameraSlashIcon className="h-6 w-6" />}
            </Button>
            <Button variant="danger" className="!p-3 !rounded-full" onClick={handleHangUp}>
              <PhoneIcon className="h-6 w-6" />
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoCallModal;