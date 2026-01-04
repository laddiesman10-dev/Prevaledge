import { useContext, useCallback } from 'react';
import { RouterContext } from '../types';

/**
 * A custom hook to handle navigation logic consistently across the app.
 * It intelligently handles anchor links vs. full page navigations,
 * especially when navigating from a sub-page (e.g., /privacy-policy)
 * back to an anchor on the main page.
 */
export const useCustomNavigate = () => {
  const { navigate } = useContext(RouterContext);

  const customNavigate = useCallback((href: string) => {
    if (!href) return;

    const isAnchorLink = href.startsWith('#');

    if (isAnchorLink) {
      // For any anchor link, always navigate to the site path with the given hash.
      navigate(`/site${href}`);
    } else {
      // For full paths like '/privacy-policy', navigate directly.
      navigate(href);
    }
  }, [navigate]);

  return customNavigate;
};