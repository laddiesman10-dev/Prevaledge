import React, { useRef, useState } from 'react';
import type { ArchivedDocument } from '../../../types';
import Button from '../../ui/Button';
import { useModal } from '../../../hooks/useModal';
import SendIcon from '../../icons/SendIcon';
import EmailModal from './EmailModal';
import DocumentPreview from './DocumentPreview';

interface DocumentPreviewModalProps {
  documentData: ArchivedDocument | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ documentData, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, !!documentData, onClose);
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailHtmlContent, setEmailHtmlContent] = useState('');

  if (!documentData) return null;

  const previewId = `modal-document-preview-${documentData.id}`;
  
  const handlePrint = () => {
    // The new global print styles in index.html will handle formatting.
    window.print();
  };
  
  const handleEmail = () => {
      const previewEl = document.getElementById(previewId);
      if (!previewEl) return;
      setEmailHtmlContent(previewEl.outerHTML);
      setIsEmailModalOpen(true);
  };

  return (
    <>
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in no-print"
      onClick={onClose}
      role="dialog" aria-modal="true"
    >
      <div ref={modalRef} className="relative bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center no-print">
            <h2 className="text-xl font-bold text-white">{documentData.documentType}: #{documentData.documentNumber}</h2>
            <div>
                <Button variant="secondary" onClick={handleEmail} className="mr-4">
                    <SendIcon className="w-5 h-5 mr-2" /> Email
                </Button>
                <Button onClick={handlePrint} className="mr-4">Print / Save as PDF</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-200 print:overflow-visible print:p-0 print:bg-transparent">
            <DocumentPreview document={documentData} previewId={previewId} />
        </div>
      </div>
    </div>
    {documentData && (
        <EmailModal 
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            documentData={documentData}
            documentHtml={emailHtmlContent}
        />
    )}
    </>
  );
};

export default DocumentPreviewModal;