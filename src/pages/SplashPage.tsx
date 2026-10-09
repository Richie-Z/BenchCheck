import { useState } from 'react'
import { ArrowRight, GithubLogo } from '@phosphor-icons/react'
import { LogoMark } from '../App'

const DEMO = [
  'SSD or HDD health status is Good',
  'Battery wear is within limits',
  'No dead or stuck pixels',
  'Every key registers',
  'USB-A port works with a real device',
  'Wi-Fi speed is reasonable for the band',
]

const PATTERNS = ['#ffffff', '#000000', '#ef4444', '#22c55e', '#3b82f6']

const STATS: { value: string; label: string }[] = [
  { value: '10', label: 'sections' },
  { value: '65', label: 'checks' },
  { value: '30-45', label: 'minutes full pass' },
  { value: '10', label: 'quick pass checks' },
]

const COVERS: { title: string; body: string }[] = [
  {
    title: 'Display test',
    body: 'Dead pixels, backlight bleed, color banding. Full-screen patterns.',
  },
  {
    title: 'Keyboard test',
    body: 'Every key, ghosting, and the ThinkPad touchpad layout.',
  },
  {
    title: 'Failure report',
    body: 'Mark fails with reasons, print a one-page report.',
  },
]

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Pick a mode',
    body: 'Full pass for 65 checks, quick pass for the 10 that catch most bad units.',
  },
  {
    title: 'Run the checks',
    body: 'Mark pass or fail and write down why something failed.',
  },
  {
    title: 'Print the report',
    body: 'One page with your findings, ready to keep or share.',
  },
]

export function SplashPage({ onEnter }: { onEnter: () => void }) {
  const [demo, setDemo] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const [pattern, setPattern] = useState<string | null>(null)

  const fails = demo.filter((v) => v === 2).length
  const done = demo.filter((v) => v !== 0).length
  const demoGrade =
    done < DEMO.length ? null : fails === 0 ? 'A' : fails === DEMO.length ? 'F' : fails <= 2 ? 'B' : fails <= 4 ? 'C' : 'D'

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <LogoMark className="size-12 text-signal" />
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-signal">
              Why BenchCheck
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
              Buying a used laptop? Check it like a repair bench.
            </h1>
            <p className="mt-5 max-w-2xl text-zinc-400">
              I bought a used laptop without a clear idea of what to check. No checklist in my
              head, no guide I trusted. So I built one: every area I wish I had inspected before
              paying, in the order a bench tech would run it.
            </p>
            <button
              type="button"
              onClick={onEnter}
              className="group mt-8 flex items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-zinc-950 transition duration-150 hover:bg-amber-400 active:translate-y-px"
            >
              Open checklist
              <ArrowRight
                size={16}
                weight="regular"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="relative rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              {demoGrade && (
                <div className={`pointer-events-none absolute -top-6 -right-4 z-10 rotate-[8deg] border-2 bg-zinc-950/80 p-1 ${demoGrade === 'A' ? 'border-pass text-pass' : demoGrade === 'F' ? 'border-fail text-fail' : 'border-signal text-signal'}`}>
                  <div className="flex flex-col items-center gap-0.5 border border-current px-2 py-1.5">
                    <LogoMark className="size-3.5" />
                    <span className="font-mono text-xl font-bold leading-none">{demoGrade}</span>
                    <span className="font-mono text-[7px] uppercase leading-none tracking-[0.2em]">Grade</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pr-16">
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  Live demo
                </span>
                <span className="font-mono text-sm text-signal">
                  {demo.filter((v) => v !== 0).length}/6
                </span>
              </div>
              <div className="mt-3">
                {DEMO.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setDemo((d) => d.map((v, i) => (i === idx ? (v + 1) % 3 : v)))
                    }
                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-zinc-800/60"
                  >
                    <span className="grid size-5 shrink-0 place-items-center bg-signal font-mono text-xs font-bold text-zinc-950">
                      {idx + 1}
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        demo[idx] === 0
                          ? 'text-zinc-600'
                          : demo[idx] === 1
                            ? 'text-signal'
                            : 'text-fail'
                      }`}
                    >
                      {demo[idx] === 0 ? '[ ]' : demo[idx] === 1 ? '[x]' : '[!]'}
                    </span>
                    <span className="text-sm text-zinc-100">{label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 border-t border-zinc-800 pt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                Click a row to cycle pass / fail
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 border-y border-zinc-800 py-8 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-mono text-3xl text-zinc-50">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-zinc-400">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="py-14">
        <h2 className="text-xl font-semibold text-zinc-50">What it covers</h2>
        <p className="mt-4 text-zinc-400">
          Quick pass for a fast screening. Full pass for a 30-45 minute bench inspection.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {COVERS.map((c) => (
            <div
              key={c.title}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-150 hover:border-signal/50"
            >
              <h3 className="text-sm font-semibold text-zinc-100">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{c.body}</p>
              {c.title === 'Display test' && (
                <div className="mt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Test patterns
                  </p>
                  <div className="mt-2 flex gap-2">
                    {PATTERNS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Preview ${color}`}
                        onClick={() => setPattern(color)}
                        style={{ background: color }}
                        className="size-8 rounded-lg border border-zinc-700 transition-transform duration-150 hover:scale-110 active:scale-95"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 py-14">
        <h2 className="text-xl font-semibold text-zinc-50">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="grid size-6 place-items-center bg-signal font-mono text-xs font-bold text-zinc-950">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-zinc-100">{s.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-4 flex items-center justify-between gap-4 border-t border-zinc-800 py-10">
        <LogoMark className="size-5 text-signal" />
        <p className="text-sm text-zinc-400">
          Built for anyone buying second-hand hardware who wants a straight answer before
          handing over cash.
        </p>
        <a
          href="https://github.com/Richie-Z/BenchCheck"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-signal"
        >
          <GithubLogo size={16} weight="regular" />
          Source on GitHub
        </a>
      </footer>

      {pattern && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: pattern }}
          onClick={() => setPattern(null)}
        >
          <span
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest ${
              pattern === '#ffffff' ? 'text-zinc-950/50' : 'text-white/50'
            }`}
          >
            Click anywhere to exit
          </span>
        </div>
      )}
    </div>
  )
}
