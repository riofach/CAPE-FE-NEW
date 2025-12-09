import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion.
 * Returns true if:
 * - OS has "prefers-reduced-motion: reduce" enabled
 * - Device is touch-only (no hover capability)
 */
export function useReducedMotion(): boolean {
  const [shouldReduce, setShouldReduce] = useState(() => {
    // SSR safety: default to false on server
    if (typeof window === 'undefined') return false;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    return mediaQuery.matches || isTouchDevice;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    const handler = (e: MediaQueryListEvent) => {
      setShouldReduce(e.matches || isTouchDevice);
    };

    // Set initial value
    setShouldReduce(mediaQuery.matches || isTouchDevice);

    // Listen for changes
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return shouldReduce;
}
