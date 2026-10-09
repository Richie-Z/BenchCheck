import { Flag } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'
import { SECTIONS } from '../../data/checklist'
import { useChecklist } from '../../store'

export function FailuresPanel() {
  const { statuses, reasons } = useChecklist()

  const failed = SECTIONS.flatMap((section) =>
    section.items
      .filter((item) => statuses[item.id] === 'fail')
      .map((item) => ({ item, section })),
  )

  if (failed.length === 0) return null

  return (
    <section
      style={{ '--i': 2 } as CSSProperties}
      className="bc-in rounded-lg border border-fail/25 bg-fail/5 p-4 sm:p-5"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-zinc-100">Failed checks</h2>
        <span className="rounded-full bg-fail/15 px-2 py-0.5 font-mono text-[11px] tabular-nums text-fail">
          {failed.length}
        </span>
      </div>

      <ul className="mt-3 divide-y divide-fail/15 border-t border-fail/15">
        {failed.map(({ item, section }) => (
          <li key={item.id} className="flex items-center gap-3 py-2">
            <Flag size={14} weight="regular" className="shrink-0 text-fail" />
            <span className="min-w-0 flex-1 text-sm text-zinc-300">{item.label}</span>
            {reasons[item.id] && (
              <span className="min-w-0 shrink truncate text-xs text-zinc-400">
                {reasons[item.id]}
              </span>
            )}
            <a
              href={`#${section.id}`}
              aria-label={`Go to section ${section.title}`}
              className="shrink-0 font-mono text-xs tabular-nums text-zinc-400 hover:text-signal"
            >
              {String(section.num).padStart(2, '0')}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
