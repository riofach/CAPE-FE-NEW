import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, TrendingDown, TrendingUp, Sparkles, Pencil } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { CategoryIcon } from '../ui/dynamic-icon';
import type { Category, Transaction } from '../../types/api';

interface EditTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  categories: Category[];
  onSubmit: (id: string, data: { categoryId?: string; amount?: number; description?: string; date?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  open,
  onClose,
  transaction,
  categories,
  onSubmit,
  isLoading
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const transactionType = transaction?.category?.type || 'EXPENSE';
  const filteredCategories = categories.filter(c => c.type === transactionType);
  const selectedCategory = categories.find(c => c.id === categoryId);

  useEffect(() => {
    if (open && transaction) {
      setCategoryId(transaction.categoryId || '');
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || '');
      setDate(transaction.date.split('T')[0]);
    }
  }, [open, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !categoryId || !amount) return;

    await onSubmit(transaction.id, {
      categoryId,
      amount: parseFloat(amount),
      description,
      date
    });
    
    onClose();
  };

  if (!transaction) return null;

  return (
    <ClayDialog open={open} onClose={onClose} title="Edit Transaksi ✏️">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* AI/Manual Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
          transaction.isAiGenerated 
            ? "bg-violet-100 text-violet-700" 
            : "bg-slate-100 text-slate-600"
        )}>
          {transaction.isAiGenerated ? (
            <>
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              AI Generated
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" strokeWidth={1.5} />
              Manual Entry
            </>
          )}
        </div>

        {/* Type Indicator (Read-only) */}
        <div className={cn(
          "flex items-center gap-2 py-2 px-4 rounded-xl",
          transactionType === 'INCOME' 
            ? "bg-emerald-50 text-emerald-700" 
            : "bg-rose-50 text-rose-700"
        )}>
          {transactionType === 'INCOME' ? (
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span className="font-medium text-sm">
            {transactionType === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </span>
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
                <CategoryIcon iconSlug={selectedCategory.iconSlug} colorHex={selectedCategory.colorHex} size="sm" />
                <span className="flex-1 text-slate-800">{selectedCategory.name}</span>
              </>
            ) : (
              <span className="flex-1 text-slate-400">Pilih kategori...</span>
            )}
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showCategoryDropdown && "rotate-180")} strokeWidth={1.5} />
          </button>

          {showCategoryDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 rounded-xl overflow-hidden bg-white shadow-lg border border-slate-100 max-h-48 overflow-y-auto"
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
                    "hover:bg-slate-50 transition-colors text-left",
                    categoryId === category.id && (transactionType === 'INCOME' ? "bg-emerald-50" : "bg-rose-50")
                  )}
                >
                  <CategoryIcon iconSlug={category.iconSlug} colorHex={category.colorHex} size="sm" />
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
            <p className={cn("text-sm mt-1", transactionType === 'INCOME' ? "text-emerald-600" : "text-rose-600")}>
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
            placeholder="Deskripsi transaksi"
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
            max={new Date().toISOString().split('T')[0]}
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
            "bg-gradient-to-r from-emerald-500 to-teal-500"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </motion.button>
      </form>
    </ClayDialog>
  );
};
