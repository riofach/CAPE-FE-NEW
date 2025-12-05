/**
 * Motion configuration constants for progressive enhancement.
 * Use with useReducedMotion() hook to conditionally apply animations.
 */

export const MOTION_TRANSITION = {
  default: { duration: 0.3, ease: 'easeOut' as const },
  fast: { duration: 0.15, ease: 'easeOut' as const },
} as const;

export const MOTION_VARIANTS = {
  // Page entrance - always used
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  
  // Card hover - conditional
  cardHover: {
    full: { y: -3, transition: { duration: 0.2 } },
    reduced: {},
  },
  
  // Button tap - always used (essential feedback)
  buttonTap: { scale: 0.98 },
} as const;

/**
 * Get stagger delay for list items.
 * @param index - Item index in list
 * @param reducedMotion - Whether to use reduced motion
 * @returns Framer Motion transition object
 */
export const getStaggerDelay = (index: number, reducedMotion: boolean) => {
  if (reducedMotion) return {};
  return { delay: index * 0.03 };
};

/**
 * Shadow class utilities for claymorphism.
 * Use reducedMotion to pick appropriate class.
 */
export const SHADOW_CLASSES = {
  // Large card shadows (StatsCard, AISmartInput containers)
  card: {
    full: 'shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]',
    reduced: 'shadow-lg',
  },
  
  // Inner card shadows (stat items, transaction items)
  cardInner: {
    full: 'shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]',
    reduced: 'shadow-md',
  },
  
  // Hover state shadows
  cardHover: {
    full: 'hover:shadow-[inset_6px_6px_12px_#ffffff,inset_-3px_-3px_8px_#d1d5db]',
    reduced: 'hover:shadow-lg',
  },
  
  // Backdrop blur containers (nav, cards with blur)
  backdrop: {
    full: 'backdrop-blur-sm bg-white/60',
    reduced: 'bg-white/95',
  },
  
  // Nav specific
  navBackdrop: {
    full: 'backdrop-blur-md bg-white/70',
    reduced: 'bg-white/95',
  },
} as const;

/**
 * Helper to get shadow class based on reduced motion preference.
 */
export const getShadowClass = (
  type: keyof typeof SHADOW_CLASSES,
  reducedMotion: boolean
): string => {
  return reducedMotion ? SHADOW_CLASSES[type].reduced : SHADOW_CLASSES[type].full;
};
