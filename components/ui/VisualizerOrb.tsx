import React from 'react';
import MicrophoneIcon from '../icons/MicrophoneIcon';
import SonicWaveIcon from '../icons/SonicWaveIcon';
import SparklesIcon from '../icons/SparklesIcon';
import type { LiveAgentStatus } from '../../types';

interface VisualizerOrbProps {
  status: LiveAgentStatus;
}

const VisualizerOrb: React.FC<VisualizerOrbProps> = ({ status }) => {
  const sizeClasses = "w-48 h-48 sm:w-64 sm:h-64";
  const iconSizeClass = "w-20 h-20 sm:w-24 sm:h-24";

  const baseClasses = `${sizeClasses} rounded-full transition-all duration-500 ease-in-out flex items-center justify-center relative overflow-hidden`;
  
  const statusClasses: Record<LiveAgentStatus, string> = {
    idle: 'bg-blue-900/30 border-2 border-blue-500/50',
    connecting: 'bg-slate-800/30 border-2 border-slate-500/50',
    listening: 'bg-green-900/40 border-2 border-green-500/60 scale-105',
    speaking: 'bg-purple-900/40 border-2 border-purple-500/60',
    thinking: 'bg-purple-900/40 border-2 border-purple-500/60',
    error: 'bg-red-900/40 border-2 border-red-500/60',
  };

  const IconComponent = () => {
    switch (status) {
        case 'listening':
            return <MicrophoneIcon className={`${iconSizeClass} text-green-300/80 transition-all duration-500`} />;
        case 'speaking':
            return <SonicWaveIcon className={`${iconSizeClass} text-purple-300/80 transition-all duration-500 animate-pulse-fast`} />;
        case 'thinking':
            return <SparklesIcon className={`${iconSizeClass} text-purple-300/80 transition-all duration-500 animate-pulse-fast`} />;
        case 'connecting':
            return <div className="w-12 h-12 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>;
        case 'error':
             return <span className="text-4xl">!</span>;
        default: // idle
            return <div className="w-1/2 h-1/2 bg-blue-500/20 rounded-full animate-pulse-slow-inner"></div>;
    }
  };

  return (
    <div className={`${baseClasses} ${statusClasses[status]}`}>
        {/* Outer pulsing ring for active states */}
        {(status === 'listening' || status === 'speaking' || status === 'thinking') && (
            <div className={`absolute inset-0 rounded-full animate-pulse-slow ${status === 'listening' ? 'bg-green-500/20' : 'bg-purple-500/20'}`}></div>
        )}
        
        {/* Core Icon */}
        <div className="relative z-10">
            <IconComponent />
        </div>

        <style>{`
            @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0; transform: scale(1.2); } }
            @keyframes pulse-slow-inner { 0%, 100% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1); opacity: 1; } }
            @keyframes pulse-fast { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
            .animate-pulse-slow-inner { animation: pulse-slow-inner 3s infinite ease-in-out; }
            .animate-pulse-fast { animation: pulse-fast 1s infinite ease-in-out; }
        `}</style>
    </div>
  );
};

export default VisualizerOrb;