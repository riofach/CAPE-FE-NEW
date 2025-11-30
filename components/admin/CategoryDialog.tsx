import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { Button } from '../ui/button';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../types/api';

const ICON_EMOJI_MAP: Record<string, string> = {
  // Food & Drinks
  'utensils': '🍽️',
  'pizza': '🍕',
  'coffee': '☕',
  'beer': '🍺',
  'wine': '🍷',
  
  // Transport
  'car': '🚗',
  'fuel': '⛽',
  'bus': '🚌',
  'train': '🚆',
  'plane': '✈️',
  'bike': '🚲',
  
  // Shopping & Finance
  'shopping-bag': '🛍️',
  'shopping-cart': '🛒',
  'receipt': '🧾',
  'wallet': '👛',
  'piggy-bank': '🐷',
  'trending-up': '📈',
  'credit-card': '💳',
  'banknote': '💵',
  
  // Home & Living
  'home': '🏠',
  'bed': '🛏️',
  'sofa': '🛋️',
  'lamp': '💡',
  'droplet': '💧',
  'zap': '⚡',
  'wifi': '📶',
  
  // Health & Beauty
  'heart': '❤️',
  'heart-pulse': '💓',
  'pill': '💊',
  'stethoscope': '🩺',
  'scissors': '✂️',
  
  // Entertainment
  'film': '🎬',
  'music': '🎵',
  'gamepad-2': '🎮',
  'tv': '📺',
  'camera': '📷',
  
  // Education & Work
  'graduation-cap': '🎓',
  'book-open': '📖',
  'briefcase': '💼',
  'laptop': '💻',
  'smartphone': '📱',
  
  // Personal
  'shirt': '👕',
  'dumbbell': '🏋️',
  'baby': '👶',
  'gift': '🎁',
  
  // Pets
  'dog': '🐕',
  'cat': '🐱',
  
  // Misc
  'wrench': '🔧',
  'hammer': '🔨',
  'paintbrush': '🖌️',
  'more-horizontal': '➕',
  'plus-circle': '➕',
  'circle': '⭕',
};

// Get emoji for icon, fallback to generic
const getIconEmoji = (iconSlug: string): string => {
  return ICON_EMOJI_MAP[iconSlug] || '📌';
};

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  editCategory?: Category | null;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSuccess,
  editCategory
}) => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [iconSlug, setIconSlug] = useState('utensils');
  const [colorHex, setColorHex] = useState('#6366F1');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEditMode = !!editCategory;

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setType(editCategory.type);
      setIconSlug(editCategory.iconSlug);
      setColorHex(editCategory.colorHex);
      setKeywords(editCategory.keywords || '');
    } else {
      resetForm();
    }
  }, [editCategory, open]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Nama maksimal 50 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditMode && editCategory) {
        const updateData: UpdateCategoryInput = {};
        if (name !== editCategory.name) updateData.name = name.trim();
        if (type !== editCategory.type) updateData.type = type;
        if (iconSlug !== editCategory.iconSlug) updateData.iconSlug = iconSlug;
        if (colorHex !== editCategory.colorHex) updateData.colorHex = colorHex;
        if (keywords !== (editCategory.keywords || '')) updateData.keywords = keywords.trim();

        const response = await api.admin.categories.update(editCategory.id, updateData);
        if (response.data) {
          onSuccess(response.data);
          toast.success('Kategori berhasil diupdate! ✏️');
        }
      } else {
        const createData: CreateCategoryInput = {
          name: name.trim(),
          type,
          iconSlug,
          colorHex,
          keywords: keywords.trim() || undefined
        };

        const response = await api.admin.categories.create(createData);
        if (response.data) {
          onSuccess(response.data);
          toast.success('Kategori berhasil dibuat! 🎉');
        }
      }
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan kategori');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setType('EXPENSE');
    setIconSlug('utensils');
    setColorHex('#6366F1');
    setKeywords('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ClayDialog 
      open={open} 
      onClose={handleClose} 
      title={isEditMode ? 'Edit Kategori ✏️' : 'Tambah Kategori 🏷️'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <ClayInput
          label="Nama Kategori"
          type="text"
          placeholder="Makanan & Minuman"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({});
          }}
          error={errors.name}
        />

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Tipe
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={cn(
                "flex-1 py-3 px-4 rounded-2xl font-medium transition-all cursor-pointer",
                type === 'EXPENSE'
                  ? "bg-rose-100 text-rose-700 shadow-[inset_3px_3px_6px_#fecdd3,inset_-3px_-3px_6px_#ffffff]"
                  : "bg-[#f0f4f8] text-slate-600 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
              )}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={cn(
                "flex-1 py-3 px-4 rounded-2xl font-medium transition-all cursor-pointer",
                type === 'INCOME'
                  ? "bg-emerald-100 text-emerald-700 shadow-[inset_3px_3px_6px_#a7f3d0,inset_-3px_-3px_6px_#ffffff]"
                  : "bg-[#f0f4f8] text-slate-600 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
              )}
            >
              💰 Income
            </button>
          </div>
        </div>

        {/* Icon */}
        <IconPicker 
          value={iconSlug} 
          onChange={setIconSlug}
          colorHex={colorHex}
        />

        {/* Color */}
        <ColorPicker 
          value={colorHex} 
          onChange={setColorHex}
        />

        {/* Keywords for AI */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Keywords untuk AI
            <span className="text-xs text-slate-400 ml-1">(opsional)</span>
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="bensin, pertamax, pertalite, solar, spbu"
            rows={2}
            className={cn(
              "w-full px-4 py-3 rounded-2xl resize-none",
              "bg-[#f0f4f8] text-slate-700 placeholder:text-slate-400",
              "shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
              "border border-white/40",
              "focus:outline-none focus:ring-2 focus:ring-violet-400/50",
              "transition-all duration-200"
            )}
          />
          <p className="text-xs text-slate-400 mt-1">
            Pisahkan dengan koma. AI akan gunakan keywords ini untuk mencocokkan kategori.
          </p>
        </div>

        {/* Preview */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Preview
          </label>
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl",
            "bg-white/70",
            "shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#e2e8f0]"
          )}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: `${colorHex}20` }}
            >
              <span style={{ color: colorHex }}>
                {getIconEmoji(iconSlug)}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-800">
                {name || 'Nama Kategori'}
              </p>
              <p className={cn(
                "text-xs font-medium",
                type === 'EXPENSE' ? "text-rose-500" : "text-emerald-500"
              )}>
                {type}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
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
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
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
