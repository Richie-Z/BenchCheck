import { GithubLogo } from '@phosphor-icons/react'
import { LogoMark } from '../App'

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
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
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
          className="mt-8 rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-zinc-950 transition duration-150 hover:bg-amber-400 active:translate-y-px"
        >
          Open checklist
        </button>
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
            <div key={c.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-sm font-semibold text-zinc-100">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{c.body}</p>
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
    </div>
  )
}
