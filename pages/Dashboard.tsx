import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TransactionList } from '../components/dashboard/TransactionList';
import { AISmartInput } from '../components/dashboard/AISmartInput';
import { ManualEntryDialog } from '../components/dashboard/ManualEntryDialog';
import { api } from '../lib/api';
import type { Transaction, Category, TransactionStats } from '../types/api';

export const Dashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [showManualEntry, setShowManualEntry] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await api.transactions.stats(currentMonth);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [currentMonth]);

  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await api.transactions.list({ month: currentMonth, limit: 5 });
      if (response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [currentMonth]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.categories.list();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, [fetchStats, fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleAiSubmit = async (input: string) => {
    setIsAiProcessing(true);
    try {
      await api.transactions.parseWithAi(input);
      await Promise.all([fetchStats(), fetchTransactions()]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleManualSubmit = async (data: {
    categoryId: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    setIsCreating(true);
    try {
      await api.transactions.create(data);
      await Promise.all([fetchStats(), fetchTransactions()]);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.transactions.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      await fetchStats();
    } finally {
      setDeletingId(null);
    }
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
            Dashboard 📊
          </h1>
          <p className="text-slate-500">
            Kelola pengeluaranmu dengan mudah dan cerdas!
          </p>
        </motion.div>

        {/* AI Smart Input */}
        <AISmartInput
          onSubmit={handleAiSubmit}
          onManualEntry={() => setShowManualEntry(true)}
          isLoading={isAiProcessing}
        />

        {/* Stats Card */}
        <StatsCard
          month={currentMonth}
          totalExpense={stats?.totalExpense || 0}
          totalIncome={stats?.totalIncome || 0}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isLoading={isLoadingStats}
        />

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Transaksi Terbaru
            </h2>
            <Link 
              to="/transactions" 
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            isLoading={isLoadingTransactions}
            isDeleting={deletingId}
          />
        </motion.div>
      </div>

      {/* Manual Entry Dialog */}
      <ManualEntryDialog
        open={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        categories={categories}
        onSubmit={handleManualSubmit}
        isLoading={isCreating}
      />
    </DashboardLayout>
  );
};
