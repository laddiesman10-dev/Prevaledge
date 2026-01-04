import { useState, useEffect, useRef } from 'react';

// Ease out quint function for a smoother animation
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export const useAnimatedNumber = (endValue: number, duration = 1500) => {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    // Capture the current rendered value to start the animation from there
    startValueRef.current = current; 
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuint(progress);
      
      const range = endValue - startValueRef.current;
      const nextValue = startValueRef.current + range * easedProgress;

      setCurrent(Math.round(nextValue));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure it ends exactly on the endValue
        setCurrent(endValue);
      }
    };
    
    // Cancel any previous animation before starting a new one
    if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration]);

  return current;
};
