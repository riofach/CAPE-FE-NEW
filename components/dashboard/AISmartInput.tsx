import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, CheckCircle, AlertCircle, ShieldOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AISmartInputProps {
  onSubmit: (input: string) => Promise<void>;
  onManualEntry: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  usageStats?: {
    used: number;
    limit: number;
  };
}

export const AISmartInput: React.FC<AISmartInputProps> = ({
  onSubmit,
  onManualEntry,
  isLoading,
  disabled = false,
  disabledMessage,
  usageStats
}) => {
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    try {
      setStatus('idle');
      setErrorMessage('');
      await onSubmit(input.trim());
      setInput('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Gagal memproses. Coba lagi ya!');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const placeholders = [
    "Kopi Starbucks 45k",
    "Nasi Padang 25rb",
    "Grab ke kantor 15000",
    "Beli baju 150k",
    "Listrik bulan ini 300rb"
  ];

  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl p-6",
        "bg-gradient-to-br from-violet-50 to-purple-50",
        reducedMotion
          ? "shadow-lg"
          : "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
        "border border-white/60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            disabled
              ? "bg-slate-300"
              : "bg-gradient-to-br from-violet-500 to-purple-600",
            "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)]"
          )}>
            {disabled ? (
              <ShieldOff className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h3 className={cn("font-bold", disabled ? "text-slate-500" : "text-slate-800")}>
              AI Smart Input
            </h3>
            <p className="text-sm text-slate-500">
              {disabled ? 'Fitur AI tidak tersedia' : 'Ketik natural, AI parsing otomatis ✨'}
            </p>
          </div>
        </div>
        
        {/* Usage Stats */}
        {usageStats && !disabled && (
          <div className={cn(
            "text-xs px-3 py-1.5 rounded-full",
            "bg-white/60",
            "shadow-[inset_1px_1px_2px_#ffffff,inset_-1px_-1px_2px_#e9d5ff]",
            usageStats.used >= usageStats.limit 
              ? "text-rose-600" 
              : "text-slate-600"
          )}>
            <span className="font-semibold">{usageStats.used}</span>
            <span className="text-slate-400">/{usageStats.limit}</span>
            <span className="ml-1 text-slate-400">hari ini</span>
          </div>
        )}
      </div>

      {/* Disabled Overlay */}
      {disabled && (
        <div className={cn(
          "mb-4 p-4 rounded-2xl",
          "bg-slate-100/80 border border-slate-200",
          "flex items-center gap-3"
        )}>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <ShieldOff className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-600">
            {disabledMessage || 'Fitur AI dinonaktifkan untuk akun Anda. Hubungi admin untuk mengaktifkan.'}
          </p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-white/80",
          "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#e9d5ff]",
          "transition-all duration-300",
          isLoading && "animate-pulse"
        )}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? 'Fitur AI tidak tersedia...' : randomPlaceholder}
            disabled={isLoading || disabled}
            className={cn(
              "w-full px-5 py-4 pr-14",
              "bg-transparent text-slate-800 placeholder:text-slate-400",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            whileHover={reducedMotion || disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "w-10 h-10 rounded-xl flex items-center justify-center",
              disabled 
                ? "bg-slate-300 text-slate-500"
                : "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
            ) : (
              <Send className="w-5 h-5" strokeWidth={1.5} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-3 text-emerald-600"
          >
            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm">Berhasil dicatat! 🎉</span>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-3 text-rose-600"
          >
            <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Entry Link */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
        <span>atau</span>
        <button 
          type="button"
          onClick={onManualEntry}
          className="text-violet-600 hover:text-violet-700 font-medium hover:underline"
        >
          input manual
        </button>
      </div>
    </motion.div>
  );
};
