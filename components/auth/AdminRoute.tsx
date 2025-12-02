import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const toast = useToast();
  const hasChecked = useRef(false);

  // Reset check when user changes (e.g., logout/login with different account)
  useEffect(() => {
    hasChecked.current = false;
    setIsAdmin(null);
    setChecking(true);
  }, [user?.id]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      if (hasChecked.current) return;
      hasChecked.current = true;

      try {
        const response = await api.users.getProfile();
        if (response.data?.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error('Akses ditolak. Halaman ini hanya untuk Admin.');
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading, toast]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
