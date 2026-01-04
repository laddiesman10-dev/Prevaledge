
import React from 'react';
import CheckIcon from './icons/CheckIcon';
import XCircleIcon from './icons/XCircleIcon';

interface LiveCritiqueResultCardProps {
  result: {
    feedback: string;
    suggestions: string[];
  };
}

const LiveCritiqueResultCard: React.FC<LiveCritiqueResultCardProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-2 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
            <XCircleIcon className="w-6 h-6 text-yellow-300 flex-shrink-0" />
            <h4 className="text-lg font-bold text-white">Critique & Suggestions</h4>
        </div>
        <p className="text-sm text-slate-300 mb-4">{result.feedback}</p>
        
        <div className="border-t border-slate-700 pt-3">
            <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Suggestions for Improvement</h5>
            <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{suggestion}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default LiveCritiqueResultCard;
