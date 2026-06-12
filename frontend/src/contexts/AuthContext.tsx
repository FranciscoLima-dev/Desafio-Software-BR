import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type LoginPayload, type RegisterPayload } from "../services/auth.service";
import type { AuthSession, AuthUser } from "../types/auth";
import {
  getStoredAuthSession,
  removeStoredAuthSession,
  setStoredAuthSession,
} from "../utils/auth-storage";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setSession(getStoredAuthSession());
    setIsInitializing(false);
  }, []);

  const clearSession = useCallback(() => {
    removeStoredAuthSession();
    setSession(null);
  }, []);

  useEffect(() => {
    window.addEventListener("auth:unauthorized", clearSession);

    return () => {
      window.removeEventListener("auth:unauthorized", clearSession);
    };
  }, [clearSession]);

  const persistSession = useCallback((nextSession: AuthSession) => {
    setStoredAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const nextSession = await authService.login(payload);
      persistSession(nextSession);
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const nextSession = await authService.register(payload);
      persistSession(nextSession);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      if (session?.token) {
        await authService.logout();
      }
    } finally {
      clearSession();
    }
  }, [clearSession, session?.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isInitializing,
      login,
      register,
      logout,
    }),
    [isInitializing, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
};

