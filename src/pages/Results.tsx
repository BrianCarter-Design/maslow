import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ENNEAGRAM_TYPES, getType } from '../data/enneagramTypes'
import type { Scores } from '../data/enneagramQuestions'
import EnneagramWheel from '../components/EnneagramWheel'
import RadarChart from '../components/RadarChart'

interface ResultsState {
  scores: Scores
  name: string
}

const TABS = ['Your Test Results', 'How People See You', 'How you see others', 'Relationships']

// Compatible types for each core type (simplified)
const COMPATIBLE: Record<number, { type: number; note: string }[]> = {
  1: [{ type: 7, note: 'Bring out your playful side' }, { type: 4, note: 'Deep creative bond' }],
  2: [{ type: 8, note: 'Powerful partnership' }, { type: 4, note: 'Emotional resonance' }],
  3: [{ type: 9, note: 'Grounding presence' }, { type: 6, note: 'Loyal support system' }],
  4: [{ type: 5, note: 'Intellectual depth' }, { type: 9, note: 'Peaceful stability' }],
  5: [{ type: 2, note: 'Warm encouragement' }, { type: 8, note: 'Mutual respect' }],
  6: [{ type: 9, note: 'Calming reassurance' }, { type: 3, note: 'Confident leadership' }],
  7: [{ type: 1, note: 'Grounded perspective' }, { type: 5, note: 'Focused depth' }],
  8: [{ type: 2, note: 'Tender care' }, { type: 5, note: 'Strategic alliance' }],
  9: [{ type: 3, note: 'Inspiring energy' }, { type: 1, note: 'Purposeful direction' }],
}

// Avatar placeholder colors per type
const AVATAR_COLORS = [
  '#1802a0', '#5d0096', '#b45309', '#9c2780',
  '#065f46', '#c2410c', '#cc0000', '#166534', '#78350f',
]

