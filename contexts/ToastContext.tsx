import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastData } from '../components/ui/clay-toast';

interface ToastContextType {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (type: 'success' | 'error', title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastData = { id, type, title, description };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => addToast('success', title, description),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => addToast('error', title, description),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
