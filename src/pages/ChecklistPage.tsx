import { ClipboardText, Lightning, Printer } from '@phosphor-icons/react'
import { useMemo, type CSSProperties } from 'react'
import { FailuresPanel } from '../components/checklist/FailuresPanel'
import { SectionBand } from '../components/checklist/SectionBand'
import { SectionRail, SectionRailMobile } from '../components/checklist/SectionRail'
import { SummaryBar } from '../components/checklist/SummaryBar'
import { QUICK_ITEMS, SECTIONS } from '../data/checklist'
import { useChecklist } from '../store'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const PAGE_CSS = `
html { scroll-behavior: smooth; }
@keyframes bc-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.bc-in {
  animation: bc-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: calc(var(--i, 0) * 45ms);
}
section[id]:target { border-top-color: var(--color-signal); }
@media (prefers-reduced-motion: reduce) {
  .bc-in { animation: none; }
  html { scroll-behavior: auto; }
}
`

function EmptyState() {
  return (
    <section
      style={{ '--i': 2 } as CSSProperties}
      className="bc-in rounded-lg border border-zinc-800 px-6 py-14 text-center"
    >
      <ClipboardText size={32} weight="regular" className="mx-auto text-zinc-600" />
      <p className="mt-3 text-balance text-base font-medium text-zinc-200">
        Nothing checked yet
      </p>
      <p className="mt-1.5 text-sm text-zinc-400">
        Start with CrystalDiskInfo and the battery report, section 1.
      </p>
    </section>
  )
}

export function ChecklistPage() {
  const { counts, statuses, meta, setModel, mode, setMode } = useChecklist()
  const quick = mode === 'quick'

  const quickItems = QUICK_ITEMS

  const quickDone = useMemo(
    () => quickItems.filter((item) => statuses[item.id] !== undefined).length,
    [quickItems, statuses],
  )

  const modeButton = (active: boolean, label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-transform duration-150 active:translate-y-px ${
        active ? 'bg-signal text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <style>{PAGE_CSS}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <h1 className="sr-only">Inspection checklist</h1>

      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor="device-model"
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400"
        >
          Device model
        </label>
        <input
          id="device-model"
          type="text"
          value={meta.model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. ThinkPad T480"
          className="w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
        />
      </div>

      <SummaryBar />

      <div
        style={{ '--i': 1 } as CSSProperties}
        className="bc-in mt-6 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {modeButton(!quick, 'Full', () => setMode('full'))}
            {modeButton(quick, 'Quick pass', () => setMode('quick'))}
          </div>
          {quick && (
            <span className="font-mono text-xs tabular-nums text-zinc-400">
              {quickDone} of {quickItems.length} done
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-transform duration-150 hover:border-zinc-600 hover:text-zinc-100 active:translate-y-px"
        >
          <Printer size={14} weight="regular" />
          Print report
        </button>
      </div>

      {quick && (
        <div className="mt-6 flex items-center justify-between gap-4 border-2 border-signal bg-zinc-950 px-4 py-4">
          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-signal">
              [ Quick pass // 10 critical checks ]
            </span>
            <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400">
              &gt;&gt;&gt; Fast screening. Ten checks that catch most bad units.
            </span>
          </div>
          <span
            className="shrink-0 font-mono font-medium leading-none tabular-nums text-signal"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.04em' }}
          >
            {String(counts.done).padStart(2, '0')}
            <span className="text-zinc-500" style={{ fontSize: '1.25rem' }}>
              /{counts.total}
            </span>
          </span>
        </div>
      )}

      {!quick && <SectionRailMobile sections={SECTIONS} />}

      <div
        className={
          quick ? 'mt-8' : 'mt-8 md:grid md:grid-cols-[14rem_1fr] md:gap-x-10'
        }
      >
        {!quick && <SectionRail sections={SECTIONS} />}

        <div className="flex min-w-0 flex-col gap-8">
          {counts.done === 0 && <EmptyState />}
          {!quick && <FailuresPanel />}

          {quick && (
            <div className="relative mt-6 overflow-hidden border-2 border-signal bg-zinc-950">
              <div aria-hidden className="h-2 w-full bc-hazard" />
              <svg
                key={counts.done}
                aria-hidden
                viewBox="0 0 24 48"
                className="bc-bolt-strike pointer-events-none absolute right-6 top-1/2 h-2/3 w-auto -translate-y-1/2 fill-signal opacity-[0.07]"
              >
                <path d="M15 2 L5 27 h7 l-2 19 L21 21 h-8 l4-19 z" />
              </svg>
              <div aria-hidden className="bc-scanlines pointer-events-none absolute inset-0" />
              <div className="relative p-3 sm:p-4">
                <SectionBand
                  title="Quick pass"
                  items={quickItems}
                  quick
                  index={3}
                  icon={Lightning}
                />
              </div>
            </div>
          )}
          {!quick &&
            SECTIONS.map((section, k) => (
              <SectionBand
                key={section.id}
                id={section.id}
                num={section.num}
                icon={section.icon}
                title={section.title}
                note={section.note}
                items={section.items}
                index={3 + k}
              />
            ))}
        </div>
      </div>

      <footer className="mt-10 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        Status is saved in this browser.
      </footer>
    </div>
  )
}
