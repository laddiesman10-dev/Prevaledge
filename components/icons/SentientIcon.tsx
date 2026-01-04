import React from 'react';

const SentientIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17.5 2 4.91 4.91 0 0 0 13 6.78" />
    <path d="M12 20.94c-1.5 0-2.75 1.06-4 1.06-3 0-6-8-6-12.22A4.91 4.91 0 0 1 6.5 2 4.91 4.91 0 0 1 11 6.78" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
  </svg>
);

export default SentientIcon;