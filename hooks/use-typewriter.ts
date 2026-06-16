'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function useTypewriter({ text, speed = 20, delay = 0, onComplete }: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const idxRef = useRef(0);
  const calledRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (idxRef.current >= text.length) {
      if (onComplete && !calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(prev => prev + text[idxRef.current]);
      idxRef.current += 1;
    }, speed);
    return () => clearTimeout(timer);
  }, [started, text, speed, onComplete]);

  return { displayed, isComplete: idxRef.current >= text.length };
}
