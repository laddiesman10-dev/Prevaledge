
import React from 'react';
import LiveConsultationResultCard from './LiveConsultationResultCard';
import LiveContentResultCard from './LiveContentResultCard';
import LiveServiceInfoCard from './LiveServiceInfoCard';
import type { ConsultationResult, ContentResult, ServiceInfoResult, ToolResultContent } from '../types';

interface LiveToolResultDisplayProps {
  functionName: string;
  result: ToolResultContent;
}

const LiveToolResultDisplay: React.FC<LiveToolResultDisplayProps> = ({ functionName, result }) => {
  switch (functionName) {
    case 'scheduleConsultation':
      return <LiveConsultationResultCard result={result as ConsultationResult} />;
    case 'findRelevantContent':
      return <LiveContentResultCard result={result as ContentResult} />;
    case 'getServiceInformation':
        return <LiveServiceInfoCard result={result as ServiceInfoResult} />;
    default:
      return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-2 animate-fade-in">
          <p className="text-xs font-mono text-slate-400">Tool Result: {functionName}</p>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all mt-2">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
  }
};

export default LiveToolResultDisplay;
