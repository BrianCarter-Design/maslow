import { ENNEAGRAM_TYPES } from '../data/enneagramTypes'

interface EnneagramWheelProps {
  activeType: number
  scores?: Record<number, number>
  size?: number
}

// Enneagram inner connections: the hexad (1-4-2-8-5-7-1) and the triangle (3-6-9-3)
const HEXAD = [1, 4, 2, 8, 5, 7, 1]
const TRIANGLE = [3, 6, 9, 3]

function typePosition(typeNum: number, cx: number, cy: number, r: number) {
  // Types 1–9 placed clockwise starting from top
  // Standard enneagram: 9 is at top, then 1, 2, ... clockwise
  const order = [9, 1, 2, 3, 4, 5, 6, 7, 8] // index 0 = 9 o'clock top
  const idx = order.indexOf(typeNum)
  const angle = (idx / 9) * 2 * Math.PI - Math.PI / 2
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

export default function EnneagramWheel({ activeType, scores, size = 380 }: EnneagramWheelProps) {
  const cx = size / 2
  const cy = size / 2
  const outerR = size * 0.42
  const innerR = size * 0.32
  const dotR = size * 0.045
  const activeDotR = size * 0.065
  const labelR = size * 0.485

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={outerR} fill="rgba(93,0,150,0.08)" stroke="rgba(93,0,150,0.2)" strokeWidth={1.5} />

      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(93,0,150,0.15)" strokeWidth={1} strokeDasharray="4 4" />

      {/* Hexad lines */}
      {HEXAD.slice(0, -1).map((t, i) => {
        const from = typePosition(t, cx, cy, innerR)
        const to = typePosition(HEXAD[i + 1], cx, cy, innerR)
        return (
          <line
            key={`h${i}`}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke="rgba(93,0,150,0.25)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* Triangle lines */}
      {TRIANGLE.slice(0, -1).map((t, i) => {
        const from = typePosition(t, cx, cy, innerR)
        const to = typePosition(TRIANGLE[i + 1], cx, cy, innerR)
        return (
          <line
            key={`tr${i}`}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke="rgba(93,0,150,0.25)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* Type nodes */}
      {ENNEAGRAM_TYPES.map((type) => {
        const pos = typePosition(type.number, cx, cy, innerR)
        const labelPos = typePosition(type.number, cx, cy, labelR)
        const isActive = type.number === activeType
        const score = scores?.[type.number] ?? 0

        return (
          <g key={type.number}>
            {/* Score arc indicator */}
            {scores && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={dotR + 4}
                fill="none"
                stroke={isActive ? '#5d0096' : 'rgba(93,0,150,0.2)'}
                strokeWidth={2}
                strokeDasharray={`${(score / 100) * (2 * Math.PI * (dotR + 4))} ${2 * Math.PI * (dotR + 4)}`}
                strokeDashoffset={2 * Math.PI * (dotR + 4) * 0.25}
                strokeLinecap="round"
              />
            )}

            {/* Dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? activeDotR : dotR}
              fill={isActive ? '#5d0096' : 'white'}
              stroke={isActive ? '#5d0096' : 'rgba(93,0,150,0.4)'}
              strokeWidth={2}
            />

            {/* Type number */}
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isActive ? size * 0.038 : size * 0.030}
              fontWeight={isActive ? '700' : '600'}
              fill={isActive ? 'white' : '#5d0096'}
              fontFamily="Inter, sans-serif"
            >
              {type.number}
            </text>

            {/* Label outside */}
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={size * 0.027}
              fontWeight={isActive ? '700' : '500'}
              fill={isActive ? '#5d0096' : '#6b7280'}
              fontFamily="Inter, sans-serif"
            >
              {type.name}
            </text>
          </g>
        )
      })}

      {/* Center label */}
      <text
        x={cx}
        y={cy - size * 0.025}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.055}
        fontWeight="800"
        fill="#5d0096"
        fontFamily="Inter, sans-serif"
      >
        {activeType}
      </text>
      <text
        x={cx}
        y={cy + size * 0.04}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.032}
        fontWeight="600"
        fill="#6b7280"
        fontFamily="Inter, sans-serif"
      >
        {ENNEAGRAM_TYPES[activeType - 1].name}
      </text>
    </svg>
  )
}
