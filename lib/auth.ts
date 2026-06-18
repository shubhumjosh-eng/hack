'use client';

import { createClient } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberCount: number;
  plan: 'free' | 'pro' | 'enterprise';
}

export type Permission = 'predict' | 'triage' | 'analytics' | 'settings' | 'manage_team' | 'manage_api' | 'export' | 'import' | 'schedule' | 'webhooks';

export const ROLE_PERMISSIONS: Record<User['role'], Permission[]> = {
  admin: ['predict', 'triage', 'analytics', 'settings', 'manage_team', 'manage_api', 'export', 'import', 'schedule', 'webhooks'],
  editor: ['predict', 'triage', 'analytics', 'export', 'import', 'schedule'],
  viewer: ['analytics'],
};

export const MOCK_TEAMS: Team[] = [
  { id: 'team-1', name: 'Demo Secondary School', slug: 'demo-school', createdAt: '2025-09-01T00:00:00Z', memberCount: 12, plan: 'pro' },
  { id: 'team-2', name: 'Partner School District', slug: 'partner-district', createdAt: '2025-10-15T00:00:00Z', memberCount: 8, plan: 'free' },
  { id: 'team-3', name: 'Enterprise School Group', slug: 'enterprise-group', createdAt: '2026-01-10T00:00:00Z', memberCount: 24, plan: 'enterprise' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'admin@demo.edu.hk', name: 'Ms. Wong, Cafeteria Manager', role: 'admin', teamId: 'team-1' },
  { id: 'user-2', email: 'editor@demo.edu.hk', name: 'Mr. Chen, Sustainability', role: 'editor', teamId: 'team-1' },
  { id: 'user-3', email: 'viewer@demo.edu.hk', name: 'Lisa, Eco-Club Student', role: 'viewer', teamId: 'team-2' },
  { id: 'user-4', email: 'admin@partner.edu.hk', name: 'Dr. Patel, Partner Admin', role: 'admin', teamId: 'team-3' },
];

export const REGISTERED_USERS_KEY = 'ecoos-registered-users';

export function getRegisteredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
  } catch { return []; }
}

export function registerUser(email: string, name: string, password: string): User {
  const users = getRegisteredUsers();
  const existing = [...MOCK_USERS, ...users].find(u => u.email === email);
  if (existing) throw new Error('Email already registered');

  const newUser: User = {
    id: `user-reg-${Date.now()}`,
    email,
    name,
    role: 'editor',
    teamId: 'team-1',
  };

  users.push(newUser);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  localStorage.setItem('ecoos-password-' + email, btoa(password));
  return newUser;
}

export function findUserByEmail(email: string): User | undefined {
  const registered = getRegisteredUsers();
  return [...MOCK_USERS, ...registered].find(u => u.email === email);
}

export function checkPassword(email: string, password: string): boolean {
  try {
    const stored = localStorage.getItem('ecoos-password-' + email);
    return stored === btoa(password);
  } catch { return false; }
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

export function getTeamById(teamId: string): Team | undefined {
  return MOCK_TEAMS.find(t => t.id === teamId);
}

export async function logAuthError(email: string, action: string, errorMessage: string) {
  try {
    await fetch('/api/auth/error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action, errorMessage, userAgent: navigator.userAgent }),
    });
  } catch {}
}

export async function supabaseSignUp(email: string, password: string, name: string, teamId?: string): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, teamId: teamId || 'team-1' } },
  });
  if (error) {
    await logAuthError(email, 'signup', error.message);
    return { error: error.message };
  }
  if (!data.user) {
    return { error: 'Signup failed: no user returned' };
  }
  const sbId = data.user.id;
  const existing = findUserByEmail(email);
  const targetTeamId = teamId || 'team-1';
  if (!existing) {
    const users = getRegisteredUsers();
    const newUser: User = {
      id: sbId,
      email,
      name,
      role: 'editor',
      teamId: targetTeamId,
    };
    const isFirst = users.length === 0;
    newUser.role = isFirst ? 'admin' : 'editor';
    users.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
  return {};
}

export async function supabaseSignIn(email: string, password: string): Promise<{ error?: string; user?: User }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    await logAuthError(email, 'login', error.message);
    return { error: error.message };
  }
  if (!data.user) {
    return { error: 'Login failed: no user returned' };
  }

  const found = findUserByEmail(email);
  if (found) {
    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1 && users[idx].id !== data.user.id) {
      users[idx].id = data.user.id;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }
    return { user: { ...found, id: data.user.id } };
  }

  const metaName = data.user.user_metadata?.name || email.split('@')[0];
  const users = getRegisteredUsers();
  const isFirst = users.length === 0;
  const newUser: User = {
    id: data.user.id,
    email,
    name: metaName,
    role: isFirst ? 'admin' : 'editor',
    teamId: 'team-1',
  };
  users.push(newUser);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  return { user: newUser };
}

export async function supabaseSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  localStorage.removeItem('ecoos-auth');
}
