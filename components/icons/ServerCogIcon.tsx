import React from 'react';

const ServerCogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M5 7.2A2 2 0 0 1 7 5.2h10a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
    <path d="M5 12H3" />
    <path d="M21 12h-2" />
    <path d="M12 19v2" />
    <path d="M12 3v2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v-0.5" />
    <path d="M12 15v-0.5" />
    <path d="M14.5 12h-0.5" />
    <path d="M9.5 12h-0.5" />
    <path d="m13.8 13.8-.4-.4" />
    <path d="m9.2 9.2-.4-.4" />
    <path d="m13.8 10.2-.4.4" />
    <path d="m9.2 14.8-.4.4" />
  </svg>
);

export default ServerCogIcon;