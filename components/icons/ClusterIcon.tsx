import React from 'react';

const ClusterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2l-2.5 5L4 8l5 4-2 6 5-3.5L17 18l-2-6 5-4-5.5-1z" />
  </svg>
);

export default ClusterIcon;