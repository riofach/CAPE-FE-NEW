import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import type { UserProfile } from '../types/api';

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { fullName?: string }) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.users.getProfile();
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: { fullName?: string }): Promise<boolean> => {
    try {
      const response = await api.users.updateProfile(data);
      if (response.data) {
        setProfile(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, refreshProfile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};
