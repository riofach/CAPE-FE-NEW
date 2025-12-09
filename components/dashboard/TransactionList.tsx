import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, AlertCircle } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getStaggerDelay, getShadowClass } from '../../lib/motion';
import { CategoryIcon } from '../ui/dynamic-icon';
import type { Transaction } from '../../types/api';

interface TransactionListProps {
  transactions: Transaction[];
  onCardClick: (transaction: Transaction) => void;
  isLoading?: boolean;
  highlightId?: string | null;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onCardClick,
  isLoading,
  highlightId
}) => {
  const reducedMotion = useReducedMotion();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className={cn(
              "p-4 rounded-2xl",
              "bg-white/60",
              "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]"
            )}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
                <div className="h-5 bg-slate-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-8 rounded-3xl text-center",
          "bg-white/60",
          "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]"
        )}
      >
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">
          Belum ada transaksi
        </h3>
        <p className="text-sm text-slate-500">
          Mulai catat pengeluaranmu dengan AI Smart Input di atas! ✨
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode={reducedMotion ? 'wait' : 'popLayout'}>
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            layout={!reducedMotion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={getStaggerDelay(index, reducedMotion)}
            onClick={() => onCardClick(transaction)}
            className={cn(
              "p-4 rounded-2xl cursor-pointer",
              getShadowClass('backdrop', reducedMotion),
              "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]",
              reducedMotion 
                ? "hover:shadow-lg" 
                : "hover:shadow-[inset_6px_6px_12px_#ffffff,inset_-3px_-3px_8px_#d1d5db]",
              "active:scale-[0.99]",
              "transition-all duration-300",
              highlightId === transaction.id && "opacity-50"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Category Icon */}
              {transaction.category ? (
                <CategoryIcon 
                  iconSlug={transaction.category.iconSlug} 
                  colorHex={transaction.category.colorHex}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 truncate">
                    {transaction.description || 'Tanpa deskripsi'}
                  </p>
                  {transaction.isAiGenerated && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 text-xs">
                      <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                      AI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{formatDate(transaction.date)}</span>
                  {transaction.category && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="truncate">{transaction.category.name}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className={cn(
                  "font-bold",
                  transaction.category?.type === 'INCOME' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {transaction.category?.type === 'INCOME' ? '+' : '-'}
                  {formatPrice(parseFloat(transaction.amount))}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
