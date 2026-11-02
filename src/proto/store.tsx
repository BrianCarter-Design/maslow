import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SEED_RESULTS } from './tests'
import type { TestResult } from './tests'

// Prototype state, kept in this browser so actions on one page show up everywhere
const KEY = 'maslow:proto:results'
const SOCIAL_KEY = 'maslow:proto:social'

export type InviteMode = 'self' | 'about'
export interface InviteOpts { testId?: string; mode?: InviteMode; friendIds?: string[] }
export interface SentInvite { id: string; testId: string; mode: InviteMode; friendIds: string[]; when: string }

interface Social {
  sent: SentInvite[]
  doneRequests: string[]
  dismissed: string[]
  cheers: string[]
  // Results you gave about friends, keyed "friendId:testId"
  given: Record<string, TestResult>
}

interface Store {
  results: Record<string, TestResult>
  save: (id: string, result: TestResult) => void
  reset: (mode: 'sample' | 'empty') => void
  social: Social
  sendInvite: (invite: Omit<SentInvite, 'id' | 'when'>) => void
  giveResult: (friendId: string, testId: string, result: TestResult) => void
  completeRequest: (id: string) => void
  dismissRequest: (id: string) => void
  toggleCheer: (id: string) => void
  invite: InviteOpts | null
  openInvite: (opts?: InviteOpts) => void
  closeInvite: () => void
  toast: string | null
  showToast: (text: string) => void
}

const EMPTY_SOCIAL: Social = { sent: [], doneRequests: [], dismissed: [], cheers: [], given: {} }

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return { ...fallback, ...JSON.parse(raw) }
  } catch { /* storage blocked */ }
  return fallback
}

export function ProtoProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState(() => load(KEY, SEED_RESULTS))
  const [social, setSocial] = useState(() => load(SOCIAL_KEY, EMPTY_SOCIAL))
  const [invite, setInvite] = useState<InviteOpts | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(results)) } catch { /* storage blocked */ }
  }, [results])
  useEffect(() => {
    try { localStorage.setItem(SOCIAL_KEY, JSON.stringify(social)) } catch { /* storage blocked */ }
  }, [social])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const value: Store = {
    results,
    save: (id, result) => setResults((r) => ({ ...r, [id]: result })),
    reset: (mode) => {
      setResults(mode === 'sample' ? SEED_RESULTS : {})
      setSocial(EMPTY_SOCIAL)
    },
    social,
    sendInvite: (inv) => setSocial((s) => ({ ...s, sent: [{ ...inv, id: String(Date.now()), when: 'Just now' }, ...s.sent] })),
    giveResult: (friendId, testId, result) => setSocial((s) => ({ ...s, given: { ...s.given, [`${friendId}:${testId}`]: result } })),
    completeRequest: (id) => setSocial((s) => ({ ...s, doneRequests: [...new Set([...s.doneRequests, id])] })),
    dismissRequest: (id) => setSocial((s) => ({ ...s, dismissed: [...new Set([...s.dismissed, id])] })),
    toggleCheer: (id) => setSocial((s) => ({ ...s, cheers: s.cheers.includes(id) ? s.cheers.filter((c) => c !== id) : [...s.cheers, id] })),
    invite,
    openInvite: (opts = {}) => setInvite(opts),
    closeInvite: () => setInvite(null),
    toast,
    showToast: setToast,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProto() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProto must be used inside ProtoProvider')
  return ctx
}
