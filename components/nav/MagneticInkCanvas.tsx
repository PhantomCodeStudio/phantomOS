'use client'
import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'

interface Particle {
  x: number; y: number
  homeX: number; homeY: number
  vx: number; vy: number
}

const WORD = 'PHANTOM CODE'
const PARTICLE_COUNT = 200

export function MagneticInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgress = useStore((s) => s.scrollProgress)
  const scrollRef = useRef(0)

  useEffect(() => { scrollRef.current = scrollProgress }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = 72 }
    resize()
    window.addEventListener('resize', resize)

    const offscreen = document.createElement('canvas')
    offscreen.width = window.innerWidth
    offscreen.height = 72
    const octx = offscreen.getContext('2d')!
    octx.fillStyle = '#000'
    octx.font = 'bold 22px Inter, sans-serif'
    octx.textBaseline = 'middle'
    const tw = octx.measureText(WORD).width
    octx.fillText(WORD, (offscreen.width - tw) / 2, 36)
    const imageData = octx.getImageData(0, 0, offscreen.width, 72)
    const wordPositions: { x: number; y: number }[] = []
    for (let y = 0; y < 72; y += 2) {
      for (let x = 0; x < offscreen.width; x += 4) {
        if (imageData.data[(y * offscreen.width + x) * 4 + 3] > 128) {
          wordPositions.push({ x, y })
        }
      }
    }

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const home = wordPositions[Math.floor(Math.random() * wordPositions.length)] ?? { x: Math.random() * canvas.width, y: 36 }
      return { x: Math.random() * canvas.width, y: Math.random() * 72, homeX: home.x, homeY: home.y, vx: 0, vy: 0 }
    })

    let mouseX = -999, mouseY = -999
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX; mouseY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    let raf: number
    const STIFFNESS = 0.15, DAMPING = 0.75

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, 72)
      const scrolled = scrollRef.current > 0.05

      particles.forEach((p) => {
        const targetX = p.homeX
        const targetY = scrolled ? 71 : p.homeY

        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.hypot(dx, dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 3
          p.vy += (dy / dist) * force * 3
        }

        p.vx += (targetX - p.x) * STIFFNESS
        p.vy += (targetY - p.y) * STIFFNESS
        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = '#0a0a0a'
        ctx.globalAlpha = 0.6
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}
