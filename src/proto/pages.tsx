import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Mood } from '../components/BlobFace'
import { ArchitectBlob } from '../components/Characters'
import { useProto } from './store'
import { TESTS } from './tests'
import { Arrow, Blob, CharacterArt, Heading, Screen, TabBar, TestCard, TopBar } from './ui'

const PERSON = { first: 'Alex', last: 'Miller' }

const THREADS: { title: string; source: string; color: string; shape: string; mood: number | Mood }[] = [
  { title: 'Recharges alone', source: 'Type 5 · Introverted 72%', color: '#9FD8FF', shape: '50%', mood: 'rest' },
  { title: 'Fuelled by ideas', source: 'Openness 82%', color: '#C9A7FF', shape: '34%', mood: 'wow' },
  { title: 'Plans, then commits', source: 'Judging 61%', color: '#FFC93C', shape: '42% 58% 62% 38% / 40% 44% 56% 60%', mood: 4 },
]

function useCounts() {
  const { results } = useProto()
  const done = TESTS.filter((t) => results[t.id]).length
  return { results, done, total: TESTS.length, pct: Math.round((done / TESTS.length) * 100) }
}

function Bell() {
  return (
    <button className="pf-glass-btn" aria-label="Notifications">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
    </button>
  )
}

// The person's combined character, with the next characters stacked behind it
function CharacterCard() {
  const navigate = useNavigate()
  const { done, total } = useCounts()
  return (
    <section className="pf-stack">
      <span className="pf-stack__back pf-stack__back--2" aria-hidden />
      <span className="pf-stack__back pf-stack__back--1" aria-hidden />
      <div className="pf-hero">
        <div className="pf-hero__stage">
          <span className="pf-status"><i />{done} of {total} tests</span>
          <span className="pf-sparkle" aria-hidden>✦</span>
          <div className="pf-hero__art"><ArchitectBlob size={196} /></div>
          <span className="pf-chip pf-chip--a">Deep<br />thinker</span>
          <span className="pf-chip pf-chip--b">Plans<br />ahead</span>
          <p className="pf-note" aria-hidden>
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20 28C8 24 4 14 8 3M8 3 3 8M8 3l5 4" /></svg>
            built from<br />your {done} tests
          </p>
        </div>
        <div className="pf-hero__foot">
          <div>
            <h1>The Quiet Architect</h1>
            <p>Your character</p>
          </div>
          <button className="pf-dark-btn" onClick={() => navigate('/play/character')}>Meet them</button>
        </div>
      </div>
    </section>
  )
}

function Widgets() {
  const { done, total, pct } = useCounts()
  const ticks = 24
  return (
    <div className="pf-widgets">
      <section className="pf-widget pf-widget--dark">
        <p className="pf-widget__label">Profile complete</p>
        <p className="pf-widget__value">{pct}%</p>
        <div className="pf-ticks" aria-hidden>
          {Array.from({ length: ticks }, (_, i) => (
            <i key={i} className={i < (ticks * done) / total ? 'is-on' : ''} style={{ animationDelay: `${0.4 + i * 0.03}s` }} />
          ))}
        </div>
      </section>
      <section className="pf-widget pf-widget--glow">
        <p className="pf-widget__label">Tests taken</p>
        <p className="pf-numeral">{done}</p>
      </section>
    </div>
  )
}

function Threads() {
  return (
    <div className="pf-threads">
      {THREADS.map((t) => (
        <article key={t.title} className="pf-thread" style={{ '--blob': t.color } as CSSProperties}>
          <b>{t.title}</b>
          <small>{t.source}</small>
          <Blob className="pf-thread__blob" color={t.color} shape={t.shape} size={64} face={46} mood={t.mood} />
        </article>
      ))}
    </div>
  )
}

