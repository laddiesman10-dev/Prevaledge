import React from 'react';
import Card from './ui/Card';
import AnimateOnScroll from './ui/AnimateOnScroll';
import { aiTools } from '../data/siteData';
import { useCustomNavigate } from '../hooks/useCustomNavigate';

const AIToolkit: React.FC = () => {
  const navigate = useCustomNavigate();

  return (
    <section id="ai-toolkit" className="py-20" aria-labelledby="ai-toolkit-heading">
        <AnimateOnScroll>
          <div className="text-center">
              <h2 id="ai-toolkit-heading" className="text-4xl font-bold mb-4">
                  Prevaledge <span className="text-blue-400">AI Toolkit</span>
              </h2>
              <p className="max-w-3xl mx-auto text-slate-400 mb-16">
                  Explore our suite of free, powerful AI tools designed to enhance your digital marketing strategy and accelerate your growth.
              </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiTools.map((tool, index) => (
            <AnimateOnScroll key={tool.id} delay={index * 100}>
              <button 
                onClick={() => navigate(`/ai-toolkit/${tool.id}`)}
                className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl group"
                aria-label={`Open ${tool.title} tool`}
              >
                <Card className="flex flex-col items-center text-center">
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-full mb-4">
                    <tool.icon 
                      aria-hidden="true"
                      className="w-8 h-8 text-blue-400 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-slate-400 text-sm flex-grow">{tool.description}</p>
                </Card>
              </button>
            </AnimateOnScroll>
          ))}
        </div>
    </section>
  );
};

export default AIToolkit;