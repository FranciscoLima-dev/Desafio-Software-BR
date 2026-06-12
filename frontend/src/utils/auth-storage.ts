import type { AuthSession } from "../types/auth";

const AUTH_STORAGE_KEY = "task-manager:auth";

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<AuthSession>;

  return (
    typeof session.token === "string" &&
    typeof session.user?.id === "string" &&
    typeof session.user.name === "string" &&
    typeof session.user.email === "string"
  );
};

export const getStoredAuthSession = (): AuthSession | null => {
  const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession) as unknown;

    if (!isAuthSession(parsedSession)) {
      removeStoredAuthSession();
      return null;
    }

    return parsedSession;
  } catch {
    removeStoredAuthSession();
    return null;
  }
};

export const setStoredAuthSession = (session: AuthSession): void => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const removeStoredAuthSession = (): void => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

