'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, ChevronLeft, ChevronRight, Radar } from 'lucide-react'
import { TOUR_STEPS, type TourStep } from './tour-data'

interface TourOverlayProps {
  onComplete: () => void
  onSkip: () => void
}

export function TourOverlay({ onComplete, onSkip }: TourOverlayProps) {
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipSide, setTooltipSide] = useState<'right' | 'center'>('right')
  const router = useRouter()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const current: TourStep = TOUR_STEPS[step]
  const total = TOUR_STEPS.length
  const isFirst = step === 0
  const isLast = step === total - 1

  const locateTarget = useCallback((id: string) => {
    const el = document.querySelector(`[data-tour="${id}"]`)
    if (el) {
      const rect = el.getBoundingClientRect()
      setTargetRect(rect)

      // If the element is not in the viewport or is very small (mobile bottom nav),
      // render centered
      if (rect.width < 10 || rect.height < 10 || rect.top < 0) {
        setTooltipSide('center')
      } else {
        setTooltipSide('right')
      }

      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setTargetRect(null)
      setTooltipSide('center')
    }
  }, [])

  useEffect(() => {
    locateTarget(current.id)
  }, [step, current.id, locateTarget])

  // When target element is found, position the tooltip
  const goNext = useCallback(() => {
    if (step < total - 1) {
      setStep(s => s + 1)
    } else {
      onComplete()
    }
  }, [step, total, onComplete])

  const goPrev = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1)
    }
  }, [step])

  function handleNavigate() {
    router.push(current.href)
    onComplete()
  }

  // Compute tooltip position
  let tooltipStyle: React.CSSProperties = {}
  let arrowStyle: React.CSSProperties = {}

  if (tooltipSide === 'right' && targetRect) {
    const sidebarWidth = 64 // collapsed sidebar width
    const tooltipW = 340
    const tooltipH = 240

    let top = targetRect.top + targetRect.height / 2 - tooltipH / 2
    // Clamp so tooltip doesn't go off-screen
    top = Math.max(20, Math.min(top, window.innerHeight - tooltipH - 20))

    tooltipStyle = {
      position: 'fixed',
      left: sidebarWidth + 16,
      top,
      width: tooltipW,
      zIndex: 9999,
    }

    arrowStyle = {
      position: 'fixed',
      left: sidebarWidth + 8,
      top: targetRect.top + targetRect.height / 2 - 6,
      zIndex: 10000,
    }
  } else {
    // Centered card on mobile or when target not found
    tooltipStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 360,
      maxWidth: '90vw',
      maxHeight: '80vh',
      zIndex: 9999,
    }
  }

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onSkip} />

      {/* Target element highlight */}
      {tooltipSide === 'right' && targetRect && (
        <div
          className="absolute border-2 border-emerald-400/70 bg-emerald-500/5 animate-pulse-glow pointer-events-none"
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            zIndex: 9998,
          }}
        />
      )}

      {/* Arrow */}
      {tooltipSide === 'right' && (
        <div style={arrowStyle}>
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-emerald-800/60" />
        </div>
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="border border-emerald-700/50 bg-gray-950 shadow-[0_0_30px_rgba(52,211,153,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <Radar className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] text-emerald-500 uppercase tracking-[0.2em]">
              Tour — Step {step + 1}/{total}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="text-emerald-700 hover:text-emerald-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center border border-emerald-700/40 bg-emerald-900/20 text-emerald-400">
              {current.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-200">{current.title}</h3>
              <p className="text-[10px] text-emerald-500">{current.description}</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-400/80 leading-relaxed">
            {current.detail}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-emerald-800/20 px-4 py-2">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                  i === step ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-emerald-800/40'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNavigate}
              className="text-[10px] text-emerald-600 hover:text-emerald-400 underline underline-offset-2"
            >
              Open this page
            </button>
            {!isFirst && (
              <button
                onClick={goPrev}
                className="flex items-center gap-1 px-2 py-1 text-[10px] border border-emerald-800/30 text-emerald-500 hover:bg-emerald-900/20 transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Prev
              </button>
            )}
            <button
              onClick={isLast ? onComplete : goNext}
              className="flex items-center gap-1 px-2 py-1 text-[10px] border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/20 transition-colors"
            >
              {isLast ? 'Done' : 'Next'} {!isLast && <ChevronRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
