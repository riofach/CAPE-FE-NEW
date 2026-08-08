import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  PiggyBank,
  Receipt,
  Calendar,
  type LucideIcon
} from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClayCard } from '../components/ui/clay-card';
import { ClayConfirmDialog } from '../components/ui/clay-confirm-dialog';
import { Button } from '../components/ui/button';
import { CategoryIcon } from '../components/ui/dynamic-icon';
import { BusinessDialog } from '../components/dashboard/BusinessDialog';
import { BusinessEntryDialog } from '../components/dashboard/BusinessEntryDialog';
import { api } from '../lib/api';
import { cn, formatPrice } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import type { Business, BusinessEntry, BusinessEntryKind } from '../types/api';

const KIND_META: Record<BusinessEntryKind, { label: string; badge: string; sign: string; amountColor: string }> = {
  CAPITAL: { label: 'Modal', badge: 'bg-violet-50 text-violet-700', sign: '+', amountColor: 'text-violet-700' },
  EXPENSE: { label: 'Biaya', badge: 'bg-rose-50 text-rose-700', sign: '−', amountColor: 'text-rose-600' },
  REVENUE: { label: 'Omzet', badge: 'bg-emerald-50 text-emerald-700', sign: '+', amountColor: 'text-emerald-700' }
};

export const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [business, setBusiness] = useState<Business | null>(null);
  const [entries, setEntries] = useState<BusinessEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BusinessEntry | null>(null);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  const [deleteEntryTarget, setDeleteEntryTarget] = useState<BusinessEntry | null>(null);
  const [confirmDeleteBusiness, setConfirmDeleteBusiness] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [bizRes, entriesRes] = await Promise.all([
        api.businesses.get(id),
        api.businesses.entries.list(id, { limit: 100 })
      ]);
      if (bizRes.data) setBusiness(bizRes.data);
      if (entriesRes.data) setEntries(entriesRes.data);
    } catch (err) {
      console.error('Failed to fetch business detail:', err);
      toast.error('Gagal memuat detail bisnis');
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateEntry = () => {
    setEditingEntry(null);
    setIsEntryFormOpen(true);
  };
  const openEditEntry = (entry: BusinessEntry) => {
    setEditingEntry(entry);
    setIsEntryFormOpen(true);
  };

  const handleEntrySaved = () => {
    setIsEntryFormOpen(false);
    setEditingEntry(null);
    fetchData();
  };
  const handleBusinessSaved = () => {
    setIsBusinessFormOpen(false);
    fetchData();
  };

  const handleDeleteEntry = async () => {
    if (!deleteEntryTarget || !id) return;
    setIsActioning(true);
    try {
      await api.businesses.entries.delete(id, deleteEntryTarget.id);
      toast.success('Catatan dihapus');
      setDeleteEntryTarget(null);
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus');
    } finally {
      setIsActioning(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!id) return;
    setIsActioning(true);
    try {
      await api.businesses.delete(id);
      toast.success('Bisnis dihapus');
      navigate('/business');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus bisnis');
      setIsActioning(false);
    }
  };

  const m = business?.metrics;
  const status = m?.status;
  const labaColor =
    status === 'PROFIT' ? 'text-emerald-600' : status === 'LOSS' ? 'text-rose-600' : 'text-slate-500';
  const StatusIcon = status === 'PROFIT' ? TrendingUp : status === 'LOSS' ? TrendingDown : Minus;
  const statusLabel = status === 'PROFIT' ? 'Untung' : status === 'LOSS' ? 'Rugi' : 'Impas';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back + refresh */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/business" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Kembali
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="w-10 h-10 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
            aria-label="Refresh"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} strokeWidth={1.5} />
          </motion.button>
        </div>

        {isLoading && !business ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <p className="text-slate-500">Memuat...</p>
          </ClayCard>
        ) : !business ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <p className="text-slate-500">Bisnis tidak ditemukan</p>
          </ClayCard>
        ) : (
          <>
            {/* Business header */}
            <ClayCard className="p-6" disableAnimation>
              <div className="flex items-center gap-4">
                <CategoryIcon iconSlug={business.iconSlug} colorHex={business.colorHex} size="lg" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-slate-800 truncate">{business.name}</h1>
                  <div className={cn('flex items-center gap-1 text-sm font-medium', labaColor)}>
                    <StatusIcon className="w-4 h-4" strokeWidth={2} /> {statusLabel}
                  </div>
                  {business.note && <p className="text-sm text-slate-500 mt-1">{business.note}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBusinessFormOpen(true)}
                    className="w-9 h-9 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
                    aria-label="Edit bisnis"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDeleteBusiness(true)}
                    className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
                    aria-label="Hapus bisnis"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            </ClayCard>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Modal" value={m?.totalModal ?? 0} icon={PiggyBank} tone="violet" />
              <MetricCard label="Total Omzet" value={m?.totalOmzet ?? 0} icon={TrendingUp} tone="emerald" />
              <MetricCard label="Total Biaya" value={m?.totalBiaya ?? 0} icon={Receipt} tone="rose" />
              <MetricCard label="Posisi Kas" value={m?.posisiKas ?? 0} icon={Wallet} tone="sky" />
            </div>

            {/* Laba operasional highlight */}
            <ClayCard color={status === 'LOSS' ? 'white' : 'green'} className="p-6" disableAnimation>
              <p className="text-sm text-slate-500 mb-1">Laba Operasional (Omzet − Biaya)</p>
              <p className={cn('text-3xl font-bold', labaColor)}>{formatPrice(m?.labaOperasional ?? 0)}</p>
            </ClayCard>

            {/* Entries */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Catatan</h2>
              <Button onClick={openCreateEntry} size="sm">
                <Plus className="w-4 h-4" strokeWidth={2} /> Tambah Catatan
              </Button>
            </div>

            {entries.length === 0 ? (
              <ClayCard className="p-12 text-center" disableAnimation>
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-slate-500 mb-1">Belum ada catatan</p>
                <p className="text-xs text-slate-400">Tambahkan Modal, Biaya, atau Omzet pertamamu</p>
              </ClayCard>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    onEdit={() => openEditEntry(entry)}
                    onDelete={() => setDeleteEntryTarget(entry)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      {business && (
        <>
          <BusinessEntryDialog
            open={isEntryFormOpen}
            onClose={() => {
              setIsEntryFormOpen(false);
              setEditingEntry(null);
            }}
            businessId={business.id}
            onSuccess={handleEntrySaved}
            editEntry={editingEntry}
          />
          <BusinessDialog
            open={isBusinessFormOpen}
            onClose={() => setIsBusinessFormOpen(false)}
            onSuccess={handleBusinessSaved}
            editBusiness={business}
          />
        </>
      )}

      <ClayConfirmDialog
        open={deleteEntryTarget !== null}
        onClose={() => !isActioning && setDeleteEntryTarget(null)}
        onConfirm={handleDeleteEntry}
        title="Hapus catatan?"
        message="Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="danger"
        isLoading={isActioning}
      />

      <ClayConfirmDialog
        open={confirmDeleteBusiness}
        onClose={() => !isActioning && setConfirmDeleteBusiness(false)}
        onConfirm={handleDeleteBusiness}
        title="Hapus bisnis?"
        message="Semua catatan (Modal, Biaya, Omzet) di bisnis ini akan ikut terhapus permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Bisnis"
        variant="danger"
        isLoading={isActioning}
      />
    </DashboardLayout>
  );
};

const toneMap: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
  sky: 'bg-sky-100 text-sky-700'
};

const MetricCard: React.FC<{ label: string; value: number; icon: LucideIcon; tone: string }> = ({
  label,
  value,
  icon: Icon,
  tone
}) => (
  <ClayCard className="p-4" disableAnimation>
    <div
      className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center mb-2 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]',
        toneMap[tone]
      )}
    >
      <Icon className="w-4 h-4" strokeWidth={1.5} />
    </div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-bold text-slate-800 text-sm">{formatPrice(value)}</p>
  </ClayCard>
);

const EntryRow: React.FC<{ entry: BusinessEntry; onEdit: () => void; onDelete: () => void }> = ({
  entry,
  onEdit,
  onDelete
}) => {
  const meta = KIND_META[entry.kind];
  return (
    <ClayCard className="p-4" disableAnimation>
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', meta.badge)}>{meta.label}</span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" strokeWidth={1.5} />
              {new Date(entry.date).toLocaleDateString('id-ID')}
            </span>
          </div>
          <p className={cn('text-lg font-bold', meta.amountColor)}>
            {meta.sign} {formatPrice(Number(entry.amount))}
          </p>
          {entry.description && <p className="text-sm text-slate-500 mt-0.5 truncate">{entry.description}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
            aria-label="Hapus"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </ClayCard>
  );
};
