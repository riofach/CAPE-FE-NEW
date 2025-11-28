import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Pencil, Trash2 } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { ClayDialog } from '../ui/clay-dialog';
import { CategoryIcon } from '../ui/dynamic-icon';
import type { Transaction } from '../../types/api';

interface TransactionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({
  open,
  onClose,
  transaction,
  onEdit,
  onDelete
}) => {
  if (!transaction) return null;

  const isIncome = transaction.category?.type === 'INCOME';

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <ClayDialog open={open} onClose={onClose} title="Detail Transaksi 📋">
      <div className="space-y-6">
        {/* Category Header */}
        <div className="flex flex-col items-center text-center">
          {transaction.category ? (
            <>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-3",
                "shadow-[inset_4px_4px_8px_#ffffff,inset_-2px_-2px_6px_#d1d5db]"
              )}
              style={{ backgroundColor: `${transaction.category.colorHex}20` }}
              >
                <CategoryIcon 
                  iconSlug={transaction.category.iconSlug} 
                  colorHex={transaction.category.colorHex}
                  size="lg"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {transaction.category.name}
              </h3>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full mt-1",
                isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
              )}>
                {isIncome ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            </>
          ) : (
            <div className="text-slate-400">Kategori tidak tersedia</div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Details */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              📝 Deskripsi
            </label>
            <p className="text-slate-800 mt-1">
              {transaction.description || 'Tidak ada deskripsi'}
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              💰 Jumlah
            </label>
            <p className={cn(
              "text-2xl font-bold mt-1",
              isIncome ? "text-emerald-600" : "text-rose-600"
            )}>
              {isIncome ? '+' : '-'}{formatPrice(parseFloat(transaction.amount))}
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              📅 Tanggal
            </label>
            <div className="flex items-center gap-2 mt-1 text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
              <span>{formatFullDate(transaction.date)}</span>
            </div>
          </div>

          {/* AI Badge */}
          {transaction.isAiGenerated && (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-xl",
              "bg-violet-50 border border-violet-100"
            )}>
              <Sparkles className="w-4 h-4 text-violet-500" strokeWidth={1.5} />
              <span className="text-sm text-violet-600">
                Dibuat dengan AI Smart Input
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(transaction)}
            className={cn(
              "flex-1 py-3 px-4 rounded-2xl font-bold cursor-pointer",
              "bg-emerald-500 text-white",
              "shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]",
              "hover:shadow-[inset_2px_2px_4px_#059669,inset_-2px_-2px_4px_#34d399]",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
          >
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
            Edit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(transaction)}
            className={cn(
              "flex-1 py-3 px-4 rounded-2xl font-bold cursor-pointer",
              "bg-rose-500 text-white",
              "shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]",
              "hover:shadow-[inset_2px_2px_4px_#be123c,inset_-2px_-2px_4px_#fb7185]",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            Hapus
          </motion.button>
        </div>
      </div>
    </ClayDialog>
  );
};
