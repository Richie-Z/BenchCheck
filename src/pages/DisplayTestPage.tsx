import { useCallback, useEffect, useRef, useState } from 'react'

interface SurfaceColor {
  name: string
  value: string
  light: boolean
}

const COLORS: SurfaceColor[] = [
  { name: 'White', value: '#ffffff', light: true },
  { name: 'Black', value: '#000000', light: false },
  { name: 'Red', value: '#ff0000', light: false },
  { name: 'Green', value: '#00ff00', light: false },
  { name: 'Blue', value: '#0000ff', light: false },
]

const LOOK_FOR = [
  'Bright dot on black = dead or stuck pixel',
  'Colored dot on white = stuck pixel',
  'Glowing edges on black in a dark room = backlight bleed',
]

function FullscreenTest({
  startIndex,
  onExit,
}: {
  startIndex: number
  onExit: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimer = useRef<number | undefined>(undefined)

  const armHide = useCallback(() => {
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2000)
  }, [])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    armHide()
  }, [armHide])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      showControls()
      if (e.key === 'Escape') {
        onExit()
        return
      }
      if (e.key >= '1' && e.key <= '5') {
        setIndex(Number(e.key) - 1)
        return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setIndex((i) => (i + 1) % COLORS.length)
      }
    }

    armHide()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousemove', showControls)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(hideTimer.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousemove', showControls)
    }
  }, [armHide, onExit, showControls])

  const color = COLORS[index]
  const theme = color.light
    ? {
        bar: 'border-zinc-300 bg-zinc-100/90 text-zinc-900',
        exit: 'border-zinc-300',
        hint: 'text-zinc-700',
      }
    : {
        bar: 'border-white/10 bg-zinc-950/80 text-zinc-100',
        exit: 'border-zinc-700',
        hint: 'text-zinc-300',
      }

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: color.value, height: '100dvh' }}
    >
      <div
        className={`absolute bottom-6 left-1/2 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-lg border px-3 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-opacity duration-150 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${theme.bar}`}
      >
        {COLORS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            onClick={() => {
              setIndex(i)
              showControls()
            }}
            className={`size-8 min-h-11 min-w-11 shrink-0 rounded-lg border border-zinc-600 transition-transform duration-150 hover:-translate-y-px active:translate-y-px ${
              i === index ? 'ring-2 ring-signal' : ''
            }`}
            style={{ background: c.value }}
          />
        ))}
        <span className="font-mono text-xs uppercase tracking-[0.14em]">
          {color.name}
        </span>
        <span
          className={`hidden font-mono text-[10px] tracking-[0.06em] sm:inline ${theme.hint}`}
        >
          1-5 surface, arrows cycle, esc exit
        </span>
        <button
          type="button"
          onClick={onExit}
          className={`min-h-11 shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-transform duration-150 hover:-translate-y-px active:translate-y-px ${theme.exit}`}
        >
          Exit
        </button>
      </div>
    </div>
  )
}

export function DisplayTestPage() {
  const [active, setActive] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const start = (i: number) => {
    setStartIndex(i)
    setActive(true)
  }

  const exit = useCallback(() => setActive(false), [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Display test
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-zinc-400">
        Fullscreen color surfaces expose dead pixels, stuck pixels, and backlight
        bleed.
      </p>

      <ul className="mt-6 max-w-2xl border-t border-zinc-800">
        {LOOK_FOR.map((line, i) => (
          <li key={line} className="flex gap-4 border-b border-zinc-800 py-3">
            <span className="font-mono text-xs tabular-nums text-signal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-zinc-400">{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Surfaces
          </p>
          <div className="mt-3 flex gap-3">
            {COLORS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => start(i)}
                aria-label={`Start on ${c.name}`}
                className="group flex min-w-11 flex-col items-center gap-2"
              >
                <span
                  className="size-8 rounded-lg border border-zinc-700 transition-transform duration-150 group-hover:-translate-y-0.5"
                  style={{ background: c.value }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 group-hover:text-zinc-200">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => start(0)}
          className="min-h-11 rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px"
        >
          Start fullscreen test
        </button>
      </div>

      {active && <FullscreenTest startIndex={startIndex} onExit={exit} />}
    </div>
  )
}
