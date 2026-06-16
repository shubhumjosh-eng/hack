const PREDICTIONS_KEY = 'ecoos-predictions';
const SETTINGS_KEY = 'ecoos-settings';

export interface SavedSettings {
  apiKey: string;
  model: string;
  notifications: { label: string; enabled: boolean }[];
}

export function getPredictions(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PREDICTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPrediction(prediction: any): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPredictions();
    existing.unshift(prediction);
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // storage full or unavailable
  }
}

export function getSettings(): SavedSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: SavedSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage full or unavailable
  }
}
