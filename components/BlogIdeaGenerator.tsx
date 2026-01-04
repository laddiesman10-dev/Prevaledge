import React, { useState } from 'react';
import { generateBlogIdeas } from '../services/geminiService';
import type { BlogIdea } from '../types';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAITool } from '../hooks/useAITool';

const BlogIdeaGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [formError, setFormError] = useState('');

  const { result: results, isLoading, error, execute } = useAITool<BlogIdea[], { topic: string }>(
    'blogIdeaGenerator',
    args => generateBlogIdeas(args.topic)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setFormError('Please enter a topic to generate ideas.');
      return;
    }
    setFormError('');
    execute({ topic }, topic);
  };

  return (
    <section id="blog-idea-generator" className="relative" aria-labelledby="blog-idea-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Provides a list of creative, SEO-friendly blog post titles, hooks, and keywords for any given topic.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="blog-idea-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Blog Idea</span> Generator
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Never run out of content ideas again. Enter a topic or industry, and get a list of creative, SEO-friendly blog post titles.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'sustainable fashion' or 'B2B marketing trends'"
            className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading}
            aria-label="Blog topic"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Get Ideas'}
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
                  {results.map((idea, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                      <h3 className="text-lg font-bold text-blue-300 mb-2">{idea.title}</h3>
                      <p className="text-slate-300 italic mb-3">"{idea.hook}"</p>
                      <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-semibold text-slate-400 mr-2">Keywords:</span>
                          {idea.keywords.map(keyword => ( <span key={keyword} className="px-2 py-1 text-xs text-purple-300 bg-purple-900/50 border border-purple-700/50 rounded-full">{keyword}</span> ))}
                      </div>
                      </div>
                  ))}
                  </div>
              ) : (
                  <div className="flex min-h-[400px] items-center justify-center text-slate-500 text-center">
                      <p>Your generated blog ideas will appear here...</p>
                  </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogIdeaGenerator;