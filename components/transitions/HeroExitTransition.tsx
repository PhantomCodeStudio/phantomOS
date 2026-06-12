'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

export function HeroExitTransition() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useLayoutEffect(() => {
    if (reducedMotion || !ref.current) return

    const heroSection = document.querySelector('section[aria-label="Hero"]')
    if (!heroSection) return

    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })

      if (isMobile) {
        // Mobile fallback: Simple opacity fade
        tl.to(ref.current!, { opacity: 1, duration: 0.4, ease: 'power1.inOut' })
          .to(ref.current!, { opacity: 0, duration: 0.4, ease: 'power1.inOut' }, '+=0.4')
      } else {
        // Desktop: Single-panel clip-path wipe
        gsap.set(ref.current, { opacity: 1 }) // Make visible for clip-path animation
        tl.fromTo(
          ref.current!,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.inOut' }
        ).to(ref.current!, { opacity: 0, duration: 0.2 }, '>-0.1')
      }

      ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom 80%',
        toggleActions: 'play none none reverse',
        animation: tl,
        invalidateOnRefresh: true,
      })
    }, ref)

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) {
    return null
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none bg-[#FFE900]"
      style={{ opacity: 0 }}
    />
  )
}
