import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, BarChart3, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export const DashboardNav: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md",
        "bg-white/70 border-b border-white/40",
        "shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img 
                src="/capev2-logo.png" 
                alt="CAPE" 
                className="w-10 h-10 rounded-xl"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-slate-800">CAPE</span>
                <span className="text-slate-500 text-sm block -mt-1">Dashboard</span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 rounded-xl p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white text-emerald-600 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:block">Home</span>
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white text-emerald-600 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:block">Analytics</span>
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white text-emerald-600 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Receipt className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:block">Transaksi</span>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-emerald-700" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-emerald-700 font-medium max-w-[120px] truncate">
                {user?.email?.split('@')[0]}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                "bg-slate-100 hover:bg-slate-200 text-slate-600",
                "transition-colors duration-200",
                "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]"
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium hidden sm:block">Keluar</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
