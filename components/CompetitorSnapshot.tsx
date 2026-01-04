import React, { useState } from 'react';
import type { CompetitorSnapshotResult, CompetitorAnalysis } from '../types';
import { analyzeCompetitors } from '../services/geminiService';
import Button from './ui/Button';
import HoloscanVisualizer from './HoloscanVisualizer';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import CheckIcon from './icons/CheckIcon';
import SparklesIcon from './icons/SparklesIcon';
import { useAITool } from '../hooks/useAITool';

const CompetitorSnapshot: React.FC = () => {
  const [yourUrl, setYourUrl] = useState<string>('');
  const [competitorUrl, setCompetitorUrl] = useState<string>('');
  const [formError, setFormError] = useState('');

  const { result: results, isLoading: isAnalyzing, error, execute, reset } = useAITool<CompetitorSnapshotResult, { yourUrl: string, competitorUrl: string }>(
      'competitorSnapshot',
      args => analyzeCompetitors(args.yourUrl, args.competitorUrl)
  );

  const validateUrl = (url: string) => {
    let fullUrl = url.trim();
    if (!fullUrl) return null;
    try {
      if (!fullUrl.startsWith('http')) {
        fullUrl = `https://${fullUrl}`;
      }
      new URL(fullUrl);
      return fullUrl;
    } catch (_) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validYourUrl = validateUrl(yourUrl);
    const validCompetitorUrl = validateUrl(competitorUrl);

    if (!validYourUrl || !validCompetitorUrl) {
      setFormError('Please enter two valid URLs to begin the analysis.');
      return;
    }
    setFormError('');
    execute({ yourUrl: validYourUrl, competitorUrl: validCompetitorUrl }, `${validYourUrl} vs ${validCompetitorUrl}`);
  };

  const handleReset = () => {
    setYourUrl('');
    setCompetitorUrl('');
    setFormError('');
    reset();
  };
  
  const AnalysisColumn: React.FC<{ analysis?: CompetitorAnalysis; title: string; }> = ({ analysis, title }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <h4 className="text-xl font-bold text-center mb-4">{title}</h4>
      <p className="text-center font-mono text-blue-400 break-all text-sm mb-6">{analysis?.url.replace(/^https?:\/\//, '') || 'N/A'}</p>
      
      <div className="grid grid-cols-2 gap-4 text-center mb-6">
        <div>
          <p className="text-3xl font-bold text-white">{analysis?.estimatedTraffic ?? 'N/A'}</p>
          <p className="text-xs text-slate-400">Est. Traffic</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{analysis?.domainAuthority ?? 0}</p>
          <p className="text-xs text-slate-400">Domain Authority</p>
        </div>
      </div>

      <div>
        <h5 className="font-semibold text-slate-300 mb-2">Top Keywords:</h5>
        <div className="flex flex-wrap gap-2 mb-6">
          {analysis?.topKeywords?.map(kw => ( <span key={kw} className="px-2 py-1 text-xs text-purple-300 bg-purple-900/50 rounded-full">{kw}</span> )) || <span className="text-xs text-slate-500">Not available.</span>}
        </div>
      </div>
      
      <div>
        <h5 className="font-semibold text-slate-300 mb-2">Key Strengths:</h5>
        <ul className="space-y-2">
          {analysis?.keyStrengths?.map(strength => (
            <li key={strength} className="flex items-start text-sm">
              <CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300">{strength}</span>
            </li>
          )) || <li className="text-xs text-slate-500">Not available.</li>}
        </ul>
      </div>
    </div>
  );

  return (
    <section id="competitor-snapshot" className="relative" aria-labelledby="snapshot-heading">
       <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Get a high-level comparison of your website versus a competitor, including estimated traffic, keywords, and strategic opportunities.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="snapshot-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Competitor Snapshot</span>
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          How do you stack up against the competition? Get a free, high-level analysis and uncover strategic opportunities.
        </p>
      </div>

      <div className="max-w-5xl mx-auto" aria-live="polite">
        {isAnalyzing ? (
          <HoloscanVisualizer url={`${yourUrl} vs ${competitorUrl}`} />
        ) : (results && typeof results !== 'string') ? (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <AnalysisColumn analysis={results.yourSite} title="Your Website" />
                <AnalysisColumn analysis={results.competitorSite} title="Competitor" />
            </div>
            
            <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-6">
                <h4 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-blue-400" />
                    Strategic Opportunity Analysis
                </h4>
                <p className="text-slate-300 text-center max-w-3xl mx-auto">{results.opportunityAnalysis}</p>
            </div>
            {error && <div role="alert" className="text-red-400 text-center mt-4">{error}</div>}
            <div className="text-center mt-10">
                <p className="text-lg text-slate-300 mb-4">Ready to close the gap and outperform your competition?</p>
                <div className="flex justify-center gap-4">
                    <Button href="#contact">Build My Strategy</Button>
                    <Button variant="secondary" onClick={handleReset}>Run New Analysis</Button>
                </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                <label htmlFor="yourUrl" className="block text-sm font-medium text-slate-300 mb-2">Your Website URL</label>
                <input type="url" id="yourUrl" value={yourUrl} onChange={(e) => setYourUrl(e.target.value)} placeholder="e.g., yourwebsite.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
               </div>
                <div>
                <label htmlFor="competitorUrl" className="block text-sm font-medium text-slate-300 mb-2">Competitor's Website URL</label>
                <input type="url" id="competitorUrl" value={competitorUrl} onChange={(e) => setCompetitorUrl(e.target.value)} placeholder="e.g., competitor.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
               </div>
            </div>
             <div className="text-center">
                <Button type="submit">Analyze Now</Button>
            </div>
            {formError && <div role="alert" className="text-red-400 text-center mt-4">{formError}</div>}
          </form>
        )}
      </div>
    </section>
  );
};

export default CompetitorSnapshot;