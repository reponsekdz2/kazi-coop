import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const Toast: React.FC<{ toast: ToastMessage; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  return (
    <div className="bg-white rounded-md shadow-lg p-4 flex items-start space-x-3 max-w-sm w-full animate-fade-in-right">
      <div>{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-gray-400 hover:text-gray-600">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};


const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;