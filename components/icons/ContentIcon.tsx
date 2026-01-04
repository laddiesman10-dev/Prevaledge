import React from 'react';

const ContentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M2.9 19.3c.1-.4.2-.8.4-1.1" />
    <path d="M4 16.8c.3-.5.6-1 1-1.5" />
    <path d="M5.5 14.5c.5-.6 1.2-1.2 1.9-1.7" />
    <path d="M7.8 12.5c.7-.5 1.4-.9 2.2-1.2" />
    <path d="M10.4 11c.9-.3 1.8-.4 2.6-.4" />
  </svg>
);

export default ContentIcon;