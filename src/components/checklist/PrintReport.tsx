import { useEffect, useState } from 'react'
import { SECTIONS } from '../../data/checklist'
import { useChecklist } from '../../store'
import type { CheckSection } from '../../types'

const today = () => new Date().toISOString().slice(0, 10)

const MARK: Record<string, string> = {
  pass: '[PASS]',
  fail: '[FAIL]',
}

export function PrintReport() {
  const { statuses, reasons, meta, counts, mode } = useChecklist()
  const [stamp, setStamp] = useState(today)

  useEffect(() => {
    const onPrint = () => setStamp(today())
    window.addEventListener('beforeprint', onPrint)
    return () => window.removeEventListener('beforeprint', onPrint)
  }, [])

  const sections: CheckSection[] =
    mode === 'quick'
      ? SECTIONS.map((section) => ({
          ...section,
          items: section.items.filter((item) => item.priority !== undefined),
        })).filter((section) => section.items.length > 0)
      : SECTIONS

  return (
    <article id="print-report" aria-hidden="true">
      <h1>
        {mode === 'quick'
          ? 'BenchCheck quick pass report'
          : 'BenchCheck inspection report'}
      </h1>
      <p>Device model: {meta.model.trim() || '-'}</p>
      <p>Date: {stamp}</p>
      <p>
        Result: {counts.pass} passed, {counts.fail} failed,{' '}
        {counts.total - counts.done} pending, {counts.total} total
      </p>
      {sections.map((section) => (
        <section key={section.id}>
          <h2>
            {String(section.num).padStart(2, '0')}. {section.title}
          </h2>
          {section.items.map((item) => {
            const status = statuses[item.id]
            const reason = reasons[item.id]
            const marker = status ? MARK[status] : '[PENDING]'
            return (
              <div key={item.id} className="print-item">
                <p>
                  {mode === 'quick'
                    ? `${marker} ${String(item.priority).padStart(2, '0')}. ${item.label}`
                    : `${marker} ${item.label}`}
                </p>
                {status === 'fail' && reason && <p className="print-reason">Reason: {reason}</p>}
              </div>
            )
          })}
        </section>
      ))}
    </article>
  )
}
