
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 3L9.25 8.75L3.5 11.5L9.25 14.25L12 20L14.75 14.25L20.5 11.5L14.75 8.75L12 3Z" />
    <path d="M5 3L6 5" />
    <path d="M18 19L19 21" />
    <path d="M19 3L18 5" />
    <path d="M5 21L6 19" />
    <path d="M3 11.5H1" />
    <path d="M23 11.5H21" />
  </svg>
);

export default SparklesIcon;
