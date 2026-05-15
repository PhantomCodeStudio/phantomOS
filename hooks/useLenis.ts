'use client'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)
  const setScrollProgress = useStore((s) => s.setScrollProgress)
  const velocityRef = useRef(0)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenisRef.current = lenis

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      setScrollProgress(progress)
      velocityRef.current = Math.abs(velocity)
      ScrollTrigger.update()
    })

    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)

    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [setScrollProgress])

  return { lenisRef, velocityRef }
}
