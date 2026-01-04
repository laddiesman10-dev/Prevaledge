import React from 'react';

const NeuralSignatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 100 50" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
    className={`w-24 h-12 text-blue-400 group-hover:text-blue-300 transition-colors duration-500 ${props.className}`}
  >
    <style>{`
      .path {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: draw 3s ease-in-out forwards;
      }
      @keyframes draw {
        to {
          stroke-dashoffset: 0;
        }
      }
      .pulse {
        animation: pulse 2s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
    `}</style>
    <path
      d="M 2 25 C 5 10, 15 10, 20 25 S 30 40, 35 25 S 45 10, 50 25 S 60 40, 65 25 S 75 10, 80 25 S 90 40, 98 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="path"
    />
     <circle cx="2" cy="25" r="3" fill="currentColor" className="pulse" style={{animationDelay: '0s'}} />
     <circle cx="50" cy="25" r="3" fill="currentColor" className="pulse" style={{animationDelay: '0.5s'}} />
     <circle cx="98" cy="25" r="3" fill="currentColor" className="pulse" style={{animationDelay: '1s'}} />
  </svg>
);

export default NeuralSignatureIcon;
