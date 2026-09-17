"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, Role } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";

// Customers work on phones and must survive reloads, so the token is persisted to
// localStorage. The token expiry limits exposure; a 401 from any call triggers logout.
const STORAGE_KEY = "fieldops-portal.auth";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: "idle" | "authenticated" | "unauthenticated";
}

interface AuthContextValue extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_ROLES: Role[] = ["CUSTOMER_ADMIN"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null, status: "idle" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
        if (parsed?.token && parsed?.user) {
          setState({ token: parsed.token, user: parsed.user, status: "authenticated" });
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setState((s) => ({ ...s, status: "unauthenticated" }));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: { identifier, password },
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
    } catch {
      /* ignore */
    }
    setState({ token: res.token, user: res.user, status: "authenticated" });
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState({ token: null, user: null, status: "unauthenticated" });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      isAdmin: state.user ? ADMIN_ROLES.includes(state.user.role) : false,
    }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
