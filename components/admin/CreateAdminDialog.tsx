import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ClayDialog } from '../ui/clay-dialog';
import { ClayInput } from '../ui/clay-input';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import type { AdminUser } from '../../types/api';

interface CreateAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const CreateAdminDialog: React.FC<CreateAdminDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nama wajib diisi';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Nama minimal 2 karakter';
    }

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.admin.users.create({
        email: email.trim(),
        password,
        fullName: fullName.trim()
      });

      if (response.data) {
        onSuccess(response.data);
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat admin');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ClayDialog open={open} onClose={handleClose} title="Create Admin 🛡️">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ClayInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
          }}
          error={errors.fullName}
        />
        
        <ClayInput
          label="Email"
          type="email"
          placeholder="admin@cape.web.id"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
        />
        
        <ClayInput
          label="Password"
          type="password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        <p className="text-xs text-slate-500 mt-2">
          User yang dibuat akan memiliki role <span className="font-semibold text-violet-600">ADMIN</span> dan dapat mengakses panel admin.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Creating...
              </>
            ) : (
              'Create Admin'
            )}
          </Button>
        </div>
      </form>
    </ClayDialog>
  );
};
