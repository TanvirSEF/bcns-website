"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, logoutUser, getProfile } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (!token) {
          setUser(null);
          return;
        }

        const response = await getProfile();
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Invalid token - clean up
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        // Clean up on error
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      await logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAuthenticated = !!user && !isLoading;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect if we're done loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  const { updateUser: contextUpdateUser } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    updateUser: contextUpdateUser,
    isAuthorized: isAuthenticated && !isLoading,
  };
}