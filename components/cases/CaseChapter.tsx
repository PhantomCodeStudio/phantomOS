'use client'
import { useRef, useState } from 'react'

interface Metric { label: string; value: string }
interface Props {
  title: string
  color: string
  metrics: Metric[]
  detail: string
  active: boolean
  bgColor: string
}

export function CaseChapter({ title, color, metrics, detail, active, bgColor }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: active ? 'auto' : 'none',
        background: bgColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title */}
      <div className="relative z-10 text-center px-8">
        <h3
          className="font-bebas leading-none"
          style={{
            fontSize: 'clamp(8vw, 12vw, 16vw)',
            color: color,
            mixBlendMode: 'difference',
          }}
        >
          {title}
        </h3>

        {/* Metrics */}
        <div className="flex gap-12 justify-center mt-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-bebas text-4xl" style={{ color }}>{m.value}</div>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Behind-the-scenes reveal */}
        <div
          className="mt-8 overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? '200px' : '0', opacity: hovered ? 1 : 0 }}
        >
          <p className="font-light text-sm text-black/60 max-w-md mx-auto">{detail}</p>
        </div>
      </div>
    </div>
  )
}
