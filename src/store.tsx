import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { QUICK_ITEMS, SECTIONS, TOTAL_ITEMS } from './data/checklist'
import type { ItemStatus, StatusMap } from './types'

export type Mode = 'full' | 'quick'

const STORAGE_KEY = 'benchcheck:statuses:v1'
const REASONS_KEY = 'benchcheck:reasons:v1'
const QUICK_STATUSES_KEY = 'benchcheck:quick-statuses:v1'
const QUICK_REASONS_KEY = 'benchcheck:quick-reasons:v1'
const META_KEY = 'benchcheck:meta:v1'

interface ChecklistApi {
  mode: Mode
  setMode: (m: Mode) => void
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
  reasons: Record<string, string>
  setReason: (id: string, reason: string) => void
  meta: { model: string }
  setModel: (model: string) => void
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

function loadQuickStatuses(): StatusMap {
  try {
    const raw = localStorage.getItem(QUICK_STATUSES_KEY)
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

function loadReasons(): Record<string, string> {
  try {
    const raw = localStorage.getItem(REASONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>
    }
    return {}
  } catch {
    return {}
  }
}

function loadQuickReasons(): Record<string, string> {
  try {
    const raw = localStorage.getItem(QUICK_REASONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>
    }
    return {}
  } catch {
    return {}
  }
}

function loadMeta(): { model: string } {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return { model: '' }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && typeof parsed.model === 'string') {
      return parsed
    }
    return { model: '' }
  } catch {
    return { model: '' }
  }
}

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('full')
  const [fullStatuses, setFullStatuses] = useState(loadStatuses)
  const [quickStatuses, setQuickStatuses] = useState(loadQuickStatuses)
  const [fullReasons, setFullReasons] = useState(loadReasons)
  const [quickReasons, setQuickReasons] = useState(loadQuickReasons)
  const [meta, setMeta] = useState(loadMeta)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullStatuses))
    } catch {
    }
  }, [fullStatuses])

  useEffect(() => {
    try {
      localStorage.setItem(REASONS_KEY, JSON.stringify(fullReasons))
    } catch {
    }
  }, [fullReasons])

  useEffect(() => {
    try {
      localStorage.setItem(QUICK_STATUSES_KEY, JSON.stringify(quickStatuses))
    } catch {
    }
  }, [quickStatuses])

  useEffect(() => {
    try {
      localStorage.setItem(QUICK_REASONS_KEY, JSON.stringify(quickReasons))
    } catch {
    }
  }, [quickReasons])

  useEffect(() => {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(meta))
    } catch {
    }
  }, [meta])

  const statuses = mode === 'full' ? fullStatuses : quickStatuses
  const reasons = mode === 'full' ? fullReasons : quickReasons

  const setStatus = useCallback(
    (id: string, status: ItemStatus | null) => {
      const set = mode === 'full' ? setFullStatuses : setQuickStatuses
      set((prev) => {
        const next = { ...prev }
        if (status === null) delete next[id]
        else next[id] = status
        return next
      })
    },
    [mode],
  )

  const setReason = useCallback(
    (id: string, reason: string) => {
      const set = mode === 'full' ? setFullReasons : setQuickReasons
      set((prev) => {
        const next = { ...prev }
        if (reason) next[id] = reason
        else delete next[id]
        return next
      })
    },
    [mode],
  )

  const setModel = useCallback((model: string) => setMeta({ model }), [])

  const cycle = useCallback(
    (id: string) => {
      const set = mode === 'full' ? setFullStatuses : setQuickStatuses
      set((prev) => {
        const next = { ...prev }
        if (next[id] === undefined) next[id] = 'pass'
        else if (next[id] === 'pass') next[id] = 'fail'
        else delete next[id]
        return next
      })
    },
    [mode],
  )

  const reset = useCallback(() => {
    if (mode === 'full') {
      setFullStatuses({})
      setFullReasons({})
    } else {
      setQuickStatuses({})
      setQuickReasons({})
    }
  }, [mode])

  const setMode = useCallback((m: Mode) => setModeState(m), [])

  const counts = useMemo(() => {
    let pass = 0
    let fail = 0
    if (mode === 'quick') {
      for (const item of QUICK_ITEMS) {
        const status = statuses[item.id]
        if (status === 'pass') pass += 1
        else if (status === 'fail') fail += 1
      }
    } else {
      for (const section of SECTIONS) {
        for (const item of section.items) {
          const status = statuses[item.id]
          if (status === 'pass') pass += 1
          else if (status === 'fail') fail += 1
        }
      }
    }
    const total = mode === 'quick' ? QUICK_ITEMS.length : TOTAL_ITEMS
    const done = pass + fail
    return {
      total,
      pass,
      fail,
      done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    }
  }, [statuses, mode])

  const value = useMemo(
    () => ({
      mode,
      setMode,
      statuses,
      cycle,
      setStatus,
      reset,
      counts,
      reasons,
      setReason,
      meta,
      setModel,
    }),
    [
      mode,
      setMode,
      statuses,
      cycle,
      setStatus,
      reset,
      counts,
      reasons,
      setReason,
      meta,
      setModel,
    ],
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
