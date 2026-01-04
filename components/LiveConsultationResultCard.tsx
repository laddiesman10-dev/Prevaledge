import React from 'react';
import type { ConsultationResult } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';

interface ConsultationResultCardProps {
  result: ConsultationResult;
}

const ConsultationResultCard: React.FC<ConsultationResultCardProps> = ({ result }) => {
  return (
    <div className="bg-green-900/40 border border-green-500/50 rounded-lg p-4 my-2 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <CheckCircleIcon className="w-6 h-6 text-green-300 flex-shrink-0" />
        <h4 className="text-lg font-bold text-white">Consultation Scheduled</h4>
      </div>
      <p className="text-sm text-slate-300 mb-4">{result.message}</p>
      <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-slate-400"/>
            <span className="text-slate-200">{result.name}</span>
          </div>
           <div className="flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-slate-400"/>
            <span className="text-slate-200">{result.email}</span>
          </div>
      </div>
    </div>
  );
};

export default ConsultationResultCard;