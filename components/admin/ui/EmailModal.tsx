import React, { useState, useEffect, useRef } from 'react';
import { useModal } from '../../../hooks/useModal';
import { emailApi } from '../../../services/apiService';
import type { ArchivedDocument } from '../../../types';
import Button from '../../ui/Button';
import SendIcon from '../../icons/SendIcon';
import LoadingSpinner from '../../ui/LoadingSpinner';
import CheckCircleIcon from '../../icons/CheckCircleIcon';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: ArchivedDocument;
  documentHtml: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, documentData, documentHtml }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, isOpen, onClose);

  const [emailContent, setEmailContent] = useState({ to: '', from: '', subject: '', body: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (documentData) {
      const { clientDetails, companyDetails, documentType, documentNumber, currency, total } = documentData;
      
      const subject = `${documentType} #${documentNumber} from ${companyDetails.name}`;
      
      const body = `Hi ${clientDetails.name || 'there'},\n\nPlease find your ${documentType.toLowerCase()} #${documentNumber} attached for a total of ${currency}${total.toFixed(2)}.\n\nThank you for your business!\n\nBest regards,\nThe team at ${companyDetails.name}`;
      
      setEmailContent({
        to: clientDetails.email,
        from: companyDetails.email,
        subject,
        body,
      });
      setStatus('idle');
    }
  }, [documentData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailContent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async () => {
    setStatus('sending');
    try {
      await emailApi.sendDocumentEmail({ ...emailContent, documentHtml });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div
        ref={modalRef}
        className="relative max-w-2xl w-11/12 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <h2 id="email-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
            <SendIcon className="w-6 h-6 text-blue-400" />
            Email {documentData.documentType}
          </h2>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-12 animate-fade-in">
              <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Email Sent!</h3>
              <p className="text-slate-400 mt-2">A simulated email has been successfully sent to {emailContent.to}.</p>
              <Button onClick={onClose} className="mt-6">Close</Button>
            </div>
          ) : (
            <div className="relative">
              {status === 'sending' && <LoadingSpinner />}
              <form className={`space-y-4 ${status === 'sending' ? 'opacity-50' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium text-slate-300 mb-1">From</label>
                    <input type="email" name="from" id="from" value={emailContent.from} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white" readOnly />
                  </div>
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium text-slate-300 mb-1">To</label>
                    <input type="email" name="to" id="to" value={emailContent.to} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                  <input type="text" name="subject" id="subject" value={emailContent.subject} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white" required />
                </div>
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-slate-300 mb-1">Body</label>
                  <textarea name="body" id="body" rows={8} value={emailContent.body} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white" required />
                </div>
                 {status === 'error' && <p className="text-red-400 text-sm text-center">Failed to send email. Please try again.</p>}
              </form>
            </div>
          )}
        </div>
        
        {status !== 'success' && (
          <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-4">
            <Button variant="secondary" onClick={onClose} disabled={status === 'sending'}>Cancel</Button>
            <Button onClick={handleSend} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailModal;