function TypeBadge({ typeNum }: { typeNum: number }) {
  const t = getType(typeNum)
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ background: t.gradient }}
    >
      {typeNum}
    </div>
  )
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-[6px] bg-[#dbdff1] rounded-full w-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  )
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ResultsState | null
  const [activeTab, setActiveTab] = useState(0)
  const [feedbackGiven, setFeedbackGiven] = useState<number | null>(null)

  if (!state) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#535353] text-xl">No results found. Please take the assessment first.</p>
        <Link
          to="/assessment/enneagram"
          className="px-8 py-3 rounded-full font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
        >
          Take Assessment
        </Link>
      </div>
    )
  }

  const { scores, name } = state

  // Sort types by score descending
  const sorted = Object.entries(scores)
    .map(([k, v]) => ({ type: parseInt(k), score: v }))
    .sort((a, b) => b.score - a.score)

  const coreTypeNum = sorted[0].type
  const coreScore = sorted[0].score
  const influence1 = sorted[1]
  const influence2 = sorted[2]
  const coreType = getType(coreTypeNum)
  const wingNum1 = coreType.wing1
  const wingNum2 = coreType.wing2
  const compatible = COMPATIBLE[coreTypeNum] ?? []

  const firstName = name.split(' ')[0]

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-[80px] py-6 flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
            >
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-[#111928] tracking-tight">Maslow</span>
          </Link>
          <div className="flex-1 flex items-center justify-center gap-8">
            <Link to="/" className="font-medium text-[#111928] text-base hover:text-[#5d0096] transition-colors">Blog</Link>
            <Link to="/" className="font-medium text-[#111928] text-base hover:text-[#5d0096] transition-colors">Enneagram</Link>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
            style={{ background: coreType.gradient }}
          >
            {firstName.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Results nav */}
      <div className="bg-white mx-[80px] mt-8 px-6 py-3 rounded-[100px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] flex items-center justify-between max-w-[1280px]">
        <div className="flex items-center gap-4">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 rounded-[30px] font-semibold text-sm capitalize transition-all ${
                activeTab === i
                  ? 'text-white'
                  : 'text-[#111928] hover:text-[#5d0096]'
              }`}
              style={activeTab === i ? { background: '#5d0096' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-[100px] font-semibold text-sm text-[#6f04b6]"
          style={{ background: '#eee6f4' }}
        >
          <span>Share results</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      {/* Main two-column layout */}
      <div className="mx-[80px] mt-10 pb-20 flex gap-8 max-w-[1280px]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-10 flex-1 min-w-0">

          {/* ── Section 1: Hero ─────────────────────────────────── */}
          <div className="bg-white rounded-[30px] p-10 flex flex-col gap-8">
            {/* Heading */}
            <div className="flex flex-col gap-3">
              <p className="text-2xl font-semibold text-[#535353] tracking-tight">Step 2: Enneagram results</p>
              <h1 className="text-[44px] font-semibold text-[#535353] leading-tight tracking-tight">
                {firstName}, let's discover what makes you, you.
              </h1>
            </div>

            {/* Hero card row */}
            <div className="flex gap-8 items-start">
              {/* Gradient hero card */}
              <div
                className="flex-1 rounded-[30px] p-8 relative overflow-hidden min-h-[280px]"
                style={{ background: coreType.gradient }}
              >
                {/* Type + score */}
                <div className="flex items-baseline gap-8 mb-6">
                  <span className="text-white font-bold text-4xl leading-tight">
                    {coreTypeNum}. {coreType.name}
                  </span>
                  <span className="text-white font-bold text-2xl opacity-90">{coreScore}%</span>
                </div>
                {/* Traits */}
                <ul className="flex flex-col gap-2">
                  {coreType.traits.map((t) => (
                    <li key={t} className="text-white text-sm font-semibold opacity-80 list-disc ml-5">{t}</li>
                  ))}
                </ul>
                {/* Decorative heart */}
                <div className="absolute right-6 top-6 text-6xl opacity-20 pointer-events-none">♥</div>
              </div>

              {/* Score panel */}
              <div className="w-[260px] flex flex-col gap-5 shrink-0">
                <p className="font-bold text-lg text-[#535353]">Your Core Type</p>
                {/* Core type row */}
                <div className="flex items-center gap-4">
                  <TypeBadge typeNum={coreTypeNum} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#6d6d6d]">
                        {coreScore}% <span className="font-medium">{coreType.name}</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5d0096" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                    <ScoreBar score={coreScore} color={coreType.color} />
                  </div>
                </div>

                <div className="h-px bg-[#f0f0f0]" />

                <p className="font-bold text-lg text-[#535353]">Your Types of Influence</p>

                {/* Influence 1 */}
                <div className="flex items-center gap-4">
                  <TypeBadge typeNum={influence1.type} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#6d6d6d]">
                        {influence1.score}% <span className="font-medium">{getType(influence1.type).name}</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                    <ScoreBar score={influence1.score} color={getType(influence1.type).color} />
                  </div>
                </div>

                {/* Influence 2 */}
                <div className="flex items-center gap-4">
                  <TypeBadge typeNum={influence2.type} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#6d6d6d]">
                        {influence2.score}% <span className="font-medium">{getType(influence2.type).name}</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                    <ScoreBar score={influence2.score} color={getType(influence2.type).color} />
                  </div>
                </div>
              </div>
            </div>

            {/* "Does this sound like you?" */}
            <div
              className="flex items-center justify-between px-6 py-3 rounded-[100px]"
              style={{ background: 'rgba(89,14,149,0.1)' }}
            >
              <p className="font-semibold text-[#590e95] text-sm">Does this sound like you?</p>
              <div className="flex items-center gap-2">
                {['😕', '😐', '🙂', '😄', '🤩'].map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setFeedbackGiven(i)}
                    className={`text-xl transition-transform hover:scale-125 ${feedbackGiven === i ? 'scale-125' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 2: Why multiple types ───────────────────── */}
          <div className="bg-white rounded-[30px] p-10 flex gap-8 items-start">
            <p className="font-bold text-[#535353] text-2xl tracking-tight leading-tight w-64 shrink-0">
              Why do I have multiple Enneagram types?
            </p>
            <p className="text-[#6b7280] text-lg leading-relaxed flex-1">
              The Enneagram recognizes that we are complex beings. Your core type reflects your dominant pattern of
              thinking, feeling, and behaving — but related types also influence your personality. These "wing" and
              "instinctual" types shape how you express your core self in different situations and relationships.
            </p>
          </div>

          {/* ── Section 3: Understanding your core type ─────────── */}
          <div className="bg-white rounded-[30px] p-10 flex flex-col gap-6">
            <p className="font-semibold text-[#535353] text-[44px] tracking-tight leading-tight">
              Understanding Your Core Enneagram Type.
            </p>
            <div className="flex items-center gap-3">
              <TypeBadge typeNum={coreTypeNum} />
              <span className="font-bold text-[#535353] text-3xl tracking-tight">{coreType.name}</span>
              <span className="text-[#535353] text-3xl">{coreScore}%</span>
            </div>

            {/* Article content */}
            <div className="flex flex-col gap-6">
              <h3 className="font-semibold text-[#535353] text-2xl tracking-tight">
                Let's Unpack Your Enneagram {coreTypeNum} "{coreType.name}" Personality
              </h3>

              {/* Hero image placeholder */}
              <div
                className="h-64 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: coreType.gradient }}
              >
                <div className="text-center text-white">
                  <div className="text-8xl font-bold opacity-30 mb-2">{coreTypeNum}</div>
                  <div className="text-xl font-semibold opacity-60">{coreType.name}</div>
                </div>
              </div>

              <p className="text-[#6b7280] text-lg leading-relaxed">{coreType.description}</p>

              <h3 className="font-semibold text-[#535353] text-2xl tracking-tight">
                Outstanding Qualities of Enneagram {coreTypeNum} Individuals
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {coreType.traits.map((trait) => (
                  <li
                    key={trait}
                    className="flex items-center gap-3 p-4 rounded-2xl text-[#535353] font-medium"
                    style={{ background: 'rgba(93,0,150,0.06)' }}
                  >
                    <span className="text-[#5d0096]">✦</span>
                    {trait}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Section 4: Wings ────────────────────────────────── */}
          <div className="bg-white rounded-[30px] overflow-hidden flex flex-col">
            {/* Wings banner */}
            <div
              className="h-72 relative flex items-center justify-center"
              style={{ background: 'rgba(93,0,150,0.12)' }}
            >
              <EnneagramWheel activeType={coreTypeNum} scores={scores} size={280} />

              {/* Wing type labels */}
              <div className="absolute left-8 top-8">
                <div className="flex items-center gap-3">
                  <TypeBadge typeNum={wingNum1} />
                  <span className="font-bold text-[#535353] text-xl">{getType(wingNum1).name}</span>
                  <span className="text-[#535353]">Wing</span>
                </div>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-4">
              <h2 className="font-semibold text-[#535353] text-[44px] tracking-tight leading-tight">
                Understand Your Enneagram {coreTypeNum} Wings.
              </h2>
              <p className="text-[#6b7280] text-lg leading-relaxed">{coreType.wingDescription}</p>

              <div className="grid grid-cols-2 gap-6 mt-4">
                {[wingNum1, wingNum2].map((wNum) => {
                  const w = getType(wNum)
                  return (
                    <div
                      key={wNum}
                      className="rounded-2xl p-6 flex flex-col gap-3"
                      style={{ background: 'rgba(93,0,150,0.06)' }}
                    >
                      <div className="flex items-center gap-3">
                        <TypeBadge typeNum={wNum} />
                        <span className="font-bold text-[#535353] text-lg">{w.name} Wing</span>
                      </div>
                      <p className="text-[#6b7280] text-sm leading-relaxed">{w.tagline}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Section 5: Stress & Growth ──────────────────────── */}
          <div className="bg-white rounded-[30px] overflow-hidden flex flex-col">
            <div
              className="h-64 flex items-center justify-center relative"
              style={{ background: coreType.gradient }}
            >
              {/* Stress arrow diagram */}
              <div className="flex items-center gap-6 text-white">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold text-2xl">
                    {coreTypeNum}
                  </div>
                  <span className="text-sm font-semibold opacity-80">{coreType.name}</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold opacity-70">Under Stress →</span>
                    <div className="w-12 h-12 bg-white bg-opacity-15 rounded-full flex items-center justify-center font-bold text-xl">
                      {coreType.stress}
                    </div>
                    <span className="text-xs font-semibold opacity-70">{getType(coreType.stress).name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold opacity-70">In Growth →</span>
                    <div className="w-12 h-12 bg-white bg-opacity-15 rounded-full flex items-center justify-center font-bold text-xl">
                      {coreType.growth}
                    </div>
                    <span className="text-xs font-semibold opacity-70">{getType(coreType.growth).name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 flex flex-col gap-6">
              <h2 className="font-semibold text-[#535353] text-[44px] tracking-tight leading-tight">
                Enneagram Arrows: You Under Stress & In Growth.
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6 flex flex-col gap-3 border-2 border-[#fee2e2]" style={{ background: '#fff5f5' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⬇</span>
                    <span className="font-bold text-red-700 text-lg">Under Stress → Type {coreType.stress}</span>
                  </div>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{coreType.stressDescription}</p>
                </div>
                <div className="rounded-2xl p-6 flex flex-col gap-3 border-2 border-[#d1fae5]" style={{ background: '#f0fdf4' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⬆</span>
                    <span className="font-bold text-green-700 text-lg">In Growth → Type {coreType.growth}</span>
                  </div>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{coreType.growthDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 6: Results Map + Scores ─────────────────── */}
          <div className="bg-white rounded-[30px] p-10 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#535353] text-2xl tracking-tight">Your Results Map</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(93,0,150,0.1)', color: '#5d0096' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
            <div className="flex items-start gap-12">
              <RadarChart scores={scores} size={320} />
              <div className="flex-1">
                <p className="font-bold text-[#535353] text-xl mb-5">Your scores</p>
                <div className="flex flex-col gap-4">
                  {sorted.map(({ type, score }) => {
                    const t = getType(type)
                    return (
                      <div key={type} className="flex items-center gap-4">
                        <TypeBadge typeNum={type} />
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#535353]">{t.name}</span>
                            <span className="text-sm font-bold text-[#535353]">{score}%</span>
                          </div>
                          <ScoreBar score={score} color={t.color} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 7: Learn more cards ─────────────────────── */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-[#535353] text-2xl tracking-tight">Learn more about your results</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Relationships', icon: '💞', desc: `How Type ${coreTypeNum} connects with others` },
                { label: 'Career paths', icon: '💼', desc: `Best roles for the ${coreType.name}` },
                { label: 'Growth tips', icon: '🌱', desc: `Practices for Type ${coreTypeNum} development` },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-[20px] p-6 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl">{card.icon}</div>
                  <p className="font-bold text-[#535353]">{card.label}</p>
                  <p className="text-[#6b7280] text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 8: Step 3 CTA ────────────────────────────── */}
          <div
            className="rounded-[30px] p-10 flex flex-col gap-6"
            style={{ background: coreType.gradient }}
          >
            <p className="text-white text-sm font-semibold opacity-70">What's Next</p>
            <h2 className="text-white font-bold text-3xl tracking-tight leading-tight">
              Step 3: Let's see if your friends & family agree!
            </h2>
            <p className="text-white opacity-80 leading-relaxed">
              Share your personality profile with people who know you best. Invite them to rate how well your results
              describe you, and see if their perception matches your self-assessment.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white rounded-full font-bold text-sm" style={{ color: coreType.color }}>
                Share Profile
              </button>
              <button className="px-8 py-3 rounded-full font-bold text-sm border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-colors">
                Invite Friends
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 flex flex-col gap-6">

          {/* Sticky sidebar */}
          <div className="sticky top-[100px] flex flex-col gap-6">

            {/* Profile card */}
            <div className="bg-white rounded-[30px] overflow-hidden">
              <div
                className="h-28 relative"
                style={{ background: coreType.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10 text-white text-8xl font-black">
                  {coreTypeNum}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 -mt-10">
                  <div
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                    style={{ background: coreType.gradient }}
                  >
                    {firstName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="mt-6">
                    <p className="font-bold text-[#111928] text-lg">{firstName}</p>
                    <p className="text-sm text-[#6b7280]">Type {coreTypeNum} · {coreType.name}</p>
                  </div>
                </div>

                <p className="text-[#6b7280] text-sm leading-relaxed">{coreType.tagline}</p>

                <div className="flex flex-col gap-2">
                  {coreType.traits.slice(0, 3).map((trait) => (
                    <div key={trait} className="flex items-center gap-2 text-sm text-[#535353]">
                      <span className="text-[#5d0096] text-xs">●</span>
                      {trait}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/assessment/enneagram')}
                  className="w-full py-2.5 rounded-full font-semibold text-sm mt-2 border-2 transition-colors hover:text-white"
                  style={{ borderColor: coreType.color, color: coreType.color }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = coreType.color
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLButtonElement).style.color = coreType.color
                  }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>

            {/* Compatible types */}
            <div className="bg-white rounded-[30px] p-6 flex flex-col gap-5">
              <p className="font-bold text-[#535353] text-lg">You get along well with</p>
              {compatible.map(({ type, note }) => {
                const ct = getType(type)
                return (
                  <div key={type} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: ct.gradient }}
                    >
                      {type}
                    </div>
                    <div>
                      <p className="font-semibold text-[#535353] text-sm">Type {type} · {ct.name}</p>
                      <p className="text-[#6b7280] text-xs">{note}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* All types mini list */}
            <div className="bg-white rounded-[30px] p-6 flex flex-col gap-4">
              <p className="font-bold text-[#535353] text-lg">All 9 Types</p>
              <div className="grid grid-cols-3 gap-2">
                {ENNEAGRAM_TYPES.map((t) => (
                  <div
                    key={t.number}
                    className={`rounded-2xl p-3 text-center transition-all ${
                      t.number === coreTypeNum ? 'text-white' : 'text-[#535353]'
                    }`}
                    style={{
                      background: t.number === coreTypeNum ? t.gradient : 'rgba(93,0,150,0.06)',
                    }}
                  >
                    <p className="font-bold text-sm">{t.number}</p>
                    <p className={`text-xs font-medium ${t.number === coreTypeNum ? 'text-white opacity-80' : 'text-[#6b7280]'}`}>
                      {t.name}
                    </p>
                    <p className={`text-xs font-bold mt-1 ${t.number === coreTypeNum ? 'text-white' : 'text-[#535353]'}`}>
                      {scores[t.number] ?? 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatars "people like you" */}
            <div className="bg-white rounded-[30px] p-6 flex flex-col gap-4">
              <p className="font-bold text-[#535353] text-lg">Famous Type {coreTypeNum}s</p>
              <div className="flex flex-col gap-3">
                {getFamousExamples(coreTypeNum).map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: AVATAR_COLORS[(person.name.charCodeAt(0) + person.name.charCodeAt(1)) % AVATAR_COLORS.length] }}
                    >
                      {person.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#535353] text-sm">{person.name}</p>
                      <p className="text-[#6b7280] text-xs">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFamousExamples(typeNum: number): { name: string; role: string }[] {
  const examples: Record<number, { name: string; role: string }[]> = {
    1: [{ name: 'Nelson Mandela', role: 'Activist & Leader' }, { name: 'Mahatma Gandhi', role: 'Humanitarian' }, { name: 'Michelle Obama', role: 'Former First Lady' }],
    2: [{ name: 'Oprah Winfrey', role: 'Media Personality' }, { name: 'Mother Teresa', role: 'Humanitarian' }, { name: 'Princess Diana', role: 'Humanitarian' }],
    3: [{ name: 'Taylor Swift', role: 'Musician' }, { name: 'Elon Musk', role: 'Entrepreneur' }, { name: 'Reese Witherspoon', role: 'Actress' }],
    4: [{ name: 'Frida Kahlo', role: 'Artist' }, { name: 'Johnny Depp', role: 'Actor' }, { name: 'Billie Eilish', role: 'Musician' }],
    5: [{ name: 'Bill Gates', role: 'Entrepreneur' }, { name: 'Albert Einstein', role: 'Physicist' }, { name: 'Mark Zuckerberg', role: 'Entrepreneur' }],
    6: [{ name: 'Tom Hanks', role: 'Actor' }, { name: 'Jennifer Aniston', role: 'Actress' }, { name: 'Sigmund Freud', role: 'Psychologist' }],
    7: [{ name: 'Robin Williams', role: 'Comedian & Actor' }, { name: 'Elton John', role: 'Musician' }, { name: 'Jim Carrey', role: 'Comedian & Actor' }],
    8: [{ name: 'Martin Luther King Jr.', role: 'Civil Rights Leader' }, { name: 'Winston Churchill', role: 'Statesman' }, { name: 'Queen Latifah', role: 'Entertainer' }],
    9: [{ name: 'Barack Obama', role: 'Former President' }, { name: 'Keanu Reeves', role: 'Actor' }, { name: 'Morgan Freeman', role: 'Actor' }],
  }
  return examples[typeNum] ?? []
}
