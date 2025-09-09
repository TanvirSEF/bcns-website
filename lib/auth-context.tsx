"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/api";
import { authApi } from "./api";
import { ApiError } from "./api-client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | Error | null;
  login: (userData: User, token: string, expiresIn?: number, refreshToken?: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  getToken: () => string | null;
  isTokenExpired: () => boolean;
  getTokenExpiration: () => Date | null;
  clearError: () => void;
  checkAuthStatus: () => {
    hasToken: boolean;
    hasStoredUser: boolean;
    currentUser: boolean;
    isExpired: boolean;
    expiresAt: Date | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | Error | null>(null);

  // Simple token management utilities
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  };

  const isTokenExpired = (): boolean => {
    if (typeof window === "undefined") return true;
    
    const token = localStorage.getItem("auth_token");
    const expiresAt = localStorage.getItem("token_expires_at");
    
    if (!token || !expiresAt) return true;
    
    const expiration = parseInt(expiresAt, 10);
    return Date.now() >= expiration;
  };

  const getTokenExpiration = (): Date | null => {
    if (typeof window === "undefined") return null;
    
    const expiresAt = localStorage.getItem("token_expires_at");
    if (!expiresAt) return null;
    
    return new Date(parseInt(expiresAt, 10));
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // User data management utilities
  const getUserFromStorage = (): User | null => {
    if (typeof window === "undefined") return null;

    try {
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch {
      // Silent error handling for corrupted user data
      localStorage.removeItem("user_data");
    }
    return null;
  };

  const setUserData = (userData: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_data", JSON.stringify(userData));
    }
  };

  const removeUserData = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_data");
    }
  };

  // Simple token storage utilities
  const setTokenData = (token: string, expiresIn?: number): void => {
    if (typeof window === "undefined") return;
    
    
    localStorage.setItem("auth_token", token);
    
    // Calculate expiration time
    const expirationTime = expiresIn 
      ? Date.now() + (expiresIn * 1000)
      : Date.now() + (60 * 60 * 1000); // Default 1 hour
    
    localStorage.setItem("token_expires_at", expirationTime.toString());
  };

  const clearTokenData = (): void => {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_expires_at");
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setError(null);
        const hasValidToken = !isTokenExpired();
        const storedUser = getUserFromStorage();
        
        if (hasValidToken && storedUser) {
          // We have a valid token and stored user data
          setUser(storedUser);
        } else if (hasValidToken) {
          // We have a token but no user data, try to fetch it
          try {
            const userData = await authApi.getProfile();
            setUser(userData);
            setUserData(userData);
          } catch (error) {
            // Clear invalid token
            clearTokenData();
            removeUserData();
            setUser(null);
            setError(error instanceof Error ? error : new Error('Failed to load user data'));
          }
        } else {
          // No valid token, clear everything
          setUser(null);
          removeUserData();
          clearTokenData();
        }
      } catch (error) {
        setUser(null);
        removeUserData();
        clearTokenData();
        setError(error instanceof Error ? error : new Error('Failed to initialize authentication'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((
    userData: User, 
    token: string, 
    expiresIn?: number, 
    _refreshToken?: string
  ) => {
    try {
      setError(null);
      setUser(userData);
      
      // Store token data
      setTokenData(token, expiresIn);
      
      // Store user data locally
      setUserData(userData);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Login failed'));
      // If storage fails, at least set the user in memory
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try to call logout API
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Always clear local state regardless of API call result
      setUser(null);
      removeUserData();
      clearTokenData();
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await authApi.getProfile();
      setUser(userData);
      setUserData(userData);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to refresh user data'));
      
      // If refresh fails due to auth error, logout the user
      if (error instanceof ApiError && error.status === 401) {
        await logout();
      }
    }
  }, [logout]);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setUserData(updatedUser);
    }
  }, [user]);

  const checkAuthStatus = useCallback(() => {
    const hasToken = !!getToken();
    const isExpired = isTokenExpired();
    const storedUser = getUserFromStorage();
    const expiresAt = getTokenExpiration();

    return {
      hasToken,
      hasStoredUser: !!storedUser,
      currentUser: !!user,
      isExpired,
      expiresAt,
    };
  }, [user]);

  const isAuthenticated = !!user && !isLoading && !isTokenExpired();

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshUser,
        updateUser,
        getToken,
        isTokenExpired,
        getTokenExpiration,
        clearError,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
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
