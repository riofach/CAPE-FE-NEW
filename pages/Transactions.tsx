import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { TransactionFilters } from '../components/dashboard/TransactionFilters';
import { TransactionList } from '../components/dashboard/TransactionList';
import { EditTransactionDialog } from '../components/dashboard/EditTransactionDialog';
import { TransactionDetailDialog } from '../components/dashboard/TransactionDetailDialog';
import { ClayConfirmDialog } from '../components/ui/clay-confirm-dialog';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Transaction, Category, TransactionListParams } from '../types/api';

const ITEMS_PER_PAGE = 10;

export const Transactions: React.FC = () => {
  const toast = useToast();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState<TransactionListParams>({
    sortBy: 'date',
    sortOrder: 'desc',
    limit: ITEMS_PER_PAGE,
    offset: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const fetchTransactions = useCallback(async (page: number) => {
    setIsLoading(true);

    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await api.transactions.list({
        ...filters,
        limit: ITEMS_PER_PAGE,
        offset
      });

      if (response.data) {
        setTransactions(response.data);
      }
      
      if (response.pagination) {
        setTotal(response.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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
    setCurrentPage(1);
    fetchTransactions(1);
  }, [filters]);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

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
            {total > 0 
              ? `Menampilkan ${startItem}-${endItem} dari ${total} transaksi`
              : 'Tidak ada transaksi'
            }
          </span>
          <button
            onClick={() => fetchTransactions(currentPage)}
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

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center justify-center gap-2 pt-4",
              "flex-wrap"
            )}
          >
            {/* Previous Button */}
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-white/80",
                reducedMotion
                  ? "shadow-md"
                  : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
                "text-slate-600 hover:text-emerald-600",
                "transition-all duration-200",
                currentPage === 1 && "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === 'ellipsis' ? (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="w-10 h-10 flex items-center justify-center text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <motion.button
                    key={page}
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      "font-medium text-sm",
                      "transition-all duration-200",
                      currentPage === page
                        ? cn(
                            "bg-emerald-500 text-white",
                            reducedMotion
                              ? "shadow-md"
                              : "shadow-[4px_4px_12px_rgba(16,185,129,0.3)]"
                          )
                        : cn(
                            "bg-white/80 text-slate-600 hover:text-emerald-600",
                            reducedMotion
                              ? "shadow-md hover:shadow-lg"
                              : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] hover:shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#d1d5db]"
                          )
                    )}
                  >
                    {page}
                  </motion.button>
                )
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-white/80",
                reducedMotion
                  ? "shadow-md"
                  : "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]",
                "text-slate-600 hover:text-emerald-600",
                "transition-all duration-200",
                currentPage === totalPages && "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </motion.div>
        )}

        {/* Page Info */}
        {totalPages > 1 && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-slate-400"
          >
            Halaman {currentPage} dari {totalPages}
          </motion.p>
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
