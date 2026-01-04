import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const useIntersectionObserver = (options: IntersectionObserverInit & { triggerOnce?: boolean }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Destructure options to create stable dependencies for useEffect
  const { threshold, root, rootMargin, triggerOnce } = options;

  useEffect(() => {
    const currentRef = ref.current; // Capture ref value for cleanup
    if (!currentRef) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          // It's safe to unobserve from within the callback
          observer.unobserve(entry.target);
        }
      } else {
        if (!triggerOnce) {
            setIsInView(false);
        }
      }
    }, { threshold, root, rootMargin });

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
    // Use the destructured, stable values in the dependency array
  }, [threshold, root, rootMargin, triggerOnce]);

  return [ref, isInView] as const;
};


const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true
}) => {
  const [ref, isInView] = useIntersectionObserver({ threshold, triggerOnce });

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out will-change-[transform,opacity] ${className}
        ${isInView ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;