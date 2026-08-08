import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { Button } from '../ui/button';
import { CategoryIcon } from '../ui/dynamic-icon';
import { IconPicker } from '../admin/IconPicker';
import { ColorPicker } from '../admin/ColorPicker';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';
import type { Business, CreateBusinessInput, UpdateBusinessInput } from '../../types/api';

interface BusinessDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (business: Business) => void;
  editBusiness?: Business | null;
}

export const BusinessDialog: React.FC<BusinessDialogProps> = ({
  open,
  onClose,
  onSuccess,
  editBusiness
}) => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [iconSlug, setIconSlug] = useState('briefcase');
  const [colorHex, setColorHex] = useState('#10b981');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditMode = !!editBusiness;

  useEffect(() => {
    if (editBusiness) {
      setName(editBusiness.name);
      setIconSlug(editBusiness.iconSlug);
      setColorHex(editBusiness.colorHex);
      setNote(editBusiness.note ?? '');
    } else {
      resetForm();
    }
  }, [editBusiness, open]);

  const resetForm = () => {
    setName('');
    setIconSlug('briefcase');
    setColorHex('#10b981');
    setNote('');
    setErrors({});
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const next: { name?: string } = {};
    if (!name.trim()) next.name = 'Nama bisnis wajib diisi';
    else if (name.trim().length > 100) next.name = 'Nama maksimal 100 karakter';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditMode && editBusiness) {
        const update: UpdateBusinessInput = {};
        if (name.trim() !== editBusiness.name) update.name = name.trim();
        if (iconSlug !== editBusiness.iconSlug) update.iconSlug = iconSlug;
        if (colorHex !== editBusiness.colorHex) update.colorHex = colorHex;
        if (note.trim() !== (editBusiness.note ?? '')) update.note = note.trim() ? note.trim() : null;

        const res = await api.businesses.update(editBusiness.id, update);
        if (res.data) {
          onSuccess(res.data);
          toast.success('Bisnis berhasil diupdate! ✏️');
        }
      } else {
        const create: CreateBusinessInput = {
          name: name.trim(),
          iconSlug,
          colorHex,
          note: note.trim() || undefined
        };
        const res = await api.businesses.create(create);
        if (res.data) {
          onSuccess(res.data);
          toast.success('Bisnis berhasil dibuat! 🎉');
        }
      }
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan bisnis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClayDialog
      open={open}
      onClose={handleClose}
      title={isEditMode ? 'Edit Bisnis ✏️' : 'Tambah Bisnis 💼'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClayInput
          label="Nama Bisnis"
          type="text"
          placeholder="mis. Warung Kopi"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({});
          }}
          error={errors.name}
        />

        <IconPicker value={iconSlug} onChange={setIconSlug} colorHex={colorHex} />
        <ColorPicker value={colorHex} onChange={setColorHex} />

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Catatan <span className="text-xs text-slate-400 ml-1">(opsional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="mis. Warung kopi depan kampus"
            rows={2}
            maxLength={500}
            className={cn(
              'w-full px-4 py-3 rounded-2xl resize-none',
              'bg-[#f0f4f8] text-slate-700 placeholder:text-slate-400',
              'shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]',
              'border border-white/40',
              'focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Preview */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">Preview</label>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#e2e8f0]">
            <CategoryIcon iconSlug={iconSlug} colorHex={colorHex} size="md" />
            <p className="font-medium text-slate-800">{name || 'Nama Bisnis'}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Menyimpan...
              </>
            ) : isEditMode ? (
              'Update'
            ) : (
              'Simpan'
            )}
          </Button>
        </div>
      </form>
    </ClayDialog>
  );
};
