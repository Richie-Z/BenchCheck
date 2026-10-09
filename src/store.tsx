import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SECTIONS, TOTAL_ITEMS } from './data/checklist'
import type { ItemStatus, StatusMap } from './types'

const STORAGE_KEY = 'benchcheck:statuses:v1'

interface ChecklistApi {
  statuses: StatusMap
  cycle: (id: string) => void
  setStatus: (id: string, status: ItemStatus | null) => void
  reset: () => void
  counts: {
    total: number
    pass: number
    fail: number
    done: number
    percent: number
  }
}

const ChecklistContext = createContext<ChecklistApi | null>(null)

function loadStatuses(): StatusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as StatusMap
    }
    return {}
  } catch {
    return {}
  }
}

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<StatusMap>(loadStatuses)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
    } catch {
      // storage full or blocked: keep working in memory
    }
  }, [statuses])

  const setStatus = useCallback((id: string, status: ItemStatus | null) => {
    setStatuses((prev) => {
      const next = { ...prev }
      if (status === null) delete next[id]
      else next[id] = status
      return next
    })
  }, [])

  const cycle = useCallback((id: string) => {
    setStatuses((prev) => {
      const next = { ...prev }
      if (next[id] === undefined) next[id] = 'pass'
      else if (next[id] === 'pass') next[id] = 'fail'
      else delete next[id]
      return next
    })
  }, [])

  const reset = useCallback(() => setStatuses({}), [])

  const counts = useMemo(() => {
    let pass = 0
    let fail = 0
    for (const section of SECTIONS) {
      for (const item of section.items) {
        const status = statuses[item.id]
        if (status === 'pass') pass += 1
        else if (status === 'fail') fail += 1
      }
    }
    const done = pass + fail
    return {
      total: TOTAL_ITEMS,
      pass,
      fail,
      done,
      percent: TOTAL_ITEMS === 0 ? 0 : Math.round((done / TOTAL_ITEMS) * 100),
    }
  }, [statuses])

  const value = useMemo(
    () => ({ statuses, cycle, setStatus, reset, counts }),
    [statuses, cycle, setStatus, reset, counts],
  )

  return (
    <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
  )
}

export function useChecklist(): ChecklistApi {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used inside ChecklistProvider')
  return ctx
}
