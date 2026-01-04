import { useEffect } from 'react';

const EXIT_INTENT_KEY = 'prevaledge_exit_intent_shown';

export const useExitIntent = (onExitIntent: () => void) => {
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(EXIT_INTENT_KEY)) {
        onExitIntent();
        sessionStorage.setItem(EXIT_INTENT_KEY, 'true');
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [onExitIntent]);
};