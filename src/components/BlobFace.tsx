import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

// Expressive cartoon faces used across the app: tall outlined eyes with a
// highlight, heavy lids, thin arched brows and characterful mouths.
// Numeric values 1–5 map to the answer scale (1 = "not me", 5 = "so me");
// named moods are for decoration. Faces sit on a blob that sets --blob.
export type Mood = 'sleep' | 'rest' | 'wow' | 'wink'

const TONGUE = '#FF6F91'

export default function Face({ value, size, ghost }: { value: number | Mood | null; size: number; ghost?: boolean }) {
  // Random offset so faces on the same screen don't animate in sync
  const [offset] = useState(() => Math.random())
  // Unique id for this face's eye clip paths
  const uid = useId().replace(/:/g, '')
  const ink = ghost ? '#B9B4C2' : 'var(--ink, #1d1d1f)'
  const stroke = (w = 3) => ({ stroke: ink, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' })

  // Ghost faces (slider hints) stay as simple line drawings
  if (ghost) {
    const line = stroke(6)
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

  // One eye: outlined white oval, pupil with highlight, optional heavy lid (y = lid edge)
  const eye = (cx: number, { dx = 0, dy = 0, lid }: { dx?: number; dy?: number; lid?: number } = {}) => (
    <g className="lv-eyes">
      <ellipse cx={cx} cy="44" rx="11.5" ry="14.5" {...stroke(2.6)} fill="#fff" />
      <g className="lv-pupils">
        <circle cx={cx + dx} cy={46 + dy} r="5.4" fill={ink} />
        <circle cx={cx + dx + 1.9} cy={46 + dy - 2} r="1.7" fill="#fff" />
      </g>
      {lid !== undefined && (
        <>
          {/* Lid is clipped to the eye so it only covers the top of the white */}
          <path
            d={`M${cx - 13} ${lid} Q${cx} ${lid - 5} ${cx + 13} ${lid} L${cx + 13} 27 L${cx - 13} 27 Z`}
            clipPath={`url(#${uid}-eye${cx})`}
            style={{ fill: 'color-mix(in srgb, var(--blob, #ccc), #000 8%)' }}
          />
          <path d={`M${cx - 11.5} ${lid} Q${cx} ${lid - 5} ${cx + 11.5} ${lid}`} {...stroke(2.6)} />
        </>
      )}
    </g>
  )
  const eyes = (o: { dx?: number; dy?: number; lid?: number } = {}) => <>{eye(37, o)}{eye(63, o)}</>
  const closed = (cx: number, up = false) => (
    <path d={up ? `M${cx - 10} 47 Q${cx} 37 ${cx + 10} 47` : `M${cx - 10} 43 Q${cx} 51 ${cx + 10} 43`} {...stroke(3.2)} />
  )

  // Brows sit above the eyes; each pair is [left, right]
  const BROWS = {
    arch: ['M27 22 Q36 15 46 21', 'M54 21 Q64 15 73 22'],
    high: ['M27 17 Q36 9 46 15', 'M54 15 Q64 9 73 17'],
    worried: ['M27 23 Q38 21 46 14', 'M54 14 Q62 21 73 23'],
    flat: ['M28 22 Q37 20 46 22', 'M54 22 Q63 20 72 22'],
    skeptic: ['M27 22 Q37 20 46 23', 'M54 17 Q64 9 74 15'],
  }
  const brows = (kind: keyof typeof BROWS) => (
    <g className="lv-brows">
      <path d={BROWS[kind][0]} {...stroke(3.4)} />
      <path d={BROWS[kind][1]} {...stroke(3.4)} />
    </g>
  )
  const grin = (
    <g className="lv-mouth">
      <path d="M29 64 Q50 68 71 64 Q67 86 50 87 Q33 86 29 64 Z" fill={ink} />
      <ellipse cx="51" cy="80" rx="9" ry="5" fill={TONGUE} />
      <path d="M33 66.5 Q50 70 67 66.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  )

  return (
    <svg className="mq-face lv" style={{ '--lv': offset } as CSSProperties} width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id={`${uid}-eye37`}><ellipse cx="37" cy="44" rx="11.5" ry="14.5" /></clipPath>
        <clipPath id={`${uid}-eye63`}><ellipse cx="63" cy="44" rx="11.5" ry="14.5" /></clipPath>
      </defs>
      {/* Curious: glancing up, one brow raised, small "o" */}
      {value === null && <>{eyes({ dx: 1, dy: -4 })}{brows('skeptic')}<ellipse className="lv-mouth" cx="52" cy="74" rx="4" ry="5" fill={ink} /></>}
      {/* Not me at all: worried brows, eyes down, open grimace */}
      {value === 1 && (
        <>
          {eyes({ dy: 4, lid: 39 })}{brows('worried')}
          <path className="lv-mouth" d="M36 78 Q50 64 64 78 Q50 72 36 78 Z" {...stroke(2.6)} fill={ink} />
        </>
      )}
      {/* Not really: heavy-lidded side-eye and a lopsided mouth */}
      {value === 2 && <>{eyes({ dx: -4, dy: 1, lid: 40 })}{brows('flat')}<path className="lv-mouth" d="M38 73 Q50 70 62 75" {...stroke(3.2)} /></>}
      {/* Somewhere between: looking away, wobbly unsure mouth */}
      {value === 3 && <>{eyes({ dx: 4, dy: -1 })}{brows('flat')}<path className="lv-mouth" d="M36 73 q3.5 -3.5 7 0 t7 0 t7 0 t7 0" {...stroke(3)} /></>}
      {/* Mostly me: bright eyes and a cheeky smile with dimples */}
      {value === 4 && (
        <>
          {eyes({ dx: 1, dy: -1 })}{brows('arch')}
          <g className="lv-mouth">
            <path d="M32 66 Q50 82 68 66" {...stroke(3.4)} />
            <path d="M29 63 Q31 66 33 67 M67 67 Q69 66 71 63" {...stroke(2.6)} />
          </g>
        </>
      )}
      {/* Totally me: wide eyes, high brows, big grin with tongue */}
      {value === 5 && <>{eyes({ dy: -2 })}{brows('high')}{grin}</>}
      {value === 'wow' && <>{eyes()}{brows('high')}<ellipse className="lv-mouth" cx="50" cy="75" rx="6.5" ry="8" fill={ink} /></>}
      {value === 'wink' && (
        <>
          {eye(37, { dx: 1, dy: -1 })}
          <g className="lv-brows"><path d={BROWS.arch[0]} {...stroke(3.4)} /><path d="M54 25 Q64 22 73 27" {...stroke(3.4)} /></g>
          {closed(63, true)}
          {grin}
        </>
      )}
      {value === 'rest' && <>{eyes({ dy: 3, lid: 45 })}{brows('flat')}<path className="lv-mouth" d="M43 72 Q50 74 57 72" {...stroke(3)} /></>}
      {value === 'sleep' && (
        <>
          {closed(37)}{closed(63)}
          <ellipse cx="50" cy="72" rx="3.5" ry="4" fill={ink} />
          <text x="76" y="22" fontSize="15" fontWeight="800" fill={ink}>z</text>
          <text x="86" y="12" fontSize="10" fontWeight="800" fill={ink}>z</text>
        </>
      )}
    </svg>
  )
}
