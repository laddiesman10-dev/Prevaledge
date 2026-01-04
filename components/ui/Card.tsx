import React, { useRef, useEffect, forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isPopular?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '', isPopular = false }, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = (ref || internalRef) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const currentRef = cardRef.current;
    if (!currentRef) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentRef.style.setProperty('--mouse-x', `${x}px`);
      currentRef.style.setProperty('--mouse-y', `${y}px`);
    };

    currentRef.addEventListener('mousemove', handleMouseMove);

    return () => {
      currentRef.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cardRef]);

  return (
    <div 
      ref={cardRef}
      className={`
        interactive-card
        relative h-full
        bg-slate-900/40 backdrop-blur-xl
        rounded-xl p-8
        border border-white/10
        transition-transform duration-300 ease-in-out
        hover:-translate-y-1
        ${className}
        ${isPopular ? 'border-blue-500/30' : ''}
      `}
    >
      {isPopular && (
        <div 
          className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-lg"
          aria-hidden="true"
        ></div>
      )}
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
