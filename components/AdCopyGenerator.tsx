import React, { useState } from 'react';
import { generateAdCopy } from '../services/geminiService';
import type { AdCopyResult } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAITool } from '../hooks/useAITool';
import { useFormValidation, Validators } from '../hooks/useFormValidation';

type FormDataType = {
    productName: string;
    targetAudience: string;
    keyFeatures: string;
    tone: string;
}

const AdCopyGenerator: React.FC = () => {
  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation<FormDataType>({
    productName: '',
    targetAudience: '',
    keyFeatures: '',
    tone: 'Professional',
  }, {
    productName: Validators.required,
    targetAudience: Validators.required,
    keyFeatures: Validators.required,
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { result: results, isLoading, error, execute } = useAITool<AdCopyResult, FormDataType>(
    'adCopyGenerator',
    (args) => generateAdCopy(args.productName, args.targetAudience, args.keyFeatures, args.tone)
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    execute(values, values.productName);
  };
  
  const getInputClasses = (fieldName: keyof FormDataType) => {
    const baseClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
    const errorClasses = "border-red-500 focus:ring-red-500";
    return touched[fieldName] && errors[fieldName] ? `${baseClasses} ${errorClasses}` : baseClasses;
  };

  const tones = ['Professional', 'Friendly', 'Urgent', 'Luxury', 'Playful', 'Inspirational'];

  return (
    <section id="ad-copy-generator" className="relative" aria-labelledby="ad-copy-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Creates compelling headlines and descriptions for your ad campaigns based on your product, audience, and tone.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="ad-copy-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Ad Copy</span> Generator
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Struggling with writer's block? Describe your product and let our AI generate compelling ad copy variations in seconds.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-2">Product/Service Name</label>
              <input type="text" name="productName" id="productName" value={values.productName} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('productName')} placeholder="e.g., QuantumLeap SaaS" />
              {touched.productName && errors.productName && <p className="text-red-400 text-xs mt-1">{errors.productName}</p>}
            </div>
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
              <input type="text" name="targetAudience" id="targetAudience" value={values.targetAudience} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('targetAudience')} placeholder="e.g., B2B data analysts" />
              {touched.targetAudience && errors.targetAudience && <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>}
            </div>
            <div>
              <label htmlFor="keyFeatures" className="block text-sm font-medium text-slate-300 mb-2">Key Features/Benefits</label>
              <textarea name="keyFeatures" id="keyFeatures" rows={3} value={values.keyFeatures} onChange={handleChange} onBlur={handleBlur} className={getInputClasses('keyFeatures')} placeholder="e.g., Real-time analytics, Interactive dashboards" />
              {touched.keyFeatures && errors.keyFeatures && <p className="text-red-400 text-xs mt-1">{errors.keyFeatures}</p>}
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">Tone of Voice</label>
              <select name="tone" id="tone" value={values.tone} onChange={handleChange} className={getInputClasses('tone')}>
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="text-center pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Ad Copy'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="relative bg-slate-900/70 border border-slate-800 rounded-lg p-6">
          {isLoading && <LoadingSpinner size="lg" />}
          {error && <div role="alert" className="flex items-center justify-center text-red-400 text-center p-4 min-h-[400px]">{error}</div>}
          
          {!isLoading && !error && (
              (results && typeof results !== 'string') ? (
                  <div className="space-y-6 animate-fade-in">
                      <div>
                          <h3 className="text-lg font-bold text-blue-400 mb-3">Headlines</h3>
                          <ul className="space-y-2">
                          {results.headlines?.map((headline, index) => (
                              <li key={`h-${index}`} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-md">
                              <span className="text-slate-200">{headline}</span>
                              <button onClick={() => handleCopy(headline)} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Copy headline">
                                  {copiedText === headline ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> )}
                              </button>
                              </li>
                          ))}
                          </ul>
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-blue-400 mb-3">Descriptions</h3>
                          <ul className="space-y-2">
                          {results.descriptions?.map((desc, index) => (
                              <li key={`d-${index}`} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-md">
                              <span className="text-slate-300">{desc}</span>
                              <button onClick={() => handleCopy(desc)} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Copy description">
                                  {copiedText === desc ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> )}
                              </button>
                              </li>
                          ))}
                          </ul>
                      </div>
                  </div>
              ) : (
                  <div className="flex min-h-[400px] items-center justify-center text-slate-500 text-center">
                      <p>Your generated ad copy will appear here...</p>
                  </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default AdCopyGenerator;
