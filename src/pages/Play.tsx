import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { ENNEAGRAM_QUESTIONS } from '../data/enneagramQuestions'
import './play.css'

// Five statements, each from a different type
const QUESTION_IDS = [13, 1, 22, 7, 25]
const QUESTIONS = QUESTION_IDS.map((id) => ENNEAGRAM_QUESTIONS.find((q) => q.id === id)!)
const TOTAL = QUESTIONS.length

const SCALE = [
  { value: 1, label: 'Not me at all', color: '#B57BFF', bg: '#EBDDFF', ink: '#3E1677', shape: '50% 50% 42% 42% / 62% 62% 38% 38%' },
  { value: 2, label: 'Not really', color: '#FF8A3D', bg: '#FFE3CF', ink: '#6B2A00', shape: '34%' },
  { value: 3, label: 'Somewhere between', color: '#C9A27E', bg: '#F2E8DD', ink: '#4A2F18', shape: '50%' },
  { value: 4, label: 'Mostly me', color: '#FFC93C', bg: '#FFF1C4', ink: '#6B4300', shape: '42% 58% 62% 38% / 40% 44% 56% 60%' },
  { value: 5, label: 'Totally me!', color: '#7FD46F', bg: '#DDF6D3', ink: '#1F4A16', shape: '50%' },
]
const IDLE = { color: '#CDBEF7', bg: '#EEEAF6', ink: '#2E2350', shape: '46%' }
const COMMIT_DELAY = 420

export default function Play() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const locked = useRef(false)
  const dragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const q = QUESTIONS[index]
  const look = selected ? SCALE[selected - 1] : IDLE

  function commit(value: number) {
    if (locked.current) return
    locked.current = true
    setSelected(value)
    setTimeout(() => {
      if (index + 1 >= TOTAL) setPhase('done')
      else {
        setIndex(index + 1)
        setSelected(null)
      }
      locked.current = false
    }, COMMIT_DELAY)
  }

  // Back from the first question returns to the intro
  function back() {
    if (locked.current) return
    if (index === 0) setPhase('intro')
    else setIndex(index - 1)
    setSelected(null)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setPhase('intro')
  }

  function slotAt(clientX: number) {
    const r = trackRef.current!.getBoundingClientRect()
    const ratio = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width))
    return Math.floor(ratio * 5) + 1
  }
  function onDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (locked.current) return
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    setSelected(slotAt(e.clientX))
  }
  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragging.current) setSelected(slotAt(e.clientX))
  }
  function onUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    dragging.current = false
    commit(slotAt(e.clientX))
  }

  if (phase === 'intro') return <Intro onStart={() => setPhase('quiz')} />
  if (phase === 'done') return <Done onRestart={restart} />

  return (
    <main className="mq" style={{ '--bg': look.bg, '--c': look.color, '--ink': look.ink } as CSSProperties}>
      <header className="mq-top">
        <button className="mq-back" onClick={back} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="mq-progress" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={index}>
          <span className="mq-progress__fill" style={{ width: `${(index / TOTAL) * 100}%` }} />
        </div>
        <span className="mq-count"><b>{index + 1}</b>/{TOTAL}</span>
        <img className="mq-icon" src="/maslow-icon.png" alt="Maslow" />
      </header>

      <section key={q.id} className="mq-stage">
        <h1 className="mq-statement">{q.text}</h1>
        <div className="mq-hero" style={{ borderRadius: look.shape }} aria-hidden>
          <Face value={selected} size={140} />
        </div>
        <p className="mq-label" key={selected ?? 0}>{selected ? SCALE[selected - 1].label : 'How much is this you?'}</p>
      </section>

      <div className="mq-slider">
        <div
          ref={trackRef}
          className="mq-track"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { dragging.current = false; setSelected(null) }}
          role="radiogroup"
          aria-label="Agreement"
        >
          {SCALE.map((s, i) => (
            <span key={s.value} className="mq-slot" role="radio" aria-checked={selected === s.value} aria-label={s.label}>
              {i > 0 && <i className="mq-divider" />}
              <Face value={s.value} size={30} ghost />
            </span>
          ))}
          <span
            className={`mq-knob ${selected ? 'is-set' : ''}`}
            style={{ left: `${((selected ?? 3) - 0.5) * 20}%`, background: look.color }}
            aria-hidden
          >
            <Face value={selected ?? 3} size={46} />
          </span>
        </div>
        <div className="mq-ends"><span>Not me</span><span>So me</span></div>
      </div>
    </main>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
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
    <main className="mq mq-intro" style={{ '--bg': look.bg, '--c': look.color, '--ink': look.ink } as CSSProperties}>
      <img className="mq-logo" src="/maslow-logo.png" alt="Maslow" />
      <div className="mq-intro__body">
        <div className="mq-hero" style={{ borderRadius: look.shape }} aria-hidden>
          <Face value={demo} size={96} />
        </div>
        <h1 className="mq-intro__title">Discover what makes <em>you, you!</em></h1>
        <p className="mq-intro__sub">Rate a few statements about yourself and we'll reveal your Enneagram personality type.</p>

        <section className="mq-how">
          <h2>How it works</h2>
          <div className="mq-track mq-track--demo" aria-hidden>
            {SCALE.map((s, i) => (
              <span key={s.value} className="mq-slot">
                {i > 0 && <i className="mq-divider" />}
                <Face value={s.value} size={24} ghost />
              </span>
            ))}
            <span className="mq-knob is-set" style={{ left: `${(demo - 0.5) * 20}%`, background: look.color }}>
              <Face value={demo} size={36} />
              <span className="mq-hand">👆</span>
            </span>
          </div>
          <p className="mq-label" key={demo}>{look.label}</p>
          <ol className="mq-steps">
            <li><b>1</b>Read each statement</li>
            <li><b>2</b>Tap the face that fits, or slide along the bar</li>
            <li><b>3</b>Go with your gut, there are no wrong answers</li>
          </ol>
        </section>
      </div>
      <button className="mq-cta" onClick={onStart}>Let's start</button>
    </main>
  )
}

