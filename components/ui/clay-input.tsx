import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-600 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-2xl",
            "bg-[#f0f4f8] text-slate-700 placeholder:text-slate-400",
            "shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
            "border border-white/40",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
            "transition-all duration-200",
            error && "ring-2 ring-red-400/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
