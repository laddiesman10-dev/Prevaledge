
import React, { useState, useContext, useRef } from 'react';
import { useModal } from '../../../hooks/useModal';
import { generateQuoteItemsFromPrompt } from '../../../services/geminiService';
import { SiteDataContext } from '../../../data/siteDataContext';
import type { DocumentLineItem } from '../../../types';
import Button from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface AIQuoteAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (items: Omit<DocumentLineItem, 'id'>[]) => void;
}

const AIQuoteAssistantModal: React.FC<AIQuoteAssistantModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModal(modalRef, isOpen, onClose);

  const { servicePricingData } = useContext(SiteDataContext);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description of the items you want to quote.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const items = await generateQuoteItemsFromPrompt(prompt, servicePricingData);
      onGenerate(items);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
    >
      <div
        ref={modalRef}
        className="relative max-w-xl w-11/12 bg-slate-900 border border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800">
          <h2 id="ai-assistant-title" className="text-xl font-bold text-white flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
            AI Quote Assistant
          </h2>
        </div>

        <div className="p-6 relative">
          {isLoading && <LoadingSpinner />}
          <div className={`space-y-4 ${isLoading ? 'opacity-50' : ''}`}>
            <div>
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-300 mb-2">
                Describe the services you want to quote:
              </label>
              <textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A standard business website, plus the Growth SEO package for 6 months, and an initial automation audit.'"
                className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
        </div>
        
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-500 shadow-purple-600/30 hover:shadow-purple-500/50 focus:ring-purple-400/50"
          >
            {isLoading ? 'Generating...' : 'Generate Items'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIQuoteAssistantModal;
