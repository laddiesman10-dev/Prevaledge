import React from 'react';

const AnalyzeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <circle cx="12" cy="13" r="3" />
    <path d="M12 16v5" />
    <path d="M12 8V5" />
    <path d="M15.5 14.5 18 17" />
    <path d="M6 9l2.5 2.5" />
    <path d="M6 17l2.5-2.5" />
    <path d="M18 9l-2.5 2.5" />
  </svg>
);

export default AnalyzeIcon;