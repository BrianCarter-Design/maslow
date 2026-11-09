import type { CSSProperties, ReactNode } from 'react'

// Matte clay characters: a soft round body with diffuse shading (no gloss),
// big white eyes, rounded brows and a smile, plus a prop that tells their story.

const INK = '#1d1d1f'

// Mix a hex colour toward a target (amount 0–1)
function mix(hex: string, target: number, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (c: number, t: number) => Math.round(c + (t - c) * amount)
  const t = [target >> 16, (target >> 8) & 255, target & 255]
  return `rgb(${ch(n >> 16, t[0])}, ${ch((n >> 8) & 255, t[1])}, ${ch(n & 255, t[2])})`
}

function ClayBody({ id, color, size, children, behind, eyes = 'both' }: {
  id: string
  color: string
  size: number
  children?: ReactNode
  behind?: ReactNode
  eyes?: 'both' | 'left'
}) {
  const shade = mix(color, 0x1c1a22, 0.28)
  const lid = mix(color, 0x1c1a22, 0.1)
  // Offset the idle animations per character so they don't all blink in sync
  const offset = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 997
  return (
    <svg className="lv" style={{ '--lv': offset } as CSSProperties} width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id={`${id}-body`} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor={mix(color, 0xffffff, 0.35)} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
        <radialGradient id={`${id}-eye`} cx="0.45" cy="0.35" r="0.7">
          <stop offset="0.6" stopColor="#fff" />
          <stop offset="1" stopColor="#e4e1ea" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="100" cy="186" rx="58" ry="8" fill={shade} opacity="0.35" filter={`url(#${id}-blur)`} />
      {behind}
      <ellipse cx="100" cy="106" rx="74" ry="72" fill={`url(#${id}-body)`} />

      {/* Eyes: outlined ovals with a highlight and a slightly heavy, self-assured lid */}
      <g className="lv-eyes">
        {[78, ...(eyes === 'both' ? [122] : [])].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy="100" rx="16" ry="20" fill={`url(#${id}-eye)`} stroke={INK} strokeWidth="3.5" />
            <g className="lv-pupils">
              <circle cx={cx + 2} cy="104" r="7.5" fill={INK} />
              <circle cx={cx + 4.6} cy="101" r="2.4" fill="#fff" />
            </g>
            <clipPath id={`${id}-eye${cx}`}><ellipse cx={cx} cy="100" rx="16" ry="20" /></clipPath>
            <path d={`M${cx - 18} 92 Q${cx} 85 ${cx + 18} 92 L${cx + 18} 76 L${cx - 18} 76 Z`} fill={lid} clipPath={`url(#${id}-eye${cx})`} />
            <path d={`M${cx - 16} 92 Q${cx} 85 ${cx + 16} 92`} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
      {/* Brows and a confident half-smile with dimples */}
      <g className="lv-brows">
        <path d="M62 70 Q77 60 93 67" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M107 66 Q123 58 138 68" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="lv-mouth">
        <path d="M84 134 Q102 150 120 132" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M81 131 Q83 135 86 136 M118 134 Q121 133 123 129" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>

      {children}
    </svg>
  )
}

// Plain clay character with no prop
export function ClayBlob({ size = 200, color, id }: { size?: number; color: string; id: string }) {
  return <ClayBody id={id} color={color} size={size} />
}

// The Architect: round glasses, a pencil behind the head and a little clay building model
export function ArchitectBlob({ size = 200, color = '#9933FF', id = 'arch' }: { size?: number; color?: string; id?: string }) {
  return (
    <ClayBody
      id={id}
      color={color}
      size={size}
      behind={
        <g transform="rotate(38 150 44)">
          <rect x="143" y="2" width="13" height="66" rx="3" fill="#E6C200" />
          <rect x="150" y="2" width="6" height="66" rx="3" fill="#FFB600" />
          <rect x="143" y="2" width="13" height="10" rx="3" fill="#FF3399" />
          <rect x="143" y="12" width="13" height="4" fill="#d9d4e2" />
        </g>
      }
    >
      {/* Round glasses over the eyes */}
      <g stroke={INK} strokeWidth="3.5" fill="none">
        <circle cx="78" cy="101" r="20" />
        <circle cx="122" cy="101" r="20" />
      </g>
      <path d="M98 99 Q100 95 102 99" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Clay building model: steps, columns and a pediment */}
      <g transform="translate(130 128)">
        <ellipse cx="32" cy="58" rx="34" ry="5" fill="#000" opacity="0.12" />
        <rect x="2" y="48" width="60" height="8" rx="2" fill="#f4f1fa" />
        <rect x="6" y="42" width="52" height="7" rx="2" fill="#e7e2f1" />
        {[10, 22, 34, 46].map((x) => (
          <rect key={x} x={x} y="18" width="7" height="24" rx="1.5" fill="#fbfaff" />
        ))}
        <rect x="6" y="13" width="52" height="6" rx="1.5" fill="#e7e2f1" />
        <path d="M2 14 L32 -4 L62 14 Z" fill="#f4f1fa" />
        <path d="M14 10 L32 0 L50 10 Z" fill="#e7e2f1" />
      </g>
    </ClayBody>
  )
}

