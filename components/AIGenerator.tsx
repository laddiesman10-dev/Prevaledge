import React, { useState } from 'react';
import { generateDigitalStrategy } from '../services/geminiService';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { renderMarkdownContent } from '../utils/formatContent';
import { useAITool } from '../hooks/useAITool';

const AIGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  
  const { result, isLoading, error, execute } = useAITool<string, { prompt: string }>(
    'strategyGenerator',
    args => generateDigitalStrategy(args.prompt),
    true
  );
  
  const isStreaming = isLoading && typeof result === 'string';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    execute({ prompt }, prompt);
  };

  return (
    <section id="ai-generator" className="relative" aria-labelledby="ai-generator-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Generates a comprehensive digital marketing strategy based on your business idea.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="ai-generator-heading" className="text-4xl font-bold mb-4">
          Generate Your <span className="text-blue-400">Digital Strategy</span>
        </h2>
        <p className="max-w-2xl mx-auto text-slate-400 mb-8">
          Have a business idea? Let our expert AI generate an innovative digital strategy for you in seconds.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A sustainable drone delivery service for urban areas'"
            className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading}
            aria-label="Your business idea"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </form>

        <div 
          className="mt-8 min-h-[200px] max-h-[60vh] overflow-y-auto bg-slate-900/70 border border-slate-800 rounded-lg p-6 relative"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && !result && <LoadingSpinner size="lg" />}
          {error && <div role="alert" className="text-red-400 text-center">{error}</div>}
          
          <div className="prose prose-invert max-w-none">
            {typeof result === 'string' && renderMarkdownContent(result)}
            {isStreaming && <span className="blinking-cursor"></span>}
          </div>
          
          {!isLoading && !result && !error && (
            <p className="text-slate-500 text-center">Your strategy will appear here...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIGenerator;