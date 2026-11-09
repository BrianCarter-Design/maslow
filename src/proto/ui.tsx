import { useLayoutEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Face from '../components/BlobFace'
import type { Mood } from '../components/BlobFace'
import { Character } from '../components/Characters'
import { propFor } from './tests'
import { usePendingRequests } from './social'
import type { TestDef, TestResult } from './tests'

// Each new screen starts at the top. Without this the browser keeps the previous
// page's scroll position, so opening an assessment from far down a long page
// landed on an empty, scrolled-down screen.
export function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Small matte clay blob with a face
export function Blob({ color, shape = '50%', size, face, mood, muted, className = '' }: {
  color: string
  shape?: string
  size: number
  face: number
  mood: number | Mood | null
  muted?: boolean
  className?: string
}) {
  return (
    <span
      className={`pf-blob ${muted ? 'is-muted' : ''} ${className}`}
      style={{ '--blob': color, width: size, height: size, borderRadius: shape } as CSSProperties}
      aria-hidden
    >
      <Face value={mood} size={face} />
    </span>
  )
}

// Full character illustration for a result
export function CharacterArt({ testId, result, color, size, id }: { testId: string; result: TestResult; color: string; size: number; id: string }) {
  return <Character kind={propFor(testId, result)} color={color} size={size} id={id} />
}

export function Screen({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <main className={`app pf ${className}`} style={style}>{children}</main>
}

export function TopBar({ title, sub, back, right }: { title: string; sub?: string; back?: boolean; right?: ReactNode }) {
  const navigate = useNavigate()
  return (
    <header className="pf-top">
      {back ? (
        <button className="pf-glass-btn" onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      ) : (
        <Blob color="#7659FF" size={44} face={32} mood="wink" />
      )}
      <div className="pf-top__who">
        {sub && <small>{sub}</small>}
        <b>{title}</b>
      </div>
      {right}
    </header>
  )
}

const TABS = [
  { to: '/play', label: 'Home', d: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z', end: true },
  { to: '/play/tests', label: 'Assessments', d: 'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3' },
  { to: '/play/friends', label: 'Friends', d: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3.5 5.5' },
  { to: '/play/progress', label: 'Progress', d: 'M5 20V10M12 20V4M19 20v-7' },
  { to: '/play/profile', label: 'Profile', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
]

export function TabBar() {
  const pending = usePendingRequests().length
  return (
    <nav className="pf-tabs" aria-label="Main">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
          {t.to === '/play/friends' && pending > 0 && <i className="pf-tabs__badge" aria-label={`${pending} requests`}>{pending}</i>}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={t.d} /></svg>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Heading({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="pf-heading">
      <h2>{title}</h2>
      {aside && <span>{aside}</span>}
    </div>
  )
}

export function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  )
}

// One card for every test: taken shows the result, not taken invites you in
export function TestCard({ test, result, delay = 0 }: { test: TestDef; result?: TestResult; delay?: number }) {
  const navigate = useNavigate()
  const done = Boolean(result)
  const open = () => navigate(done ? `/play/test/${test.id}/result` : `/play/test/${test.id}`)
  return (
    <article
      className={`pf-card ${done ? '' : 'is-pending'}`}
      style={{ '--blob': test.color, animationDelay: `${0.1 + delay * 0.05}s` } as CSSProperties}
    >
      <header className="pf-card__head">
        <Blob color={test.color} shape={test.shape} size={44} face={30} mood={done ? 4 : 'rest'} muted={!done} />
        <div className="pf-card__title">
          <b>{test.name}</b>
          <small>{done ? `Taken ${result!.date}` : `Not taken · ${test.minutes} min`}</small>
        </div>
        {done ? (
          <button className="pf-glass-btn" onClick={open} aria-label={`Open ${test.name} results`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </button>
        ) : (
          <button className="pf-take" onClick={open}>
            Take assessment
            <span><Arrow size={12} /></span>
          </button>
        )}
      </header>

      {done ? (
        <>
          <div className="pf-card__hero">
            <p className="pf-card__result">{result!.code}<span>{result!.name}</span></p>
            <span className="pf-card__art"><CharacterArt testId={test.id} result={result!} color={test.color} size={92} id={`card-${test.id}`} /></span>
          </div>
          <Scores scores={result!.scores} />
        </>
      ) : (
        <p className="pf-card__teaser">{test.teaser}</p>
      )}
    </article>
  )
}

export function Scores({ scores }: { scores: TestResult['scores'] }) {
  return (
    <div className="pf-scores">
      {scores.map((s) => (
        <div key={s.label}>
          <small>{s.label}</small>
          <span className="pf-meter"><i style={{ width: `${s.pct}%`, '--c': s.color } as CSSProperties} /></span>
          <b>{s.pct}</b>
        </div>
      ))}
    </div>
  )
}
