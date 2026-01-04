
import React, { useState } from 'react';
import type { ArticleDraftResult } from '../types';
import { generateArticleOutline, generateArticleDraft } from '../services/geminiService';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { renderMarkdownContent } from '../utils/formatContent';
import CheckIcon from './icons/CheckIcon';
import { useAITool } from '../hooks/useAITool';

const ArticleDrafter: React.FC = () => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  
  const { result: outline, isLoading: isOutlineLoading, error: outlineError, execute: executeOutline, reset: resetOutline } = useAITool<string[], { topic: string }>(
      'articleDrafter', args => generateArticleOutline(args.topic)
  );

  const { result: draft, isLoading: isDraftLoading, error: draftError, execute: executeDraft, reset: resetDraft } = useAITool<string, { topic: string, outline: string[] }>(
      'articleDrafter', args => generateArticleDraft(args.topic, args.outline), true
  );

  const [formError, setFormError] = useState('');

  const handleGenerateOutline = async () => {
    if (!topic.trim()) {
      setFormError('Please provide a topic for your article.');
      return;
    }
    setFormError('');
    await executeOutline({ topic }, topic);
    setStep(2);
  };

  const handleGenerateDraft = async () => {
    if (!outline || (outline as string[]).length === 0) {
      setFormError('An outline is required to generate a draft.');
      return;
    }
    setFormError('');
    setStep(3); // Go to loading/streaming view
    await executeDraft({ topic, outline: outline as string[] }, topic);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setTopic('');
    setFormError('');
    resetOutline();
    resetDraft();
  };
  
  const handleCopy = (text: string | null) => {
    if (text) navigator.clipboard.writeText(text);
  };
  
  const isDraftStreaming = isDraftLoading && typeof draft === 'string';

  return (
    <section id="article-drafter" className="relative" aria-labelledby="drafter-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="A multi-step assistant that helps you create a full, SEO-optimized first draft of a blog post, from topic to outline to final article.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="drafter-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">SEO Article</span> Drafter
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Beat writer's block forever. Go from a single idea to a complete, structured first draft in just a few clicks.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 rounded-lg p-8 min-h-[400px]">
        {(formError || outlineError || draftError) && <p className="text-red-400 text-sm text-center mb-4">{formError || outlineError || draftError}</p>}

        {step === 1 && (
          <div className="animate-fade-in text-center">
            <h3 className="text-xl font-semibold mb-4">Step 1: What is your article about?</h3>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The benefits of cold brew coffee" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" disabled={isOutlineLoading} />
              <Button onClick={handleGenerateOutline} disabled={isOutlineLoading}> {isOutlineLoading ? 'Generating...' : 'Create Outline'} </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="animate-fade-in text-left">
            <h3 className="text-xl font-semibold mb-4 text-center">Step 2: Review & Approve Your Outline</h3>
            {isOutlineLoading && <LoadingSpinner size="md" />}
            {outline && (
              <>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3 mb-6">
                  {(outline as string[]).map((item, index) => (
                      <div key={index} className="flex items-center">
                          <CheckIcon className="w-5 h-5 text-blue-400 mr-3" />
                          <p className="text-slate-200">{item}</p>
                      </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="secondary" onClick={handleReset}>Start Over</Button>
                  <Button onClick={handleGenerateDraft} disabled={isDraftLoading}> {isDraftLoading ? 'Please wait...' : 'Write Full Draft'} </Button>
                </div>
              </>
            )}
          </div>
        )}

        {(step === 3 || step === 4) && (
             <div className="animate-fade-in text-left">
                <h3 className="text-xl font-semibold mb-4 text-center">Step 3: Your Draft is Ready!</h3>
                <div className="relative">
                    <button onClick={() => handleCopy(draft as string)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-lg text-xs font-semibold z-10">Copy Draft</button>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 prose prose-invert max-w-none">
                        {renderMarkdownContent(draft as string)}
                        {isDraftStreaming && <span className="blinking-cursor"></span>}
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    <Button variant="secondary" onClick={handleReset}>Create New Article</Button>
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default ArticleDrafter;
