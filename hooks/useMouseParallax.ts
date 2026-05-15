'use client'
import { useEffect, useRef } from 'react'

export function useMouseParallax() {
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return pos
}
