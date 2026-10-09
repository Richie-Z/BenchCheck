import { Check, Flag } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'
import { useChecklist } from '../../store'
import type { CheckItem } from '../../types'

export function ItemRow({ item, step, i }: { item: CheckItem; step?: number; i: number }) {
  const { statuses, cycle } = useChecklist()
  const status = statuses[item.id]
  const failed = status === 'fail'
  const done = status !== undefined

  const control = failed
    ? 'border-fail bg-fail/15'
    : status === 'pass'
      ? 'border-pass bg-pass/15'
      : 'border-zinc-600 group-hover:border-zinc-400'

  const label = failed ? 'text-fail' : done ? 'text-zinc-400' : 'text-zinc-100'

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => cycle(item.id)}
        style={{ '--i': i } as CSSProperties}
        className={`bc-in flex w-full items-start gap-3 py-2.5 pr-2 text-left transition-transform duration-150 active:translate-y-px ${
          failed ? 'bg-fail/5 hover:bg-fail/10' : 'hover:bg-zinc-900'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -left-2 top-0 h-full w-0.5 origin-top transition-transform duration-150 ${
            failed ? 'scale-y-100 bg-fail' : 'scale-y-0 bg-signal group-hover:scale-y-100'
          }`}
        />

        {step !== undefined && (
          <span className="mt-0.5 w-6 shrink-0 font-mono text-xs leading-5 tabular-nums text-signal">
            {String(step).padStart(2, '0')}
          </span>
        )}

        <span
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${control}`}
        >
          {status === 'pass' && <Check size={12} weight="regular" className="text-pass" />}
          {failed && <Flag size={12} weight="regular" className="text-fail" />}
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block text-sm ${label}`}>{item.label}</span>
          {item.hint && <span className="mt-0.5 block text-xs text-zinc-400">{item.hint}</span>}
        </span>
      </button>
    </li>
  )
}
