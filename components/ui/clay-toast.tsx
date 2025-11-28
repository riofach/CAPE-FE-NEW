import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  title: string;
  description?: string;
}

interface ClayToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export const ClayToast: React.FC<ClayToastProps> = ({ toast, onDismiss }) => {
  const isSuccess = toast.type === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-2xl min-w-[320px] max-w-[420px]",
        "backdrop-blur-sm border",
        isSuccess
          ? "bg-emerald-50/90 border-emerald-200/50 shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#a7f3d0]"
          : "bg-rose-50/90 border-rose-200/50 shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#fecdd3]"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
          isSuccess
            ? "bg-emerald-100 text-emerald-600"
            : "bg-rose-100 text-rose-600"
        )}
      >
        {isSuccess ? (
          <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <XCircle className="w-5 h-5" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-semibold text-sm",
            isSuccess ? "text-emerald-800" : "text-rose-800"
          )}
        >
          {toast.title}
        </p>
        {toast.description && (
          <p
            className={cn(
              "text-sm mt-0.5 truncate",
              isSuccess ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "flex-shrink-0 p-1 rounded-lg transition-colors",
          isSuccess
            ? "hover:bg-emerald-100 text-emerald-500"
            : "hover:bg-rose-100 text-rose-500"
        )}
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss
}) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ClayToast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
