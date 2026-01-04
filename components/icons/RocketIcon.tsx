
import React from 'react';

const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.05A5.5 5.5 0 0 0 3 8.5c0 1.45.63 2.9 1.5 4z" />
    <path d="M12.5 4.5c1.26-1.5 5-2 5-2s-.5 3.74-2 5c-.84.71-2.3.7-3.05.05A5.5 5.5 0 0 1 8.5 3c1.45 0 2.9.63 4 1.5z" />
    <path d="M8 16c-1.5-2-3-5.5-3-5.5s4 1 6 3" />
    <path d="M16 8c2-1.5 5.5-3 5.5-3s-1 4-3 6" />
  </svg>
);

export default RocketIcon;
