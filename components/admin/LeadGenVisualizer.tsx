import React, { useState, useEffect } from 'react';

interface LeadGenVisualizerProps {
  mode: 'finding' | 'auditing';
  target?: string;
}

const findingSteps = [
  "Parsing Ideal Customer Profile...",
  "Querying lead databases...",
  "Analyzing company profiles...",
  "Filtering for technology stack...",
  "Ranking potential leads...",
  "Compiling prospect list...",
];

const auditingSteps = [
  "Initiating comprehensive audit...",
  "Crawling site for technical health...",
  "Analyzing on-page SEO & content...",
  "Scanning social media presence...",
  "Evaluating competitive landscape...",
  "Identifying key pain points...",
  "Developing strategic roadmap...",
  "Generating outreach materials...",
  "Finalizing intelligence report...",
];

const LeadGenVisualizer: React.FC<LeadGenVisualizerProps> = ({ mode, target }) => {
  const steps = mode === 'finding' ? findingSteps : auditingSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const duration = mode === 'finding' ? 1500 : 8000; // Auditing takes longer

  useEffect(() => {
    const stepDuration = duration / steps.length;
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, duration / 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [steps, duration]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-8 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-blue-400">
            {mode === 'finding' ? 'Finding Prospects...' : 'Analyzing Prospect...'}
        </h3>
        {target && <p className="text-slate-400 font-mono break-all">{target}</p>}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-4 mb-6 relative overflow-hidden">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-100 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-32 animate-shine"></div>
      </div>
      
      {/* Terminal Output */}
      <div className="bg-black/50 rounded-md p-4 h-48 font-mono text-sm text-green-400 overflow-y-auto">
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <p key={index} className={index === currentStep ? 'animate-pulse' : ''}>
            <span className="text-slate-500 mr-2">{`[${Math.min(100, Math.round(index * (100 / (steps.length - 1)))).toString().padStart(3, ' ')}%] >`}</span>
            {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LeadGenVisualizer;
