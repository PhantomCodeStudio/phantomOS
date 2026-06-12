'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

const BEATS = [
  {
    label: 'The Gap',
    body: 'Brands reach audiences through flat screens. But humans experience space, depth, and presence. Current web is 2D thinking for 3D beings.',
    key: ['space', 'presence'],
  },
  {
    label: 'The Opportunity',
    body: 'AR, XR, and TouchDesigner exist as tools. Few studios truly master them. The market is hungry for immersive.',
    key: ['immersive'],
  },
  {
    label: 'The Phantom Difference',
    body: 'We think in dimensions. We design for presence and memory. We build for transformation.',
    key: ['dimensions', 'presence', 'transformation'],
  },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const beats = sectionRef.current!.querySelectorAll<HTMLElement>('.beat')
      beats.forEach((beat) => {
        gsap.fromTo(
          beat,
          { opacity: 0, y: reducedMotion ? 0 : 40 },
          {
            opacity: 1, y: 0,
            duration: reducedMotion ? 0.001 : 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: beat, start: 'top 65%', toggleActions: 'play none none none' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-[8%] overflow-hidden bg-[#FFE900]"
    >
      {/* Background iridescent shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'conic-gradient(from 0deg, #4169FF22, #7B00FF22, #4169FF22)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'conic-gradient(from 180deg, #7B00FF22, #00FFFF22, #7B00FF22)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-24">
        {BEATS.map((beat) => (
          <div key={beat.label} className="beat">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-black/40 block mb-3">
              {beat.label}
            </span>
            <p className="font-bebas text-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {beat.body.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={beat.key.includes(word.toLowerCase().replace(/[^a-z]/g, ''))
                    ? 'text-[#4169FF]'
                    : ''}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
