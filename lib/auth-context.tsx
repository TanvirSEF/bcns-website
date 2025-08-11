"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getMe, tokenStorage } from "./api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => Promise<void>;
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
        if (token) {
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
        }

        // Always attempt to fetch the full profile (supports cookie-only sessions too)
        try {
          const me = await getMe(token || undefined);
          if (me) setUser(me);
        } catch {
          // Do not remove token on transient errors; keep optimistic user if any
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

  const login = async (token: string, userData?: User) => {
    setIsLoading(true);
    tokenStorage.set(token);
    // Optimistically set user if provided (from immediate login response)
    if (userData) {
      setUser(userData);
    }
    try {
      // Always fetch the full profile to populate fields like avatar, phone, etc.
      const me = await getMe(token);
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
    tokenStorage.remove();

    // Best-effort clear httpOnly cookies on server side
    fetch("/api/auth/logout", { method: "POST" })
      .catch(() => {
        // Ignore fetch errors during logout
        console.warn(
          "Logout API call failed, but continuing with client-side logout"
        );
      })
      .finally(() => {
        // Force redirect to login after a short delay to ensure state is cleared
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
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
      // Clear any existing state and redirect to login page if not authenticated
      tokenStorage.remove();
      window.location.href = "/login";
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return auth;
}
