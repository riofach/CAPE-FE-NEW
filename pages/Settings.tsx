import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Mail, Calendar, LogOut, Save, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const { profile, isLoading, updateProfile } = useUserProfile();
  
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.fullName || '');
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setHasChanges(displayName !== (profile.fullName || ''));
    }
  }, [displayName, profile]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      const success = await updateProfile({ fullName: displayName });
      if (success) {
        toast.success('Profil berhasil diupdate! ✨');
      } else {
        toast.error('Gagal menyimpan perubahan 😵');
      }
    } catch (error) {
      toast.error('Gagal menyimpan perubahan 😵');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Sampai jumpa lagi! 👋');
  };

  const getAvatarUrl = () => {
    const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    if (googleAvatar) return googleAvatar;
    
    const email = user?.email || 'user';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=10b981&textColor=ffffff`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" strokeWidth={1.5} />
            Pengaturan
          </h1>
          <p className="text-slate-500">
            Kelola profil dan preferensimu
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-6 rounded-3xl",
            "bg-white/70 backdrop-blur-sm",
            "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
          )}
        >
          <div className="flex items-center gap-4">
            <img
              src={getAvatarUrl()}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-slate-800 truncate">
                {profile?.fullName || 'Pengguna CAPE'}
              </h2>
              <p className="text-slate-500 text-sm truncate">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  profile?.authProvider === 'google'
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                )}>
                  {profile?.authProvider === 'google' ? '🔗 Google' : '✉️ Email'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-6 rounded-3xl",
            "bg-white/70 backdrop-blur-sm",
            "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
          )}
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" strokeWidth={1.5} />
            Ubah Profil
          </h3>

          <div className="space-y-4">
            {/* Display Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nama Tampilan
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Masukkan nama tampilan"
                className={cn(
                  "w-full px-4 py-3 rounded-xl",
                  "bg-slate-50/80 border border-slate-200/50",
                  "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03)]",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent",
                  "text-slate-700 placeholder:text-slate-400",
                  "transition-all duration-200"
                )}
              />
              <p className="text-xs text-slate-400 mt-1">
                Nama ini akan ditampilkan di dashboard
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200/30">
                <Mail className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <span className="text-slate-500">{profile?.email}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Bergabung Sejak
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200/30">
                <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <span className="text-slate-500">
                  {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: hasChanges ? 1.02 : 1 }}
              whileTap={{ scale: hasChanges ? 0.98 : 1 }}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
                "font-semibold transition-all duration-200",
                hasChanges
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" strokeWidth={1.5} />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </motion.button>
          </div>
        </motion.div>

        {/* Logout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-6 rounded-3xl",
            "bg-white/70 backdrop-blur-sm",
            "shadow-[inset_4px_4px_8px_#ffffff,inset_-4px_-4px_8px_#e2e8f0]"
          )}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
              "bg-rose-50 hover:bg-rose-100 text-rose-600",
              "border border-rose-200/50",
              "font-semibold transition-all duration-200"
            )}
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Keluar dari Akun
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
