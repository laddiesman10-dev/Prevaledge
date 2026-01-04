import { useEffect } from 'react';

export const useScrollOnRouteChange = (route: string) => {
  useEffect(() => {
    const hash = route.split('#')[1];
    if (hash) {
      // Use a timeout to ensure the element is rendered before scrolling
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (route === '/') { // Only scroll to top if on root path without a valid hash
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [route]);
};
