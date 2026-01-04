import React, { useState } from 'react';
import { generateNicheProfile } from '../services/geminiService';
import type { NicheProfileResult } from '../types';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import InfoIcon from './icons/InfoIcon';
import HoloscanVisualizer from './HoloscanVisualizer';
import CheckIcon from './icons/CheckIcon';
import { useAITool } from '../hooks/useAITool';

type FormDataType = { industry: string, skills: string, audience: string };

const NicheNavigator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({ industry: '', skills: '', audience: '' });
  const [formError, setFormError] = useState('');

  const { result, isLoading, error, execute, reset } = useAITool<NicheProfileResult, FormDataType>(
      'nicheNavigator',
      args => generateNicheProfile(args.industry, args.skills, args.audience)
  );

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry || !formData.skills || !formData.audience) {
      setFormError('Please complete all fields to generate your niche profile.');
      return;
    }
    setFormError('');
    setStep(4); // Move to loading step
    await execute(formData, formData.industry);
    setStep(5); // Move to results step (or back if error)
  };

  const handleReset = () => {
    setStep(1);
    setFormData({ industry: '', skills: '', audience: '' });
    setFormError('');
    reset();
  };

  // On error from hook, go back to form
  React.useEffect(() => {
      if (error) {
          setStep(3);
      }
  }, [error]);

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in w-full max-w-lg">
            <label htmlFor="industry" className="block text-lg font-medium text-slate-300 mb-2 text-center">What industry, topic, or passion are you interested in?</label>
            <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} className={`${inputClasses} text-center`} placeholder="e.g., Sustainable Coffee, Vintage Guitars, AI for Artists" />
            <div className="mt-6 text-center"> <Button onClick={handleNext} disabled={!formData.industry} className="w-full sm:w-auto">Next</Button> </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in w-full max-w-lg">
            <label htmlFor="skills" className="block text-lg font-medium text-slate-300 mb-2 text-center">What are your key skills or strengths?</label>
            <input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} className={`${inputClasses} text-center`} placeholder="e.g., Writing, Graphic Design, Community Building" />
            <div className="mt-6 text-center flex flex-col sm:flex-row gap-4 justify-center"> <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">Back</Button> <Button onClick={handleNext} disabled={!formData.skills} className="w-full sm:w-auto">Next</Button> </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in w-full max-w-lg">
            <label htmlFor="audience" className="block text-lg font-medium text-slate-300 mb-2 text-center">Who do you want to serve or help?</label>
            <input type="text" name="audience" id="audience" value={formData.audience} onChange={handleChange} className={`${inputClasses} text-center`} placeholder="e.g., Small business owners, Creative professionals, New parents" />
            <div className="mt-6 text-center flex flex-col sm:flex-row gap-4 justify-center"> <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">Back</Button> <Button onClick={handleSubmit} disabled={!formData.audience} className="w-full sm:w-auto">Generate Profile</Button> </div>
            {formError && <p className="text-red-400 text-sm text-center mt-4">{formError}</p>}
            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
          </div>
        );
       case 4:
        return <HoloscanVisualizer url="Crafting your niche strategy..." />;
       case 5:
        if (!result || typeof result === 'string') return null;
        return (
            <div className="animate-fade-in text-left">
                <h3 className="text-2xl font-bold text-center mb-6">Your Niche Profile</h3>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-6">
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">Niche</h4> <p className="text-2xl font-semibold text-white">{result.niche || 'N/A'}</p> </div>
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">Description</h4> <p className="text-slate-300">{result.description || 'No description provided.'}</p> </div>
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">Target Audience</h4> <p className="text-slate-300">{result.targetAudience || 'No audience defined.'}</p> </div>
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">Unique Selling Proposition (USP)</h4> <p className="text-slate-300">{result.usp || 'No USP provided.'}</p> </div>
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">Content Angles</h4> <ul className="space-y-2"> {result.contentAngles?.map((angle, i) => ( <li key={i} className="flex items-start text-sm"><CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 shrink-0" /><span className="text-slate-300">{angle}</span></li> )) || 'Not available.'} </ul> </div>
                    <div> <h4 className="text-sm font-bold uppercase text-blue-400 mb-1">SEO Keywords</h4> <div className="flex flex-wrap gap-2"> {result.keywords?.map(kw => ( <span key={kw} className="px-2 py-1 text-xs text-purple-300 bg-purple-900/50 rounded-full">{kw}</span> )) || 'Not available.'} </div> </div>
                </div>
                 <div className="text-center mt-8">
                    <p className="text-lg text-slate-300 mb-4">Ready to build a brand around this niche?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4"> <Button href="#contact" className="w-full sm:w-auto">Discuss Strategy</Button> <Button variant="secondary" onClick={handleReset} className="w-full sm:w-auto">Find Another Niche</Button> </div>
                </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <section id="niche-navigator" className="relative" aria-labelledby="niche-heading">
      <div className="absolute top-0 right-0 z-20">
        <Tooltip text="Discovers profitable and underserved market niches based on your interests, skills, and target audience.">
          <InfoIcon className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
        </Tooltip>
      </div>
      <div className="text-center">
        <h2 id="niche-heading" className="text-4xl font-bold mb-4">
          AI-Powered <span className="text-blue-400">Niche Navigator</span>
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 mb-12">
          Turn your passion into a plan. Our AI strategist helps you discover profitable niches and craft a go-to-market strategy.
        </p>
      </div>
      <div className="max-w-2xl mx-auto min-h-[250px] flex items-center justify-center">
        {renderStep()}
      </div>
    </section>
  );
};

export default NicheNavigator;