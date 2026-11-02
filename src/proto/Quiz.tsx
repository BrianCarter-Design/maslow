import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Face from '../components/BlobFace'
import { getTest } from './tests'
import { useProto } from './store'
import { Arrow, Blob, CharacterArt, Scores } from './ui'

// The answer scale: colour, label and blob shape for each step
const SCALE = [
  { value: 1, label: 'Not me at all', color: '#B57BFF', shape: '50% 50% 42% 42% / 62% 62% 38% 38%' },
  { value: 2, label: 'Not really', color: '#FF8A3D', shape: '34%' },
  { value: 3, label: 'Somewhere between', color: '#C9A27E', shape: '50%' },
  { value: 4, label: 'Mostly me', color: '#FFC93C', shape: '42% 58% 62% 38% / 40% 44% 56% 60%' },
  { value: 5, label: 'Totally me!', color: '#7FD46F', shape: '50%' },
]
const IDLE = { color: '#CDBEF7', shape: '46%' }
const COMMIT_DELAY = 420

const monthYear = () => new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

export default function Quiz() {
  const { id = '' } = useParams()
  const test = getTest(id)
  const navigate = useNavigate()
  const { save } = useProto()
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const locked = useRef(false)
  const dragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Intro, questions and celebration share one address, so reset the scroll as they change
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [phase])

  if (!test) return <Navigate to="/play/tests" replace />
  const total = test.statements.length
  const look = selected ? SCALE[selected - 1] : IDLE

  function commit(value: number) {
    if (locked.current) return
    locked.current = true
    setSelected(value)
    const next = [...answers.slice(0, index), value]
    setAnswers(next)
    setTimeout(() => {
      if (index + 1 >= total) {
        save(test!.id, { ...test!.score(next), date: monthYear() })
        setPhase('done')
      } else {
        setIndex(index + 1)
        setSelected(null)
      }
      locked.current = false
    }, COMMIT_DELAY)
  }

  function back() {
    if (locked.current) return
    if (index === 0) setPhase('intro')
    else setIndex(index - 1)
    setSelected(null)
  }

  function slotAt(clientX: number) {
    const r = trackRef.current!.getBoundingClientRect()
    return Math.floor(Math.min(0.999, Math.max(0, (clientX - r.left) / r.width)) * 5) + 1
  }
  function onDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (locked.current) return
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    setSelected(slotAt(e.clientX))
  }
  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    const v = slotAt(e.clientX)
    if (v !== selected) setSelected(v)
  }
  function onUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    dragging.current = false
    commit(slotAt(e.clientX))
  }

  if (phase === 'intro') return <Intro name={test.name} total={total} minutes={test.minutes} onStart={() => setPhase('quiz')} />
  if (phase === 'done') return <Celebrate name={test.name} total={total} onResults={() => navigate(`/play/test/${test.id}/result`, { replace: true })} />

  return (
    <main className="app pf qz" style={{ '--tint': look.color } as CSSProperties}>
      <header className="qz-top">
        <button className="pf-glass-btn" onClick={back} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="qz-progress" aria-label={`Question ${index + 1} of ${total}`}>
          {test.statements.map((_, i) => <i key={i} className={i < index ? 'is-done' : i === index ? 'is-now' : ''} />)}
        </div>
        <span className="qz-count"><b>{index + 1}</b>/{total}</span>
      </header>

      <section key={index} className="qz-stage">
        <p className="pf-label">{test.name}</p>
        <h1 className="qz-statement">{test.statements[index].text}</h1>
        <span className="pf-blob qz-hero" style={{ '--blob': look.color, borderRadius: look.shape } as CSSProperties} aria-hidden>
          <Face value={selected} size={120} />
        </span>
        <p className="qz-label" key={selected ?? 0}>{selected ? SCALE[selected - 1].label : 'How much is this you?'}</p>
      </section>

      <div className="qz-slider">
        <div
          ref={trackRef}
          className="qz-track"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { dragging.current = false; setSelected(null) }}
          role="radiogroup"
          aria-label="Agreement"
        >
          {SCALE.map((s, i) => (
            <span key={s.value} className="qz-slot" role="radio" aria-checked={selected === s.value} aria-label={s.label}>
              {i > 0 && <i className="qz-divider" />}
              <Face value={s.value} size={28} ghost />
            </span>
          ))}
          <span
            className={`pf-blob qz-knob ${selected ? 'is-set' : ''}`}
            style={{ left: `${((selected ?? 3) - 0.5) * 20}%`, '--blob': look.color } as CSSProperties}
            aria-hidden
          >
            <Face value={selected ?? 3} size={50} />
          </span>
        </div>
        <div className="qz-ends"><span>Not me</span><span>So me</span></div>
      </div>
    </main>
  )
}

