import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, BarChart3, Receipt } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryLegend } from '../components/dashboard/CategoryLegend';
import { AIInsightWidget } from '../components/dashboard/AIInsightWidget';
import { api } from '../lib/api';
import { cn, formatPrice } from '../lib/utils';
import type { AnalyticsData } from '../types/api';

export const Analytics: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.analytics.get(currentMonth);
      if (response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 2);
    setCurrentMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const now = new Date();
    const current = new Date(year, month);
    if (current < new Date(now.getFullYear(), now.getMonth() + 1)) {
      setCurrentMonth(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return currentMonth === current;
  };

  const formatMonth = (dateStr: string) => {
    const [year, monthNum] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const handleGenerateInsight = async () => {
    const response = await api.analytics.getInsight(currentMonth);
    if (response.data?.insight) {
      return response.data.insight;
    }
    throw new Error('Failed to generate insight');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">
            Analytics 📈
          </h1>
          <p className="text-slate-500">
            Lihat kemana uangmu pergi bulan ini
          </p>
        </motion.div>

        {/* Month Selector + Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "rounded-3xl p-6",
            "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
            "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
            "border border-white/60"
          )}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevMonth}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                "bg-white/80 hover:bg-white",
                "shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#d1d5db]",
                "transition-all duration-200"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
            </motion.button>

            <h2 className="text-xl font-bold text-slate-700 capitalize">
              {formatMonth(currentMonth)}
            </h2>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              disabled={isCurrentMonth()}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                "bg-white/80 hover:bg-white",
                "shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#d1d5db]",
                "transition-all duration-200",
                isCurrentMonth() && "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Overview Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Expense */}
            <motion.div 
              whileHover={{ y: -3 }}
              className={cn(
                "p-5 rounded-2xl",
                "bg-white/70 backdrop-blur-sm",
                "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff]">
                  <TrendingDown className="w-5 h-5 text-rose-600" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-slate-500 font-medium">Total Pengeluaran</span>
              </div>
              <p className="text-2xl font-bold text-rose-600">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  formatPrice(analytics?.totalExpense || 0)
                )}
              </p>
            </motion.div>

            {/* Comparison */}
            <motion.div 
              whileHover={{ y: -3 }}
              className={cn(
                "p-5 rounded-2xl",
                "bg-white/70 backdrop-blur-sm",
                "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff]",
                  (analytics?.percentChange || 0) <= 0 ? "bg-emerald-100" : "bg-orange-100"
                )}>
                  {(analytics?.percentChange || 0) <= 0 
                    ? <TrendingDown className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                    : <TrendingUp className="w-5 h-5 text-orange-600" strokeWidth={1.5} />
                  }
                </div>
                <span className="text-sm text-slate-500 font-medium">vs Bulan Lalu</span>
              </div>
              <p className={cn(
                "text-2xl font-bold",
                (analytics?.percentChange || 0) <= 0 ? "text-emerald-600" : "text-orange-600"
              )}>
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    {(analytics?.percentChange || 0) > 0 ? '+' : ''}
                    {analytics?.percentChange || 0}%
                  </>
                )}
              </p>
              {!isLoading && (analytics?.percentChange || 0) <= 0 && (
                <p className="text-xs text-emerald-500 mt-1">Bagus! Pengeluaran berkurang 🎉</p>
              )}
            </motion.div>

            {/* Transaction Count */}
            <motion.div 
              whileHover={{ y: -3 }}
              className={cn(
                "p-5 rounded-2xl",
                "bg-white/70 backdrop-blur-sm",
                "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff]">
                  <Receipt className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-slate-500 font-medium">Total Transaksi</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  analytics?.transactionCount || 0
                )}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "rounded-3xl p-6",
              "bg-[#f0f4f8]",
              "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
              "border border-white/40"
            )}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>Top 5 Kategori</span>
              <span className="text-xl">🍩</span>
            </h3>
            <SpendingChart 
              data={analytics?.topCategories || []} 
              isLoading={isLoading}
            />
          </motion.div>

          {/* Category Legend Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "rounded-3xl p-6",
              "bg-[#f0f4f8]",
              "shadow-[20px_20px_60px_#c8d0e7,-20px_-20px_60px_#ffffff]",
              "border border-white/40"
            )}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>Detail per Kategori</span>
              <span className="text-xl">📊</span>
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse h-16 bg-slate-200/50 rounded-2xl" />
                ))}
              </div>
            ) : (
              <CategoryLegend data={analytics?.topCategories || []} />
            )}
          </motion.div>
        </div>

        {/* AI Insight Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AIInsightWidget onGenerate={handleGenerateInsight} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
