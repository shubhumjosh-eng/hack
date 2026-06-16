'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Radar } from 'lucide-react'

export interface TourStep {
  selector: string
  title: string
  description: string
  placement?: 'bottom' | 'top' | 'right' | 'left'
}

interface PageTourProps {
  steps: TourStep[]
  pageId: string
  onComplete?: () => void
}

export function PageTour({ steps, pageId, onComplete }: PageTourProps) {
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({})
  const [visible, setVisible] = useState(true)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  const current = steps[step]
  const total = steps.length
  const isFirst = step === 0
  const isLast = step === total - 1

  const positionTooltip = useCallback(() => {
    const el = document.querySelector(current.selector)
    if (!el) {
      // Fallback: center on screen
      setTargetRect(null)
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
        maxWidth: '90vw',
        zIndex: 9999,
      })
      return
    }

    const rect = el.getBoundingClientRect()
    setTargetRect(rect)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const placement = current.placement ?? 'bottom'
    const tooltipW = 320
    const tooltipH = 180
    const gap = 10

    let left: number
    let top: number
    let arrowLeft: number
    let arrowTop: number
    let arrowClass: string

    switch (placement) {
      case 'top':
        left = rect.left + rect.width / 2 - tooltipW / 2
        top = rect.top - tooltipH - gap
        arrowLeft = tooltipW / 2 - 6
        arrowTop = tooltipH
        arrowClass = 'top-arrow'
        break
      case 'left':
        left = rect.left - tooltipW - gap
        top = rect.top + rect.height / 2 - tooltipH / 2
        arrowLeft = tooltipW
        arrowTop = tooltipH / 2 - 6
        arrowClass = 'left-arrow'
        break
      case 'right':
        left = rect.right + gap
        top = rect.top + rect.height / 2 - tooltipH / 2
        arrowLeft = -8
        arrowTop = tooltipH / 2 - 6
        arrowClass = 'right-arrow'
        break
      default: // bottom
        left = rect.left + rect.width / 2 - tooltipW / 2
        top = rect.bottom + gap
        arrowLeft = tooltipW / 2 - 6
        arrowTop = -12
        arrowClass = 'bottom-arrow'
    }

    // Clamp to viewport
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipW - 10))
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipH - 10))

    setTooltipStyle({
      position: 'fixed',
      left,
      top,
      width: tooltipW,
      zIndex: 9999,
    })

    // Arrow
    if (arrowClass === 'bottom-arrow') {
      setArrowStyle({
        position: 'fixed',
        left: left + arrowLeft,
        top: top + arrowTop,
        zIndex: 10000,
      })
    } else if (arrowClass === 'right-arrow') {
      setArrowStyle({
        position: 'fixed',
        left: left + arrowLeft,
        top: top + arrowTop,
        zIndex: 10000,
      })
    } else {
      setArrowStyle({})
    }
  }, [current])

  useEffect(() => {
    // Wait a tick for DOM to settle after scroll/resize
    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(positionTooltip, 350)
    setTimeoutId(id)
    return () => clearTimeout(id)
  }, [step, current.selector, positionTooltip, timeoutId])

  useEffect(() => {
    const handleResize = () => positionTooltip()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [positionTooltip])

  const goNext = useCallback(() => {
    if (step < total - 1) setStep(s => s + 1)
    else handleDone()
  }, [step, total])

  const goPrev = useCallback(() => {
    if (step > 0) setStep(s => s - 1)
  }, [step])

  function handleSkip() {
    setVisible(false)
    onComplete?.()
  }

  function handleDone() {
    setVisible(false)
    localStorage.setItem(`ecoos-tour-${pageId}`, 'true')
    onComplete?.()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleSkip} />

      {/* Target highlight */}
      {targetRect && (
        <div
          className="absolute border-2 border-emerald-400/70 bg-emerald-500/5 animate-pulse-glow pointer-events-none rounded-sm"
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
      {arrowStyle.left !== undefined && (
        <div style={arrowStyle}>
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-emerald-700/60" />
        </div>
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="border border-emerald-700/50 bg-gray-950 shadow-[0_0_25px_rgba(52,211,153,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-emerald-800/20 px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Radar className="h-3 w-3 text-emerald-500" />
            <span className="text-[9px] text-emerald-500 uppercase tracking-[0.15em]">
              Step {step + 1}/{total}
            </span>
          </div>
          <button onClick={handleSkip} className="text-emerald-700 hover:text-emerald-400 transition-colors p-0.5">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="p-3 space-y-2">
          <h4 className="text-xs font-bold text-emerald-200">{current.title}</h4>
          <p className="text-[10px] text-emerald-400/80 leading-relaxed">{current.description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-emerald-800/20 px-3 py-1.5">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
                  i === step ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]' : 'bg-emerald-800/40'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button onClick={goPrev} className="flex items-center gap-1 px-2 py-1 text-[9px] border border-emerald-800/30 text-emerald-500 hover:bg-emerald-900/20 transition-colors">
                <ChevronLeft className="h-3 w-3" /> Prev
              </button>
            )}
            <button onClick={isLast ? handleDone : goNext} className="flex items-center gap-1 px-2 py-1 text-[9px] border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/20 transition-colors">
              {isLast ? 'Done' : 'Next'} {!isLast && <ChevronRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
