import React, { useState, useEffect } from 'react';

interface HoloscanVisualizerProps {
  url: string;
}

const scanSteps = [
  "Initiating site analysis...",
  "Establishing secure connection...",
  "Crawling site structure for SEO...",
  "Analyzing page speed and Core Vitals...",
  "Evaluating user experience design...",
  "Checking mobile responsiveness...",
  "Assessing security protocols...",
  "Compiling performance metrics...",
  "Finalizing analysis...",
  "Scan complete. Rendering report...",
];

const HoloscanVisualizer: React.FC<HoloscanVisualizerProps> = ({ url }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-blue-400">Analyzing Digital Presence</h3>
        <p className="text-slate-400 font-mono break-all">{url}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-4 mb-6 relative overflow-hidden">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-width duration-100 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-32 animate-shine"></div>
      </div>
      
      {/* Terminal Output */}
      <div className="bg-black/50 rounded-md p-4 h-48 font-mono text-sm text-green-400 overflow-hidden">
        {scanSteps.slice(0, currentStep + 1).map((step, index) => (
          <p key={index} className={index === currentStep ? 'animate-pulse' : ''}>
            <span className="text-slate-500 mr-2">{`[${(index * 10).toString().padStart(3, ' ')}%] >`}</span>
            {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default HoloscanVisualizer;