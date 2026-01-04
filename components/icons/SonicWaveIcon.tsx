import React from 'react';

const SonicWaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 10v4" />
    <path d="M7 7v10" />
    <path d="M12 4v16" />
    <path d="M17 7v10" />
    <path d="M21 10v4" />
  </svg>
);

export default SonicWaveIcon;