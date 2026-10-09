import { useEffect, useState } from 'react'
import { SECTIONS, TOTAL_ITEMS } from '../../data/checklist'
import { useChecklist } from '../../store'

const today = () => new Date().toISOString().slice(0, 10)

const MARK: Record<string, string> = {
  pass: '[PASS]',
  fail: '[FAIL]',
}

export function PrintReport() {
  const { statuses, reasons, meta, counts } = useChecklist()
  const [stamp, setStamp] = useState(today)

  useEffect(() => {
    const onPrint = () => setStamp(today())
    window.addEventListener('beforeprint', onPrint)
    return () => window.removeEventListener('beforeprint', onPrint)
  }, [])

  return (
    <article id="print-report" aria-hidden="true">
      <h1>BenchCheck inspection report</h1>
      <p>Device model: {meta.model.trim() || '-'}</p>
      <p>Date: {stamp}</p>
      <p>
        Result: {counts.pass} passed, {counts.fail} failed,{' '}
        {TOTAL_ITEMS - counts.done} pending, {TOTAL_ITEMS} total
      </p>
      {SECTIONS.map((section) => (
        <section key={section.id}>
          <h2>
            {String(section.num).padStart(2, '0')}. {section.title}
          </h2>
          {section.items.map((item) => {
            const status = statuses[item.id]
            const reason = reasons[item.id]
            return (
              <div key={item.id} className="print-item">
                <p>
                  {status ? MARK[status] : '[PENDING]'} {item.label}
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
