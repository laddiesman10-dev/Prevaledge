// This allows us to extend the Window interface
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Tracks a custom event with Google Analytics.
 * @param action - The name of the event (e.g., 'submit_contact_form').
 * @param params - An object of additional parameters to send with the event.
 */
export const trackEvent = (action: string, params?: Record<string, any>): void => {
  // Check if gtag is available on the window object
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  } else {
    // You might want to log this in development for debugging
    // console.warn(`Analytics event "${action}" not tracked because gtag is not available.`);
  }
};
