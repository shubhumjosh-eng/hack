export interface ScheduledAudit {
  id: string;
  name: string;
  description: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'custom';
  cronExpression: string;
  inputTemplate: {
    dayOfWeek: string;
    scheduledMenu: string;
    expectedAttendance: number;
    weatherCondition: string;
    temperature: number;
  };
  enabled: boolean;
  createdAt: string;
  lastRun: string | null;
  nextRun: string | null;
  notificationChannels: ('email' | 'slack' | 'webhook')[];
  notificationTargets: string[];
}

export interface ThresholdAlert {
  id: string;
  name: string;
  metric: 'predictedWasteKg' | 'wastePerAttendee' | 'annualProjection' | 'cost';
  condition: 'above' | 'below';
  value: number;
  enabled: boolean;
  cooldownMinutes: number;
  lastTriggered: string | null;
  notificationChannels: ('email' | 'slack' | 'webhook')[];
}

const SCHEDULES_KEY = 'ecoos-schedules';
const THRESHOLDS_KEY = 'ecoos-thresholds';

export function getSchedules(): ScheduledAudit[] {
  try { return JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '[]'); }
  catch { return []; }
}

export function createSchedule(data: Omit<ScheduledAudit, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>): ScheduledAudit {
  const schedules = getSchedules();
  const s: ScheduledAudit = { ...data, id: `sched-${Date.now()}`, createdAt: new Date().toISOString(), lastRun: null, nextRun: null };
  schedules.unshift(s);
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules.slice(0, 20)));
  return s;
}

export function toggleSchedule(id: string): void {
  const schedules = getSchedules();
  const s = schedules.find(s => s.id === id);
  if (s) { s.enabled = !s.enabled; localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules)); }
}

export function deleteSchedule(id: string): void {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(getSchedules().filter(s => s.id !== id)));
}

export function getThresholds(): ThresholdAlert[] {
  try { return JSON.parse(localStorage.getItem(THRESHOLDS_KEY) || '[]'); }
  catch { return []; }
}

export function createThreshold(data: Omit<ThresholdAlert, 'id' | 'lastTriggered'>): ThresholdAlert {
  const thresholds = getThresholds();
  const t: ThresholdAlert = { ...data, id: `thresh-${Date.now()}`, lastTriggered: null };
  thresholds.unshift(t);
  localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds.slice(0, 20)));
  return t;
}

export function toggleThreshold(id: string): void {
  const thresholds = getThresholds();
  const t = thresholds.find(t => t.id === id);
  if (t) { t.enabled = !t.enabled; localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds)); }
}

export function deleteThreshold(id: string): void {
  localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(getThresholds().filter(t => t.id !== id)));
}

export function computeNextCronRun(cron: string): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}
