import React from 'react';
import type { ServiceInfoResult } from '../types';
import CheckIcon from './icons/CheckIcon';
import AgentIcon from './icons/AgentIcon';

interface ServiceInfoCardProps {
  result: ServiceInfoResult;
}

const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({ result }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-2 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <AgentIcon className="w-6 h-6 text-blue-300 flex-shrink-0" />
        <h4 className="text-lg font-bold text-white">{result.title}</h4>
      </div>
      <p className="text-sm text-slate-300 mb-4">{result.description}</p>
      
      <div className="border-t border-slate-700 pt-3">
        <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Key Offerings</h5>
        <ul className="space-y-2">
            {result.keyOfferings.map((offering, index) => (
                <li key={index} className="flex items-start text-sm">
                    <CheckIcon className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{offering}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceInfoCard;