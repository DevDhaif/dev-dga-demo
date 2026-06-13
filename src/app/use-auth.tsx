/* eslint-disable react-refresh/only-export-components -- context module: AuthProvider + useAuth hook intentionally co-located */
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const USERNAME = 'admin';
const PASSWORD = 'password';
const KEY = 'masar.auth';

interface AuthValue {
  authed: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children, initial }: { children: ReactNode; initial?: boolean }) {
  const [authed, setAuthed] = useState<boolean>(() => {
    if (initial !== undefined) return initial;
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });

  const login = useCallback((username: string, password: string) => {
    const ok = username === USERNAME && password === PASSWORD;
    if (ok) {
      setAuthed(true);
      localStorage.setItem(KEY, '1');
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    localStorage.removeItem(KEY);
  }, []);

  return <AuthContext.Provider value={{ authed, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
