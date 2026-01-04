import React, { useRef } from 'react';
import type { AITool } from '../types';
import { useModal } from '../hooks/useModal';
import XIcon from './icons/XIcon';

interface AIToolModalProps {
  tool: AITool | null;
  onClose: () => void;
}

const AIToolModal: React.FC<AIToolModalProps> = ({ tool, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, !!tool, onClose);

  if (!tool) return null;

  const ToolComponent = tool.component;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg animate-fade-in p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tool-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-6xl max-h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
                <tool.icon className="w-6 h-6 text-blue-400"/>
                <h2 id="ai-tool-modal-title" className="text-xl font-bold text-white">{tool.title}</h2>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
                aria-label={`Close ${tool.title} tool`}
            >
                <XIcon className="w-6 h-6" />
            </button>
        </header>

        <div className="flex-grow overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ToolComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolModal;
