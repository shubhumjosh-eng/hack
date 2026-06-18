'use client';

import { useTypewriter } from '@/hooks/use-typewriter';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 20, className = '', onComplete }: TypewriterTextProps) {
  const { displayed, isComplete } = useTypewriter({ text, speed, onComplete });

  return (
    <span className={className}>
      {displayed}
      {!isComplete && <span className="animate-blink text-emerald-500">_</span>}
    </span>
  );
}
