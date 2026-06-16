'use client';

import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const BOOT_MESSAGES = [
  { text: 'EcoOS Core v2.5.0 — INITIALIZING...', delay: 200, speed: 30 },
  { text: '> kernel: loading food_waste_predictor module', delay: 400, speed: 20 },
  { text: '> kernel: mounting Hugging Face inference bridge', delay: 600, speed: 20 },
  { text: '> kernel: loading Meta-Llama-3-8B-Instruct weights', delay: 900, speed: 25 },
  { text: '> kernel: establishing secure TLS tunnel to hf router', delay: 1200, speed: 20 },
  { text: '> kernel: calibrating waste prediction algorithms...', delay: 1600, speed: 30 },
  { text: '> kernel: loading few-shot examples (3/3)', delay: 2000, speed: 20 },
  { text: '> kernel: responsible AI guardrails — ENABLED', delay: 2400, speed: 25 },
  { text: '', delay: 2800, speed: 0 },
  { text: 'SYSTEM ONLINE // LLAMA-3-8B // EDGE RUNTIME', delay: 3000, speed: 40 },
  { text: 'READY.', delay: 3500, speed: 50 },
];

interface BootSequenceProps {
  onComplete: () => void;
}

function TypewriterText({ text, speed, onDone }: { text: string; speed: number; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!text) {
      onDone();
      return;
    }
    if (idx >= text.length) {
      onDone();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(prev => prev + text[idx]);
      setIdx(idx + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [idx, text, speed, onDone]);

  return <span>{displayed}<span className="animate-blink">_</span></span>;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (step >= BOOT_MESSAGES.length) {
      setShowCursor(false);
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const current = BOOT_MESSAGES[step];

  const handleLineDone = () => {
    const nextStep = step + 1;
    if (nextStep < BOOT_MESSAGES.length) {
      const nextDelay = BOOT_MESSAGES[nextStep].delay;
      setTimeout(() => setStep(nextStep), nextDelay);
    } else {
      setStep(nextStep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col font-mono">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl px-8">
          <div className="mb-8 flex items-center gap-3">
            <Terminal className="h-6 w-6 text-emerald-500" />
            <span className="text-lg text-emerald-400 font-bold tracking-[0.15em]">EcoOS CORE</span>
            <span className="risk-warning text-[10px]">v2.5.0</span>
          </div>

          <div className="space-y-1.5 text-sm">
            {BOOT_MESSAGES.slice(0, step).map((msg, i) => (
              <div key={i} className="text-emerald-500/80">
                {msg.text}
              </div>
            ))}
            {step < BOOT_MESSAGES.length && (
              <div className="text-emerald-400">
                <TypewriterText text={current.text} speed={current.speed} onDone={handleLineDone} />
              </div>
            )}
          </div>

          {step >= BOOT_MESSAGES.length && showCursor && (
            <div className="mt-4 flex items-center gap-2 text-emerald-400">
              <span className="animate-blink text-lg">_</span>
            </div>
          )}
        </div>
      </div>
      <div className="pb-4 text-center">
        <p className="text-[10px] text-emerald-700/50">USAII Global AI Hackathon 2026 — Direction A: Food Waste Rescue Radar</p>
      </div>
    </div>
  );
}
