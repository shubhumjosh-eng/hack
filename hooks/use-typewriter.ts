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
  const textRef = useRef(text);
  const speedRef = useRef(speed);

  textRef.current = text;
  speedRef.current = speed;

  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    idxRef.current = 0;
    setDisplayed('');
    calledRef.current = false;

    const interval = setInterval(() => {
      const t = textRef.current;
      if (idxRef.current >= t.length) {
        clearInterval(interval);
        if (completeRef.current && !calledRef.current) {
          calledRef.current = true;
          completeRef.current();
        }
        return;
      }
      setDisplayed(t.slice(0, idxRef.current + 1));
      idxRef.current += 1;
    }, speedRef.current);

    return () => clearInterval(interval);
  }, [started, text]);

  return { displayed, isComplete: idxRef.current >= textRef.current.length };
}
