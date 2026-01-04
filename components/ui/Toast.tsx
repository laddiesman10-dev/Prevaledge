import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);
  }, []);

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      role="alert"
      className={`fixed top-8 right-8 z-[100] flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out
        ${isSuccess ? 'bg-green-600/80 backdrop-blur-sm border border-green-500/50' : 'bg-red-600/80 backdrop-blur-sm border border-red-500/50'}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`
      }
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${isSuccess ? 'bg-green-800' : 'bg-red-800'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/20 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;