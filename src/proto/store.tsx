import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SEED_RESULTS } from './tests'
import type { TestResult } from './tests'

// Saved results for the prototype, kept in this browser so taking a test updates every page
const KEY = 'maslow:proto:results'

interface Store {
  results: Record<string, TestResult>
  save: (id: string, result: TestResult) => void
  reset: (mode: 'sample' | 'empty') => void
}

const Ctx = createContext<Store | null>(null)

function load(): Record<string, TestResult> {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* storage blocked */ }
  return SEED_RESULTS
}

export function ProtoProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(results)) } catch { /* storage blocked */ }
  }, [results])

  const value: Store = {
    results,
    save: (id, result) => setResults((r) => ({ ...r, [id]: result })),
    reset: (mode) => setResults(mode === 'sample' ? SEED_RESULTS : {}),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProto() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProto must be used inside ProtoProvider')
  return ctx
}
