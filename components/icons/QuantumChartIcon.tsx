import React from 'react';

const QuantumChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9V3" />
    <path d="M12 21v-6" />
    <path d="M15 12H9" />
    <path d="M21 12h-6" />
    <path d="M3 12h6" />
  </svg>
);

export default QuantumChartIcon;