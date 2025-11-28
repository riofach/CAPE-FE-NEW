import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClayDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ClayDialog: React.FC<ClayDialogProps> = ({
  open,
  onClose,
  title,
  children
}) => {
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100%-2rem)] max-w-md",
              "rounded-3xl p-6",
              "bg-[#f0f4f8]",
              "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
              "border border-white/40"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer",
                  "bg-white/80 hover:bg-slate-100",
                  "text-slate-400 hover:text-slate-600",
                  "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
                  "transition-colors duration-200"
                )}
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            </div>
            
            {/* Content */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
