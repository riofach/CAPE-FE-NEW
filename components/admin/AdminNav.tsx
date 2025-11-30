import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FolderTree, LogOut, Menu, X, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';

const navItems = [
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
];

export const AdminNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
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
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/admin/users" className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-violet-500 to-purple-600 text-white",
                "shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]"
              )}>
                <Shield className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-800">CAPE</span>
                <span className="text-violet-600 text-sm block -mt-1">Admin Panel</span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/80 rounded-xl p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-white text-violet-600 shadow-[2px_2px_8px_rgba(0,0,0,0.08)]" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right Side: User Info & Actions */}
          <div className="flex items-center gap-2">
            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100">
              <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-violet-700" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-violet-700 font-medium max-w-[120px] truncate">
                {profile?.fullName || 'Admin'}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer",
                "bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600",
                "transition-colors duration-200",
                "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]"
              )}
              title="Logout"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium hidden sm:block">Keluar</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-xl cursor-pointer",
                "bg-slate-100 text-slate-600",
                "shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d1d5db]"
              )}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 space-y-2 overflow-hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                      isActive
                        ? "bg-violet-100 text-violet-700 shadow-[inset_2px_2px_4px_#ddd6fe,inset_-2px_-2px_4px_#ffffff]"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    {item.label}
                  </NavLink>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
