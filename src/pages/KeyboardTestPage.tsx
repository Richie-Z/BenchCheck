import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import {
  ARROWS_CLUSTER,
  KEYBOARD_ROWS,
  TOTAL_KEYS,
  type KeyDef,
} from '../components/tools/keyboardLayout'

const KEY_UNIT = '2.5rem'
const GAP_EXTRA = '0.2rem'

type KeyState = 'held' | 'seen' | 'idle'

function Key({ def, state }: { def: KeyDef; state: KeyState }) {
  const held = state === 'held'

  const tone = held
    ? 'border-signal bg-signal text-zinc-950'
    : state === 'seen'
      ? 'border-signal/40 bg-zinc-800 text-zinc-200'
      : 'border-zinc-700/60 bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-400'

  const depth = held
    ? 'shadow-[0_0_10px_rgba(245,158,11,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]'
    : 'shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_4px_rgba(0,0,0,0.35),0_2px_2px_rgba(2,6,12,0.45)]'

  const Icon = def.icon

  return (
    <div
      className={`relative grid place-items-center rounded-lg border font-mono text-[11px] transition-transform duration-150 ${
        def.half ? 'h-6' : 'h-10'
      } ${tone} ${depth} ${held ? 'translate-y-px' : ''}`}
      style={{
        width: `calc(${def.units ?? 1} * ${KEY_UNIT})`,
        marginLeft: def.gap ? GAP_EXTRA : undefined,
      }}
    >
      <span className="relative flex flex-col items-center gap-0.5 leading-none">
        {Icon && <Icon size={10} weight="regular" className="opacity-70" />}
        <span>{def.label}</span>
      </span>
      {def.nub && (
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 z-10 size-3 -translate-x-1/2 rounded-full bg-[#e11d48] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.6)]"
        />
      )}
    </div>
  )
}

const LEGEND = [
  { label: 'Untested', cls: 'border-zinc-700/60 bg-gradient-to-b from-zinc-800 to-zinc-900' },
  { label: 'Tested', cls: 'border-signal/40 bg-zinc-800' },
  { label: 'Held', cls: 'border-signal bg-signal' },
]

export function KeyboardTestPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pressed, setPressed] = useState<Set<string>>(() => new Set())
  const [held, setHeld] = useState<Set<string>>(() => new Set())

  const stateOf = (code: string): KeyState =>
    held.has(code) ? 'held' : pressed.has(code) ? 'seen' : 'idle'

  const reset = () => {
    setPressed(new Set())
    setHeld(new Set())
    containerRef.current?.focus()
  }

  useEffect(() => {
    containerRef.current?.focus()

    const containerHasFocus = () => {
      const el = containerRef.current
      return (
        !!el && (el === document.activeElement || el.contains(document.activeElement))
      )
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault()
      if (e.code === 'Space' && containerHasFocus()) e.preventDefault()
      setPressed((prev) =>
        prev.has(e.code) ? prev : new Set(prev).add(e.code),
      )
      setHeld((prev) => (prev.has(e.code) ? prev : new Set(prev).add(e.code)))
    }

    const onKeyUp = (e: KeyboardEvent) => {
      setHeld((prev) => {
        if (!prev.has(e.code)) return prev
        const next = new Set(prev)
        next.delete(e.code)
        return next
      })
    }

    const onBlur = () => setHeld(new Set())

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  const done = pressed.size === TOTAL_KEYS

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Keyboard test
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-zinc-400">
        Press every key. Each key lights up once it registers.
      </p>
      <p className="mt-2 max-w-[65ch] text-xs leading-relaxed text-zinc-400">
        Some system shortcuts never reach the browser, so confirm those keys with
        any online tester too.
      </p>
      <p className="mt-3 text-xs text-zinc-400 md:hidden">
        Physical keyboard required for this test.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-y border-zinc-800 py-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            Registered
          </span>
          <span className="font-mono text-3xl font-medium tabular-nums">
            <span className="text-signal">{pressed.size}</span>
            <span className="text-zinc-400">/{TOTAL_KEYS}</span>
          </span>
          {done && (
            <span className="rounded-full bg-signal/15 px-2.5 py-1 font-mono text-[11px] text-signal">
              All keys registered
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {LEGEND.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-zinc-400"
            >
              <span className={`size-3 rounded-lg border ${item.cls}`} />
              {item.label}
            </span>
          ))}
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-transform duration-150 hover:border-zinc-700 hover:text-zinc-100 active:translate-y-px"
          >
            <ArrowCounterClockwise size={14} weight="regular" />
            Reset
          </button>
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        ThinkPad 6-row US layout
      </p>

      <div className="mt-3 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950/60 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-3">
        <div
          ref={containerRef}
          tabIndex={0}
          onMouseDown={() => containerRef.current?.focus()}
          className="overflow-x-auto rounded-lg bg-zinc-950/60 focus-visible:ring-2 focus-visible:ring-signal"
        >
          <div className="flex w-max flex-col gap-1.5 p-1">
            {KEYBOARD_ROWS.slice(0, 5).map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map((def) => (
                  <Key key={def.code} def={def} state={stateOf(def.code)} />
                ))}
              </div>
            ))}
            <div className="flex gap-1.5">
              {KEYBOARD_ROWS[5].map((def) => (
                <Key key={def.code} def={def} state={stateOf(def.code)} />
              ))}
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1.5">
                  {ARROWS_CLUSTER[0].map((def) => (
                    <Key key={def.code} def={def} state={stateOf(def.code)} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {ARROWS_CLUSTER[1].map((def) => (
                    <Key key={def.code} def={def} state={stateOf(def.code)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
