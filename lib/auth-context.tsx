"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getMe, tokenStorage } from "./api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenStorage.get();
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Optimistically derive minimal user info from JWT to avoid logout
        // on reload if the profile endpoint is temporarily unavailable.
        try {
          const base64 = token.split(".")[1];
          const decoded = JSON.parse(
            typeof window !== "undefined"
              ? atob(base64)
              : Buffer.from(base64, "base64").toString()
          );
          if (decoded?.email || decoded?.name || decoded?.sub) {
            setUser({
              id: decoded.sub || decoded.userId || "unknown",
              name: decoded.name || decoded.email?.split("@")[0] || "Member",
              email: decoded.email || "",
            });
          }
        } catch {}

        // Fetch full user profile via our proxy to Users service (has phone, bio, address, avatar).
        try {
          const me = await getMe(token);
          if (me) setUser(me);
        } catch {
          // Do not remove token on transient errors; keep optimistic user
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

  const login = (token: string, userData: User) => {
    tokenStorage.set(token);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);
    window.location.href = "/login";
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