/* ---------- Home ---------- */
export function HomePage() {
  const navigate = useNavigate()
  const { results } = useCounts()
  const next = TESTS.find((t) => !results[t.id])
  const insight = THREADS[new Date().getDate() % THREADS.length]

  return (
    <Screen>
      <TopBar sub="Good morning," title={PERSON.first} right={<Bell />} />

      <section className="hm-hello">
        <h1>What will you<br />discover today?</h1>
      </section>

      {next ? (
        <button className="hm-next" style={{ '--blob': next.color } as CSSProperties} onClick={() => navigate(`/play/test/${next.id}`)}>
          <div>
            <p className="pf-label">Up next · {next.minutes} min</p>
            <b>{next.name}</b>
            <span>{next.teaser}</span>
            <span className="pf-dark-btn hm-next__btn">Start <Arrow size={14} /></span>
          </div>
          <Blob className="hm-next__blob" color={next.color} shape={next.shape} size={110} face={78} mood={4} />
        </button>
      ) : (
        <section className="hm-next hm-next--done" style={{ '--blob': '#7FD46F' } as CSSProperties}>
          <div>
            <p className="pf-label">All done</p>
            <b>Every test complete</b>
            <span>Your full character is unlocked.</span>
          </div>
          <Blob className="hm-next__blob" color="#7FD46F" size={110} face={78} mood={5} />
        </section>
      )}

      <Widgets />

      <Heading title="Your character" aside={<Link to="/play/character">See all</Link>} />
      <CharacterCard />

      <Heading title="Today’s insight" />
      <section className="hm-insight" style={{ '--blob': insight.color } as CSSProperties}>
        <Blob color={insight.color} shape={insight.shape} size={56} face={40} mood={insight.mood} />
        <div>
          <b>{insight.title}</b>
          <small>{insight.source}</small>
        </div>
      </section>

      <Heading title="Explore tests" aside={<Link to="/play/tests">See all</Link>} />
      <div className="pf-threads">
        {TESTS.map((t) => (
          <Link key={t.id} to={results[t.id] ? `/play/test/${t.id}/result` : `/play/test/${t.id}`} className="pf-thread hm-test" style={{ '--blob': t.color } as CSSProperties}>
            <b>{t.name}</b>
            <small>{results[t.id] ? results[t.id].code : `${t.minutes} min`}</small>
            <Blob className="pf-thread__blob" color={t.color} shape={t.shape} size={64} face={46} mood={results[t.id] ? 4 : 'rest'} muted={!results[t.id]} />
            <span className="pf-round-btn" aria-hidden><Arrow size={12} /></span>
          </Link>
        ))}
      </div>

      <TabBar />
    </Screen>
  )
}

