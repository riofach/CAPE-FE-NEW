import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getShadowClass } from '../../lib/motion';

interface StatsCardProps {
  month: string;
  totalExpense: number;
  totalIncome: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  month,
  totalExpense,
  totalIncome,
  onPrevMonth,
  onNextMonth,
  isLoading
}) => {
  const reducedMotion = useReducedMotion();
  const balance = totalIncome - totalExpense;
  const isPositive = balance >= 0;

  const formatMonth = (dateStr: string) => {
    const [year, monthNum] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const isCurrentMonth = () => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return month === current;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl p-6",
        "bg-gradient-to-br from-emerald-50 to-teal-50",
        "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
        "border border-white/60"
      )}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={reducedMotion ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrevMonth}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-white/80 hover:bg-white",
            reducedMotion
              ? "shadow-md"
              : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
            "transition-all duration-200"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
        </motion.button>

        <h2 className="text-lg font-bold text-slate-700 capitalize">
          {formatMonth(month)}
        </h2>

        <motion.button
          whileHover={reducedMotion ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNextMonth}
          disabled={isCurrentMonth()}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-white/80 hover:bg-white",
            reducedMotion
              ? "shadow-md"
              : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
            "transition-all duration-200",
            isCurrentMonth() && "opacity-40 cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-2 w-16" />
              <div className="h-8 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Income */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -2 }}
            className={cn(
              "p-4 rounded-2xl",
              getShadowClass('backdrop', reducedMotion),
              reducedMotion
                ? "shadow-md"
                : "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-slate-500">Pemasukan</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              {formatPrice(totalIncome)}
            </p>
          </motion.div>

          {/* Expense */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -2 }}
            className={cn(
              "p-4 rounded-2xl",
              getShadowClass('backdrop', reducedMotion),
              reducedMotion
                ? "shadow-md"
                : "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-rose-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-slate-500">Pengeluaran</span>
            </div>
            <p className="text-xl font-bold text-rose-600">
              {formatPrice(totalExpense)}
            </p>
          </motion.div>

          {/* Balance */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -2 }}
            className={cn(
              "p-4 rounded-2xl",
              getShadowClass('backdrop', reducedMotion),
              reducedMotion
                ? "shadow-md"
                : "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isPositive ? "bg-blue-100" : "bg-orange-100"
              )}>
                <Wallet className={cn(
                  "w-4 h-4",
                  isPositive ? "text-blue-600" : "text-orange-600"
                )} strokeWidth={1.5} />
              </div>
              <span className="text-sm text-slate-500">Saldo</span>
            </div>
            <p className={cn(
              "text-xl font-bold",
              isPositive ? "text-blue-600" : "text-orange-600"
            )}>
              {isPositive ? '+' : ''}{formatPrice(balance)}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
