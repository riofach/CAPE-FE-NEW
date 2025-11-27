import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { CategoryIcon } from '../ui/dynamic-icon';
import type { Category } from '../../types/api';

interface ManualEntryDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: { categoryId: string; amount: number; description: string; date: string }) => Promise<void>;
  isLoading?: boolean;
}

export const ManualEntryDialog: React.FC<ManualEntryDialogProps> = ({
  open,
  onClose,
  categories,
  onSubmit,
  isLoading
}) => {
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredCategories = categories.filter(c => c.type === transactionType);
  const selectedCategory = categories.find(c => c.id === categoryId);

  useEffect(() => {
    if (open) {
      setTransactionType('EXPENSE');
      setCategoryId('');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  // Reset category when type changes
  useEffect(() => {
    setCategoryId('');
  }, [transactionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    await onSubmit({
      categoryId,
      amount: parseFloat(amount),
      description,
      date
    });
    
    onClose();
  };

  return (
    <ClayDialog open={open} onClose={onClose} title="Input Manual 📝">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => setTransactionType('EXPENSE')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg",
              "transition-all duration-200 font-medium text-sm",
              transactionType === 'EXPENSE'
                ? "bg-rose-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-200"
            )}
          >
            <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('INCOME')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg",
              "transition-all duration-200 font-medium text-sm",
              transactionType === 'INCOME'
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-200"
            )}
          >
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            Pemasukan
          </button>
        </div>

        {/* Category Select */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Kategori
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-left",
              "bg-white/80",
              "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]",
              "flex items-center gap-3",
              "focus:outline-none focus:ring-2",
              transactionType === 'INCOME' ? "focus:ring-emerald-300" : "focus:ring-rose-300"
            )}
          >
            {selectedCategory ? (
              <>
                <CategoryIcon 
                  iconSlug={selectedCategory.iconSlug} 
                  colorHex={selectedCategory.colorHex} 
                  size="sm"
                />
                <span className="flex-1 text-slate-800">{selectedCategory.name}</span>
              </>
            ) : (
              <span className="flex-1 text-slate-400">Pilih kategori...</span>
            )}
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              showCategoryDropdown && "rotate-180"
            )} strokeWidth={1.5} />
          </button>

          {/* Dropdown */}
          {showCategoryDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "absolute z-10 w-full mt-2 rounded-xl overflow-hidden",
                "bg-white shadow-lg border border-slate-100",
                "max-h-48 overflow-y-auto"
              )}
            >
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(category.id);
                    setShowCategoryDropdown(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3",
                    "hover:bg-slate-50 transition-colors",
                    categoryId === category.id && (transactionType === 'INCOME' ? "bg-emerald-50" : "bg-rose-50")
                  )}
                >
                  <CategoryIcon 
                    iconSlug={category.iconSlug} 
                    colorHex={category.colorHex} 
                    size="sm"
                  />
                  <span className="text-slate-700">{category.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Jumlah (Rp)
          </label>
          <ClayInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25000"
            min="0"
            required
          />
          {amount && (
            <p className={cn(
              "text-sm mt-1",
              transactionType === 'INCOME' ? "text-emerald-600" : "text-rose-600"
            )}>
              {transactionType === 'INCOME' ? '+' : '-'} {formatPrice(parseFloat(amount) || 0)}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Deskripsi
          </label>
          <ClayInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={transactionType === 'INCOME' ? "Gaji bulanan" : "Beli kopi pagi"}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Tanggal
          </label>
          <ClayInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!categoryId || !amount || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-3 px-6 rounded-xl font-bold",
            "text-white shadow-lg",
            "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)]",
            "hover:shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center justify-center gap-2",
            transactionType === 'INCOME'
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-rose-500 to-pink-500"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
              Menyimpan...
            </>
          ) : (
            `Simpan ${transactionType === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}`
          )}
        </motion.button>
      </form>
    </ClayDialog>
  );
};
