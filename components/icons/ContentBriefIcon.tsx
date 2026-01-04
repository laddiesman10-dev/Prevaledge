
import React from 'react';

const ContentBriefIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18h.01" />
    <path d="M12 15a2.5 2.5 0 0 1-2.4-3.13" />
    <path d="M14.4 11.87a2.5 2.5 0 0 1-2.4 3.13" />
    <path d="M12 11.5V10" />
    <path d="M10 12.5h.5" />
    <path d="M14 12.5h-.5" />
    <path d="m10.8 14.3-.4-.4" />
    <path d="m13.2 14.3.4-.4" />
  </svg>
);

export default ContentBriefIcon;
