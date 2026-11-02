import type { ReactNode } from 'react'

// Matte clay characters: a soft round body with diffuse shading (no gloss),
// big white eyes, rounded brows and a smile, plus a prop that tells their story.

const INK = '#1c1a22'

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
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden>
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

      {/* Eyes */}
      <ellipse cx="78" cy="100" rx="16" ry="18" fill={`url(#${id}-eye)`} />
      <circle cx="80" cy="103" r="7.5" fill={INK} />
      {eyes === 'both' && (
        <>
          <ellipse cx="122" cy="100" rx="16" ry="18" fill={`url(#${id}-eye)`} />
          <circle cx="124" cy="103" r="7.5" fill={INK} />
        </>
      )}
      {/* Brows and smile */}
      <path d="M64 74 Q78 66 92 72" stroke={shade} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M108 70 Q122 64 136 72" stroke={shade} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M88 138 Q100 147 112 138" stroke={shade} strokeWidth="5" fill="none" strokeLinecap="round" />

      {children}
    </svg>
  )
}

// Plain clay character with no prop
export function ClayBlob({ size = 200, color, id }: { size?: number; color: string; id: string }) {
  return <ClayBody id={id} color={color} size={size} />
}

// The Architect: round glasses, a pencil behind the head and a little clay building model
export function ArchitectBlob({ size = 200, color = '#B57BFF' }: { size?: number; color?: string }) {
  return (
    <ClayBody
      id="arch"
      color={color}
      size={size}
      behind={
        <g transform="rotate(38 150 44)">
          <rect x="143" y="2" width="13" height="66" rx="3" fill="#ffc93c" />
          <rect x="150" y="2" width="6" height="66" rx="3" fill="#e9a91f" />
          <rect x="143" y="2" width="13" height="10" rx="3" fill="#ff9ec7" />
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
export function InvestigatorBlob({ size = 200, color = '#6FD6C8' }: { size?: number; color?: string }) {
  return (
    <ClayBody id="inv" color={color} size={size} eyes="left">
      {/* Handle */}
      <rect x="146" y="118" width="14" height="52" rx="7" fill="#8a5a3c" transform="rotate(-38 153 144)" />
      <rect x="146" y="112" width="14" height="12" rx="3" fill="#c9a27e" transform="rotate(-38 153 118)" />
      {/* Lens with the magnified eye behind it */}
      <circle cx="124" cy="100" r="30" fill="#e9fbf8" />
      <ellipse cx="124" cy="100" rx="22" ry="24" fill="#fff" />
      <circle cx="127" cy="104" r="11" fill={INK} />
      <circle cx="131" cy="99" r="3.5" fill="#fff" />
      <circle cx="124" cy="100" r="30" fill="none" stroke="#3a3a46" strokeWidth="6" />
      <path d="M104 86 Q110 76 120 74" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
    </ClayBody>
  )
}
