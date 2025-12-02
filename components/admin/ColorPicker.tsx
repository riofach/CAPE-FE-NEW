import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

const colorPresets = [
  { hex: '#EF4444', name: 'Red' },
  { hex: '#F97316', name: 'Orange' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#EAB308', name: 'Yellow' },
  { hex: '#84CC16', name: 'Lime' },
  { hex: '#22C55E', name: 'Green' },
  { hex: '#10B981', name: 'Emerald' },
  { hex: '#14B8A6', name: 'Teal' },
  { hex: '#06B6D4', name: 'Cyan' },
  { hex: '#0EA5E9', name: 'Sky' },
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#8B5CF6', name: 'Violet' },
  { hex: '#A855F7', name: 'Purple' },
  { hex: '#D946EF', name: 'Fuchsia' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#F43F5E', name: 'Rose' },
  { hex: '#64748B', name: 'Slate' },
];

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const selectedColor = colorPresets.find(c => c.hex === value) || { hex: value, name: 'Custom' };

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex);
    onChange(hex);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-600 mb-2">
        Color
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
          className="w-8 h-8 rounded-xl shadow-inner"
          style={{ backgroundColor: value }}
        />
        <span className="flex-1 text-left">{selectedColor.name}</span>
        <span className="text-xs text-slate-400 uppercase">{value}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
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
                "border border-white/40"
              )}
            >
              {/* Preset Colors */}
              <p className="text-xs text-slate-500 mb-2 font-medium">Preset Colors</p>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {colorPresets.map((color) => {
                  const isSelected = value === color.hex;
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        onChange(color.hex);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "relative w-10 h-10 rounded-xl cursor-pointer",
                        "shadow-[2px_2px_6px_#d1d9e6,-2px_-2px_6px_#ffffff]",
                        "hover:scale-110 transition-transform duration-200",
                        isSelected && "ring-2 ring-offset-2 ring-violet-500"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check 
                          size={16} 
                          className="absolute inset-0 m-auto text-white drop-shadow-md" 
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color */}
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-500 mb-2 font-medium flex items-center gap-1">
                  <Palette size={12} strokeWidth={1.5} />
                  Custom Color
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const hex = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                        setCustomColor(hex);
                        if (hex.length === 7) {
                          onChange(hex);
                        }
                      }
                    }}
                    placeholder="#6366F1"
                    maxLength={7}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-xl text-sm uppercase",
                      "bg-white/60 border-0",
                      "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                      "focus:outline-none focus:ring-2 focus:ring-violet-300",
                      "text-slate-700 placeholder:text-slate-400"
                    )}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
