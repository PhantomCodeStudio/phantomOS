'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

export function HeroText() {
  const ref    = useRef<HTMLDivElement>(null)
  const loading = useStore((s) => s.loading)

  useEffect(() => {
    if (loading || !ref.current) return
    const tween = gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' })
    return () => { tween.kill() }
  }, [loading])

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 opacity-0">
      <h1
        className="font-bebas text-black leading-none mix-blend-multiply"
        style={{ fontSize: 'clamp(8vw, 12vw, 14vw)' }}
      >
        Immersive by Design
      </h1>
      <p className="mt-4 text-black/70 font-light text-lg max-w-md">
        We don&rsquo;t build experiences.<br />We architect realities.
      </p>
      <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-[1px] h-8 bg-black/30" />
        <span className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40">Scroll to explore</span>
      </div>
    </div>
  )
}
