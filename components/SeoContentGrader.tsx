import React, { useState } from 'react';
import type { SeoContentGraderResult, SeoContentAnalysisCategory } from '../types';
import { gradeSeoContent } from '../services/geminiService';
import Button from './ui/Button';
import HoloscanVisualizer from './HoloscanVisualizer';
import ScoreGauge from './ScoreGauge';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import CheckIcon from './icons/CheckIcon';
import { useAITool } from '../hooks/useAITool';

const SeoContentGrader: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [formError, setFormError] = useState('');

  const { result: results, isLoading: isAnalyzing, error, execute, reset } = useAITool<SeoContentGraderResult, { content: string, keyword: string }>(
      'seoContentGrader',
      args => gradeSeoContent(args.content, args.keyword)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !keyword.trim()) {
      setFormError('Please provide both content and a target keyword.');
      return;
    }
    setFormError('');
    execute({ content, keyword }, keyword);
  };

  const handleReset = () => {
    setContent('');
    setKeyword('');
    setFormError('');
    reset();
  };
  
  const ResultCard: React.FC<{ title: string; data: SeoContentAnalysisCategory; index: number; }> = ({ title, data, index }) => {
    const scoreColor = data.score > 75 ? 'text-green-400' : data.score > 40 ? 'text-yellow-400' : 'text-red-400';
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-6 animate-fade-in" style={{ animationDelay: `${index * 150}ms`, opacity: 0, animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-300">{title}</h4>
                <span className={`text-2xl font-bold ${scoreColor}`}>{data.score}<span className="text-base text-slate-500">/100</span></span>
            </div>
            <ul className="space-y-3">
                {data.feedback.map((point, i) => (
                    <li key={i} className="flex items-start text-sm">
                        <CheckIcon className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
  };

  const emptyCategory = { score: 0, feedback: ['No data available'] };

  return (
    <section id="seo-grader" className="relative" aria-labelledby="grader-heading">
       <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Analyzes your blog post or landing page content for SEO effectiveness against a target keyword. Provides a score and actionable feedback.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="grader-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">SEO Content Grader</span>
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Is your content optimized to rank? Paste your text and target keyword to get a free, comprehensive SEO analysis and report card.
        </p>
      </div>

      <div className="max-w-5xl mx-auto" aria-live="polite">
        {isAnalyzing ? (
          <HoloscanVisualizer url={`Analyzing content for keyword: "${keyword}"`} />
        ) : (results && typeof results !== 'string') ? (
          <div className="animate-fade-in">
            <div className="flex flex-col items-center mb-8 bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <ScoreGauge score={results.overallScore ?? 0} />
              <h3 className="text-2xl font-bold text-center mt-6 mb-2">Overall SEO Score</h3>
              <p className="max-w-2xl text-center text-slate-300">{results.executiveSummary || 'Analysis complete.'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ResultCard title="Keyword Optimization" data={results.keywordOptimization || emptyCategory} index={0} />
                <ResultCard title="Readability & Structure" data={results.readabilityAndStructure || emptyCategory} index={1} />
                <ResultCard title="Semantic SEO" data={results.semanticSeo || emptyCategory} index={2} />
                <ResultCard title="Expertise & Trust (E-E-A-T)" data={results.expertiseAndTrust || emptyCategory} index={3} />
            </div>
            {error && <div role="alert" className="text-red-400 text-center mt-4">{error}</div>}
            <div className="text-center mt-10">
                <p className="text-lg text-slate-300 mb-4">Ready to improve your score and outrank the competition?</p>
                <div className="flex justify-center gap-4">
                    <Button href="#contact">Get My Content to 95+</Button>
                    <Button variant="secondary" onClick={handleReset}>Analyze Another Post</Button>
                </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
               <div className="md:col-span-2">
                <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">Your Content</label>
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste the full text of your blog post or landing page here..." className="w-full h-48 bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
               </div>
                <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-slate-300 mb-2">Target Keyword</label>
                <input type="text" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g., 'content marketing tips'" className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
               </div>
            </div>
             <div className="text-center">
                <Button type="submit">Grade My Content</Button>
            </div>
            {formError && <div role="alert" className="text-red-400 text-center mt-4">{formError}</div>}
          </form>
        )}
      </div>
    </section>
  );
};

export default SeoContentGrader;