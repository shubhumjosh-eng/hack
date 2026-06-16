'use client';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

import { useTypewriter } from '@/hooks/use-typewriter';

export function TypewriterText({ text, speed = 20, className = '' }: TypewriterTextProps) {
  const { displayed, isComplete } = useTypewriter({ text, speed });

  return (
    <span className={className}>
      {displayed}
      {!isComplete && <span className="animate-blink text-emerald-500">_</span>}
    </span>
  );
}
