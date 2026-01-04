import React, { useState, useEffect } from 'react';

interface DeferredRendererProps {
  children: React.ReactNode;
  delay: number;
}

const DeferredRenderer: React.FC<DeferredRendererProps> = ({ children, delay }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldRender ? <>{children}</> : null;
};

export default DeferredRenderer;
