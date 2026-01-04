import React from 'react';
import { aiTools } from '../data/siteData';
import type { AIToolName } from '../types';
import Button from './ui/Button';
import SparklesIcon from './icons/SparklesIcon';

interface AIToolCalloutProps {
  category: string;
}

const categoryToToolMap: { [key: string]: AIToolName } = {
  'SEO': 'seoContentGrader',
  'AI & Automation': 'strategyGenerator',
  'Web Development': 'websiteAnalyzer',
  'Marketing Strategy': 'competitorSnapshot',
  'Content Marketing': 'blogIdeaGenerator',
  'Social Media': 'socialPostGenerator',
};

const AIToolCallout: React.FC<AIToolCalloutProps> = ({ category }) => {
  const toolId = categoryToToolMap[category];
  const tool = aiTools.find(t => t.id === toolId);

  if (!tool) {
    return null; // Don't show a callout if no relevant tool is found
  }

  return (
    <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <div className="p-3 bg-slate-700 rounded-full">
            <tool.icon className="w-8 h-8 text-blue-300" />
        </div>
      </div>
      <div>
        <h4 className="font-bold text-white text-lg">Put this into practice.</h4>
        <p className="text-slate-300 mt-1 mb-3">
          Enjoyed this article? Try our free AI-powered <span className="font-semibold text-blue-300">{tool.title}</span> to apply these concepts and get instant results.
        </p>
      </div>
      <div className="sm:ml-auto flex-shrink-0">
         <Button href={`/ai-toolkit/${tool.id}`} variant="secondary">
            Try the Tool
          </Button>
      </div>
    </div>
  );
};

export default AIToolCallout;