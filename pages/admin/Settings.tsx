import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sparkles, Save, RefreshCw, Infinity } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ClayCard } from '../../components/ui/clay-card';
import { Button } from '../../components/ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';

export const Settings: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // AI Settings
  const [aiDailyLimit, setAiDailyLimit] = useState('25');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [originalLimit, setOriginalLimit] = useState('25');

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.admin.settings.get();
      if (response.data) {
        const limit = response.data.ai_daily_limit_default || '25';
        if (limit === '-1') {
          setIsUnlimited(true);
          setAiDailyLimit('25');
        } else {
          setIsUnlimited(false);
          setAiDailyLimit(limit);
        }
        setOriginalLimit(limit);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat settings');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    const newValue = isUnlimited ? '-1' : aiDailyLimit;
    
    // Validate
    if (!isUnlimited) {
      const numValue = parseInt(aiDailyLimit, 10);
      if (isNaN(numValue) || numValue < 1) {
        toast.error('Limit harus berupa angka positif');
        return;
      }
    }
    
    setIsSaving(true);
    try {
      await api.admin.settings.update('ai_daily_limit_default', newValue);
      setOriginalLimit(newValue);
      toast.success('Settings berhasil disimpan! ✨');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    const currentValue = isUnlimited ? '-1' : aiDailyLimit;
    return currentValue !== originalLimit;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <SettingsIcon className="w-7 h-7 text-violet-500" strokeWidth={1.5} />
              Settings
            </h1>
            <p className="text-slate-500">Konfigurasi global aplikasi</p>
          </div>
          <Button 
            variant="secondary" 
            size="md" 
            onClick={fetchSettings} 
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} strokeWidth={1.5} />
          </Button>
        </motion.div>

        {/* AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ClayCard className="!p-6" disableAnimation>
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
                "shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff]"
              )}>
                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">AI Configuration</h2>
                <p className="text-sm text-slate-500">Pengaturan fitur AI Smart Input</p>
              </div>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-40" />
                <div className="h-12 bg-slate-200 rounded-xl w-full max-w-xs" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Daily Limit Setting */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Daily Limit per User
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    Batas penggunaan AI per hari untuk semua user (bisa di-override per user)
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Limit Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={aiDailyLimit}
                        onChange={(e) => setAiDailyLimit(e.target.value)}
                        disabled={isUnlimited}
                        className={cn(
                          "w-24 px-4 py-2.5 rounded-xl text-center font-medium",
                          "bg-white/60 border-0",
                          "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
                          "focus:outline-none focus:ring-2 focus:ring-violet-300",
                          "text-slate-700",
                          isUnlimited && "opacity-50 cursor-not-allowed"
                        )}
                      />
                      <span className="text-slate-500 text-sm">request / hari</span>
                    </div>

                    {/* Unlimited Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsUnlimited(!isUnlimited)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer",
                        isUnlimited
                          ? "bg-violet-100 text-violet-700 shadow-[inset_2px_2px_4px_#ddd6fe,inset_-2px_-2px_4px_#ffffff]"
                          : "bg-white/60 text-slate-500 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
                      )}
                    >
                      <Infinity className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Unlimited</span>
                    </button>
                  </div>

                  {isUnlimited && (
                    <p className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      ⚠️ Mode unlimited aktif - semua user bisa menggunakan AI tanpa batas harian
                    </p>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-100">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges()}
                  >
                    <Save className={cn("w-4 h-4", isSaving && "animate-pulse")} strokeWidth={1.5} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  {!hasChanges() && (
                    <span className="ml-3 text-sm text-slate-400">Tidak ada perubahan</span>
                  )}
                </div>
              </div>
            )}
          </ClayCard>
        </motion.div>
      </div>
    </AdminLayout>
  );
};
