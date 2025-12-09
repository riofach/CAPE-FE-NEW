import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Loader2, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getShadowClass } from '../../lib/motion';

interface AIInsightWidgetProps {
  onGenerate: () => Promise<string>;
}

export const AIInsightWidget: React.FC<AIInsightWidgetProps> = ({ onGenerate }) => {
  const reducedMotion = useReducedMotion();
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onGenerate();
      setInsight(result);
    } catch (err: any) {
      setError(err.message || 'Gagal generate insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl p-6",
        "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50",
        reducedMotion
          ? "shadow-lg"
          : "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
        "border border-white/60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={reducedMotion ? {} : { rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-violet-500 to-purple-600",
              reducedMotion
                ? "shadow-lg"
                : "shadow-[inset_3px_3px_6px_rgba(255,255,255,0.3),4px_4px_12px_rgba(139,92,246,0.3)]"
            )}
          >
            <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
          </motion.div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">AI Insight</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Roast spending-mu! <Flame className="w-3.5 h-3.5 text-orange-500" />
            </p>
          </div>
        </div>
        
        {insight && (
          <motion.button
            whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleGenerate}
            disabled={loading}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-white/80 hover:bg-white text-violet-600",
              reducedMotion
                ? "shadow-sm"
                : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#e9d5ff]",
              "transition-all duration-300"
            )}
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!insight && !loading && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8"
          >
            <p className="text-slate-500 mb-5">
              Penasaran gimana AI melihat kebiasaan spending-mu? 👀
            </p>
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold text-lg",
                "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500",
                "text-white",
                reducedMotion
                  ? "shadow-lg hover:shadow-xl"
                  : "shadow-[inset_3px_3px_6px_rgba(255,255,255,0.3),6px_6px_20px_rgba(139,92,246,0.4)] hover:shadow-[inset_3px_3px_6px_rgba(255,255,255,0.3),8px_8px_25px_rgba(139,92,246,0.5)]",
                "transition-all duration-300"
              )}
            >
              <span className="flex items-center gap-3">
                <Flame className="w-5 h-5" strokeWidth={1.5} />
                Roast Pengeluaranku!
              </span>
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-violet-500" strokeWidth={1.5} />
            </motion.div>
            <p className="text-slate-500 mt-4 font-medium">AI sedang menganalisis...</p>
            <p className="text-slate-400 text-sm">Tunggu sebentar ya 🔥</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-3">😵</div>
            <p className="text-rose-500 font-medium mb-3">{error}</p>
            <button
              onClick={handleGenerate}
              className="text-violet-600 hover:text-violet-700 font-medium hover:underline"
            >
              Coba lagi
            </button>
          </motion.div>
        )}

        {insight && !loading && (
          <motion.div
            key="insight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "p-5 rounded-2xl",
              getShadowClass('backdrop', reducedMotion),
              reducedMotion
                ? "shadow-md"
                : "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#f3e8ff]",
              "border border-violet-100/50"
            )}
          >
            <p className="text-slate-700 whitespace-pre-line leading-relaxed text-[15px]">
              {insight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