function Done({ onRestart }: { onRestart: () => void }) {
  const look = SCALE[4]
  return (
    <main className="mq mq-done" style={{ '--bg': look.bg, '--c': look.color, '--ink': look.ink } as CSSProperties}>
      <Confetti />
      <img className="mq-logo" src="/maslow-logo.png" alt="Maslow" />
      <div className="mq-done__body">
        <div className="mq-done__hero">
          <span className="mq-ring" />
          <span className="mq-ring mq-ring--2" />
          <div className="mq-hero mq-hero--party" aria-hidden><Face value={5} size={130} /></div>
        </div>
        <h1 className="mq-done__title">Woohoo, you did it!</h1>
        <p className="mq-done__sub">All {TOTAL} statements answered. Thanks for taking the test!</p>
      </div>
      <button className="mq-cta" onClick={onRestart}>Back to start</button>
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
    const colors = SCALE.map((s) => s.color).concat('#FF5DA2', '#5B8CFF')
    const make = (fromLeft: boolean) => ({
      x: fromLeft ? 0 : w,
      y: h * 0.7,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 14 + 6) * dpr,
      vy: (Math.random() * -22 - 12) * dpr,
      r: (Math.random() * 6 + 4) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      kind: Math.floor(Math.random() * 3),
      c: colors[Math.floor(Math.random() * colors.length)],
    })
    const parts = Array.from({ length: 160 }, (_, i) => make(i % 2 === 0))
    let frame = 0
    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      // Second wave half a second in
      if (frame === 30) for (let i = 0; i < 80; i++) parts.push(make(i % 2 === 0))
      for (const p of parts) {
        p.vy += 0.5 * dpr
        p.vx *= 0.985
        p.vy = Math.min(p.vy, 6 * dpr)
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
      if (++frame < 320) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="mq-confetti" aria-hidden />
}

// Flat character faces, one per answer value (null = curious idle face)
function Face({ value, size, ghost }: { value: number | null; size: number; ghost?: boolean }) {
  const ink = ghost ? '#B9B4C2' : 'var(--ink)'
  const line = { stroke: ink, strokeWidth: 7, strokeLinecap: 'round' as const, fill: 'none' }
  const eyes = (
    <>
      <circle cx="36" cy="42" r="6" fill={ink} />
      <circle cx="64" cy="42" r="6" fill={ink} />
    </>
  )
  return (
    <svg className="mq-face" width={size} height={size} viewBox="0 0 100 100">
      {value === null && <>{eyes}<circle cx="50" cy="66" r="6" {...line} strokeWidth={6} /></>}
      {value === 1 && (
        <>
          <path d="M27 42 Q35 48 43 42" {...line} />
          <path d="M57 42 Q65 48 73 42" {...line} />
          <path d="M36 70 Q50 56 64 70 Z" {...line} fill={ink} strokeLinejoin="round" />
        </>
      )}
      {value === 2 && <>{eyes}<path d="M35 70 Q50 58 65 70" {...line} /></>}
      {value === 3 && <>{eyes}<path d="M37 64 H63" {...line} /></>}
      {value === 4 && <>{eyes}<path d="M34 60 Q50 74 66 60" {...line} /></>}
      {value === 5 && (
        <>
          <path d="M27 45 Q35 37 43 45" {...line} />
          <path d="M57 45 Q65 37 73 45" {...line} />
          <path d="M32 58 H68 Q66 76 50 76 Q34 76 32 58 Z" fill={ink} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}
