import { ENNEAGRAM_TYPES } from '../data/enneagramTypes'

interface RadarChartProps {
  scores: Record<number, number>
  size?: number
}

function polarToCartesian(cx: number, cy: number, r: number, angleIndex: number, total: number) {
  const angle = (angleIndex / total) * 2 * Math.PI - Math.PI / 2
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

export default function RadarChart({ scores, size = 340 }: RadarChartProps) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.36
  const labelR = size * 0.46
  const n = 9
  const levels = [0.25, 0.5, 0.75, 1.0]

  // Build polygon points for the user's scores
  const polygonPoints = ENNEAGRAM_TYPES.map((type, i) => {
    const score = scores[type.number] ?? 0
    const r = (score / 100) * maxR
    return polarToCartesian(cx, cy, r, i, n)
  })
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid level circles */}
      {levels.map((level) => {
        const points = ENNEAGRAM_TYPES.map((_, i) =>
          polarToCartesian(cx, cy, maxR * level, i, n)
        )
          .map((p) => `${p.x},${p.y}`)
          .join(' ')
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="rgba(93,0,150,0.12)"
            strokeWidth={1}
          />
        )
      })}

      {/* Axis lines */}
      {ENNEAGRAM_TYPES.map((_, i) => {
        const end = polarToCartesian(cx, cy, maxR, i, n)
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={end.x} y2={end.y}
            stroke="rgba(93,0,150,0.12)"
            strokeWidth={1}
          />
        )
      })}

      {/* Score polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(93,0,150,0.18)"
        stroke="#5d0096"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {ENNEAGRAM_TYPES.map((type, i) => {
        const score = scores[type.number] ?? 0
        const r = (score / 100) * maxR
        const pos = polarToCartesian(cx, cy, r, i, n)
        return (
          <circle key={type.number} cx={pos.x} cy={pos.y} r={4} fill="#5d0096" />
        )
      })}

      {/* Labels */}
      {ENNEAGRAM_TYPES.map((type, i) => {
        const pos = polarToCartesian(cx, cy, labelR, i, n)
        const score = scores[type.number] ?? 0
        return (
          <g key={type.number}>
            <text
              x={pos.x}
              y={pos.y - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={size * 0.034}
              fontWeight="700"
              fill="#5d0096"
              fontFamily="Inter, sans-serif"
            >
              {type.number}
            </text>
            <text
              x={pos.x}
              y={pos.y + 11}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={size * 0.026}
              fontWeight="500"
              fill="#6b7280"
              fontFamily="Inter, sans-serif"
            >
              {score}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