// The Investigator: peering through a magnifying glass, one eye enlarged
export function InvestigatorBlob({ size = 200, color = '#00C5E5', id = 'inv' }: { size?: number; color?: string; id?: string }) {
  return (
    <ClayBody id={id} color={color} size={size} eyes="left">
      {/* Handle */}
      <rect x="146" y="118" width="14" height="52" rx="7" fill="#8a5a3c" transform="rotate(-38 153 144)" />
      <rect x="146" y="112" width="14" height="12" rx="3" fill="#1AE6CC" transform="rotate(-38 153 118)" />
      {/* Lens with the magnified eye behind it */}
      <circle cx="124" cy="100" r="30" fill="#e9fbf8" />
      <g className="lv-eyes">
        <ellipse cx="124" cy="100" rx="22" ry="25" fill="#fff" stroke={INK} strokeWidth="3" />
        <g className="lv-pupils">
          <circle cx="127" cy="104" r="11" fill={INK} />
          <circle cx="131.5" cy="99" r="3.6" fill="#fff" />
        </g>
      </g>
      <circle cx="124" cy="100" r="30" fill="none" stroke="#3a3a46" strokeWidth="6" />
      <path d="M104 86 Q110 76 120 74" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
    </ClayBody>
  )
}

// ---------- Prop library: every result gets its own clay character ----------

export type PropKind =
  | 'investigator' | 'architect' | 'clipboard' | 'heart' | 'trophy' | 'beret' | 'shield' | 'partyhat'
  | 'glove' | 'sprout' | 'lightbulb' | 'sunglasses' | 'compass' | 'speech' | 'hourglass' | 'gift'
  | 'wrench' | 'lightning' | 'megaphone' | 'book' | 'pawn' | 'cloud'

// Soft drop shadow under held props so they sit on the clay
const propShadow = { filter: 'drop-shadow(0 4px 4px rgba(28, 26, 34, 0.18))' }

