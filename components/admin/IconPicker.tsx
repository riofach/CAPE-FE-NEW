import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Clock } from 'lucide-react';
import { DynamicIcon, allIconNames } from '../ui/dynamic-icon';
import { cn } from '../../lib/utils';

// Popular/recommended icons shown first
const FEATURED_ICONS = [
  'utensils', 'car', 'fuel', 'shopping-bag', 'receipt', 'film', 'heart',
  'graduation-cap', 'briefcase', 'gift', 'piggy-bank', 'wallet', 'trending-up',
  'laptop', 'gamepad-2', 'home', 'coffee', 'plane', 'music', 'camera',
  'shirt', 'dumbbell', 'baby', 'dog', 'cat', 'smartphone', 'wifi', 'zap',
  'droplet', 'pill', 'stethoscope', 'bus', 'train', 'bike', 'pizza',
  'beer', 'wine', 'cigarette', 'scissors', 'wrench', 'hammer', 'paintbrush'
];

// LocalStorage key for recent icons
const RECENT_ICONS_KEY = 'cape-recent-icons';
const MAX_RECENT_ICONS = 10;

// Get recent icons from localStorage
const getRecentIcons = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_ICONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save recent icon to localStorage
const saveRecentIcon = (iconName: string) => {
  try {
    const recent = getRecentIcons().filter(i => i !== iconName);
    recent.unshift(iconName);
    localStorage.setItem(
      RECENT_ICONS_KEY, 
      JSON.stringify(recent.slice(0, MAX_RECENT_ICONS))
    );
  } catch {
    // Ignore localStorage errors
  }
};

interface IconPickerProps {
  value: string;
  onChange: (slug: string) => void;
  colorHex?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ 
  value, 
  onChange,
  colorHex = '#6366F1'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recentIcons] = useState(getRecentIcons);
  const [showAll, setShowAll] = useState(false);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    
    if (!searchLower) {
      // No search: show recent + featured
      const combined = [...new Set([...recentIcons, ...FEATURED_ICONS])];
      return showAll ? allIconNames : combined;
    }
    
    // Search: filter all icons
    return allIconNames.filter(name => 
      name.toLowerCase().includes(searchLower)
    );
  }, [search, recentIcons, showAll]);

  // Limit displayed icons for performance
  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, showAll ? 500 : 50);
  }, [filteredIcons, showAll]);

  const handleSelect = useCallback((iconName: string) => {
    saveRecentIcon(iconName);
    onChange(iconName);
    setIsOpen(false);
    setSearch('');
    setShowAll(false);
  }, [onChange]);

  // Format icon name for display (kebab-case to Title Case)
  const formatIconName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-600 mb-2">
        Icon
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-2xl flex items-center gap-3 cursor-pointer",
          "bg-[#f0f4f8] text-slate-700",
          "shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
          "border border-white/40",
          "focus:outline-none focus:ring-2 focus:ring-violet-400/50",
          "transition-all duration-200"
        )}
      >
        <div 
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${colorHex}20` }}
        >
          <DynamicIcon name={value} size={18} color={colorHex} />
        </div>
        <span className="flex-1 text-left">{formatIconName(value)}</span>
        <span className="text-xs text-slate-400">{value}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => {
                setIsOpen(false);
                setSearch('');
                setShowAll(false);
              }} 
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "absolute left-0 right-0 mt-2 z-50",
                "rounded-2xl p-4",
                "bg-[#f0f4f8]",
                "shadow-[10px_10px_30px_#c8d0e7,-10px_-10px_30px_#ffffff]",
                "border border-white/40",
                "max-h-96 overflow-hidden flex flex-col"
              )}
            >
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Cari icon... (contoh: fuel, car, food)"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowAll(false);
                  }}
                  autoFocus
                  className={cn(
                    "w-full pl-9 pr-4 py-2 rounded-xl text-sm",
                    "bg-white/60 border-0",
                    "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                    "focus:outline-none focus:ring-2 focus:ring-violet-300",
                    "text-slate-700 placeholder:text-slate-400"
                  )}
                />
              </div>

              {/* Info */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-slate-500">
                  {search 
                    ? `${filteredIcons.length} hasil` 
                    : `${displayedIcons.length} icon ditampilkan`}
                </span>
                {!search && !showAll && filteredIcons.length < allIconNames.length && (
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="text-xs text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                  >
                    Lihat semua {allIconNames.length}+ icons
                  </button>
                )}
              </div>

              {/* Section Labels */}
              {!search && recentIcons.length > 0 && (
                <div className="flex items-center gap-1 mb-2 px-1">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Terakhir digunakan</span>
                </div>
              )}

              {/* Icon Grid */}
              <div className="overflow-y-auto flex-1 -mx-1">
                <div className="grid grid-cols-5 gap-2 px-1">
                  {displayedIcons.map((iconName) => {
                    const isSelected = value === iconName;
                    const isRecent = recentIcons.includes(iconName);
                    
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelect(iconName)}
                        className={cn(
                          "relative p-2 rounded-xl flex flex-col items-center gap-1 cursor-pointer",
                          "transition-all duration-200",
                          isSelected
                            ? "bg-violet-100 shadow-[inset_2px_2px_4px_#ddd6fe,inset_-2px_-2px_4px_#ffffff]"
                            : "bg-white/60 hover:bg-white shadow-[2px_2px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
                        )}
                        title={formatIconName(iconName)}
                      >
                        <DynamicIcon 
                          name={iconName}
                          size={20} 
                          color={isSelected ? '#7c3aed' : '#475569'}
                        />
                        <span className={cn(
                          "text-[9px] truncate w-full text-center leading-tight",
                          isSelected ? "text-violet-600" : "text-slate-500"
                        )}>
                          {iconName.split('-')[0]}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" strokeWidth={2} />
                          </div>
                        )}
                        {!isSelected && isRecent && !search && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                            <Clock size={8} className="text-white" strokeWidth={2} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Load More */}
                {!showAll && !search && displayedIcons.length < filteredIcons.length && (
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm",
                        "bg-white/60 text-slate-600",
                        "shadow-[2px_2px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]",
                        "hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                        "transition-all duration-200 cursor-pointer"
                      )}
                    >
                      Muat lebih banyak icon...
                    </button>
                  </div>
                )}

                {/* No Results */}
                {displayedIcons.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">Tidak ada icon yang cocok</p>
                    <p className="text-xs mt-1">Coba kata kunci lain</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
