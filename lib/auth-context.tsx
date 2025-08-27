"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./types";
import { getMe } from "./user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData?: User) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Always attempt to fetch the full profile using HttpOnly cookies
        try {
          const me = await getMe();
          if (me) setUser(me);
        } catch {
          console.warn("Profile fetch failed during init");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData?: User) => {
    setIsLoading(true);
    // Optimistically set user if provided (from immediate login response)
    if (userData) {
      setUser(userData);
    }
    try {
      // Always fetch the full profile to populate fields like avatar, phone, etc.
      const me = await getMe();
      if (me) setUser(me);
    } catch {
      console.warn("Profile fetch failed right after login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user state immediately to prevent race conditions
    setUser(null);

    // Best-effort clear httpOnly cookies on server side
    fetch("/api/auth/logout", { method: "POST" })
      .catch(() => {
        // Ignore fetch errors during logout
        console.warn(
          "Logout API call failed, but continuing with client-side logout"
        );
      })
      .finally(() => {
        // Immediate redirect to avoid race conditions with useRequireAuth
        window.location.href = "/login";
      });
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = "/login";
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return auth;
}
