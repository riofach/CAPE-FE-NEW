import React from 'react';
import { motion } from 'framer-motion';
import { cn, formatPrice } from '../../lib/utils';
import { CategoryIcon } from '../ui/dynamic-icon';

interface CategoryLegendProps {
  data: Array<{
    category: { name: string; colorHex: string; iconSlug: string } | null;
    total: number;
    percentage: number;
  }>;
}

export const CategoryLegend: React.FC<CategoryLegendProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>Tidak ada data kategori</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          key={item.category?.name || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
          whileHover={{ x: 4 }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-2xl cursor-default",
            "bg-white/70 backdrop-blur-sm",
            "shadow-[inset_3px_3px_6px_#ffffff,inset_-3px_-3px_6px_#e2e8f0]",
            "hover:shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#d1d5db]",
            "transition-all duration-300"
          )}
        >
          {/* Category Icon */}
          {item.category ? (
            <CategoryIcon 
              iconSlug={item.category.iconSlug} 
              colorHex={item.category.colorHex}
              size="sm"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center"
            >
              <span className="text-slate-400 text-xs">?</span>
            </div>
          )}

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-700 truncate">
              {item.category?.name || 'Lainnya'}
            </p>
            <p className="text-sm text-slate-500">
              {formatPrice(item.total)}
            </p>
          </div>

          {/* Percentage Badge */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className={cn(
              "text-sm font-bold px-3 py-1.5 rounded-xl",
              "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]"
            )}
            style={{ 
              backgroundColor: `${item.category?.colorHex || '#94a3b8'}15`,
              color: item.category?.colorHex || '#94a3b8'
            }}
          >
            {item.percentage}%
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
