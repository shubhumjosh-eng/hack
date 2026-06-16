'use client';

import { useEffect } from 'react';
import { getTheme, applyThemeColors } from '@/lib/themes';

export function ThemeInit() {
  useEffect(() => {
    const theme = getTheme();
    applyThemeColors(theme.id);
  }, []);
  return null;
}
