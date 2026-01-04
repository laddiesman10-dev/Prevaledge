import React from 'react';

const SortDescendingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m3 16 4 4 4-4"/>
    <path d="M7 20V4"/>
    <path d="M11 12h10"/>
    <path d="M11 18h7"/>
    <path d="M11 6h13"/>
  </svg>
);

export default SortDescendingIcon;
