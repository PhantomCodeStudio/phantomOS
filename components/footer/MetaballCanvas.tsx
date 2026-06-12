'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BLOB_COLORS = ['#4169FF', '#7B00FF', '#CC0033', '#00FF87']

interface Blob {
  x: number; y: number
  vy: number; vx: number
  radius: number
  color: string
  homeY: number
  oy: number
}

export function MetaballCanvas({ onBurst }: { onBurst?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef  = useRef<Blob[]>([])
  const mouseRef  = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height

    const blobs: Blob[] = BLOB_COLORS.map((color, i) => ({
      x: (i + 1) * (W() / 5),
      y: H() + 150,
      vy: 0, vx: (Math.random() - 0.5) * 0.5,
      radius: 120 + i * 20,
      color,
      homeY: H() * 0.4 + i * 40,
      oy: H() + 150,
    }))
    blobsRef.current = blobs

    // Rise on scroll — stored so cleanup kills only this trigger
    const blobTrigger = ScrollTrigger.create({
      trigger: canvas.parentElement,
      start: 'top 80%',
      onEnter: () => {
        blobs.forEach((b) => gsap.to(b, { y: b.homeY, duration: 1.2, ease: 'power3.out' }))
      },
    })

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMouse)

    let raf: number
    const STIFF = 0.008, DAMP = 0.92

    const drawMetaball = (b: Blob) => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)
      grad.addColorStop(0, b.color + 'cc')
      grad.addColorStop(0.5, b.color + '66')
      grad.addColorStop(1, b.color + '00')
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    const loop = () => {
      ctx.clearRect(0, 0, W(), H())

      blobs.forEach((b) => {
        // Cursor dent
        const dx = b.x - mouseRef.current.x
        const dy = b.y - mouseRef.current.y
        const dist = Math.hypot(dx, dy)
        if (dist < b.radius * 0.8 && dist > 0) {
          b.vx += (dx / dist) * 0.3
          b.vy += (dy / dist) * 0.3
        }

        // Spring to home X
        b.vx += (((blobsRef.current.indexOf(b) + 1) * (W() / 5)) - b.x) * STIFF
        b.vx *= DAMP
        b.vy *= DAMP
        b.x += b.vx
        b.y += b.vy

        drawMetaball(b)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouse)
      blobTrigger.kill()
    }
  }, [])

  const burst = () => {
    blobsRef.current.forEach((b) => {
      const angle = Math.random() * Math.PI * 2
      gsap.to(b, { x: b.x + Math.cos(angle) * 600, y: b.y + Math.sin(angle) * 600, duration: 0.8, ease: 'power2.out' })
    })
    onBurst?.()
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
      style={{ mixBlendMode: 'multiply' }}
      onClick={burst}
    />
  )
}
