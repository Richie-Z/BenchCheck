import type { CSSProperties } from 'react'
import { useChecklist } from '../../store'
import type { CheckItem, SectionIcon } from '../../types'
import { ItemRow } from './ItemRow'

interface SectionBandProps {
  title: string
  items: CheckItem[]
  index: number
  id?: string
  num?: number
  icon?: SectionIcon
  note?: string
  quick?: boolean
}

export function SectionBand({
  title,
  items,
  index,
  id,
  num,
  icon: Icon,
  note,
  quick = false,
}: SectionBandProps) {
  const { statuses } = useChecklist()
  const done = items.filter((item) => statuses[item.id] !== undefined).length
  const titleId = id ? `${id}-title` : undefined

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      style={{ '--i': index } as CSSProperties}
      className="bc-in scroll-mt-24 border-t border-zinc-800 pt-6"
    >
      <div className="flex items-center gap-3">
        {num !== undefined && (
          <span className="font-mono text-xl font-semibold leading-none tracking-tight tabular-nums text-signal">
            {String(num).padStart(2, '0')}
          </span>
        )}
        {Icon && <Icon size={24} weight="regular" className="shrink-0 text-signal" />}
        <h2
          id={titleId}
          className="min-w-0 flex-1 text-balance text-lg font-semibold tracking-tight text-zinc-100"
        >
          {title}
        </h2>
        <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-400">
          <span className="text-zinc-100">{done}</span>/{items.length}
        </span>
      </div>

      {note && <p className="mt-2 max-w-[65ch] text-sm text-zinc-400">{note}</p>}

      <ul className="mt-4 divide-y divide-zinc-800">
        {items.map((item, i) => (
          <ItemRow
            key={item.id}
            item={item}
            step={quick ? item.priority : undefined}
            i={index + Math.min(i, 7) * 0.3}
          />
        ))}
      </ul>
    </section>
  )
}
