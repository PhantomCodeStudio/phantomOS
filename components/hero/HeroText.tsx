'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/lib/store'
import { TextSplitter } from '@/components/typography/TextSplitter'

export function HeroText() {
  const ref      = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const cueRef     = useRef<HTMLDivElement>(null)
  const tlRef      = useRef<gsap.core.Timeline | null>(null)
  const loading       = useStore((s) => s.loading)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (loading) return
    const root = ref.current
    const heading = headingRef.current
    const sub = subRef.current
    const cue = cueRef.current
    if (!root || !heading || !sub || !cue) return

    // Kill any previous timeline before starting a new one (Strict Mode / re-fire safe).
    tlRef.current?.kill()
    tlRef.current = null

    if (reducedMotion) {
      // Reduced-motion branch: settle to the final visible state instantly.
      // No y translate, no clip motion, no per-word stagger.
      // Under reduced motion TextSplitter renders plain text (no word spans),
      // so revealing the heading element is sufficient.
      gsap.set([heading, sub, cue], { opacity: 1, y: 0, clipPath: 'none' })
      gsap.set(root, { opacity: 1 })
      return () => {
        tlRef.current?.kill()
        tlRef.current = null
      }
    }

    // T-14 Phase 1 — per-word reveal. Target the TextSplitter word spans.
    const words = heading.querySelectorAll<HTMLElement>('[data-word-index]')
    const headlineTargets: HTMLElement[] | HTMLHeadingElement =
      words.length ? Array.from(words) : heading

    // Establish hidden start states before revealing the container, so the
    // words/children never flash before the timeline runs. The headline element
    // itself is shown (no clip wipe); the individual words animate in.
    gsap.set(heading, { opacity: 1, clipPath: 'none', y: 0 })
    gsap.set(headlineTargets, { opacity: 0, y: 40 })
    gsap.set(sub, { opacity: 0, y: 20 })
    gsap.set(cue, { opacity: 0 })
    gsap.set(root, { opacity: 1 })

    // Controlled entrance: headline (word stagger) first, subhead second, scroll cue last.
    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(headlineTargets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      })
      .to(sub, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .to(cue, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')

    tlRef.current = tl

    return () => {
      tlRef.current?.kill()
      tlRef.current = null
    }
  }, [loading, reducedMotion])

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 opacity-0">
      <h1
        ref={headingRef}
        aria-label="Immersive by Design"
        className="font-bebas text-black leading-none mix-blend-multiply"
        style={{ fontSize: 'clamp(8vw, 12vw, 14vw)' }}
      >
        <TextSplitter as="span" text="Immersive by Design" splitBy="words" wordClassName="hero-word" />
      </h1>
      <p ref={subRef} className="mt-4 text-black/70 font-light text-lg max-w-md">
        We don&rsquo;t build experiences.<br />We architect realities.
      </p>
      <div ref={cueRef} className="mt-16 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-[1px] h-8 bg-black/30" />
        <span className="font-mono text-[0.6rem] tracking-widest uppercase text-black/40">Scroll to explore</span>
      </div>
    </div>
  )
}
