const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const ON_HANDLER_RE = /\bon\w+\s*=\s*['"][^'"]*['"]/gi;
const JAVASCRIPT_URL_RE = /javascript\s*:\s*/gi;
const HTML_TAG_RE = /<[^>]*>/g;

export function sanitizeString(input: string, maxLength: number = 1000): string {
  let s = String(input ?? '').trim();
  s = s.replace(SCRIPT_TAG_RE, '');
  s = s.replace(ON_HANDLER_RE, '');
  s = s.replace(JAVASCRIPT_URL_RE, '');
  s = s.slice(0, maxLength);
  return s;
}

export function sanitizeHtml(input: string, maxLength: number = 1000): string {
  let s = sanitizeString(input, maxLength);
  s = s.replace(HTML_TAG_RE, '');
  return s;
}

export function validateAttendance(val: unknown): { value: number; error?: string } {
  const n = Number(val);
  if (!Number.isFinite(n) || n < 1) return { value: 0, error: 'expectedAttendance must be a positive number' };
  if (n > 5000) return { value: 0, error: 'expectedAttendance must be 5000 or less' };
  if (!Number.isInteger(n)) return { value: Math.round(n) };
  return { value: n };
}

export function validateTemperature(val: unknown): { value: number; error?: string } {
  if (val == null) return { value: 70 };
  const n = Number(val);
  if (!Number.isFinite(n)) return { value: 0, error: 'temperature must be a number' };
  if (n < -50 || n > 150) return { value: 0, error: 'temperature must be between -50°F and 150°F' };
  return { value: n };
}

export const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const VALID_WEATHER = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Hot', 'Cold', 'Mild', 'Windy'] as const;

export function validateDayOfWeek(val: unknown): { value: string; error?: string } {
  const s = String(val ?? '');
  if (!VALID_DAYS.includes(s as any)) {
    return { value: '', error: `dayOfWeek must be one of: ${VALID_DAYS.join(', ')}` };
  }
  return { value: s };
}

export function validateWeather(val: unknown): { value: string; error?: string } {
  const s = String(val ?? '');
  const normalized = VALID_WEATHER.find(w => w.toLowerCase() === s.toLowerCase());
  if (normalized) return { value: normalized };
  return { value: '', error: `weatherCondition must be one of: ${VALID_WEATHER.join(', ')}` };
}

export function sanitizePredictionInput(body: Record<string, unknown>): {
  data?: { dayOfWeek: string; scheduledMenu: string; expectedAttendance: number; weatherCondition: string; temperature: number };
  errors?: string[];
} {
  const errors: string[] = [];
  const dayResult = validateDayOfWeek(body.dayOfWeek);
  if (dayResult.error) errors.push(dayResult.error);
  const menu = sanitizeHtml(String(body.scheduledMenu ?? ''), 500);
  if (!menu) errors.push('scheduledMenu is required');
  const attResult = validateAttendance(body.expectedAttendance);
  if (attResult.error) errors.push(attResult.error);
  const weatherResult = validateWeather(body.weatherCondition);
  if (weatherResult.error) errors.push(weatherResult.error);
  const tempResult = validateTemperature(body.temperature);
  if (tempResult.error) errors.push(tempResult.error);
  if (errors.length > 0) return { errors };
  return {
    data: {
      dayOfWeek: dayResult.value,
      scheduledMenu: menu,
      expectedAttendance: attResult.value,
      weatherCondition: weatherResult.value,
      temperature: tempResult.value,
    },
  };
}