function Intro({ name, total, minutes, onStart }: { name: string; total: number; minutes: number; onStart: () => void }) {
  const navigate = useNavigate()
  // Demo knob walks across the scale to show how answering works
  const [demo, setDemo] = useState(3)
  useEffect(() => {
    const steps = [3, 4, 5, 4, 3, 2, 1, 2]
    let i = 0
    const t = setInterval(() => { i = (i + 1) % steps.length; setDemo(steps[i]) }, 900)
    return () => clearInterval(t)
  }, [])
  const look = SCALE[demo - 1]
  return (
    <main className="app pf qz qz-intro" style={{ '--tint': look.color } as CSSProperties}>
      <header className="qz-top">
        <button className="pf-glass-btn" onClick={() => navigate(-1)} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <PageTitle kicker="Assessment" title={name} />
        <span className="qz-top__ghost" />
      </header>

      <section className="qz-intro__top">
        <span className="pf-blob qz-intro__blob" style={{ '--blob': look.color, borderRadius: look.shape } as CSSProperties} aria-hidden>
          <Face value={demo} size={92} />
        </span>
        <p className="pf-label">{total} statements · ~{minutes} min</p>
        <h1>Discover what makes <em>you, you!</em></h1>
        <p className="qz-intro__sub">Rate a few statements about yourself and we’ll reveal your {name} result.</p>
      </section>

      <section className="pf-card qz-how">
        <p className="pf-label">How it works</p>
        <div className="qz-track qz-track--demo" aria-hidden>
          {SCALE.map((s, i) => (
            <span key={s.value} className="qz-slot">
              {i > 0 && <i className="qz-divider" />}
              <Face value={s.value} size={24} ghost />
            </span>
          ))}
          <span className="pf-blob qz-knob is-set" style={{ left: `${(demo - 0.5) * 20}%`, '--blob': look.color } as CSSProperties}>
            <Face value={demo} size={40} />
            <span className="qz-hand">👆</span>
          </span>
        </div>
        <p className="qz-label qz-label--small" key={demo}>{look.label}</p>
        <ol className="qz-steps">
          <li><b>1</b>Read each statement</li>
          <li><b>2</b>Tap the face that fits, or slide along the bar</li>
          <li><b>3</b>Go with your gut, there are no wrong answers</li>
        </ol>
      </section>

      <button className="pf-dark-btn qz-cta" onClick={onStart}>Start assessment <Arrow /></button>
    </main>
  )
}

