"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // UX improvement
  isAuthLoading: boolean;
}

/* ═══════════════════════════════════════════════ */

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/* ═══════════════════════════════════════════════ */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // initial load
  const [isAuthLoading, setIsAuthLoading] = useState(false); // login/register

  /* ─────────────────────────────────────────────
     REFRESH USER (SAFE)
     ───────────────────────────────────────────── */
  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get<{ user: User }>("/api/auth/me");
      setUser(data.user);
    } catch {
      // Do NOT show toast here (silent fail)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /* ─────────────────────────────────────────────
     LOGIN
     ───────────────────────────────────────────── */
  const login = useCallback(async (email: string, password: string) => {
    setIsAuthLoading(true);
    try {
      const data = await api.post<{ user: User; message: string }>(
        "/api/auth/login",
        { email, password }
      );

      setUser(data.user);
      toast.success(data.message || "Logged in successfully");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Login failed";
      toast.error(msg);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  /* ─────────────────────────────────────────────
     REGISTER
     ───────────────────────────────────────────── */
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setIsAuthLoading(true);
      try {
        const data = await api.post<{ user: User; message: string }>(
          "/api/auth/register",
          { username, email, password }
        );

        setUser(data.user);
        toast.success(data.message || "Account created");
      } catch (err) {
        const msg =
          err instanceof ApiError ? err.message : "Registration failed";
        toast.error(msg);
        throw err;
      } finally {
        setIsAuthLoading(false);
      }
    },
    []
  );

  /* ─────────────────────────────────────────────
     LOGOUT
     ───────────────────────────────────────────── */
  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore error (logout should always succeed locally)
    } finally {
      setUser(null);
      toast.success("Logged out");
    }
  }, []);

  /* ─────────────────────────────────────────────
     CONTEXT VALUE
     ───────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
      isAuthLoading, //  exposed
    }),
    [user, isLoading, login, register, logout, refreshUser, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
