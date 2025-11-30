import React, { lazy, Suspense, memo } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { cn } from '../../lib/utils';

// Cache for loaded icon components
const iconCache = new Map<string, React.LazyExoticComponent<React.FC<LucideProps>>>();

// Get or create lazy icon component
const getIconComponent = (name: string) => {
  if (!iconCache.has(name)) {
    const importFn = dynamicIconImports[name as keyof typeof dynamicIconImports];
    if (importFn) {
      iconCache.set(name, lazy(importFn));
    }
  }
  return iconCache.get(name);
};

// Loading placeholder
const IconPlaceholder: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    className="animate-pulse bg-slate-200 rounded"
    style={{ width: size, height: size }}
  />
);

// Fallback icon when name not found
const FallbackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = memo(({ 
  name, 
  className,
  size = 20,
  color
}) => {
  const IconComponent = getIconComponent(name);
  
  if (!IconComponent) {
    return <FallbackIcon size={size} color={color} />;
  }
  
  return (
    <Suspense fallback={<IconPlaceholder size={size} />}>
      <IconComponent 
        className={cn("shrink-0", className)} 
        size={size} 
        strokeWidth={1.5}
        color={color}
      />
    </Suspense>
  );
});

DynamicIcon.displayName = 'DynamicIcon';

// Export list of all available icon names
export const allIconNames = Object.keys(dynamicIconImports);

interface CategoryIconProps {
  iconSlug: string;
  colorHex: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  iconSlug, 
  colorHex,
  size = 'md'
}) => {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 16 },
    md: { container: 'w-10 h-10', icon: 20 },
    lg: { container: 'w-12 h-12', icon: 24 }
  };

  const bgColor = `${colorHex}20`;
  
  return (
    <div 
      className={cn(
        sizes[size].container,
        "rounded-xl flex items-center justify-center",
        "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]"
      )}
      style={{ backgroundColor: bgColor }}
    >
      <DynamicIcon 
        name={iconSlug} 
        size={sizes[size].icon} 
        color={colorHex}
      />
    </div>
  );
};
