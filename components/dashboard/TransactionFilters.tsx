import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CategoryIcon } from '../ui/dynamic-icon';
import type { Category, TransactionListParams } from '../../types/api';

interface TransactionFiltersProps {
  categories: Category[];
  onFilterChange: (filters: Partial<TransactionListParams>) => void;
  initialFilters?: Partial<TransactionListParams>;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  categories,
  onFilterChange,
  initialFilters = {}
}) => {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || '');
  const [startDate, setStartDate] = useState(initialFilters.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters.endDate || '');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>(initialFilters.sortBy || 'date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialFilters.sortOrder || 'desc');
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const selectedCategory = categories.find(c => c.id === categoryId);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: search || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setShowCategoryDropdown(false);
    onFilterChange({ categoryId: id || undefined });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      onFilterChange({ startDate: value || undefined, month: undefined });
    } else {
      setEndDate(value);
      onFilterChange({ endDate: value || undefined, month: undefined });
    }
  };

  const handleSortChange = (newSortBy: 'date' | 'amount', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setShowSortDropdown(false);
    onFilterChange({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
    onFilterChange({
      search: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = search || categoryId || startDate || endDate || sortBy !== 'date' || sortOrder !== 'desc';

  const sortOptions = [
    { sortBy: 'date' as const, sortOrder: 'desc' as const, label: 'Terbaru' },
    { sortBy: 'date' as const, sortOrder: 'asc' as const, label: 'Terlama' },
    { sortBy: 'amount' as const, sortOrder: 'desc' as const, label: 'Nominal Terbesar' },
    { sortBy: 'amount' as const, sortOrder: 'asc' as const, label: 'Nominal Terkecil' },
  ];

  const currentSort = sortOptions.find(o => o.sortBy === sortBy && o.sortOrder === sortOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-5 rounded-3xl relative z-10",
        "bg-white/70 backdrop-blur-sm",
        "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]",
        "space-y-4"
      )}
    >
      {/* Row 1: Search + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-xl",
              "bg-white/80 text-slate-800 placeholder:text-slate-400",
              "shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]",
              "focus:outline-none focus:ring-2 focus:ring-emerald-300",
              "transition-all duration-200"
            )}
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-left",
              "bg-white/80",
              "shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]",
              "flex items-center gap-3",
              "focus:outline-none focus:ring-2 focus:ring-emerald-300"
            )}
          >
            {selectedCategory ? (
              <>
                <CategoryIcon iconSlug={selectedCategory.iconSlug} colorHex={selectedCategory.colorHex} size="sm" />
                <span className="flex-1 text-slate-800 truncate">{selectedCategory.name}</span>
              </>
            ) : (
              <>
                <Filter className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <span className="flex-1 text-slate-400">Semua Kategori</span>
              </>
            )}
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showCategoryDropdown && "rotate-180")} strokeWidth={1.5} />
          </button>

          {showCategoryDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-2 rounded-xl bg-white shadow-lg border border-slate-100 max-h-48 overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={cn("w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-left", !categoryId && "bg-emerald-50")}
              >
                <Filter className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <span className="text-slate-700">Semua Kategori</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn("w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-left", categoryId === category.id && "bg-emerald-50")}
                >
                  <CategoryIcon iconSlug={category.iconSlug} colorHex={category.colorHex} size="sm" />
                  <span className="text-slate-700">{category.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Row 2: Date Range + Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Start Date */}
        <div>
          <label className="block text-xs text-slate-500 mb-1 ml-1">Dari Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-sm",
              "bg-white/80 text-slate-800",
              "shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]",
              "focus:outline-none focus:ring-2 focus:ring-emerald-300"
            )}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs text-slate-500 mb-1 ml-1">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-sm",
              "bg-white/80 text-slate-800",
              "shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]",
              "focus:outline-none focus:ring-2 focus:ring-emerald-300"
            )}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <label className="block text-xs text-slate-500 mb-1 ml-1">Urutkan</label>
          <button
            type="button"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-left text-sm",
              "bg-white/80",
              "shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]",
              "flex items-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-emerald-300"
            )}
          >
            <ArrowUpDown className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <span className="flex-1 text-slate-700">{currentSort?.label}</span>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showSortDropdown && "rotate-180")} strokeWidth={1.5} />
          </button>

          {showSortDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-2 rounded-xl bg-white shadow-lg border border-slate-100"
            >
              {sortOptions.map((option) => (
                <button
                  key={`${option.sortBy}-${option.sortOrder}`}
                  type="button"
                  onClick={() => handleSortChange(option.sortBy, option.sortOrder)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-slate-50",
                    sortBy === option.sortBy && sortOrder === option.sortOrder && "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-500 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
          Reset Filter
        </motion.button>
      )}
    </motion.div>
  );
};
