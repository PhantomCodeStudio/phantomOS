'use client'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function useReducedMotion() {
  const setReducedMotion = useStore((s) => s.setReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setReducedMotion])
}
