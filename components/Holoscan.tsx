import React, { useState } from 'react';
import type { HoloscanResult } from '../types';
import { analyzeWebsitePresence } from '../services/geminiService';
import Button from './ui/Button';
import HoloscanVisualizer from './HoloscanVisualizer';
import ScoreGauge from './ScoreGauge';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import { useAITool } from '../hooks/useAITool';

const Holoscan: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [formError, setFormError] = useState('');

  const { result: results, isLoading: isScanning, error, execute, reset } = useAITool<HoloscanResult, { url: string }>(
    'websiteAnalyzer',
    args => analyzeWebsitePresence(args.url)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fullUrl = url.trim();
    if (!fullUrl) {
      setFormError('A valid URL is required to initiate the analysis.');
      return;
    }
    // Basic URL validation
    try {
        if (!fullUrl.startsWith('http')) {
          fullUrl = `https://${fullUrl}`;
        }
        new URL(fullUrl);
        setUrl(fullUrl);
    } catch (_) {
        setFormError('Please enter a valid URL (e.g., example.com).');
        return;
    }
    setFormError('');
    execute({ url: fullUrl }, fullUrl);
  };

  const handleReset = () => {
    setUrl('');
    setFormError('');
    reset();
  };
  
  const ResultCard: React.FC<{ title: string; score: number; feedback: string; recommendations: string; index: number; }> = ({ title, score, feedback, recommendations, index }) => (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-6 animate-fade-in" style={{ animationDelay: `${index * 150}ms`, opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-slate-300">{title}</h4>
        <span className={`text-2xl font-bold ${score > 75 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{score}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-3" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`${title} score`}>
        <div className={`h-2.5 rounded-full ${score > 75 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-slate-400 text-sm mb-4">{feedback}</p>
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <h5 className="text-xs font-bold uppercase text-blue-400 mb-2">Recommendation</h5>
        <p className="text-slate-300 text-sm">{recommendations}</p>
      </div>
    </div>
  );

  const emptyCategory = { score: 0, feedback: 'No data available', recommendations: 'No data available' };

  return (
    <section id="holoscan" className="relative" aria-labelledby="holoscan-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Analyzes any website's digital presence, providing scores and recommendations for SEO, UX, Performance, and Security.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="holoscan-heading" className="text-4xl font-bold mb-4">
          Website Presence <span className="text-blue-400">Analyzer</span>
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-8">
          Is your website performing at its best? Get a free, high-level analysis of your site's digital presence based on key modern standards.
        </p>
      </div>

      <div className="max-w-4xl mx-auto" aria-live="polite">
        {isScanning ? (
          <HoloscanVisualizer url={url} />
        ) : (results && typeof results !== 'string') ? (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-center mb-4">Digital Health Report for: <span className="text-blue-400 break-all">{url}</span></h3>
            <div className="flex flex-col items-center mb-8 bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <ScoreGauge score={results.overallScore ?? 0} />
              <p className="mt-6 max-w-2xl text-center text-slate-300">{results.executiveSummary || 'Analysis complete.'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ResultCard title="SEO Performance" {...(results.seo || emptyCategory)} index={0} />
              <ResultCard title="User Experience (UX)" {...(results.ux || emptyCategory)} index={1} />
              <ResultCard title="Performance" {...(results.performance || emptyCategory)} index={2} />
              <ResultCard title="Security" {...(results.security || emptyCategory)} index={3} />
            </div>
            <div className="text-center mt-10">
                <p className="text-lg text-slate-300 mb-4">Your analysis is complete. Ready to improve your score?</p>
                <div className="flex justify-center gap-4">
                    <Button href="#contact">Contact Us For A Quote</Button>
                    <Button variant="secondary" onClick={handleReset}>Scan Another Site</Button>
                </div>
            </div>
            {error && <div role="alert" className="text-red-400 text-center mt-4">{error}</div>}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g., example.com)"
                className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                aria-label="Website URL"
              />
              <Button type="submit">Analyze Site</Button>
            </div>
            {formError && <div role="alert" className="text-red-400 text-center mt-4">{formError}</div>}
          </form>
        )}
      </div>
    </section>
  );
};

export default Holoscan;