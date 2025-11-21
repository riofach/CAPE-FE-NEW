import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = "font-heading font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden active:scale-95";
  
  const variants = {
    primary: "bg-[#10b981] text-white shadow-[6px_6px_12px_#6ee7b7,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#059669,inset_-4px_-4px_8px_#34d399]",
    secondary: "bg-[#f0f4f8] text-slate-600 shadow-clay-button hover:shadow-clay-button-active",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};