import React from 'react';

const headlines = [
  "Prevaledge wins 'AI Innovation Award' for its custom marketing solutions.",
  "Google's latest algorithm update prioritizes user experience and page speed.",
  "Report: AI-powered content creation sees 300% adoption growth in the last year.",
  "The future of e-commerce is headless: faster, more flexible, and more scalable.",
  "Prevaledge client 'QuantumLeap' reports record Q3 sales after site overhaul.",
  "Why data privacy and security are more important than ever for brand trust.",
  "Social media trends: The rise of authentic, short-form video content.",
];

const marqueeContent = headlines.join(' +++ ');

const NewsTicker: React.FC = () => {
  return (
    <div className="relative z-20 flex bg-slate-900/50 border-b border-slate-800 backdrop-blur-lg overflow-hidden whitespace-nowrap">
      <div className="flex-shrink-0 flex items-center animate-marquee">
        {/* Render the content twice for seamless looping */}
        <span className="flex items-center h-10 text-sm text-slate-400 font-mono">
          <span className="flex items-center text-blue-400 mr-4 ml-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            NEWS
          </span>
          {marqueeContent}
        </span>
         <span className="flex items-center h-10 text-sm text-slate-400 font-mono" aria-hidden="true">
          <span className="flex items-center text-blue-400 mr-4 ml-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            NEWS
          </span>
          {marqueeContent}
        </span>
      </div>
    </div>
  );
};

export default NewsTicker;