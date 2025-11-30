import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, Search, Trash2, RefreshCw, Edit3 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ClayCard } from '../../components/ui/clay-card';
import { Button } from '../../components/ui/button';
import { ClayConfirmDialog } from '../../components/ui/clay-confirm-dialog';
import { CategoryDialog } from '../../components/admin/CategoryDialog';
import { CategoryIcon } from '../../components/ui/dynamic-icon';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';
import type { Category } from '../../types/api';

export const CategoryManagement: React.FC = () => {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.categories.list();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat kategori');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || cat.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const expenseCount = categories.filter(c => c.type === 'EXPENSE').length;
  const incomeCount = categories.filter(c => c.type === 'INCOME').length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setDeletingId(deleteTarget.id);
    try {
      const response = await api.admin.categories.delete(deleteTarget.id);
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      
      if (response.data?.affectedTransactions && response.data.affectedTransactions > 0) {
        toast.success(`Kategori dihapus. ${response.data.affectedTransactions} transaksi di-reset kategorinya.`);
      } else {
        toast.success('Kategori berhasil dihapus! 🗑️');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus kategori');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleDialogSuccess = (category: Category) => {
    if (editCategory) {
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    } else {
      setCategories(prev => [category, ...prev]);
    }
    setShowDialog(false);
    setEditCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditCategory(category);
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditCategory(null);
    setShowDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FolderTree className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
              Category Management
            </h1>
            <p className="text-slate-500">Kelola kategori transaksi global</p>
          </div>
          <Button variant="primary" onClick={openCreateDialog}>
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Tambah Kategori
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <ClayCard className="!p-4 text-center" disableAnimation>
            <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </ClayCard>
          <ClayCard className="!p-4 text-center" disableAnimation>
            <p className="text-2xl font-bold text-rose-600">{expenseCount}</p>
            <p className="text-xs text-slate-500">Expense</p>
          </ClayCard>
          <ClayCard className="!p-4 text-center" disableAnimation>
            <p className="text-2xl font-bold text-emerald-600">{incomeCount}</p>
            <p className="text-xs text-slate-500">Income</p>
          </ClayCard>
        </div>

        {/* Filters */}
        <ClayCard className="!p-4" disableAnimation>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Cari kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl",
                    "bg-white/60 border-0",
                    "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                    "focus:outline-none focus:ring-2 focus:ring-violet-300",
                    "text-slate-700 placeholder:text-slate-400"
                  )}
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'EXPENSE' | 'INCOME')}
              className={cn(
                "px-4 py-2.5 rounded-xl cursor-pointer",
                "bg-white/60 border-0",
                "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                "focus:outline-none focus:ring-2 focus:ring-violet-300",
                "text-slate-700"
              )}
            >
              <option value="ALL">Semua Tipe</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <Button variant="secondary" size="md" onClick={() => fetchCategories()} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} strokeWidth={1.5} />
            </Button>
          </div>
        </ClayCard>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <ClayCard className="!p-4" disableAnimation>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                </ClayCard>
              </div>
            ))
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full">
              <ClayCard className="!p-8 text-center" disableAnimation>
                <FolderTree className="w-12 h-12 mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                <p className="text-slate-500">
                  {search || typeFilter !== 'ALL' 
                    ? 'Tidak ada kategori yang cocok' 
                    : 'Belum ada kategori'}
                </p>
              </ClayCard>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id}>
                <ClayCard 
                  className={cn("!p-4", deletingId === category.id && "opacity-50")}
                  disableAnimation
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon 
                      iconSlug={category.iconSlug}
                      colorHex={category.colorHex}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {category.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          category.type === 'EXPENSE'
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}>
                          {category.type}
                        </span>
                        {category.isGlobal && (
                          <span className="text-xs text-slate-400">Global</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="!p-2"
                      >
                        <Edit3 className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(category)}
                        disabled={deletingId === category.id}
                        className="!p-2 !text-rose-500 hover:!bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                </ClayCard>
              </div>
            ))
          )}
        </div>

        {/* Count Info */}
        {filteredCategories.length > 0 && (
          <p className="text-center text-sm text-slate-500">
            Menampilkan {filteredCategories.length} dari {categories.length} kategori
          </p>
        )}
      </div>

      {/* Category Dialog (Create/Edit) */}
      <CategoryDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditCategory(null);
        }}
        onSuccess={handleDialogSuccess}
        editCategory={editCategory}
      />

      {/* Delete Confirmation */}
      <ClayConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Kategori?"
        message={`Yakin ingin menghapus kategori "${deleteTarget?.name}"? Transaksi yang menggunakan kategori ini akan kehilangan referensi kategorinya.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={!!deletingId}
      />
    </AdminLayout>
  );
};
