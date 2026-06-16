'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User, MOCK_USERS, getTeamById, type Team } from '@/lib/auth';

interface AuthContextValue {
  user: User | null;
  team: Team | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchTeam: (teamId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = 'ecoos-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { userId: string; teamId: string };
        const found = MOCK_USERS.find(u => u.id === parsed.userId);
        if (found) {
          setUser(found);
          setTeam(getTeamById(parsed.teamId) ?? null);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) { setLoading(false); return false; }
    setUser(found);
    const t = getTeamById(found.teamId) ?? null;
    setTeam(t);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: found.id, teamId: found.teamId }));
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTeam(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const switchTeam = useCallback((teamId: string) => {
    if (!user) return;
    const t = getTeamById(teamId);
    if (t) {
      setTeam(t);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id, teamId }));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, team, loading, login, logout, switchTeam, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