// Held props sit at the lower right of the body; hats sit on top
const PROPS: Partial<Record<PropKind, { front?: ReactNode; behind?: ReactNode }>> = {
  clipboard: {
    front: (
      <g transform="translate(138 116) rotate(10)" style={propShadow}>
        <rect width="40" height="52" rx="6" fill="#1AE6CC" />
        <rect x="5" y="9" width="30" height="38" rx="3" fill="#fff" />
        <rect x="12" y="2" width="16" height="10" rx="3" fill="#8a8a96" />
        <path d="M11 27 l6 6 l12 -13" stroke="#19D980" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
  },
  heart: {
    front: (
      <path
        d="M162 176 C138 160 132 146 140 136 C147 128 158 131 162 140 C166 131 177 128 184 136 C192 146 186 160 162 176 Z"
        fill="#E633CC" style={propShadow}
      />
    ),
  },
  trophy: {
    front: (
      <g transform="translate(140 120)" style={propShadow}>
        <path d="M6 4 H38 V18 C38 30 30 38 22 38 C14 38 6 30 6 18 Z" fill="#E6C200" />
        <path d="M6 9 H0 C0 20 5 24 9 24 M38 9 H44 C44 20 39 24 35 24" stroke="#FFB600" strokeWidth="4" fill="none" />
        <rect x="18" y="38" width="8" height="8" fill="#FFB600" />
        <rect x="10" y="46" width="24" height="8" rx="3" fill="#8a5a3c" />
        <path d="M14 10 Q16 22 22 26" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
    ),
  },
  beret: {
    front: (
      <g transform="rotate(-14 100 40)">
        <ellipse cx="96" cy="42" rx="52" ry="16" fill="#CC00DD" />
        <ellipse cx="96" cy="48" rx="46" ry="6" fill="#C32824" />
        <rect x="93" y="22" width="6" height="10" rx="3" fill="#C32824" />
      </g>
    ),
  },
  shield: {
    front: (
      <g transform="translate(138 112)" style={propShadow}>
        <path d="M24 0 L48 8 V28 C48 44 36 54 24 60 C12 54 0 44 0 28 V8 Z" fill="#3399FF" />
        <path d="M24 0 V60 C36 54 48 44 48 28 V8 Z" fill="#0E6BEC" />
        <path d="M14 28 l7 7 l13 -14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
  },
  partyhat: {
    front: (
      <g transform="rotate(12 104 30)">
        <path d="M78 46 L104 -2 L130 46 Z" fill="#FF3399" />
        <path d="M86 32 L122 32 M92 20 L116 20" stroke="#E6C200" strokeWidth="5" strokeLinecap="round" />
        <circle cx="104" cy="-2" r="7" fill="#E6C200" />
        <ellipse cx="104" cy="46" rx="27" ry="5" fill="#FF3399" />
      </g>
    ),
  },
  glove: {
    front: (
      <g transform="translate(136 118) rotate(-12)" style={propShadow}>
        <rect x="6" y="40" width="34" height="18" rx="5" fill="#f4f1fa" />
        <path d="M4 22 C4 6 16 0 28 0 C42 0 48 10 48 24 C48 36 40 44 28 44 H12 C6 44 4 38 4 32 Z" fill="#CC00DD" />
        <path d="M4 24 C0 22 -2 30 4 34" fill="#C32824" />
        <path d="M14 12 Q22 6 32 8" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
    ),
  },
  sprout: {
    behind: (
      <g>
        <path d="M100 38 Q100 24 102 14" stroke="#00A34D" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M102 18 C88 2 70 6 70 16 C82 22 94 22 102 18 Z" fill="#33FF99" />
        <path d="M102 16 C112 0 132 2 134 12 C122 20 110 20 102 16 Z" fill="#19D980" />
      </g>
    ),
  },
  lightbulb: {
    front: (
      <g transform="translate(140 6)">
        <path d="M-10 6 L-18 -2 M24 -6 L24 -16 M58 6 L66 -2" stroke="#E6C200" strokeWidth="4" strokeLinecap="round" />
        <circle cx="24" cy="22" r="20" fill="#ffe27a" />
        <path d="M14 22 Q24 32 34 22" stroke="#FFB600" strokeWidth="3" fill="none" />
        <rect x="14" y="38" width="20" height="12" rx="3" fill="#a9a5b4" />
      </g>
    ),
  },
  sunglasses: {
    front: (
      <g>
        <path d="M56 92 H98 L94 112 C92 120 64 120 60 112 Z" fill={INK} />
        <path d="M102 92 H144 L140 112 C138 120 110 120 106 112 Z" fill={INK} />
        <path d="M96 94 H104" stroke={INK} strokeWidth="5" />
        <path d="M64 98 L74 98 M110 98 L120 98" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>
    ),
  },
  compass: {
    front: (
      <g transform="translate(160 146)" style={propShadow}>
        <circle r="24" fill="#1AE6CC" />
        <circle r="18" fill="#fffaf0" />
        <path d="M0 -14 L5 0 L0 14 L-5 0 Z" fill="#CC00DD" />
        <path d="M0 0 L5 0 L0 14 L-5 0 Z" fill="#8a8a96" />
        <circle r="2.5" fill={INK} />
      </g>
    ),
  },
  speech: {
    front: (
      <g transform="translate(130 4)" style={propShadow}>
        <path d="M6 0 H58 C62 0 64 2 64 6 V32 C64 36 62 38 58 38 H24 L12 50 L14 38 H6 C2 38 0 36 0 32 V6 C0 2 2 0 6 0 Z" fill="#fff" />
        <circle cx="18" cy="19" r="4" fill="#9933FF" />
        <circle cx="32" cy="19" r="4" fill="#9933FF" />
        <circle cx="46" cy="19" r="4" fill="#9933FF" />
      </g>
    ),
  },
  hourglass: {
    front: (
      <g transform="translate(146 118)" style={propShadow}>
        <rect width="40" height="7" rx="3" fill="#8a5a3c" />
        <rect y="51" width="40" height="7" rx="3" fill="#8a5a3c" />
        <path d="M6 7 H34 C34 20 24 24 22 29 C24 34 34 38 34 51 H6 C6 38 16 34 18 29 C16 24 6 20 6 7 Z" fill="#e6f4ff" />
        <path d="M12 14 H28 C26 20 22 24 20 27 C18 24 14 20 12 14 Z M10 49 C12 42 18 38 20 36 C22 38 28 42 30 49 Z" fill="#E6C200" />
      </g>
    ),
  },
  gift: {
    front: (
      <g transform="translate(138 124)" style={propShadow}>
        <rect y="12" width="48" height="40" rx="5" fill="#00C5E5" />
        <rect x="-3" y="6" width="54" height="12" rx="4" fill="#3399FF" />
        <rect x="20" y="6" width="8" height="46" fill="#E633CC" />
        <path d="M24 6 C14 -6 4 2 10 6 Z M24 6 C34 -6 44 2 38 6 Z" fill="#E633CC" />
      </g>
    ),
  },
  wrench: {
    front: (
      <g transform="translate(150 118) rotate(35)" style={propShadow}>
        <rect x="-5" y="12" width="10" height="46" rx="5" fill="#a9a5b4" />
        <path d="M-14 0 C-14 -10 -6 -16 0 -16 L-4 -6 L4 -6 L0 -16 C6 -16 14 -10 14 0 C14 10 6 16 0 16 C-6 16 -14 10 -14 0 Z" fill="#a9a5b4" />
        <circle r="6" fill="#d9d4e2" />
      </g>
    ),
  },
  lightning: {
    front: <path d="M156 4 L130 54 H152 L140 96 L184 36 H160 L176 4 Z" fill="#E6C200" stroke="#FFB600" strokeWidth="3" strokeLinejoin="round" style={propShadow} />,
  },
  megaphone: {
    front: (
      <g transform="translate(132 120) rotate(-18)" style={propShadow}>
        <path d="M8 14 L44 0 V44 L8 30 Z" fill="#FF6666" />
        <rect y="12" width="12" height="20" rx="3" fill="#CC00DD" />
        <ellipse cx="44" cy="22" rx="6" ry="22" fill="#FF6666" />
        <rect x="12" y="30" width="8" height="18" rx="3" fill="#8a8a96" />
      </g>
    ),
  },
  book: {
    front: (
      <g transform="translate(118 150) rotate(-8)" style={propShadow}>
        <path d="M0 6 C14 0 26 2 34 8 V40 C26 34 14 32 0 38 Z" fill="#fff" />
        <path d="M68 6 C54 0 42 2 34 8 V40 C42 34 54 32 68 38 Z" fill="#f4f1fa" />
        <path d="M0 38 C14 32 26 34 34 40 C42 34 54 32 68 38 V42 C54 36 42 38 34 44 C26 38 14 36 0 42 Z" fill="#3399FF" />
        <path d="M8 14 H26 M8 22 H24 M42 14 H60 M42 22 H58" stroke="#d9d4e2" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
  },
  pawn: {
    front: (
      <g transform="translate(150 112)" style={propShadow}>
        <circle cx="16" cy="10" r="10" fill="#3a3a46" />
        <path d="M8 22 H24 L28 44 H4 Z" fill="#3a3a46" />
        <rect x="-2" y="44" width="36" height="10" rx="4" fill="#3a3a46" />
        <circle cx="12" cy="7" r="3" fill="#fff" opacity="0.4" />
      </g>
    ),
  },
  cloud: {
    front: (
      <g transform="translate(128 0)" style={propShadow}>
        <path d="M14 34 C2 34 0 20 10 16 C10 4 26 0 32 10 C38 2 54 4 54 18 C64 20 62 34 52 34 Z" fill="#e6f4ff" />
        <path d="M18 42 L15 50 M32 42 L29 50 M46 42 L43 50" stroke="#3399FF" strokeWidth="4" strokeLinecap="round" />
      </g>
    ),
  },
}

// Any character by prop kind; ids must be unique per page for the SVG gradients
export function Character({ kind, color, size = 200, id }: { kind?: PropKind; color: string; size?: number; id: string }) {
  if (kind === 'investigator') return <InvestigatorBlob id={id} size={size} color={color} />
  if (kind === 'architect') return <ArchitectBlob id={id} size={size} color={color} />
  const prop = kind ? PROPS[kind] : undefined
  return (
    <ClayBody id={id} color={color} size={size} behind={prop?.behind}>
      {prop?.front}
    </ClayBody>
  )
}
