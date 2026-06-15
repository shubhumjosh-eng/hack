'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={cn('inline-flex', className)}>
      {'•'.repeat(dots)}
      {' '.repeat(3 - dots)}
    </span>
  );
}
