import React from 'react';
import { useCustomNavigate } from '../../hooks/useCustomNavigate';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'link';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, href, variant = 'primary', className = '', ...props }) => {
  const customNavigate = useCustomNavigate();

  const primaryClasses = 'px-6 sm:px-8 py-3 font-semibold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 focus:ring-blue-400/50';
  const secondaryClasses = 'px-6 sm:px-8 py-3 font-semibold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-4 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 backdrop-blur-sm focus:ring-slate-500/50';
  const linkClasses = 'p-0 font-normal text-slate-400 hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500 rounded-sm';

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return primaryClasses;
      case 'secondary':
        return secondaryClasses;
      case 'link':
        return linkClasses;
      default:
        return primaryClasses;
    }
  };

  const classes = `${getVariantClasses()} ${className}`;
  
  if (href) {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      customNavigate(href);
    };

    return (
      <a href={href} onClick={handleLinkClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;