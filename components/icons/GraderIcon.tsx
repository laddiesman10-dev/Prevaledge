import React from 'react';

const GraderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M8.5 14.5L11 12l-2.5-2.5" />
    <path d="M15.5 14.5L13 12l2.5-2.5" />
    <circle cx="12" cy="12" r="10" />
    <path d="m16 16-2-2" />
    <path d="m8 8 2 2" />
  </svg>
);

export default GraderIcon;