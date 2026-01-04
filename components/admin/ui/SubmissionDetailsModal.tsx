import React, { useRef } from 'react';
import type { ContactSubmission } from '../../../types';
import Button from '../../ui/Button';
import { useModal } from '../../../hooks/useModal';
import XIcon from '../../icons/XIcon';

interface SubmissionDetailsModalProps {
  submission: ContactSubmission | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <h4 className="text-xs font-bold uppercase text-slate-400">{label}</h4>
        <p className="text-slate-200 mt-1">{value || 'N/A'}</p>
    </div>
);

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({ submission, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, !!submission, onClose);

  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog" aria-modal="true"
    >
      <div ref={modalRef} className="relative bg-slate-900 w-full max-w-2xl h-[70vh] rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-xl font-bold text-white">Contact Submission</h2>
                <p className="text-sm text-slate-400">from {submission.name}</p>
            </div>
            <Button variant="secondary" onClick={onClose} className="!p-2"><XIcon className="w-5 h-5" /></Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-800/50 rounded-lg">
                <DetailItem label="Name" value={submission.name} />
                <DetailItem label="Email" value={submission.email} />
                <DetailItem label="Organization" value={submission.organization} />
                <DetailItem label="Phone" value={submission.phone} />
                <DetailItem label="Submitted On" value={new Date(submission.submittedAt).toLocaleString()} />
                <div>
                     <h4 className="text-xs font-bold uppercase text-slate-400">AI Insight</h4>
                     {submission.isAnalyzing ? (
                        <p className="text-slate-400 italic mt-1">Analyzing...</p>
                     ) : (
                        <p className="text-blue-300 font-semibold mt-1">{submission.inquiryType || 'N/A'}</p>
                     )}
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Message</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">{submission.message}</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;