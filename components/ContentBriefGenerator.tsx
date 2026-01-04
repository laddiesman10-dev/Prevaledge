
import React, { useState, useContext } from 'react';
import { generateContentBrief } from '../services/geminiService';
import type { ContentBriefResult } from '../types';
import { SITE_URL } from '../types';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import HoloscanVisualizer from './HoloscanVisualizer';
import { useAITool } from '../hooks/useAITool';
import { SiteDataContext } from '../data/siteDataContext';
import CheckIcon from './icons/CheckIcon';
import LinkIcon from './icons/LinkIcon';

const ContentBriefGenerator: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [formError, setFormError] = useState('');
    const { blogPosts } = useContext(SiteDataContext);

    const otherPosts = blogPosts.map(p => ({ slug: p.slug, title: p.title }));

    const { result, isLoading, error, execute, reset } = useAITool<ContentBriefResult, { topic: string, otherPosts: {slug: string, title: string}[] }>(
        'contentBriefGenerator',
        (args) => generateContentBrief(args.topic, args.otherPosts)
    );
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setFormError('Please enter a topic to generate a brief.');
            return;
        }
        setFormError('');
        execute({ topic, otherPosts }, topic);
    };

    const handleReset = () => {
        setTopic('');
        setFormError('');
        reset();
    };

    return (
        <section id="content-brief-generator" className="relative" aria-labelledby="brief-heading">
            <div className="absolute top-0 right-0 z-20">
                <Tooltip text="Generates a comprehensive SEO content brief for a given topic, including audience, headings, keywords, and competitor insights.">
                    <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
                </Tooltip>
            </div>
            <div className="text-center">
                <h2 id="brief-heading" className="text-4xl font-bold mb-4">
                    AI-Powered <span className="text-blue-400">Content Brief</span> Generator
                </h2>
                <p className="max-w-3xl mx-auto text-slate-400 mb-12">
                    Create expert-level, SEO-optimized content briefs in seconds. Go from topic to a detailed action plan for your writers.
                </p>
            </div>

            <div className="max-w-5xl mx-auto" aria-live="polite">
                {isLoading ? (
                    <HoloscanVisualizer url={`Building content brief for: "${topic}"`} />
                ) : result && typeof result !== 'string' ? (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-center mb-6">Content Brief for: <span className="text-blue-400">{topic}</span></h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column for details */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2">Suggested Title</h4>
                                    <p>{result.suggestedTitle}</p>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2">Target Audience</h4>
                                    <p>{result.targetAudience}</p>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2">Search Intent</h4>
                                    <p>{result.searchIntent}</p>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2">Top Competitor Strengths</h4>
                                    <ul className="space-y-2 text-sm">
                                    {result.competitorAnalysis?.map((comp, i) => <li key={i}><strong>{comp.title}:</strong> {comp.strength}</li>)}
                                    </ul>
                                </div>
                            </div>
                            {/* Right Column for content structure */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-3">Key Headings</h4>
                                    <ul className="space-y-2">
                                        {result.keyHeadings?.map((heading, i) => <li key={i} className="flex items-start"><CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-1 shrink-0" /><span>{heading}</span></li>)}
                                    </ul>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-3">Semantic Keywords to Include</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.semanticKeywords?.map(kw => <span key={kw} className="px-2 py-1 text-xs text-purple-300 bg-purple-900/50 rounded-full">{kw}</span>)}
                                    </div>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-3">Internal Link Suggestions</h4>
                                    <ul className="space-y-2">
                                        {result.internalLinkSuggestions?.map((link, i) => <li key={i} className="flex items-start text-sm"><LinkIcon className="w-4 h-4 text-slate-400 mr-2 mt-1 shrink-0" /><span>Link "<strong>{link.anchorText}</strong>" to <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{link.url.replace(SITE_URL, '')}</a></span></li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {error && <div role="alert" className="text-red-400 text-center mt-4">{error}</div>}
                        <div className="text-center mt-8">
                            <Button variant="secondary" onClick={handleReset}>Generate Another Brief</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-lg p-8">
                        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a blog post topic or keyword..."
                                className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                aria-label="Article Topic"
                            />
                            <Button type="submit">Generate Brief</Button>
                        </div>
                        {formError && <div role="alert" className="text-red-400 text-center mt-4">{formError}</div>}
                    </form>
                )}
            </div>
        </section>
    );
};

export default ContentBriefGenerator;
