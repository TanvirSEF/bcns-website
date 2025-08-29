"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/api";
import { getProfile, logoutUser } from "./api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  getToken: () => string | null;
  checkAuthStatus: () => {
    hasToken: boolean;
    hasStoredUser: boolean;
    currentUser: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token management utilities
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  };

  const setToken = (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  };

  const removeToken = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  };

  const hasToken = (): boolean => {
    return !!getToken();
  };

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

  // Initialize auth state
  useEffect(() => {
    try {
      const token = hasToken();
      const storedUser = getUserFromStorage();

      if (token && storedUser) {
        setUser(storedUser);
      } else if (token && !storedUser) {
        // Clean up invalid token
        removeToken();
        setUser(null);
      } else {
        setUser(null);
      }
    } catch {
      // If there's any error in initialization, clear everything
      setUser(null);
      removeToken();
      removeUserData();
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (userData: User, token: string) => {
    try {
      setUser(userData);
      setToken(token);
      setUserData(userData);
    } catch (error) {
      console.error("Auth Context - Storage failed:", error);
      // If storage fails, at least set the user in memory
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      removeToken();
      removeUserData();
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setUserData(userData);
    } catch {
      // If refresh fails, logout the user
      await logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setUserData(updatedUser);
    }
  };

  const checkAuthStatus = () => {
    const token = hasToken();
    const storedUser = getUserFromStorage();

    return {
      hasToken: token,
      hasStoredUser: !!storedUser,
      currentUser: !!user,
    };
  };

  const isAuthenticated = !!user && !isLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
        updateUser,
        getToken,
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
