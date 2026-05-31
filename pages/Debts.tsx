import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, HandCoins, Wallet, CheckCircle2, Pencil, Trash2, Calendar, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClayCard } from '../components/ui/clay-card';
import { ClayInput } from '../components/ui/clay-input';
import { ClayDialog } from '../components/ui/clay-dialog';
import { ClayConfirmDialog } from '../components/ui/clay-confirm-dialog';
import { Button } from '../components/ui/button';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import type { Debt, DebtSummary, DebtType, DebtStatus, CreateDebtInput, UpdateDebtInput } from '../types/api';

const formatIDR = (value: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value));

const todayISO = () => new Date().toISOString().slice(0, 10);

type FilterType = 'ALL' | DebtType;
type FilterStatus = 'ALL' | DebtStatus;

interface DebtFormState {
  type: DebtType;
  counterpartyName: string;
  amount: string;
  startDate: string;
  dueDate: string;
  note: string;
  syncToTransaction: boolean;
}

const EMPTY_FORM: DebtFormState = {
  type: 'LENDING',
  counterpartyName: '',
  amount: '',
  startDate: todayISO(),
  dueDate: '',
  note: '',
  syncToTransaction: true
};

export const Debts: React.FC = () => {
  const toast = useToast();

  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<DebtSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formState, setFormState] = useState<DebtFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [settleTarget, setSettleTarget] = useState<Debt | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Debt | null>(null);
  const [isActioning, setIsActioning] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { type?: DebtType; status?: DebtStatus; limit: number } = { limit: 100 };
      if (filterType !== 'ALL') params.type = filterType;
      if (filterStatus !== 'ALL') params.status = filterStatus;

      const [listRes, summaryRes] = await Promise.all([
        api.debts.list(params),
        api.debts.summary()
      ]);
      if (listRes.data) setDebts(listRes.data);
      if (summaryRes.data) setSummary(summaryRes.data);
    } catch (err) {
      console.error('Failed to fetch debts:', err);
      toast.error('Gagal memuat data utang');
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterStatus, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateForm = () => {
    setEditingDebt(null);
    setFormState(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (debt: Debt) => {
    setEditingDebt(debt);
    setFormState({
      type: debt.type,
      counterpartyName: debt.counterpartyName,
      amount: String(debt.amount),
      startDate: debt.startDate.slice(0, 10),
      dueDate: debt.dueDate ? debt.dueDate.slice(0, 10) : '',
      note: debt.note ?? '',
      syncToTransaction: debt.createdTransactionId !== null
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSubmitting) return;
    setIsFormOpen(false);
    setEditingDebt(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amountNum = Number(formState.amount);
    if (!formState.counterpartyName.trim()) {
      setFormError('Nama orang wajib diisi');
      return;
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setFormError('Nominal harus angka positif');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingDebt) {
        const updateData: UpdateDebtInput = {
          counterpartyName: formState.counterpartyName.trim(),
          amount: amountNum,
          note: formState.note.trim() ? formState.note.trim() : null,
          startDate: formState.startDate,
          dueDate: formState.dueDate ? formState.dueDate : null
        };
        await api.debts.update(editingDebt.id, updateData);
        toast.success('Catatan berhasil diperbarui');
      } else {
        const createData: CreateDebtInput = {
          type: formState.type,
          counterpartyName: formState.counterpartyName.trim(),
          amount: amountNum,
          startDate: formState.startDate,
          syncToTransaction: formState.syncToTransaction
        };
        if (formState.dueDate) createData.dueDate = formState.dueDate;
        if (formState.note.trim()) createData.note = formState.note.trim();
        await api.debts.create(createData);
        toast.success(formState.type === 'LENDING' ? 'Piutang berhasil dicatat' : 'Utang berhasil dicatat');
      }
      setIsFormOpen(false);
      setEditingDebt(null);
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan catatan';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettle = async () => {
    if (!settleTarget) return;
    setIsActioning(true);
    try {
      await api.debts.settle(settleTarget.id);
      toast.success('Ditandai sebagai Lunas');
      setSettleTarget(null);
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menandai lunas';
      toast.error(message);
    } finally {
      setIsActioning(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsActioning(true);
    try {
      await api.debts.delete(deleteTarget.id);
      toast.success('Catatan dihapus');
      setDeleteTarget(null);
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus';
      toast.error(message);
    } finally {
      setIsActioning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Utang & Piutang</h1>
            <p className="text-slate-500 text-sm">Catat siapa pinjam ke kamu, dan kamu pinjam ke siapa</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="w-10 h-10 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
              aria-label="Refresh"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} strokeWidth={1.5} />
            </motion.button>
            <Button onClick={openCreateForm} size="md">
              <Plus className="w-4 h-4" strokeWidth={2} />
              Tambah
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ClayCard color="green" className="p-6" disableAnimation>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]">
                <HandCoins className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Piutang Belum Lunas</p>
                <p className="text-xs text-slate-400">{summary?.countLendingPending ?? 0} catatan</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatIDR(summary?.totalLendingPending ?? 0)}</p>
          </ClayCard>

          <ClayCard className="p-6" disableAnimation>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]">
                <Wallet className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Utang Belum Lunas</p>
                <p className="text-xs text-slate-400">{summary?.countBorrowingPending ?? 0} catatan</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-sky-700">{formatIDR(summary?.totalBorrowingPending ?? 0)}</p>
          </ClayCard>
        </div>

        {/* Filters */}
        <ClayCard className="p-4" disableAnimation>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500 mr-2">Tipe:</span>
            {(['ALL', 'LENDING', 'BORROWING'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filterType === t
                    ? 'bg-emerald-100 text-emerald-700 shadow-[inset_2px_2px_4px_#a7f3d0,inset_-2px_-2px_4px_#ffffff]'
                    : 'bg-white/70 text-slate-500 hover:text-slate-700'
                )}
              >
                {t === 'ALL' ? 'Semua' : t === 'LENDING' ? 'Piutang' : 'Utang'}
              </button>
            ))}
            <span className="text-sm text-slate-500 mx-2">Status:</span>
            {(['ALL', 'PENDING', 'PAID'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filterStatus === s
                    ? 'bg-emerald-100 text-emerald-700 shadow-[inset_2px_2px_4px_#a7f3d0,inset_-2px_-2px_4px_#ffffff]'
                    : 'bg-white/70 text-slate-500 hover:text-slate-700'
                )}
              >
                {s === 'ALL' ? 'Semua' : s === 'PENDING' ? 'Belum Lunas' : 'Lunas'}
              </button>
            ))}
          </div>
        </ClayCard>

        {/* List */}
        {isLoading && debts.length === 0 ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <p className="text-slate-500">Memuat...</p>
          </ClayCard>
        ) : debts.length === 0 ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <HandCoins className="w-12 h-12 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-slate-500 mb-1">Belum ada catatan utang/piutang</p>
            <p className="text-xs text-slate-400">Klik &ldquo;Tambah&rdquo; untuk mulai mencatat</p>
          </ClayCard>
        ) : (
          <div className="space-y-3">
            {debts.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                onSettle={() => setSettleTarget(debt)}
                onEdit={() => openEditForm(debt)}
                onDelete={() => setDeleteTarget(debt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <ClayDialog
        open={isFormOpen}
        onClose={closeForm}
        title={editingDebt ? 'Edit Catatan' : 'Tambah Catatan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingDebt && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Tipe</label>
              <div className="grid grid-cols-2 gap-2">
                {(['LENDING', 'BORROWING'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormState((s) => ({ ...s, type: t }))}
                    className={cn(
                      'py-3 px-4 rounded-2xl font-medium text-sm transition-all',
                      formState.type === t
                        ? t === 'LENDING'
                          ? 'bg-emerald-500 text-white shadow-[4px_4px_8px_#6ee7b7,-4px_-4px_8px_#ffffff]'
                          : 'bg-sky-500 text-white shadow-[4px_4px_8px_#bae6fd,-4px_-4px_8px_#ffffff]'
                        : 'bg-white/80 text-slate-600 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]'
                    )}
                  >
                    {t === 'LENDING' ? 'Piutang (saya pinjamkan)' : 'Utang (saya pinjam)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ClayInput
            label="Nama orang"
            value={formState.counterpartyName}
            onChange={(e) => setFormState((s) => ({ ...s, counterpartyName: e.target.value }))}
            placeholder="mis. Andi"
            maxLength={100}
            required
          />

          <ClayInput
            label="Nominal (IDR)"
            type="number"
            inputMode="numeric"
            min={1}
            value={formState.amount}
            onChange={(e) => setFormState((s) => ({ ...s, amount: e.target.value }))}
            placeholder="500000"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <ClayInput
              label="Tanggal mulai"
              type="date"
              value={formState.startDate}
              onChange={(e) => setFormState((s) => ({ ...s, startDate: e.target.value }))}
            />
            <ClayInput
              label="Jatuh tempo (opsional)"
              type="date"
              value={formState.dueDate}
              onChange={(e) => setFormState((s) => ({ ...s, dueDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Catatan (opsional)</label>
            <textarea
              value={formState.note}
              onChange={(e) => setFormState((s) => ({ ...s, note: e.target.value }))}
              placeholder="mis. Pinjam buat bayar kos"
              maxLength={500}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl bg-[#f0f4f8] text-slate-700 placeholder:text-slate-400 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
            />
          </div>

          {!editingDebt && (
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.syncToTransaction}
                onChange={(e) => setFormState((s) => ({ ...s, syncToTransaction: e.target.checked }))}
                className="w-5 h-5 rounded accent-emerald-500"
              />
              <span className="text-sm text-slate-600">
                Catat juga sebagai transaksi
                <span className="block text-xs text-slate-400">
                  Otomatis buat transaksi {formState.type === 'LENDING' ? 'pengeluaran' : 'pemasukan'} di tanggal mulai
                </span>
              </span>
            </label>
          )}

          {formError && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
              {formError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-2xl font-bold bg-white/80 text-slate-600 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </ClayDialog>

      <ClayConfirmDialog
        open={settleTarget !== null}
        onClose={() => !isActioning && setSettleTarget(null)}
        onConfirm={handleSettle}
        title="Tandai Lunas?"
        message={
          settleTarget?.createdTransactionId
            ? `${settleTarget?.counterpartyName} — ${formatIDR(settleTarget?.amount ?? 0)}. Transaksi balasan akan otomatis dicatat.`
            : `${settleTarget?.counterpartyName} — ${formatIDR(settleTarget?.amount ?? 0)}. Akan ditandai sebagai Lunas.`
        }
        confirmText="Tandai Lunas"
        variant="info"
        isLoading={isActioning}
      />

      <ClayConfirmDialog
        open={deleteTarget !== null}
        onClose={() => !isActioning && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus catatan?"
        message={
          deleteTarget?.createdTransactionId || deleteTarget?.settlementTransactionId
            ? 'Transaksi yang tersinkron juga akan ikut dihapus. Tindakan ini tidak dapat dibatalkan.'
            : 'Tindakan ini tidak dapat dibatalkan.'
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={isActioning}
      />
    </DashboardLayout>
  );
};

interface DebtRowProps {
  debt: Debt;
  onSettle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DebtRow: React.FC<DebtRowProps> = ({ debt, onSettle, onEdit, onDelete }) => {
  const isLending = debt.type === 'LENDING';
  const isPaid = debt.status === 'PAID';
  const Icon = isLending ? HandCoins : Wallet;

  return (
    <ClayCard className="p-4" disableAnimation>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
            'shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]',
            isLending ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-800 truncate">{debt.counterpartyName}</p>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                isLending ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
              )}
            >
              {isLending ? 'Piutang' : 'Utang'}
            </span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                isPaid ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'
              )}
            >
              {isPaid ? 'Lunas' : 'Belum Lunas'}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">{formatIDR(debt.amount)}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" strokeWidth={1.5} />
              Mulai {new Date(debt.startDate).toLocaleDateString('id-ID')}
            </span>
            {debt.dueDate && !isPaid && (
              <span className="flex items-center gap-1 text-amber-600">
                Jatuh tempo {new Date(debt.dueDate).toLocaleDateString('id-ID')}
              </span>
            )}
            {debt.paidAt && (
              <span className="flex items-center gap-1 text-emerald-600">
                Lunas {new Date(debt.paidAt).toLocaleDateString('id-ID')}
              </span>
            )}
            {debt.createdTransactionId && (
              <span className="text-slate-400">• tersinkron</span>
            )}
          </div>
          {debt.note && <p className="text-sm text-slate-500 mt-1 truncate">{debt.note}</p>}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isPaid && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettle}
              className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
              aria-label="Tandai lunas"
              title="Tandai lunas"
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          )}
          {!isPaid && (
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
          )}
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
