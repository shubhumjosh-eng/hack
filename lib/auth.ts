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
  { id: 'team-1', name: 'Green Valley Unified', slug: 'green-valley', createdAt: '2025-09-01T00:00:00Z', memberCount: 12, plan: 'pro' },
  { id: 'team-2', name: 'Coastal Prep Schools', slug: 'coastal-prep', createdAt: '2025-10-15T00:00:00Z', memberCount: 8, plan: 'free' },
  { id: 'team-3', name: 'Mercy Health System', slug: 'mercy-health', createdAt: '2026-01-10T00:00:00Z', memberCount: 24, plan: 'enterprise' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'admin@greenvalley.edu', name: 'Dr. Sarah Chen', role: 'admin', teamId: 'team-1' },
  { id: 'user-2', email: 'editor@greenvalley.edu', name: 'Mark Rivera', role: 'editor', teamId: 'team-1' },
  { id: 'user-3', email: 'viewer@coastalprep.org', name: 'Lisa Park', role: 'viewer', teamId: 'team-2' },
  { id: 'user-4', email: 'admin@mercyhealth.org', name: 'Dr. James Okafor', role: 'admin', teamId: 'team-3' },
];

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

export function getTeamById(teamId: string): Team | undefined {
  return MOCK_TEAMS.find(t => t.id === teamId);
}
