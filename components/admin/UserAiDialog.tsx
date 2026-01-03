import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Infinity, BarChart3 } from 'lucide-react';
import { ClayDialog } from '../ui/clay-dialog';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';
import type { AdminUser } from '../../types/api';

interface UserAiDialogProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  globalLimit: number;
  onUpdate: (updatedUser: AdminUser) => void;
}

type LimitMode = 'default' | 'custom' | 'unlimited';

export const UserAiDialog: React.FC<UserAiDialogProps> = ({
  open,
  onClose,
  user,
  globalLimit,
  onUpdate
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [limitMode, setLimitMode] = useState<LimitMode>('default');
  const [customLimit, setCustomLimit] = useState('50');

  // Initialize state when user changes
  useEffect(() => {
    if (user) {
      setAiEnabled(user.aiEnabled);
      if (user.aiDailyLimit === -1) {
        setLimitMode('unlimited');
      } else if (user.aiDailyLimit !== null) {
        setLimitMode('custom');
        setCustomLimit(user.aiDailyLimit.toString());
      } else {
        setLimitMode('default');
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update AI access if changed
      if (aiEnabled !== user.aiEnabled) {
        await api.admin.users.toggleAiAccess(user.id, aiEnabled);
      }

      // Calculate new limit value
      let newLimit: number | null = null;
      if (limitMode === 'unlimited') {
        newLimit = -1;
      } else if (limitMode === 'custom') {
        const num = parseInt(customLimit, 10);
        if (isNaN(num) || num < 1) {
          toast.error('Custom limit harus angka positif');
          setIsLoading(false);
          return;
        }
        newLimit = num;
      }

      // Update limit if changed
      const currentLimit = user.aiDailyLimit;
      if (newLimit !== currentLimit) {
        await api.admin.users.updateAiLimit(user.id, newLimit);
      }

      // Update local state
      onUpdate({
        ...user,
        aiEnabled,
        aiDailyLimit: newLimit
      });

      toast.success('Pengaturan AI user berhasil diperbarui! ✨');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  const getLimitDisplay = () => {
    if (limitMode === 'unlimited') return '∞';
    if (limitMode === 'custom') return customLimit;
    return globalLimit.toString();
  };

  if (!user) return null;

  return (
    <ClayDialog open={open} onClose={onClose} title="Pengaturan AI User ✨">
      <div className="space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            "bg-violet-100 text-violet-600"
          )}>
            <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">
              {user.fullName || 'No Name'}
            </p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* AI Status Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status AI
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAiEnabled(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all cursor-pointer",
                aiEnabled
                  ? "bg-emerald-100 text-emerald-700 shadow-[inset_2px_2px_4px_#a7f3d0,inset_-2px_-2px_4px_#ffffff]"
                  : "bg-white/60 text-slate-500 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
              )}
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-medium">Aktif</span>
            </button>
            <button
              type="button"
              onClick={() => setAiEnabled(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all cursor-pointer",
                !aiEnabled
                  ? "bg-rose-100 text-rose-700 shadow-[inset_2px_2px_4px_#fecdd3,inset_-2px_-2px_4px_#ffffff]"
                  : "bg-white/60 text-slate-500 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
              )}
            >
              <Sparkles className="w-4 h-4 opacity-50" strokeWidth={1.5} />
              <span className="font-medium">Nonaktif</span>
            </button>
          </div>
        </div>

        {/* Daily Limit */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Daily Limit
          </label>
          <div className="space-y-2">
            {/* Default Option */}
            <button
              type="button"
              onClick={() => setLimitMode('default')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left",
                limitMode === 'default'
                  ? "bg-violet-100 text-violet-700 shadow-[inset_2px_2px_4px_#ddd6fe,inset_-2px_-2px_4px_#ffffff]"
                  : "bg-white/60 text-slate-600 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
              )}
            >
              <BarChart3 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <span className="font-medium">Use Default</span>
                <span className="text-sm opacity-70 ml-2">({globalLimit}/hari)</span>
              </div>
              {limitMode === 'default' && (
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>

            {/* Custom Option */}
            <button
              type="button"
              onClick={() => setLimitMode('custom')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left",
                limitMode === 'custom'
                  ? "bg-violet-100 text-violet-700 shadow-[inset_2px_2px_4px_#ddd6fe,inset_-2px_-2px_4px_#ffffff]"
                  : "bg-white/60 text-slate-600 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
              )}
            >
              <Sparkles className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <div className="flex-1 flex items-center gap-2">
                <span className="font-medium">Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customLimit}
                  onChange={(e) => {
                    setCustomLimit(e.target.value);
                    setLimitMode('custom');
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "w-16 px-2 py-1 rounded-lg text-center text-sm",
                    "bg-white border-0",
                    "shadow-[inset_1px_1px_2px_#d1d9e6,inset_-1px_-1px_2px_#ffffff]",
                    "focus:outline-none focus:ring-2 focus:ring-violet-300"
                  )}
                />
                <span className="text-sm opacity-70">/hari</span>
              </div>
              {limitMode === 'custom' && (
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>

            {/* Unlimited Option */}
            <button
              type="button"
              onClick={() => setLimitMode('unlimited')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left",
                limitMode === 'unlimited'
                  ? "bg-amber-100 text-amber-700 shadow-[inset_2px_2px_4px_#fde68a,inset_-2px_-2px_4px_#ffffff]"
                  : "bg-white/60 text-slate-600 shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] hover:bg-slate-50"
              )}
            >
              <Infinity className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span className="font-medium flex-1">Unlimited</span>
              {limitMode === 'unlimited' && (
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 rounded-xl bg-slate-50 text-center">
          <p className="text-xs text-slate-500 mb-1">Preview limit user</p>
          <p className="text-2xl font-bold text-slate-800">
            {getLimitDisplay()}
            <span className="text-sm font-normal text-slate-500 ml-1">
              {limitMode !== 'unlimited' && '/hari'}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </Button>
        </div>
      </div>
    </ClayDialog>
  );
};
