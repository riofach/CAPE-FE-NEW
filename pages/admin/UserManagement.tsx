import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Trash2, RefreshCw, Shield, User, Sparkles } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ClayCard } from '../../components/ui/clay-card';
import { Button } from '../../components/ui/button';
import { ClayConfirmDialog } from '../../components/ui/clay-confirm-dialog';
import { CreateAdminDialog } from '../../components/admin/CreateAdminDialog';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import type { AdminUser } from '../../types/api';

export const UserManagement: React.FC = () => {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENT' | 'ADMIN'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [togglingAiId, setTogglingAiId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.admin.users.list({
        search: debouncedSearch || undefined,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        page,
        limit: 20
      });
      
      if (response.data) {
        setUsers(response.data);
      }
      if (response.pagination) {
        setTotal(response.pagination.total);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data user');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setDeletingId(deleteTarget.id);
    try {
      await api.admin.users.delete(deleteTarget.id);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
      toast.success('User berhasil dihapus! 🗑️');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus user');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleCreateSuccess = (newUser: AdminUser) => {
    setUsers(prev => [newUser, ...prev]);
    setTotal(prev => prev + 1);
    setShowCreateDialog(false);
    toast.success('Admin baru berhasil dibuat! 🛡️');
  };

  const handleToggleAiAccess = async (user: AdminUser) => {
    setTogglingAiId(user.id);
    try {
      const newEnabled = !user.aiEnabled;
      await api.admin.users.toggleAiAccess(user.id, newEnabled);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, aiEnabled: newEnabled } : u
      ));
      toast.success(`AI ${newEnabled ? 'diaktifkan' : 'dinonaktifkan'} untuk ${user.fullName || user.email}`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah akses AI');
    } finally {
      setTogglingAiId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
              <Users className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
              User Management
            </h1>
            <p className="text-slate-500">Kelola semua user dalam sistem</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Create Admin
          </Button>
        </motion.div>

        {/* Filters */}
        <ClayCard className="!p-4" disableAnimation>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'CLIENT' | 'ADMIN')}
              className={cn(
                "px-4 py-2.5 rounded-xl cursor-pointer",
                "bg-white/60 border-0",
                "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                "focus:outline-none focus:ring-2 focus:ring-violet-300",
                "text-slate-700"
              )}
            >
              <option value="ALL">Semua Role</option>
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Admin</option>
            </select>
            <Button variant="secondary" size="md" onClick={() => fetchUsers()} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} strokeWidth={1.5} />
            </Button>
          </div>
        </ClayCard>

        {/* User List */}
        <div className="space-y-3">
          {isLoading ? (
            // Skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <ClayCard className="!p-4" disableAnimation>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-48" />
                    </div>
                  </div>
                </ClayCard>
              </div>
            ))
          ) : users.length === 0 ? (
            <ClayCard className="!p-8 text-center" disableAnimation>
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
              <p className="text-slate-500">Tidak ada user ditemukan</p>
            </ClayCard>
          ) : (
            users.map((user) => (
              <div key={user.id}>
                <ClayCard 
                  className={cn("!p-4", deletingId === user.id && "opacity-50")}
                  disableAnimation
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        user.role === 'ADMIN' 
                          ? "bg-violet-100 text-violet-600" 
                          : "bg-emerald-100 text-emerald-600"
                      )}>
                        {user.role === 'ADMIN' ? (
                          <Shield className="w-5 h-5" strokeWidth={1.5} />
                        ) : (
                          <User className="w-5 h-5" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {user.fullName || 'No Name'}
                        </p>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            user.role === 'ADMIN'
                              ? "bg-violet-100 text-violet-700"
                              : "bg-emerald-100 text-emerald-700"
                          )}>
                            {user.role}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
                            user.aiEnabled
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          )}>
                            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                            AI {user.aiEnabled ? 'ON' : 'OFF'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {user.authProvider}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDate(user.createdAt)}
                          </span>
                          {user._count && user._count.transactions > 0 && (
                            <span className="text-xs text-slate-400">
                              • {user._count.transactions} transaksi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {currentUser?.id !== user.id ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleAiAccess(user)}
                          disabled={togglingAiId === user.id}
                          className={cn(
                            user.aiEnabled 
                              ? "!text-amber-600 hover:!bg-amber-50" 
                              : "!text-slate-400 hover:!bg-slate-100"
                          )}
                          title={user.aiEnabled ? 'Nonaktifkan AI' : 'Aktifkan AI'}
                        >
                          <Sparkles className={cn(
                            "w-4 h-4",
                            togglingAiId === user.id && "animate-pulse"
                          )} strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setDeleteTarget(user)}
                          disabled={deletingId === user.id}
                          className="!text-rose-600 hover:!bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic px-2">Akun Anda</span>
                    )}
                  </div>
                </ClayCard>
              </div>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {total > 0 && (
          <p className="text-center text-sm text-slate-500">
            Menampilkan {users.length} dari {total} users
          </p>
        )}
      </div>

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation */}
      <ClayConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus User?"
        message={`Yakin ingin menghapus "${deleteTarget?.fullName || deleteTarget?.email}"? Semua data transaksi user ini akan ikut terhapus permanen.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={!!deletingId}
      />
    </AdminLayout>
  );
};
