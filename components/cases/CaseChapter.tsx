'use client'
import Image from 'next/image'

interface Metric { label: string; value: string }
interface Props {
  title: string
  color: string
  metrics: Metric[]
  detail: string
  active: boolean
  bgColor: string
  image: string
  imageAlt: string
  isStatic: boolean
  revealProgress: number
}

export function CaseChapter({
  title,
  color,
  metrics,
  detail,
  active,
  bgColor,
  image,
  imageAlt,
  isStatic,
  revealProgress,
}: Props) {
  const clipPathValue = isStatic ? 'inset(0% 0% 0% 0%)' : `inset(${100 - revealProgress * 100}% 0% 0% 0%)`

  return (
    <div
      className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        pointerEvents: active ? 'auto' : 'none',
        background: bgColor,
      }}
    >
      {/* Image Side */}
      <div className="relative w-full h-full hidden md:block">
        <div
          className="absolute inset-0"
          style={{ clipPath: clipPathValue, transition: isStatic ? 'none' : 'clip-path 0.2s ease-out' }}
        >
          <Image src={image} alt={imageAlt} fill style={{ objectFit: 'cover' }} />
        </div>
      </div>

      {/* Text Side */}
      <div className="relative z-10 text-center px-8">
        <div className="relative mb-8 h-48 w-full overflow-hidden md:hidden">
          <Image src={image} alt={imageAlt} fill style={{ objectFit: 'cover' }} />
        </div>

        <h3
          className="font-bebas leading-none"
          style={{
            fontSize: 'clamp(6vw, 10vw, 12vw)',
            color: color,
          }}
        >
          {title}
        </h3>

        {/* Metrics */}
        <div className="flex gap-8 justify-center mt-6">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="font-bebas text-3xl" style={{ color }}>{m.value}</div>
              <div className="font-mono text-[0.5rem] tracking-widest uppercase text-black/40 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Detail text */}
        <div className="mt-6">
          <p className="font-light text-sm text-black/60 max-w-md mx-auto">{detail}</p>
        </div>
      </div>
    </div>
  )
}
