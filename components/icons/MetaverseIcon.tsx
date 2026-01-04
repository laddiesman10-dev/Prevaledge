import React from 'react';

const MetaverseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M21 7.5-12 1-3 7.5" />
    <path d="M3 7.5v9L12 23l9-6.5v-9" />
    <path d="M12 23V12" />
    <path d="m12 12-9-4.5" />
    <path d="m21 7.5-9 4.5" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <path d="m12 23 8.73-5.05" />
    <path d="M3.27 18.04 12 12.99" />
  </svg>
);

export default MetaverseIcon;