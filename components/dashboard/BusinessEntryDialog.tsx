import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn, formatPrice } from '../../lib/utils';
import type {
  BusinessEntry,
  BusinessEntryKind,
  CreateBusinessEntryInput,
  UpdateBusinessEntryInput
} from '../../types/api';

const KIND_META: Record<BusinessEntryKind, { label: string; emoji: string; active: string }> = {
  CAPITAL: {
    label: 'Modal',
    emoji: '💰',
    active: 'bg-violet-500 text-white shadow-[4px_4px_8px_#ddd6fe,-4px_-4px_8px_#ffffff]'
  },
  EXPENSE: {
    label: 'Biaya',
    emoji: '🧾',
    active: 'bg-rose-500 text-white shadow-[4px_4px_8px_#fecdd3,-4px_-4px_8px_#ffffff]'
  },
  REVENUE: {
    label: 'Omzet',
    emoji: '📈',
    active: 'bg-emerald-500 text-white shadow-[4px_4px_8px_#6ee7b7,-4px_-4px_8px_#ffffff]'
  }
};

const todayISO = () => new Date().toISOString().slice(0, 10);

interface BusinessEntryDialogProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  onSuccess: () => void;
  editEntry?: BusinessEntry | null;
}

export const BusinessEntryDialog: React.FC<BusinessEntryDialogProps> = ({
  open,
  onClose,
  businessId,
  onSuccess,
  editEntry
}) => {
  const toast = useToast();
  const [kind, setKind] = useState<BusinessEntryKind>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!editEntry;

  useEffect(() => {
    if (editEntry) {
      setKind(editEntry.kind);
      setAmount(String(editEntry.amount));
      setDescription(editEntry.description ?? '');
      setDate(editEntry.date.slice(0, 10));
    } else {
      setKind('EXPENSE');
      setAmount('');
      setDescription('');
      setDate(todayISO());
    }
    setError(null);
  }, [editEntry, open]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError('Nominal harus angka positif');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && editEntry) {
        const update: UpdateBusinessEntryInput = {
          kind,
          amount: amountNum,
          description: description.trim() ? description.trim() : null,
          date
        };
        await api.businesses.entries.update(businessId, editEntry.id, update);
        toast.success('Catatan berhasil diperbarui');
      } else {
        const create: CreateBusinessEntryInput = { kind, amount: amountNum, date };
        if (description.trim()) create.description = description.trim();
        await api.businesses.entries.create(businessId, create);
        toast.success('Catatan berhasil ditambahkan');
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan catatan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClayDialog open={open} onClose={handleClose} title={isEditMode ? 'Edit Catatan' : 'Tambah Catatan'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Jenis</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(KIND_META) as BusinessEntryKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  'py-3 px-2 rounded-2xl font-medium text-sm transition-all',
                  kind === k
                    ? KIND_META[k].active
                    : 'bg-white/80 text-slate-600 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]'
                )}
              >
                <span className="mr-1">{KIND_META[k].emoji}</span>
                {KIND_META[k].label}
              </button>
            ))}
          </div>
        </div>

        <ClayInput
          label="Nominal (IDR)"
          type="number"
          inputMode="numeric"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500000"
          required
        />
        {amount && Number(amount) > 0 && (
          <p className="text-xs text-slate-500 -mt-2">{formatPrice(Number(amount))}</p>
        )}

        <ClayInput
          label="Deskripsi (opsional)"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="mis. Beli stok kopi"
          maxLength={500}
        />

        <ClayInput
          label="Tanggal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && <div className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{error}</div>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </Button>
        </div>
      </form>
    </ClayDialog>
  );
};
