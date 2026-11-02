// Clay-character faces used across the app: big white eyes with dark pupils,
// soft brows and a mouth. Numeric values 1–5 map to the answer scale
// (1 = "not me", 5 = "so me"); named moods are for decoration.
export type Mood = 'sleep' | 'rest' | 'wow' | 'wink'

export default function Face({ value, size, ghost }: { value: number | Mood | null; size: number; ghost?: boolean }) {
  const ink = ghost ? '#B9B4C2' : 'var(--ink, #1c1a22)'
  const line = { stroke: ink, strokeWidth: 6, strokeLinecap: 'round' as const, fill: 'none' }

  // Ghost faces (slider hints) stay as simple line drawings
  if (ghost) {
    const dots = <><circle cx="36" cy="44" r="5.5" fill={ink} /><circle cx="64" cy="44" r="5.5" fill={ink} /></>
    return (
      <svg className="mq-face" width={size} height={size} viewBox="0 0 100 100">
        {value === 1 && <><path d="M28 44 Q36 49 44 44" {...line} /><path d="M56 44 Q64 49 72 44" {...line} /><path d="M38 70 Q50 60 62 70" {...line} /></>}
        {value === 2 && <>{dots}<path d="M37 70 Q50 61 63 70" {...line} /></>}
        {value === 3 && <>{dots}<path d="M38 66 H62" {...line} /></>}
        {value === 4 && <>{dots}<path d="M36 62 Q50 72 64 62" {...line} /></>}
        {value === 5 && <><path d="M28 46 Q36 39 44 46" {...line} /><path d="M56 46 Q64 39 72 46" {...line} /><path d="M35 60 H65 Q63 75 50 75 Q37 75 35 60 Z" fill={ink} /></>}
      </svg>
    )
  }

  const eye = (cx: number, dx = 0, dy = 2) => (
    <>
      <ellipse cx={cx} cy="44" rx="11" ry="12.5" fill="#fff" />
      <circle cx={cx + dx} cy={44 + dy} r="5.5" fill={ink} />
    </>
  )
  const openEyes = (dx = 1, dy = 2) => <>{eye(36, dx, dy)}{eye(64, dx, dy)}</>
  // Brows: friendly arch, worried (inner ends raised) or surprised (lifted high)
  const BROWS = {
    happy: ['M26 28 Q36 20 46 25', 'M54 25 Q64 20 74 28'],
    worried: ['M26 27 Q37 25 46 19', 'M54 19 Q63 25 74 27'],
    wow: ['M26 22 Q36 13 46 19', 'M54 19 Q64 13 74 22'],
  }
  const brows = (kind: keyof typeof BROWS) => (
    <>
      <path d={BROWS[kind][0]} {...line} strokeWidth={5} opacity={0.75} />
      <path d={BROWS[kind][1]} {...line} strokeWidth={5} opacity={0.75} />
    </>
  )
  const shut = (y: number, up = false) => (
    <>
      <path d={up ? `M27 ${y} Q36 ${y - 8} 45 ${y}` : `M27 ${y} Q36 ${y + 7} 45 ${y}`} {...line} />
      <path d={up ? `M55 ${y} Q64 ${y - 8} 73 ${y}` : `M55 ${y} Q64 ${y + 7} 73 ${y}`} {...line} />
    </>
  )

  return (
    <svg className="mq-face" width={size} height={size} viewBox="0 0 100 100">
      {value === null && <>{openEyes(0, -1)}{brows('happy')}<ellipse cx="50" cy="74" rx="5" ry="6" fill={ink} /></>}
      {value === 1 && <>{shut(44)}{brows('worried')}<path d="M38 76 Q50 64 62 76" {...line} /></>}
      {value === 2 && <>{openEyes(0, 4)}{brows('worried')}<path d="M38 76 Q50 67 62 76" {...line} /></>}
      {value === 3 && <>{openEyes(1, 2)}<path d="M40 72 H60" {...line} /></>}
      {value === 4 && <>{openEyes(1, 1)}{brows('happy')}<path d="M37 68 Q50 78 63 68" {...line} /></>}
      {value === 5 && <>{shut(46, true)}{brows('happy')}<path d="M35 64 H65 Q63 80 50 80 Q37 80 35 64 Z" fill={ink} /></>}
      {value === 'sleep' && <>{shut(46)}<path d="M45 70 Q50 73 55 70" {...line} strokeWidth={5} /><text x="74" y="24" fontSize="16" fontWeight="800" fill={ink}>z</text></>}
      {value === 'rest' && <>{shut(46)}<path d="M44 70 H56" {...line} strokeWidth={5} /></>}
      {value === 'wow' && <>{openEyes(0, 0)}{brows('wow')}<ellipse cx="50" cy="74" rx="7" ry="8" fill={ink} /></>}
      {value === 'wink' && (
        <>
          {eye(36, 1, 1)}
          <path d="M55 46 Q64 38 73 46" {...line} />
          <path d="M37 66 Q50 77 63 66" {...line} />
        </>
      )}
    </svg>
  )
}
