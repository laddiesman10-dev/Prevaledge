import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-4',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };
  
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg z-10 ${className}`}>
      <div className={`${sizeClasses[size]} border-blue-400 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
