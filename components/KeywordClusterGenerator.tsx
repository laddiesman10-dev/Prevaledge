import React, { useState } from 'react';
import { generateKeywordClusters } from '../services/geminiService';
import type { KeywordCluster } from '../types';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAITool } from '../hooks/useAITool';

const KeywordClusterGenerator: React.FC = () => {
  const [seedKeyword, setSeedKeyword] = useState<string>('');
  const [formError, setFormError] = useState('');

  const { result: results, isLoading, error, execute } = useAITool<KeywordCluster[], { seedKeyword: string }>(
    'keywordClusterGenerator',
    args => generateKeywordClusters(args.seedKeyword)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedKeyword.trim()) {
      setFormError('Please enter a seed keyword to generate clusters.');
      return;
    }
    setFormError('');
    execute({ seedKeyword }, seedKeyword);
  };

  return (
    <section id="keyword-cluster-generator" className="relative" aria-labelledby="keyword-cluster-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Generates relevant keyword clusters and long-tail keywords to help you build topical authority and improve SEO.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="keyword-cluster-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Keyword Cluster</span> Generator
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Elevate your SEO strategy. Enter a primary keyword, and our AI will generate relevant topic clusters to help you build topical authority.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            placeholder="e.g., 'content marketing'"
            className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading}
            aria-label="Seed Keyword"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Clusters'}
          </Button>
        </form>
        {formError && <p className="text-red-400 text-sm text-center -mt-4 mb-4">{formError}</p>}
        
        <div 
          className="relative bg-slate-900/70 border border-slate-800 rounded-lg p-6"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && <LoadingSpinner size="lg" />}
          {error && <div role="alert" className="flex items-center justify-center text-red-400 text-center p-4 min-h-[400px]">{error}</div>}
          
          {!isLoading && !error && (
              (results && Array.isArray(results)) ? (
                  <div className="space-y-6 animate-fade-in">
                  {results.map((cluster, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                      <h3 className="text-lg font-bold text-blue-300 mb-3">{cluster.clusterTitle}</h3>
                      <div className="flex flex-wrap gap-2">
                          {cluster.keywords.map(keyword => ( <span key={keyword} className="px-2 py-1 text-xs text-slate-300 bg-slate-700/50 rounded-md">{keyword}</span> ))}
                      </div>
                      </div>
                  ))}
                  </div>
              ) : (
                  <div className="flex min-h-[400px] items-center justify-center text-slate-500 text-center">
                      <p>Your generated keyword clusters will appear here.</p>
                  </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default KeywordClusterGenerator;