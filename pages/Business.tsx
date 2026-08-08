import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Building2, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClayCard } from '../components/ui/clay-card';
import { Button } from '../components/ui/button';
import { CategoryIcon } from '../components/ui/dynamic-icon';
import { BusinessDialog } from '../components/dashboard/BusinessDialog';
import { api } from '../lib/api';
import { cn, formatPrice } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import type { Business as BusinessModel, BusinessStatus } from '../types/api';

export const Business: React.FC = () => {
  const toast = useToast();
  const [businesses, setBusinesses] = useState<BusinessModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.businesses.list();
      if (res.data) setBusinesses(res.data);
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
      toast.error('Gagal memuat data bisnis');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreated = () => {
    setIsFormOpen(false);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bisnis</h1>
            <p className="text-slate-500 text-sm">
              Lacak modal, biaya, dan omzet tiap bisnismu — terpisah dari keuangan pribadi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="w-10 h-10 rounded-xl bg-white/80 text-slate-500 hover:text-slate-700 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db] flex items-center justify-center"
              aria-label="Refresh"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} strokeWidth={1.5} />
            </motion.button>
            <Button onClick={() => setIsFormOpen(true)} size="md">
              <Plus className="w-4 h-4" strokeWidth={2} />
              Tambah Bisnis
            </Button>
          </div>
        </div>

        {/* List */}
        {isLoading && businesses.length === 0 ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <p className="text-slate-500">Memuat...</p>
          </ClayCard>
        ) : businesses.length === 0 ? (
          <ClayCard className="p-12 text-center" disableAnimation>
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-slate-500 mb-1">Belum ada bisnis</p>
            <p className="text-xs text-slate-400">Klik &ldquo;Tambah Bisnis&rdquo; untuk mulai melacak untung-rugi</p>
          </ClayCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>

      <BusinessDialog open={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleCreated} />
    </DashboardLayout>
  );
};

const statusMeta = (status?: BusinessStatus) => {
  if (status === 'PROFIT') return { label: 'Untung', color: 'text-emerald-600', Icon: TrendingUp };
  if (status === 'LOSS') return { label: 'Rugi', color: 'text-rose-600', Icon: TrendingDown };
  return { label: 'Impas', color: 'text-slate-500', Icon: Minus };
};

const BusinessCard: React.FC<{ business: BusinessModel }> = ({ business }) => {
  const m = business.metrics;
  const s = statusMeta(m?.status);
  const StatusIcon = s.Icon;

  return (
    <Link to={`/business/${business.id}`}>
      <ClayCard
        className="p-5 h-full hover:shadow-[8px_8px_20px_#c8d0e7,-8px_-8px_20px_#ffffff] transition-shadow"
        disableAnimation
      >
        <div className="flex items-center gap-3 mb-4">
          <CategoryIcon iconSlug={business.iconSlug} colorHex={business.colorHex} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{business.name}</p>
            <div className={cn('flex items-center gap-1 text-xs font-medium', s.color)}>
              <StatusIcon className="w-3 h-3" strokeWidth={2} />
              {s.label}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-slate-400">Laba Operasional</p>
            <p className={cn('font-bold', s.color)}>{formatPrice(m?.labaOperasional ?? 0)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Posisi Kas</p>
            <p className="font-bold text-slate-700">{formatPrice(m?.posisiKas ?? 0)}</p>
          </div>
        </div>
      </ClayCard>
    </Link>
  );
};
