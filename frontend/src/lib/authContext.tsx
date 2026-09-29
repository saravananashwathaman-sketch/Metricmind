"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser, AuthSession, Role } from "@/types";
import { api } from "./api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthSession>;
  loginDemo: (role?: Role) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "metricmind_auth_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: AuthSession = JSON.parse(stored);
          if (parsed && parsed.expires_at && parsed.expires_at > Date.now()) {
            setSession(parsed);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to restore session from storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<AuthSession> => {
    const authSession = await api.login(email, password, rememberMe);
    setSession(authSession);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authSession));
        if (rememberMe) {
          document.cookie = `mm_session_token=${authSession.token}; path=/; max-age=${30 * 86400}; SameSite=Lax`;
        } else {
          document.cookie = `mm_session_token=${authSession.token}; path=/; SameSite=Lax`;
        }
      } catch (e) {
        console.warn("Could not persist session to localStorage", e);
      }
    }

    return authSession;
  }, []);

  const loginDemo = useCallback(async (role: Role = "Executive"): Promise<AuthSession> => {
    // Deterministic demo account: Rajesh Kapoor, Executive
    const authSession = await api.login("demo@metricmind.app", "demo", false);
    if (role && role !== "Executive") {
      authSession.user.role = role;
    }
    setSession(authSession);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authSession));
        document.cookie = `mm_session_token=${authSession.token}; path=/; SameSite=Lax`;
      } catch (e) {}
    }

    return authSession;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {}

    setSession(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
        document.cookie = "mm_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } catch {}
      window.location.href = "/login";
    }
  }, []);

  const value: AuthContextType = {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: !!session && session.expires_at > Date.now(),
    isLoading,
    isDemo: !!session?.is_demo,
    login,
    loginDemo,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
