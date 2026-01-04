import React, { useRef } from 'react';
import { useModal } from '../../hooks/useModal';
import Button from '../ui/Button';
import XIcon from '../icons/XIcon';
import MicrophoneIcon from '../icons/MicrophoneIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  status: 'idle' | 'pending' | 'denied';
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, onContinue, status }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useModal(modalRef, isOpen, onClose);
    
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="permission-modal-title"
        >
            <div ref={modalRef} className="relative max-w-md w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <div className="p-8 text-center">
                    {status === 'denied' ? (
                        <>
                            <AlertTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h2 id="permission-modal-title" className="text-2xl font-bold text-white mb-4">Microphone Access Denied</h2>
                            <p className="text-slate-400 mb-6">
                                The Live AI Strategist requires microphone access. Please enable microphone permissions for this site in your browser's settings to continue.
                            </p>
                            <Button onClick={onClose} className="w-full">Okay, I Understand</Button>
                        </>
                    ) : (
                        <>
                            <MicrophoneIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h2 id="permission-modal-title" className="text-2xl font-bold text-white mb-4">Microphone Access Required</h2>
                            <p className="text-slate-400 mb-6">
                                The Live AI Strategist uses your microphone for a voice-based conversation. Your browser will ask for permission.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="secondary" onClick={onClose} className="w-full">Cancel</Button>
                                <Button onClick={onContinue} disabled={status === 'pending'} className="w-full">
                                    {status === 'pending' ? 'Waiting...' : 'Continue'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionModal;
