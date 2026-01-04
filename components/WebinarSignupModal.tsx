import React, { useState, useContext, useRef } from 'react';
import { useModal } from '../hooks/useModal';
import { SiteDataContext } from '../data/siteDataContext';
import Button from './ui/Button';
import GraduationCapIcon from './icons/GraduationCapIcon';
import XIcon from './icons/XIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface WebinarSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebinarSignupModal: React.FC<WebinarSignupModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, isOpen, onClose);

  const { addWebinarSignup } = useContext(SiteDataContext);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await addWebinarSignup({ email });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setEmail('');
        setStatus('idle');
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="webinar-signup-title"
    >
      <div
        ref={modalRef}
        className="relative max-w-lg w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {status === 'success' ? (
             <div className="p-8 md:p-12 text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">You're In!</h2>
                <p className="text-slate-300 mt-2">
                    Thank you for registering. We've sent a confirmation and details to your email. We look forward to seeing you at the masterclass!
                </p>
                <Button onClick={handleClose} className="mt-6">
                    Close
                </Button>
            </div>
        ) : (
            <div className="p-8 md:p-12 text-center">
                <GraduationCapIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 id="webinar-signup-title" className="text-2xl font-bold text-white mb-2">
                    Join the AI Marketing Masterclass
                </h2>
                <p className="text-slate-400 mb-6">
                    Enter your email to secure your free spot.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        required
                        disabled={status === 'loading'}
                    />
                    <Button type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Registering...' : 'Register for Free'}
                    </Button>
                </form>
                {status === 'error' && (
                    <p className="text-red-400 text-sm mt-3">Something went wrong. Please try again.</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default WebinarSignupModal;