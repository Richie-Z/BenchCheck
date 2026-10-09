import type { CSSProperties } from 'react'
import { useChecklist } from '../../store'
import type { CheckSection, StatusMap } from '../../types'

function sectionState(statuses: StatusMap, section: CheckSection) {
  let done = 0
  let failed = 0
  for (const item of section.items) {
    const status = statuses[item.id]
    if (status === 'pass') done += 1
    else if (status === 'fail') {
      done += 1
      failed += 1
    }
  }
  const total = section.items.length
  const tone =
    done === 0
      ? 'text-zinc-400'
      : failed === done
        ? 'text-fail'
        : done === total && failed === 0
          ? 'text-pass'
          : 'text-signal'
  return { done, total, tone }
}

const pad = (num: number) => String(num).padStart(2, '0')

export function SectionRail({ sections }: { sections: CheckSection[] }) {
  const { statuses } = useChecklist()

  return (
    <aside className="hidden md:block">
      <nav
        aria-label="Checklist sections"
        style={{ '--i': 2 } as CSSProperties}
        className="bc-in sticky top-24"
      >
        <ul>
          {sections.map((section) => {
            const { done, total, tone } = sectionState(statuses, section)
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group block rounded-lg px-2 py-1.5 hover:bg-zinc-900"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-xs tabular-nums text-zinc-400 group-hover:text-signal">
                      {pad(section.num)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-400 group-hover:text-zinc-100">
                      {section.title}
                    </span>
                  </span>
                  <span
                    className={`mt-0.5 block pl-6 font-mono text-xs tabular-nums ${tone}`}
                  >
                    {done}/{total}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export function SectionRailMobile({ sections }: { sections: CheckSection[] }) {
  const { statuses } = useChecklist()

  return (
    <div
      style={{ '--i': 2 } as CSSProperties}
      className="bc-in -mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:hidden"
    >
      <nav aria-label="Checklist sections">
        <ul className="flex w-max gap-2">
          {sections.map((section) => {
            const { done, total, tone } = sectionState(statuses, section)
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 hover:border-zinc-700"
                >
                  <span className="font-mono text-xs tabular-nums text-zinc-400">
                    {pad(section.num)}
                  </span>
                  <span className="text-xs text-zinc-400">{section.title}</span>
                  <span className={`font-mono text-xs tabular-nums ${tone}`}>
                    {done}/{total}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
