import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useChecklist } from '../../store'
import { LogoMark } from '../../App'

function Stat({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <div>
      <div className={`font-mono text-2xl leading-none tracking-tight tabular-nums ${className}`}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-zinc-400">{label}</div>
    </div>
  )
}

export function SummaryBar() {
  const { counts, reset } = useChecklist()
  const [confirming, setConfirming] = useState(false)
  const timer = useRef<number | null>(null)

  const cancel = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => cancel, [])

  const handleReset = () => {
    if (confirming) {
      cancel()
      setConfirming(false)
      reset()
      return
    }
    setConfirming(true)
    timer.current = window.setTimeout(() => {
      setConfirming(false)
      timer.current = null
    }, 3000)
  }

  const grade: 'A' | 'B' | 'C' | 'D' | 'F' | null =
    counts.done === 0
      ? null
      : counts.fail === 0
        ? 'A'
        : counts.fail <= 2
          ? 'B'
          : counts.fail <= 4
            ? 'C'
            : counts.fail <= 6
              ? 'D'
              : 'F'

  return (
    <section
      aria-label="Progress summary"
      style={{ '--i': 0 } as CSSProperties}
      className="bc-in relative rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-6xl font-medium leading-none tracking-tight tabular-nums text-zinc-50 sm:text-7xl">
              {counts.done}
            </span>
            <span className="font-mono text-2xl font-light leading-none tracking-tight tabular-nums text-zinc-400 sm:text-3xl">
              /{counts.total}
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">checks done</p>
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-4 pr-24 sm:pr-28 sm:gap-x-10">
          <Stat value={counts.pass} label="passed" className="text-pass" />
          <Stat value={counts.fail} label="failed" className="text-fail" />
          <Stat
            value={counts.total - counts.done}
            label="remaining"
            className="text-zinc-100"
          />

          <button
            type="button"
            onClick={handleReset}
            onBlur={() => {
              cancel()
              setConfirming(false)
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-transform duration-150 active:translate-y-px ${
              confirming
                ? 'border-signal bg-signal/10 text-signal'
                : 'border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100'
            }`}
          >
            {confirming ? 'Confirm reset?' : 'Reset'}
          </button>

          {counts.done > 0 && (
            <div className="flex items-center gap-3">
              {counts.pass === counts.total && (
                <span className="rounded-full bg-pass/15 px-2.5 py-1 font-mono text-[11px] text-pass">
                  All passed
                </span>
              )}
              {counts.pass === 0 && counts.fail > 0 && (
                <span className="rounded-full bg-fail/15 px-2.5 py-1 font-mono text-[11px] text-fail">
                  All failed
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div
          role="progressbar"
          aria-label="Checks completed"
          aria-valuemin={0}
          aria-valuemax={counts.total}
          aria-valuenow={counts.done}
          className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800"
        >
          <div
            className="h-full w-full origin-left rounded-full bg-signal transition-transform duration-150"
            style={{ transform: `scaleX(${counts.percent / 100})` }}
          />
        </div>
        <span className="w-11 shrink-0 text-right font-mono text-xs tabular-nums text-zinc-400">
          {counts.percent}%
        </span>
      </div>

      {grade && (
        <div
          className={`pointer-events-none absolute -top-8 -right-5 z-10 rotate-[8deg] border-2 bg-zinc-950/80 p-1 ${
            grade === 'A'
              ? 'border-pass text-pass'
              : grade === 'F'
                ? 'border-fail text-fail'
                : 'border-signal text-signal'
          }`}
        >
          <div className="flex flex-col items-center gap-1 border border-current px-3 py-2">
            <LogoMark className="size-5" />
            <span className="font-mono text-3xl font-bold leading-none">{grade}</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] leading-none">
              Grade
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
