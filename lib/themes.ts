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

const STYLE_ID = 'ecoos-theme-override';

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
  root.style.setProperty('--theme-green', c.green);
  root.style.setProperty('--theme-red', c.red);
  root.style.setProperty('--theme-yellow', c.yellow);
  root.style.setProperty('--theme-blue', c.blue);

  const old = document.getElementById(STYLE_ID);
  if (old) old.remove();

  const style = document.createElement('style');
  style.id = STYLE_ID;

  const hexToRgb = (hex: string) => {
    const v = parseInt(hex.replace('#', ''), 16);
    return `${(v >> 16) & 255} ${(v >> 8) & 255} ${v & 255}`;
  };

  const a = c.accent;
  const al = c.accentLight;
  const ad = c.accentDark;
  const bg = c.bg;
  const bgl = c.bgLight;
  const bo = c.border;
  const tx = c.text;
  const td = c.textDim;
  const tm = c.textMuted;
  const gn = c.green;
  const rd = c.red;
  const yw = c.yellow;
  const bl = c.blue;
  const sc = c.scanlines;

  const ar = hexToRgb(a);
  const alr = hexToRgb(al);
  const adr = hexToRgb(ad);
  const txr = hexToRgb(tx);
  const tdr = hexToRgb(td);
  const tmr = hexToRgb(tm);
  const gnr = hexToRgb(gn);
  const rdr = hexToRgb(rd);
  const ywr = hexToRgb(yw);
  const blr = hexToRgb(bl);

  // prettier-ignore
  style.textContent = [
    `body { background: ${bg} !important; color: ${tx} !important; }`,
    `.bg-gray-950, .bg-gray-950\\/80 { background: ${bg} !important; }`,
    `.bg-gray-900, .bg-gray-900\\/50, .bg-gray-900\\/30, .bg-gray-900\\/80, .bg-gray-900\\/60 { background: ${bgl} !important; }`,
    `.bg-black { background: ${bg} !important; }`,
    `.from-gray-950 { --tw-gradient-from: ${bg} !important; }`,
    `.to-gray-950 { --tw-gradient-to: ${bg} !important; }`,
    `.from-emerald-900\\/50 { --tw-gradient-from: ${adr} / 0.5 !important; }`,
    `.to-emerald-950 { --tw-gradient-to: ${adr} / 0.95 !important; }`,
    `.to-emerald-950\\/80 { --tw-gradient-to: ${adr} / 0.8 !important; }`,

    // text colors
    `.text-emerald-50, .text-emerald-100, .text-emerald-200 { color: ${tx} !important; }`,
    `.text-emerald-300, .text-emerald-400 { color: ${a} !important; }`,
    `.text-emerald-500 { color: ${al} !important; }`,
    `.text-emerald-600, .text-emerald-700, .text-emerald-800, .text-emerald-950 { color: ${td} !important; }`,
    `.placeholder-emerald-700\\/50::placeholder { color: ${tm}80 !important; }`,
    `.text-emerald-300\\/80 { color: ${ar} / 0.8 !important; }`,
    `.text-emerald-400\\/60, .text-emerald-400\\/50 { color: ${ar} / 0.6 !important; }`,
    `.text-emerald-500\\/70, .text-emerald-500\\/50, .text-emerald-500\\/40 { color: ${alr} / 0.5 !important; }`,
    `.text-emerald-600\\/70 { color: ${tdr} / 0.7 !important; }`,
    `.text-emerald-700\\/50, .text-emerald-700\\/40, .text-emerald-700\\/30 { color: ${tdr} / 0.4 !important; }`,
    `.text-emerald-800\\/40, .text-emerald-800\\/30 { color: ${tdr} / 0.3 !important; }`,
    `a:hover .text-emerald-300, a:hover.text-emerald-300, .group:hover .text-emerald-300 { color: ${a} !important; }`,

    // border colors
    `.border-emerald-950\\/80, .border-emerald-950\\/20 { border-color: ${adr} / 0.8 !important; }`,
    `.border-emerald-800\\/20, .border-emerald-800\\/25, .border-emerald-800\\/30, .border-emerald-800\\/40, .border-emerald-800\\/50 { border-color: ${bo} !important; }`,
    `.border-emerald-800\\/10 { border-color: ${adr} / 0.1 !important; }`,
    `.border-emerald-700\\/40, .border-emerald-700\\/50, .border-emerald-700\\/60, .border-emerald-700\\/30 { border-color: ${bo} !important; }`,
    `.border-emerald-700\\/20 { border-color: ${adr} / 0.2 !important; }`,
    `.border-emerald-600\\/40, .border-emerald-600\\/30 { border-color: ${a}66 !important; }`,
    `.border-emerald-500\\/50, .border-emerald-500\\/60 { border-color: ${a} !important; }`,
    `.border-emerald-400\\/20 { border-color: ${ar} / 0.2 !important; }`,
    `* { border-color: ${bo} !important; }`,

    // bg variants
    `.bg-emerald-950, .bg-emerald-950\\/50 { background: ${adr} / 0.5 !important; }`,
    `.bg-emerald-900\\/20, .bg-emerald-900\\/30 { background: ${adr} / 0.2 !important; }`,
    `.bg-emerald-900\\/40 { background: ${adr} / 0.4 !important; }`,
    `.bg-emerald-900\\/15 { background: ${tmr} / 0.15 !important; }`,
    `.bg-emerald-800\\/20 { background: ${adr} / 0.2 !important; }`,
    `.bg-emerald-800\\/30 { background: ${adr} / 0.3 !important; }`,
    `.bg-emerald-700\\/20, .bg-emerald-700\\/30 { background: ${adr} / 0.3 !important; }`,
    `.bg-emerald-600\\/20, .bg-emerald-600\\/30 { background: ${adr} / 0.4 !important; }`,
    `.bg-emerald-500\\/10 { background: ${ar} / 0.1 !important; }`,
    `.bg-red-900\\/30 { background: ${rdr} / 0.3 !important; }`,
    `.bg-amber-900\\/30 { background: ${ywr} / 0.3 !important; }`,
    `.hover\\:bg-emerald-900\\/20:hover { background: ${adr} / 0.2 !important; }`,
    `.hover\\:bg-emerald-700\\/20:hover, .hover\\:bg-emerald-700\\/30:hover { background: ${adr} / 0.3 !important; }`,
    `.hover\\:bg-emerald-700\\/40:hover { background: ${adr} / 0.4 !important; }`,
    `.hover\\:bg-gray-800\\/50:hover { background: ${bgl} !important; }`,
    `.hover\\:fill-emerald-900\\/20:hover { fill: ${adr} / 0.2 !important; }`,

    // hover border
    `.hover\\:border-emerald-700\\/40:hover { border-color: ${a}66 !important; }`,
    `.hover\\:border-emerald-600\\/40:hover, .hover\\:border-emerald-600\\/60:hover { border-color: ${a} !important; }`,
    `.hover\\:border-emerald-500\\/60:hover { border-color: ${a} !important; }`,

    // custom terminal classes
    `.terminal-panel { background: ${bg} !important; border-color: ${bo} !important; box-shadow: 0 0 15px ${ar} / 0.05 !important; }`,
    `.terminal-header { background: ${bgl} !important; border-color: ${tmr} / 0.3 !important; color: ${td} !important; }`,
    `.terminal-content { color: ${td} !important; }`,
    `.terminal-input { background: ${bgl} !important; border-color: ${bo} !important; color: ${tx} !important; }`,
    `.terminal-input::placeholder { color: ${tm}80 !important; }`,
    `.terminal-input:focus { border-color: ${al}99 !important; box-shadow: 0 0 8px ${ar} / 0.1 !important; }`,
    `.terminal-select { background: ${bgl} !important; border-color: ${bo} !important; color: ${tx} !important; }`,
    `.terminal-select:focus { border-color: ${al}99 !important; box-shadow: 0 0 8px ${ar} / 0.1 !important; }`,
    `.terminal-btn { background: ${adr} / 0.2 !important; border-color: ${a}66 !important; color: ${tx} !important; }`,
    `.terminal-btn:hover { background: ${adr} / 0.3 !important; border-color: ${a} !important; box-shadow: 0 0 12px ${ar} / 0.15 !important; }`,
    `.terminal-btn-primary { background: ${adr} / 0.3 !important; border-color: ${a} !important; color: ${tx} !important; }`,
    `.terminal-btn-primary:hover { background: ${adr} / 0.4 !important; border-color: ${al}99 !important; }`,
    `.terminal-label { color: ${tdr} / 0.7 !important; }`,
    `.terminal-prompt { color: ${tdr} / 0.5 !important; }`,

    `.risk-info { background: ${adr} / 0.3 !important; color: ${a} !important; border-color: ${bo} !important; }`,
    `.risk-critical { border-color: ${rdr} / 0.4 !important; }`,
    `.risk-warning { border-color: ${ywr} / 0.4 !important; }`,

    `.glow-text { text-shadow: 0 0 10px ${ar} / 0.3, 0 0 20px ${ar} / 0.1 !important; }`,
    `.glow-border { box-shadow: 0 0 10px ${ar} / 0.05, inset 0 0 10px ${ar} / 0.02 !important; }`,

    `.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite !important; }`,
    `@keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 5px ${ar} / 0.1; } 50% { box-shadow: 0 0 15px ${ar} / 0.2; } }`,

    `.scanlines { background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${sc} 2px, ${sc} 4px) !important; }`,
    `.scanlines-overlay { background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${sc} 2px, ${sc} 4px) !important; }`,

    // scrollbar
    `::-webkit-scrollbar-thumb { background: ${adr} / 0.3 !important; }`,
    `::-webkit-scrollbar-thumb:hover { background: ${adr} / 0.4 !important; }`,

    // card components
    `.card, div\\[class\\*\\=\\'card\\'\\] { background: ${bg} !important; border-color: ${bo} !important; }`,

    // specific component overrides
    `.bg-emerald-900\\/80 { background: ${adr} / 0.8 !important; }`,
    `button:disabled { opacity: 0.4 !important; }`,
  ].join('\n');

  document.head.appendChild(style);
}
