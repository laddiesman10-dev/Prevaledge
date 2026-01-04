import React from 'react';

type Stage = 'discover' | 'strategize' | 'execute' | 'optimize' | null;

interface InteractiveProcessFlowIconProps extends React.SVGProps<SVGSVGElement> {
  activeStage: Stage;
}

const InteractiveProcessFlowIcon: React.FC<InteractiveProcessFlowIconProps> = ({ activeStage, ...props }) => {
  const stages = {
    discover: { cx: 50, cy: 50, text: 'Discover' },
    strategize: { cx: 250, cy: 50, text: 'Strategize' },
    execute: { cx: 250, cy: 150, text: 'Execute' },
    optimize: { cx: 50, cy: 150, text: 'Optimize' },
  };

  const getNodeClasses = (stage: Stage) => {
    const baseCircle = "transition-all duration-500";
    const baseText = "transition-all duration-500 font-bold text-[14px] fill-slate-300";
    if (stage === activeStage) {
      return {
        circle: `${baseCircle} fill-blue-500/20 stroke-blue-400 stroke-2`,
        text: `${baseText} fill-white`,
      };
    }
    return {
      circle: `${baseCircle} fill-slate-800 stroke-slate-600 stroke-1`,
      text: `${baseText} fill-slate-400`,
    };
  };

  const getPathClasses = (startStage: Stage) => {
    const base = "transition-all duration-500 stroke-2";
    if (activeStage === startStage) {
      return `${base} stroke-blue-500`;
    }
    return `${base} stroke-slate-700`;
  };

  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Paths */}
      <path d="M 80 50 H 220" fill="none" className={getPathClasses('discover')} />
      <path d="M 250 80 V 120" fill="none" className={getPathClasses('strategize')} />
      <path d="M 220 150 H 80" fill="none" className={getPathClasses('execute')} />
      <path d="M 50 120 V 80" fill="none" className={getPathClasses('optimize')} />

      {/* Nodes */}
      {Object.entries(stages).map(([key, { cx, cy, text }]) => {
        const { circle, text: textClass } = getNodeClasses(key as Stage);
        return (
          <g key={key} style={{ filter: activeStage === key ? 'url(#glow)' : 'none' }}>
            <circle cx={cx} cy={cy} r="30" className={circle} />
            <text x={cx} y={cy + 5} textAnchor="middle" className={textClass}>
              {text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default InteractiveProcessFlowIcon;