function Celebrate({ name, total, onResults }: { name: string; total: number; onResults: () => void }) {
  return (
    <main className="app pf qz qz-done" style={{ '--tint': '#7FD46F' } as CSSProperties}>
      <Confetti />
      <header className="qz-top">
        <span className="qz-top__ghost" />
        <PageTitle kicker="Assessment complete" title={name} />
        <span className="qz-top__ghost" />
      </header>
      <div className="qz-done__body">
        <div className="qz-done__hero">
          <span className="qz-ring" />
          <span className="qz-ring qz-ring--2" />
          <Blob className="qz-party" color="#7FD46F" size={170} face={120} mood={5} />
        </div>
        <h1>Woohoo, you did it!</h1>
        <p>All {total} statements answered. Your result is saved to your profile.</p>
      </div>
      <button className="pf-dark-btn qz-cta" onClick={onResults}>See my results <Arrow /></button>
    </main>
  )
}

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(2, devicePixelRatio || 1)
    const w = (canvas.width = canvas.offsetWidth * dpr)
    const h = (canvas.height = canvas.offsetHeight * dpr)
    const colors = SCALE.map((s) => s.color).concat('#FF9EC7', '#9FD8FF', '#6FD6C8')
    const make = (fromLeft: boolean) => ({
      x: fromLeft ? 0 : w, y: h * 0.7,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 14 + 6) * dpr,
      vy: (Math.random() * -22 - 12) * dpr,
      r: (Math.random() * 6 + 4) * dpr,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      kind: Math.floor(Math.random() * 3),
      c: colors[Math.floor(Math.random() * colors.length)],
    })
    const parts = Array.from({ length: 160 }, (_, i) => make(i % 2 === 0))
    let frame = 0
    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      if (frame === 30) for (let i = 0; i < 80; i++) parts.push(make(i % 2 === 0))
      for (const p of parts) {
        p.vy = Math.min(p.vy + 0.5 * dpr, 6 * dpr)
        p.vx *= 0.985
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        if (p.kind === 0) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        else if (p.kind === 1) { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2); ctx.fill() }
        else { ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.lineTo(p.r, p.r); ctx.lineTo(-p.r, p.r); ctx.fill() }
        ctx.restore()
      }
      if (++frame < 320) raf = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="qz-confetti" aria-hidden />
}

// Result page for any test, read from saved results
export function ResultPage() {
  const { id = '' } = useParams()
  const test = getTest(id)
  const navigate = useNavigate()
  const { results } = useProto()
  const result = results[id]
  if (!test || !result) return <Navigate to={test ? `/play/test/${id}` : '/play/tests'} replace />

  return (
    <main className="app pf" style={{ '--tint': test.color } as CSSProperties}>
      <header className="qz-top">
        <button className="pf-glass-btn" onClick={() => navigate('/play/profile')} aria-label="Back to profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <PageTitle kicker="Your result" title={test.name} />
        <span className="qz-top__ghost" />
      </header>

      <section className="pf-hero">
        <div className="pf-hero__stage rs-stage" style={{ '--blob': test.color } as CSSProperties}>
          <span className="pf-status"><i />Saved · {result.date}</span>
          <div className="pf-hero__art"><CharacterArt testId={test.id} result={result} color={test.color} size={200} id={`result-${test.id}`} /></div>
          <p className="pf-note" aria-hidden>
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20 28C8 24 4 14 8 3M8 3 3 8M8 3l5 4" /></svg>
            this is you!
          </p>
        </div>
        <div className="rs-head">
          <p className="pf-label">Your {test.name} result</p>
          <h1>{result.code}</h1>
          <p>{result.name}</p>
        </div>
      </section>

      <section className="pf-card">
        <p className="pf-label rs-label">Your mix</p>
        <Scores scores={result.scores} />
      </section>

      <section className="pf-card rs-about">
        <p className="pf-label rs-label">About you</p>
        <p>{result.blurb}</p>
      </section>

      <div className="rs-actions">
        <button className="pf-dark-btn qz-cta" onClick={() => navigate('/play/profile')}>View my profile <Arrow /></button>
        <button className="rs-ghost" onClick={() => navigate(`/play/test/${test.id}`)}>Retake assessment</button>
      </div>
    </main>
  )
}

// Centered page title in the top bar, so people always know where they are
function PageTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="qz-title">
      <small>{kicker}</small>
      <b>{title}</b>
    </div>
  )
}
