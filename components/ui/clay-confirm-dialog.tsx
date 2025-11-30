import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClayConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ClayConfirmDialog: React.FC<ClayConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isLoading) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus dialog for accessibility
      setTimeout(() => dialogRef.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, isLoading]);

  const variantStyles = {
    danger: {
      icon: 'bg-rose-100 text-rose-600',
      button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-[4px_4px_8px_#fecdd3,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#be123c,inset_-2px_-2px_4px_#fb7185]'
    },
    warning: {
      icon: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-[4px_4px_8px_#fde68a,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b45309,inset_-2px_-2px_4px_#fbbf24]'
    },
    info: {
      icon: 'bg-sky-100 text-sky-600',
      button: 'bg-sky-500 hover:bg-sky-600 text-white shadow-[4px_4px_8px_#bae6fd,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#0369a1,inset_-2px_-2px_4px_#38bdf8]'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
          />
          
          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100%-2rem)] max-w-sm",
              "rounded-3xl p-6",
              "bg-[#f0f4f8]",
              "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
              "border border-white/40",
              "outline-none"
            )}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                "absolute top-4 right-4",
                "w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer",
                "bg-white/80 hover:bg-slate-100",
                "text-slate-400 hover:text-slate-600",
                "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
                "transition-colors duration-200",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]",
                currentVariant.icon
              )}>
                <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center mb-6">
              <h2 id="confirm-dialog-title" className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
              <p id="confirm-dialog-message" className="text-slate-600">{message}</p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isLoading}
                className={cn(
                  "flex-1 py-3 px-4 rounded-2xl font-bold cursor-pointer",
                  "bg-white/80 text-slate-600",
                  "shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]",
                  "hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                  "transition-all duration-200",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {cancelText}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "flex-1 py-3 px-4 rounded-2xl font-bold cursor-pointer",
                  "transition-all duration-200",
                  currentVariant.button,
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Loading...
                  </span>
                ) : (
                  confirmText
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
