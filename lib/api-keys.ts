export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  permissions: ('read' | 'write' | 'admin')[];
  rateLimit: number;
  enabled: boolean;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  createdAt: string;
  lastDelivery: string | null;
  lastStatus: number | null;
  enabled: boolean;
  retryCount: number;
}

export type WebhookEvent = 'prediction.completed' | 'triage.completed' | 'threshold.breached' | 'schedule.triggered' | 'import.completed';

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: 'prediction.completed', label: 'Prediction Completed' },
  { value: 'triage.completed', label: 'Triage Completed' },
  { value: 'threshold.breached', label: 'Threshold Breached' },
  { value: 'schedule.triggered', label: 'Schedule Triggered' },
  { value: 'import.completed', label: 'Import Completed' },
];

const KEYS_STORAGE_KEY = 'ecoos-api-keys';
const WEBHOOKS_STORAGE_KEY = 'ecoos-webhooks';

function generateKey(): string {
  const prefix = 'eco';
  const random = Array.from({ length: 48 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
  return `${prefix}_${random}`;
}

export function getApiKeys(): ApiKey[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS_STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function createApiKey(name: string, permissions: ApiKey['permissions']): ApiKey {
  const keys = getApiKeys();
  const key: ApiKey = {
    id: `key-${Date.now()}`,
    name,
    key: generateKey(),
    prefix: 'eco_' + Math.random().toString(36).substring(2, 8),
    createdAt: new Date().toISOString(),
    lastUsed: null,
    expiresAt: null,
    permissions,
    rateLimit: 100,
    enabled: true,
  };
  keys.unshift(key);
  localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys.slice(0, 20)));
  return key;
}

export function deleteApiKey(id: string): void {
  const keys = getApiKeys().filter(k => k.id !== id);
  localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
}

export function toggleApiKey(id: string): void {
  const keys = getApiKeys();
  const k = keys.find(k => k.id === id);
  if (k) { k.enabled = !k.enabled; localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys)); }
}

export function getWebhooks(): Webhook[] {
  try {
    return JSON.parse(localStorage.getItem(WEBHOOKS_STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function createWebhook(name: string, url: string, events: WebhookEvent[]): Webhook {
  const wh: Webhook = {
    id: `wh-${Date.now()}`,
    name,
    url,
    events,
    secret: Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join(''),
    createdAt: new Date().toISOString(),
    lastDelivery: null,
    lastStatus: null,
    enabled: true,
    retryCount: 3,
  };
  const webhooks = getWebhooks();
  webhooks.unshift(wh);
  localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooks.slice(0, 10)));
  return wh;
}

export function deleteWebhook(id: string): void {
  const webhooks = getWebhooks().filter(w => w.id !== id);
  localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooks));
}

export function toggleWebhook(id: string): void {
  const webhooks = getWebhooks();
  const w = webhooks.find(w => w.id === id);
  if (w) { w.enabled = !w.enabled; localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooks)); }
}

export const API_ENDPOINTS = [
  { method: 'POST', path: '/api/predict', desc: 'Run waste prediction', body: '{ "dayOfWeek": "...", "scheduledMenu": "...", "expectedAttendance": 300, "weatherCondition": "...", "temperature": 72 }' },
  { method: 'POST', path: '/api/triage', desc: 'Analyze environmental text', body: '{ "text": "..." }' },
  { method: 'GET', path: '/api/predict', desc: 'API metadata and schema' },
  { method: 'GET', path: '/api/triage', desc: 'API metadata and schema' },
  { method: 'POST', path: '/api/validate-key', desc: 'Validate HF API key', body: '{ "key": "hf_..." }' },
];
