import React, { useRef } from 'react';
import { useModal } from '../../hooks/useModal';
import Button from '../ui/Button';
import MailIcon from '../icons/MailIcon';
import XIcon from '../icons/XIcon';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div
        ref={modalRef}
        className="relative max-w-md w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8 text-center">
            <MailIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 id="forgot-password-title" className="text-2xl font-bold text-white mb-4">
                Password Reset
            </h2>
            <p className="text-slate-400 mb-6">
                To reset your password, please contact our support team. An administrator will assist you with the process.
            </p>
            <p className="text-sm bg-slate-800/50 p-3 rounded-md">
                <a href="mailto:info@prevaledge.com" className="font-semibold text-blue-400 hover:underline">
                    info@prevaledge.com
                </a>
            </p>
            <div className="mt-8">
                <Button onClick={onClose} className="w-full">
                    Got it
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;