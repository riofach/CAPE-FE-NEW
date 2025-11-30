import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { TransactionFilters } from '../components/dashboard/TransactionFilters';
import { TransactionList } from '../components/dashboard/TransactionList';
import { EditTransactionDialog } from '../components/dashboard/EditTransactionDialog';
import { TransactionDetailDialog } from '../components/dashboard/TransactionDetailDialog';
import { ClayConfirmDialog } from '../components/ui/clay-confirm-dialog';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import type { Transaction, Category, TransactionListParams } from '../types/api';

const ITEMS_PER_PAGE = 20;

export const Transactions: React.FC = () => {
  const toast = useToast();
  const location = useLocation();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  
  const [filters, setFilters] = useState<TransactionListParams>({
    sortBy: 'date',
    sortOrder: 'desc',
    limit: ITEMS_PER_PAGE,
    offset: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async (append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const currentOffset = append ? offset + ITEMS_PER_PAGE : 0;
      const response = await api.transactions.list({
        ...filters,
        limit: ITEMS_PER_PAGE,
        offset: currentOffset
      });

      if (response.data) {
        if (append) {
          setTransactions(prev => [...prev, ...response.data!]);
        } else {
          setTransactions(response.data);
        }
        setOffset(currentOffset);
      }
      
      if (response.pagination) {
        setTotal(response.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters, offset]);

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
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setOffset(0);
    fetchTransactions(false);
  }, [filters]);

  // Handle navigation from Dashboard with edit intent
  useEffect(() => {
    const state = location.state as { editTransactionId?: string } | null;
    if (state?.editTransactionId && transactions.length > 0) {
      const transactionToEdit = transactions.find(t => t.id === state.editTransactionId);
      if (transactionToEdit) {
        setEditTransaction(transactionToEdit);
        // Clear the state to prevent re-opening on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, transactions]);

  const handleFilterChange = (newFilters: Partial<TransactionListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleLoadMore = () => {
    fetchTransactions(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.transactions.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setTotal(prev => prev - 1);
      toast.success('Transaksi berhasil dihapus! 🗑️');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus transaksi 😵');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCardClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleEditFromDetail = (transaction: Transaction) => {
    setSelectedTransaction(null);
    setEditTransaction(transaction);
  };

  const handleDeleteFromDetail = (transaction: Transaction) => {
    setSelectedTransaction(null);
    setDeleteTarget(transaction);
  };

  const handleUpdate = async (id: string, data: { categoryId?: string; amount?: number; description?: string; date?: string }) => {
    setIsUpdating(true);
    try {
      const response = await api.transactions.update(id, data);
      if (response.data) {
        setTransactions(prev => prev.map(t => t.id === id ? response.data! : t));
        toast.success('Transaksi berhasil diupdate! ✏️');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupdate transaksi 😵');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const hasMore = transactions.length < total;
  const remaining = total - transactions.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">
            Riwayat Transaksi 📋
          </h1>
          <p className="text-slate-500">
            Semua catatan pengeluaranmu ada di sini
          </p>
        </motion.div>

        {/* Filters */}
        <TransactionFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />

        {/* Transaction Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between text-sm text-slate-500"
        >
          <span>
            Menampilkan {transactions.length} dari {total} transaksi
          </span>
          <button
            onClick={() => fetchTransactions(false)}
            disabled={isLoading}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} strokeWidth={1.5} />
            Refresh
          </button>
        </motion.div>

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onCardClick={handleCardClick}
          isLoading={isLoading}
          highlightId={deletingId}
        />

        {/* Load More Button */}
        {hasMore && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={cn(
                "px-8 py-3 rounded-2xl font-bold",
                "bg-white/80",
                "shadow-[6px_6px_16px_#c8d0e7,-6px_-6px_16px_#ffffff]",
                "hover:shadow-[8px_8px_20px_#c8d0e7,-8px_-8px_20px_#ffffff]",
                "text-emerald-600",
                "flex items-center gap-2",
                "transition-all duration-300",
                isLoadingMore && "opacity-70"
              )}
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                  Memuat...
                </>
              ) : (
                '🔄 Muat Lebih Banyak'
              )}
            </motion.button>
            <span className="text-sm text-slate-400">
              Sisa {remaining} transaksi
            </span>
          </motion.div>
        )}
      </div>

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      {/* Edit Dialog */}
      <EditTransactionDialog
        open={!!editTransaction}
        onClose={() => setEditTransaction(null)}
        transaction={editTransaction}
        categories={categories}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <ClayConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi?"
        message={`Yakin ingin menghapus transaksi "${deleteTarget?.description || 'ini'}"? Aksi ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={!!deletingId}
      />
    </DashboardLayout>
  );
};
