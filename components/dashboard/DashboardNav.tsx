import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  User,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  HandCoins,
  Building2,
  type LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/transactions', label: 'Transaksi', icon: Receipt },
  { to: '/debts', label: 'Utang', icon: HandCoins },
  { to: '/business', label: 'Bisnis', icon: Building2 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

const activePillClass = 'bg-white text-emerald-600 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]';
const idlePillClass = 'text-slate-500 hover:text-slate-700';

export const DashboardNav: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-50',
        reducedMotion ? 'bg-white/95' : 'backdrop-blur-md bg-white/70',
        'border-b border-white/40',
        'shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
      )}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        {/* Row 1: brand cluster (left) + desktop nav pills (center) + user actions (right) */}
        <div className="flex items-center justify-between gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <img
              src="/capev2-logo.png"
              alt="CAPE"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0"
            />
            <div className="leading-tight min-w-0">
              <span className="block font-bold text-slate-800 text-sm sm:text-base">CAPE</span>
              <span className="block text-slate-500 text-[11px] sm:text-sm -mt-0.5 sm:-mt-1">
                Dashboard
              </span>
            </div>
          </Link>

          {/* Desktop-only nav pill group */}
          <div className="hidden sm:flex flex-1 justify-start ml-3">
            <div
              className={cn(
                'flex items-center gap-1',
                'bg-slate-100/80 rounded-xl p-1',
                'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]'
              )}
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive ? activePillClass : idlePillClass
                    )
                  }
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="hidden md:block">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-emerald-700" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-emerald-700 font-medium max-w-[120px] truncate">
                {profile?.fullName || user?.email?.split('@')[0]}
              </span>
            </div>

            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              aria-label="Keluar"
              className={cn(
                'flex items-center gap-2 rounded-xl',
                'h-10 sm:h-auto px-3 sm:px-4 sm:py-2',
                'bg-slate-100 hover:bg-slate-200 text-slate-600',
                'transition-colors duration-200',
                reducedMotion
                  ? 'shadow-sm'
                  : 'shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]'
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium hidden sm:block">Keluar</span>
            </motion.button>
          </div>
        </div>

        {/* Row 2: mobile-only nav pill row (full-width, icon + label stacked) */}
        <div className="sm:hidden mt-2">
          <div
            className={cn(
              'flex items-stretch gap-1',
              'bg-slate-100/80 rounded-xl p-1',
              'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]'
            )}
          >
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5',
                    'px-1 py-1.5 rounded-lg text-[10px] font-medium leading-tight transition-all duration-200',
                    isActive ? activePillClass : idlePillClass
                  )
                }
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <span className="truncate w-full text-center">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
