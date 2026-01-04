import React from 'react';

const GeoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 2v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="m4.93 19.07 1.41-1.41" />
    <path d="M12 20v2" />
    <path d="m19.07 19.07-1.41-1.41" />
    <path d="M22 12h-2" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export default GeoIcon;