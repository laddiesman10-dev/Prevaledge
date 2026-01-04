import React, { useEffect, useState } from 'react';
import InboxIcon from '../icons/InboxIcon';

interface NewLeadToastProps {
  onClose: () => void;
  onViewClick: () => void;
}

const NewLeadToast: React.FC<NewLeadToastProps> = ({ onClose, onViewClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="alert"
      className={`fixed top-6 right-6 z-[100] w-full max-w-sm p-4 rounded-lg shadow-2xl text-white transition-all duration-500 ease-out
        bg-slate-800/80 backdrop-blur-lg border border-blue-500/50
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`
      }
    >
        <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
                <InboxIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-100">
                    New Lead Received!
                </p>
                <p className="mt-1 text-sm text-slate-400">
                    A new contact form has been submitted.
                </p>
                <div className="mt-3 flex gap-3">
                    <button
                        onClick={onViewClick}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                    >
                        View
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                    >
                        Dismiss
                    </button>
                </div>
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

export default NewLeadToast;