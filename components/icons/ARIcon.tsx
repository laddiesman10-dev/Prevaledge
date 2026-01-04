import React from 'react';

const ARIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M20.94 11c.46.9.7 1.91.7 3" />
    <path d="M3.06 11A9.5 9.5 0 0 1 12 5.5" />
    <path d="M12 20.5c-1.84 0-3.54-.6-4.94-1.6" />
    <path d="M21.66 15.6A9.5 9.5 0 0 0 12 20.5" />
  </svg>
);

export default ARIcon;