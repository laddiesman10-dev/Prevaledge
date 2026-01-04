import React from 'react';

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.017 21v-7.391c0-5.704 3.731-9.57 9.983-9.57v7.212c-3.13 0-4.418 1.427-4.418 3.973h4.418v5.776h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9.983-9.57v7.212c-3.14 0-4.418 1.427-4.418 3.973h4.418v5.776h-9.983z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

export default QuoteIcon;