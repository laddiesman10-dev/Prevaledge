import React from 'react';

const IdeaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M9 18a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v8a3 3 0 0 0 3 3z" />
    <path d="M12 18a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v8a3 3 0 0 0 3 3z" />
    <path d="M9 6h6" />
  </svg>
);

export default IdeaIcon;