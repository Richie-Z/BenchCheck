import { useEffect, useState } from 'react'
import { ChecklistProvider, useChecklist } from './store'
import { ChecklistPage } from './pages/ChecklistPage'
import { DisplayTestPage } from './pages/DisplayTestPage'
import { KeyboardTestPage } from './pages/KeyboardTestPage'

type Tab = 'checklist' | 'display' | 'keyboard'

const TABS: { id: Tab; label: string }[] = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'display', label: 'Display test' },
  { id: 'keyboard', label: 'Keyboard test' },
]

function Header({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const { counts } = useChecklist()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-[11px] font-semibold text-signal">
            BC
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight text-zinc-100 sm:block">
            BenchCheck
          </span>
        </div>

        <nav className="flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTab(t.id)}
              className={`flex h-16 shrink-0 items-center border-b-2 px-3 text-sm ${
                tab === t.id
                  ? 'border-signal text-zinc-50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 font-mono text-xs tabular-nums sm:flex">
          <span className="text-zinc-400">
            <span className="text-zinc-100">{counts.done}</span>/{counts.total}
          </span>
          {counts.fail > 0 && (
            <span className="rounded-full bg-fail/15 px-2 py-0.5 text-fail">
              {counts.fail} failed
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

function Shell() {
  const [tab, setTab] = useState<Tab>('checklist')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  return (
    <div className="min-h-[100dvh]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-signal focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to content
      </a>

      <Header tab={tab} onTab={setTab} />

      <main id="main" tabIndex={-1}>
        {tab === 'checklist' && <ChecklistPage />}
        {tab === 'display' && <DisplayTestPage />}
        {tab === 'keyboard' && <KeyboardTestPage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ChecklistProvider>
      <Shell />
    </ChecklistProvider>
  )
}
