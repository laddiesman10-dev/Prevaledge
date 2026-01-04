import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div 
        className="absolute right-0 bottom-full mb-2 w-64
                   bg-slate-800 text-slate-200 text-sm rounded-lg shadow-lg p-3
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10
                   transform transition-transform group-hover:-translate-y-1"
        role="tooltip"
      >
        {text}
        {/* Triangle pointing down */}
        <div className="absolute right-3 top-full w-0 h-0
                        border-x-8 border-x-transparent
                        border-t-8 border-t-slate-800">
        </div>
      </div>
    </div>
  );
};

export default Tooltip;