/* ---------- Tests ---------- */
export function TestsPage() {
  const { results, done, total } = useCounts()
  const [filter, setFilter] = useState<'all' | 'taken' | 'new'>('all')
  const list = TESTS.filter((t) => (filter === 'all' ? true : filter === 'taken' ? results[t.id] : !results[t.id]))

  return (
    <Screen>
      <TopBar sub="Discover more of you" title="Tests" />
      <div className="ts-filters" role="tablist">
        {([['all', `All ${total}`], ['taken', `Taken ${done}`], ['new', `New ${total - done}`]] as const).map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>
      <div className="pf-tests">
        {list.map((t, i) => <TestCard key={t.id} test={t} result={results[t.id]} delay={i} />)}
        {list.length === 0 && <p className="ts-empty">Nothing here yet.</p>}
      </div>
      <TabBar />
    </Screen>
  )
}

/* ---------- Progress ---------- */
const MILESTONES = [
  { at: 1, title: 'First sketch', note: 'Your character starts to take shape' },
  { at: 3, title: 'Blueprint', note: 'Common threads appear across tests' },
  { at: 6, title: 'Full character', note: 'Every side of you, in one place' },
]

export function ProgressPage() {
  const { results, done } = useCounts()
  const { reset } = useProto()
  const taken = TESTS.filter((t) => results[t.id])

  return (
    <Screen>
      <TopBar sub="Your journey" title="Progress" />
      <Widgets />

      <Heading title="Milestones" />
      <section className="pf-card pg-milestones">
        {MILESTONES.map((m) => {
          const hit = done >= m.at
          return (
            <div key={m.title} className={`pg-milestone ${hit ? 'is-hit' : ''}`}>
              <span className="pg-dot">{hit ? '✓' : m.at}</span>
              <div>
                <b>{m.title}</b>
                <small>{hit ? m.note : `Unlocks at ${m.at} tests`}</small>
              </div>
            </div>
          )
        })}
      </section>

      <Heading title="History" aside={`${taken.length} results`} />
      <section className="pf-card pg-history">
        {taken.length === 0 && <p className="ts-empty">No tests taken yet.</p>}
        {taken.map((t) => (
          <Link key={t.id} to={`/play/test/${t.id}/result`} className="pg-row">
            <span className="pg-row__art"><CharacterArt kind={results[t.id].character} color={t.color} size={52} id={`hist-${t.id}`} /></span>
            <div>
              <b>{t.name}</b>
              <small>{results[t.id].code} · {results[t.id].name}</small>
            </div>
            <span className="pg-row__date">{results[t.id].date}</span>
          </Link>
        ))}
      </section>

      <Heading title="Prototype" />
      <section className="pf-card pg-demo">
        <p>Try the app as a new person, or go back to Alex’s sample profile.</p>
        <div>
          <button className="rs-ghost" onClick={() => reset('empty')}>Start fresh</button>
          <button className="rs-ghost" onClick={() => reset('sample')}>Sample profile</button>
        </div>
      </section>

      <TabBar />
    </Screen>
  )
}

/* ---------- Profile ---------- */
export function ProfilePage() {
  const { results, done, total } = useCounts()
  const taken = TESTS.filter((t) => results[t.id])
  const pending = TESTS.filter((t) => !results[t.id])

  return (
    <Screen>
      <TopBar sub="Welcome back" title={`${PERSON.first} ${PERSON.last}`} right={<Bell />} />
      <CharacterCard />

      <Heading title="Common threads" aside="Across your tests" />
      <Threads />

      <Heading title="Your results" aside={`${done} of ${total}`} />
      <div className="pf-tests">
        {taken.map((t, i) => <TestCard key={t.id} test={t} result={results[t.id]} delay={i} />)}
        {taken.length === 0 && <p className="ts-empty">Take a test to see your first result.</p>}
      </div>

      {pending.length > 0 && (
        <>
          <Heading title="Still to discover" />
          <div className="pf-tests">
            {pending.map((t, i) => <TestCard key={t.id} test={t} delay={i} />)}
          </div>
        </>
      )}

      <TabBar />
    </Screen>
  )
}

/* ---------- Character ---------- */
export function CharacterPage() {
  const { results, done } = useCounts()
  const taken = TESTS.filter((t) => results[t.id])
  const [copied, setCopied] = useState(false)

  async function share() {
    const text = 'I’m The Quiet Architect on Maslow. Find your character:'
    try {
      if (navigator.share) await navigator.share({ title: 'My Maslow character', text, url: location.origin + '/play' })
      else { await navigator.clipboard.writeText(`${text} ${location.origin}/play`); setCopied(true) }
    } catch { /* share dismissed */ }
  }

  return (
    <Screen>
      <TopBar back sub="Your character" title="The Quiet Architect" />

      <section className="pf-hero">
        <div className="pf-hero__stage ch-stage">
          <span className="pf-status"><i />Built from {done} tests</span>
          <div className="pf-hero__art"><ArchitectBlob size={230} /></div>
          <span className="pf-chip pf-chip--a">Deep<br />thinker</span>
          <span className="pf-chip pf-chip--b">Plans<br />ahead</span>
        </div>
        <div className="ch-copy">
          <p>
            You design ideas carefully, build them on your own, and only show the finished plan. You see systems where
            others see chaos, and you’re happiest when a good idea finally clicks into place.
          </p>
          <div className="ch-tags">
            {['Strategic', 'Independent', 'Curious', 'Reserved', 'Thorough'].map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <Heading title="What shapes them" />
      <section className="pf-card pg-history">
        {taken.length === 0 && <p className="ts-empty">Take a test to start building your character.</p>}
        {taken.map((t) => (
          <Link key={t.id} to={`/play/test/${t.id}/result`} className="pg-row">
            <span className="pg-row__art"><CharacterArt kind={results[t.id].character} color={t.color} size={52} id={`shape-${t.id}`} /></span>
            <div>
              <b>{results[t.id].name}</b>
              <small>{t.name} · {results[t.id].code}</small>
            </div>
            <span className="pg-row__date"><Arrow size={14} /></span>
          </Link>
        ))}
      </section>

      <Heading title="Strengths & watch-outs" />
      <div className="ch-split">
        <section className="ch-tile" style={{ '--blob': '#7FD46F' } as CSSProperties}>
          <Blob color="#7FD46F" size={44} face={32} mood={5} />
          <b>At your best</b>
          <p>Calm, independent problem-solving and long-range plans.</p>
        </section>
        <section className="ch-tile" style={{ '--blob': '#FFA36B' } as CSSProperties}>
          <Blob color="#FFA36B" shape="34%" size={44} face={32} mood={2} />
          <b>Watch out for</b>
          <p>Overthinking and keeping people at arm’s length.</p>
        </section>
      </div>

      <div className="rs-actions">
        <button className="pf-dark-btn qz-cta" onClick={share}>{copied ? 'Link copied' : 'Share my character'}</button>
      </div>
      <TabBar />
    </Screen>
  )
}
