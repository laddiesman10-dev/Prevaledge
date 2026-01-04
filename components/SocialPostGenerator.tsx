import React, { useState } from 'react';
import { generateSocialPosts } from '../services/geminiService';
import type { SocialPostResult } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import ImageIcon from './icons/ImageIcon';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import VideoIcon from './icons/VideoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAITool } from '../hooks/useAITool';

type FormDataType = {
    topic: string;
    platform: string;
    goal: string;
    tone: string;
}

const SocialPostGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    topic: '',
    platform: 'LinkedIn',
    goal: 'Promote Content',
    tone: 'Professional',
  });
  const [formError, setFormError] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { result: results, isLoading, error, execute } = useAITool<SocialPostResult[], FormDataType>(
      'socialPostGenerator',
      args => generateSocialPosts(args.topic, args.platform, args.goal, args.tone)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) {
      setFormError('A topic or URL is required.');
      return;
    }
    setFormError('');
    execute(formData, formData.topic);
  };

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const tones = ['Professional', 'Friendly', 'Witty', 'Inspirational', 'Urgent'];
  const platforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'];
  const goals = ['Promote Content', 'Announce Product', 'Share a Tip', 'Ask a Question'];

  return (
    <section id="social-post-generator" className="relative" aria-labelledby="social-post-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Generates platform-specific social media posts, including copy, hashtags, and visual ideas, to amplify your content.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="social-post-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Social Content</span> Amplifier
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Amplify your message. Generate platform-specific social media posts complete with copy, hashtags, and visual suggestions.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">Topic or URL</label>
              <textarea name="topic" id="topic" rows={3} value={formData.topic} onChange={handleChange} className={inputClasses} placeholder="e.g., A link to your latest blog post or a product description" />
            </div>
            <div>
                <label htmlFor="goal" className="block text-sm font-medium text-slate-300 mb-2">Goal of Post</label>
                <select name="goal" id="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
                  {goals.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
                <select name="platform" id="platform" value={formData.platform} onChange={handleChange} className={inputClasses}>
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">Tone of Voice</label>
                <select name="tone" id="tone" value={formData.tone} onChange={handleChange} className={inputClasses}>
                  {tones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <div className="text-center pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Amplify Content'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="relative bg-slate-900/70 border border-slate-800 rounded-lg p-6">
          {isLoading && <LoadingSpinner size="lg" />}
          {error && <div role="alert" className="flex items-center justify-center text-red-400 text-center p-4 min-h-[400px]">{error}</div>}
          
          {!isLoading && !error && (
              (results && Array.isArray(results)) ? (
                  <div className="space-y-6 animate-fade-in">
                  {results.map((result, index) => {
                      const lowerCaseSuggestion = result.visualSuggestion.toLowerCase();
                      const isVideo = lowerCaseSuggestion.includes('video') || lowerCaseSuggestion.includes('animation') || lowerCaseSuggestion.includes('reel') || lowerCaseSuggestion.includes('gif');
                      const Icon = isVideo ? VideoIcon : ImageIcon;
                      const formattedHashtags = result.hashtags.map(h => `#${h}`).join(' ');
                      const textToCopy = `${result.post}\n\n${formattedHashtags}`;
                      return (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 relative">
                          <button onClick={() => handleCopy(textToCopy)} className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors p-1" aria-label="Copy post text and hashtags">
                          {copiedText === textToCopy ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> )}
                          </button>
                          <p className="text-slate-200 whitespace-pre-wrap pr-8">{result.post}</p>
                          <p className="text-blue-400 mt-4">{formattedHashtags}</p>
                          <div className="mt-4 pt-4 border-t border-slate-700/50">
                          <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center"><Icon className="w-4 h-4 mr-2" />Visual Suggestion</h4>
                          <p className="text-slate-300 text-sm">{result.visualSuggestion}</p>
                          </div>
                      </div>
                      );
                  })}
                  </div>
              ) : (
                  <div className="flex min-h-[400px] items-center justify-center text-slate-500 text-center">
                      <p>Your generated social posts will appear here.</p>
                  </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default SocialPostGenerator;