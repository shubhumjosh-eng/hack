export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  accent: string;
  accentLight: string;
  accentDark: string;
  bg: string;
  bgLight: string;
  border: string;
  text: string;
  textDim: string;
  textMuted: string;
  green: string;
  red: string;
  yellow: string;
  blue: string;
  scanlines: string;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'emerald',
    name: 'Emerald Terminal',
    description: 'Classic green phosphor terminal aesthetic',
    colors: {
      accent: '#34d399',
      accentLight: '#6ee7b7',
      accentDark: '#047857',
      bg: '#030712',
      bgLight: '#111827',
      border: '#065f4640',
      text: '#34d399',
      textDim: '#a7f3d0',
      textMuted: '#065f46',
      green: '#34d399',
      red: '#f87171',
      yellow: '#fbbf24',
      blue: '#60a5fa',
      scanlines: 'rgba(0,0,0,0.03)',
    },
  },
  {
    id: 'amber',
    name: 'Amber CRT',
    description: 'Warm amber monochrome CRT terminal',
    colors: {
      accent: '#f59e0b',
      accentLight: '#fbbf24',
      accentDark: '#92400e',
      bg: '#0c0a00',
      bgLight: '#1c1917',
      border: '#92400e40',
      text: '#f59e0b',
      textDim: '#fde68a',
      textMuted: '#92400e',
      green: '#f59e0b',
      red: '#fca5a5',
      yellow: '#fcd34d',
      blue: '#93c5fd',
      scanlines: 'rgba(245,158,11,0.03)',
    },
  },
  {
    id: 'blue',
    name: 'Blue Ice',
    description: 'Cool blue phosphorus display',
    colors: {
      accent: '#60a5fa',
      accentLight: '#93c5fd',
      accentDark: '#1e40af',
      bg: '#030712',
      bgLight: '#0f172a',
      border: '#1e40af40',
      text: '#60a5fa',
      textDim: '#bfdbfe',
      textMuted: '#1e40af',
      green: '#60a5fa',
      red: '#fca5a5',
      yellow: '#fde68a',
      blue: '#60a5fa',
      scanlines: 'rgba(96,165,250,0.03)',
    },
  },
  {
    id: 'red',
    name: 'Red Alert',
    description: 'High-contrast red-on-black for night use',
    colors: {
      accent: '#f87171',
      accentLight: '#fca5a5',
      accentDark: '#991b1b',
      bg: '#0a0000',
      bgLight: '#1c1010',
      border: '#991b1b40',
      text: '#f87171',
      textDim: '#fecaca',
      textMuted: '#991b1b',
      green: '#f87171',
      red: '#f87171',
      yellow: '#fbbf24',
      blue: '#93c5fd',
      scanlines: 'rgba(248,113,113,0.03)',
    },
  },
  {
    id: 'retro',
    name: 'Retro CRT',
    description: 'Classic IBM 5151 green-on-black with scanlines',
    colors: {
      accent: '#33ff33',
      accentLight: '#66ff66',
      accentDark: '#006600',
      bg: '#000000',
      bgLight: '#0a0a0a',
      border: '#33ff3320',
      text: '#33ff33',
      textDim: '#99ff99',
      textMuted: '#006600',
      green: '#33ff33',
      red: '#ff3333',
      yellow: '#ffff33',
      blue: '#33ffff',
      scanlines: 'rgba(0,255,0,0.05)',
    },
  },
  {
    id: 'highcontrast',
    name: 'High Contrast',
    description: 'WCAG AAA accessible high-contrast theme',
    colors: {
      accent: '#ffffff',
      accentLight: '#ffffff',
      accentDark: '#cccccc',
      bg: '#000000',
      bgLight: '#1a1a1a',
      border: '#ffffff40',
      text: '#ffffff',
      textDim: '#e0e0e0',
      textMuted: '#999999',
      green: '#ffffff',
      red: '#ff6666',
      yellow: '#ffff66',
      blue: '#66b3ff',
      scanlines: 'rgba(255,255,255,0.02)',
    },
  },
];

const THEME_KEY = 'ecoos-theme';

export function getTheme(): ThemeDefinition {
  try {
    const id = localStorage.getItem(THEME_KEY);
    return THEMES.find(t => t.id === id) ?? THEMES[0];
  } catch { return THEMES[0]; }
}

export function setTheme(id: string): void {
  localStorage.setItem(THEME_KEY, id);
  applyThemeColors(id);
}

export function applyThemeColors(id: string): void {
  const theme = THEMES.find(t => t.id === id) ?? THEMES[0];
  const c = theme.colors;
  const root = document.documentElement;
  root.style.setProperty('--theme-accent', c.accent);
  root.style.setProperty('--theme-accent-light', c.accentLight);
  root.style.setProperty('--theme-accent-dark', c.accentDark);
  root.style.setProperty('--theme-bg', c.bg);
  root.style.setProperty('--theme-bg-light', c.bgLight);
  root.style.setProperty('--theme-border', c.border);
  root.style.setProperty('--theme-text', c.text);
  root.style.setProperty('--theme-text-dim', c.textDim);
  root.style.setProperty('--theme-text-muted', c.textMuted);
  root.style.setProperty('--theme-scanlines', c.scanlines);
}
