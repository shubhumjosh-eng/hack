const invites = new Map<string, { code: string; teamId: string; createdBy: string; used: boolean; expiresAt: number }>();
const CODE_LENGTH = 12;

export function generateInviteCode(teamId: string, createdBy: string): string {
  const code = Array.from({ length: CODE_LENGTH }, () =>
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.charAt(Math.floor(Math.random() * 32))
  ).join('');
  invites.set(code, {
    code,
    teamId,
    createdBy,
    used: false,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return code;
}

export function validateInviteCode(code: string): { valid: boolean; teamId?: string } {
  const invite = invites.get(code.toUpperCase());
  if (!invite) return { valid: false };
  if (invite.used) return { valid: false };
  if (Date.now() > invite.expiresAt) return { valid: false };
  return { valid: true, teamId: invite.teamId };
}

export function markInviteUsed(code: string) {
  const invite = invites.get(code.toUpperCase());
  if (invite) invite.used = true;
}

export function getInvitesByUser(userEmail: string) {
  return Array.from(invites.values())
    .filter(i => i.createdBy === userEmail)
    .map(i => ({ code: i.code, teamId: i.teamId, used: i.used, expiresAt: i.expiresAt }));
}
