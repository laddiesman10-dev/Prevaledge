import React, { useRef } from 'react';
import type { JobApplication } from '../../../types';
import Button from '../ui/Button';
import { useModal } from '../../hooks/useModal';
import XIcon from '../icons/XIcon';
import DownloadIcon from '../icons/DownloadIcon';

interface ApplicationDetailsModalProps {
  application: JobApplication | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <h4 className="text-xs font-bold uppercase text-slate-400">{label}</h4>
        <p className="text-slate-200 mt-1">{value || 'N/A'}</p>
    </div>
);

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ application, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, !!application, onClose);

  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog" aria-modal="true"
    >
      <div ref={modalRef} className="relative bg-slate-900 w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-xl font-bold text-white">Application Details</h2>
                <p className="text-sm text-slate-400">from {application.name}</p>
            </div>
            <Button variant="secondary" onClick={onClose} className="!p-2"><XIcon className="w-5 h-5" /></Button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-slate-800/50 rounded-lg">
                <DetailItem label="Applicant Name" value={application.name} />
                <DetailItem label="Email" value={application.email} />
                <DetailItem label="Phone" value={application.phone} />
                <DetailItem label="Applying For" value={application.jobTitle} />
                <DetailItem label="Submitted On" value={new Date(application.submittedAt).toLocaleString()} />
                <div>
                     <h4 className="text-xs font-bold uppercase text-slate-400">Resume</h4>
                     <a 
                        href={application.resume.dataUrl} 
                        download={application.resume.filename}
                        className="mt-1 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        {application.resume.filename}
                    </a>
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cover Letter</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">{application.coverLetter}</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;