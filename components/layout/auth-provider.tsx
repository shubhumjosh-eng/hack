'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User, MOCK_USERS, getTeamById, findUserByEmail, checkPassword, getRegisteredUsers, REGISTERED_USERS_KEY, supabaseSignIn, supabaseSignOut, supabaseSignUp, logAuthError, type Team } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  team: Team | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<string | null>;
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
    async function init() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const email = session.user.email!;
          const found = findUserByEmail(email) || MOCK_USERS.find(u => u.email === email);
          if (found) {
            const merged = { ...found, id: session.user.id };
            setUser(merged);
            setTeam(getTeamById(found.teamId) ?? null);
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { userId: string; teamId: string };
          const allUsers = [...MOCK_USERS, ...getRegisteredUsers()];
          const found = allUsers.find(u => u.id === parsed.userId);
          if (found) {
            setUser(found);
            setTeam(getTeamById(parsed.teamId) ?? null);
          }
        }
      } catch {}

      setLoading(false);
    }

    init();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setTeam(null);
        localStorage.removeItem(AUTH_KEY);
      } else if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email!;
        const mockUser = MOCK_USERS.find(u => u.email === email);
        const found = findUserByEmail(email) || mockUser;
        if (found) {
          const merged = { ...found, id: session.user.id };
          setUser(merged);
          setTeam(getTeamById(found.teamId) ?? null);
          localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: merged.id, teamId: found.teamId }));
        } else {
          const users = getRegisteredUsers();
          const metaName = session.user.user_metadata?.name || email.split('@')[0];
          const isFirst = users.length === 0;
          const newUser: User = {
            id: session.user.id,
            email,
            name: metaName,
            role: isFirst ? 'admin' : 'editor',
            teamId: 'team-1',
          };
          users.push(newUser);
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
          setUser(newUser);
          setTeam(getTeamById('team-1') ?? null);
          localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: newUser.id, teamId: 'team-1' }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser) {
      setUser(mockUser);
      const t = getTeamById(mockUser.teamId) ?? null;
      setTeam(t);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: mockUser.id, teamId: mockUser.teamId }));
      setLoading(false);
      return true;
    }

    const result = await supabaseSignIn(email, password);
    if (result.error) {
      const found = findUserByEmail(email);
      if (found && checkPassword(email, password)) {
        setUser(found);
        const t = getTeamById(found.teamId) ?? null;
        setTeam(t);
        localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: found.id, teamId: found.teamId }));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    }

    if (result.user) {
      setUser(result.user);
      const t = getTeamById(result.user.teamId) ?? null;
      setTeam(t);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: result.user.id, teamId: result.user.teamId }));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<string | null> => {
    const existing = [...MOCK_USERS, ...getRegisteredUsers()].find(u => u.email === email);
    if (existing) return 'Email already registered';

    const result = await supabaseSignUp(email, password, name);
    if (result.error) return result.error;

    const loginOk = await login(email, password);
    if (!loginOk) return 'Account created but auto-login failed. Please sign in.';

    return null;
  }, [login]);

  const logout = useCallback(async () => {
    setUser(null);
    setTeam(null);
    localStorage.removeItem(AUTH_KEY);
    try {
      await supabaseSignOut();
    } catch {}
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
    <AuthContext.Provider value={{ user, team, loading, login, signup, logout, switchTeam, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
