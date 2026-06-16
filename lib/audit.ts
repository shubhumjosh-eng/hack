const auditLog: AuditEntry[] = [];
const MAX_LOG = 500;

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
}

export function pushAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
  auditLog.unshift({
    ...entry,
    id: Math.random().toString(36).slice(2, 10),
    timestamp: new Date().toISOString(),
  });
  if (auditLog.length > MAX_LOG) auditLog.length = MAX_LOG;
}

export function getAuditLog(): AuditEntry[] {
  return [...auditLog];
}
