import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ClayCardProps extends HTMLMotionProps<"div"> {
  color?: 'white' | 'green' | 'lime';
  children?: React.ReactNode;
  className?: string;
  disableAnimation?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({ 
  children, 
  className, 
  color = 'white',
  disableAnimation = false,
  ...props 
}) => {
  const colors = {
    white: "bg-[#f0f4f8]",
    green: "bg-[#ecfdf5]", // Emerald 50
    lime: "bg-[#f7fee7]"   // Lime 50
  };

  const baseClasses = cn(
    "rounded-3xl p-8",
    colors[color],
    "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
    "border border-white/40",
    className
  );

  // For pages where content loads dynamically (not scrolled into view),
  // use instant render instead of whileInView animation
  if (disableAnimation) {
    return (
      <div className={baseClasses}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};