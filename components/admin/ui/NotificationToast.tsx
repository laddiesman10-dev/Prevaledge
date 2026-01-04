import React, { useEffect, useState } from 'react';
import { Notification } from '../../../types';
import BellIcon from '../../icons/BellIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import XCircleIcon from '../../icons/XCircleIcon';
import InfoIcon from '../../icons/InfoIcon';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const icons = {
  info: <InfoIcon className="w-6 h-6 text-blue-300" />,
  success: <CheckCircleIcon className="w-6 h-6 text-green-300" />,
  warning: <BellIcon className="w-6 h-6 text-yellow-300" />,
  error: <XCircleIcon className="w-6 h-6 text-red-300" />,
};

const colors = {
    info: 'border-blue-500/50',
    success: 'border-green-500/50',
    warning: 'border-yellow-500/50',
    error: 'border-red-500/50',
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow fade-out animation before removing from DOM
        setTimeout(onClose, 300);
    }, 7000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`w-full max-w-sm p-4 rounded-lg shadow-2xl text-white transition-all duration-300 ease-in-out
        bg-slate-800/80 backdrop-blur-lg border ${colors[notification.type]}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`
      }
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {icons[notification.type]}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-slate-100">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className="inline-flex text-slate-400 rounded-md hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
