import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Receipt, 
  Film, 
  Heart,
  HeartPulse,
  GraduationCap,
  BookOpen,
  MoreHorizontal,
  Briefcase,
  Gift,
  PiggyBank,
  Wallet,
  TrendingUp,
  Laptop,
  PlusCircle,
  Gamepad2,
  HelpCircle,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const iconMap: Record<string, LucideIcon> = {
  'utensils': Utensils,
  'car': Car,
  'shopping-bag': ShoppingBag,
  'receipt': Receipt,
  'film': Film,
  'heart': Heart,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'more-horizontal': MoreHorizontal,
  'briefcase': Briefcase,
  'gift': Gift,
  'piggy-bank': PiggyBank,
  'wallet': Wallet,
  'trending-up': TrendingUp,
  'laptop': Laptop,
  'plus-circle': PlusCircle,
  'gamepad-2': Gamepad2,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  className,
  size = 20,
  color
}) => {
  const Icon = iconMap[name] || HelpCircle;
  
  return (
    <Icon 
      className={cn("shrink-0", className)} 
      size={size} 
      strokeWidth={1.5}
      color={color}
    />
  );
};

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
