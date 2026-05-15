'use client'
import { useEffect, useRef } from 'react'
import { PhysicsEngine, LogoBody } from '@/lib/physics/physicsEngine'
import { audioEngine } from '@/lib/audio/audioEngine'
import { useStore } from '@/lib/store'

const CLIENTS = [
  'Nike','Lascote','FNB Art Joburg','Fa\'kugesi','Keith Haring Foundation',
  'Butan Streetwear','Rosons Spices','Meta','South Point','Art Bank SA',
  'Natl Arts Festival','Playtopia','Africa Games Week','SPOVA.app',
]
const COLORS = ['#4169FF','#7B00FF','#CC0033','#00FF87','#0a0a0a']

export function ClientsPlayground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const engineRef  = useRef<PhysicsEngine | null>(null)
  const bodiesRef  = useRef<(LogoBody & { name: string; color: string; scale: number })[]>([])
  const mouseRef   = useRef({ x: -999, y: -999, vx: 0, vy: 0, px: -999, py: -999 })
  const dragRef    = useRef<number | null>(null)
  const hoveredRef = useRef<number | null>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const W = canvas.offsetWidth
    const H = Math.max(600, canvas.offsetHeight)
    canvas.width  = W
    canvas.height = H

    const engine = new PhysicsEngine(W, H)
    engineRef.current = engine

    const bodies = CLIENTS.map((name, i) => {
      const body = {
        name, color: COLORS[i % COLORS.length],
        x: 80 + Math.random() * (W - 160),
        y: 80 + Math.random() * (H - 160),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        mass: 1, radius: 48, friction: 0.98, restitution: 0.65,
        dragging: false, scale: 1,
      }
      engine.addBody(body)
      return body
    })
    bodiesRef.current = bodies

    const getBodyAt = (mx: number, my: number) => {
      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i]
        if (Math.hypot(mx - b.x, my - b.y) < b.radius) return i
      }
      return null
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      mouseRef.current.vx = Math.abs(mx - mouseRef.current.px)
      mouseRef.current.vy = Math.abs(my - mouseRef.current.py)
      mouseRef.current.px = mouseRef.current.x
      mouseRef.current.py = mouseRef.current.y
      mouseRef.current.x  = mx
      mouseRef.current.y  = my
      if (dragRef.current !== null) {
        bodies[dragRef.current].x = mx
        bodies[dragRef.current].y = my
      }
      hoveredRef.current = getBodyAt(mx, my)
    }

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const idx  = getBodyAt(e.clientX - rect.left, e.clientY - rect.top)
      if (idx !== null) { dragRef.current = idx; bodies[idx].dragging = true }
    }

    const onMouseUp = () => {
      if (dragRef.current !== null) {
        const b = bodies[dragRef.current]
        b.dragging = false
        b.vx = mouseRef.current.vx * 0.3
        b.vy = mouseRef.current.vy * 0.3
        dragRef.current = null
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    let raf: number
    const prevVels: number[] = bodies.map(() => 0)

    const loop = () => {
      const mouse = { x: mouseRef.current.x, y: mouseRef.current.y, vx: mouseRef.current.vx, vy: mouseRef.current.vy }
      engine.step(0, mouse)

      // Detect collisions for audio
      bodies.forEach((b, i) => {
        const speed = Math.hypot(b.vx, b.vy)
        const prev  = prevVels[i]
        if (prev - speed > 1.5) audioEngine.playLogoCollision(prev - speed)
        prevVels[i] = speed
      })

      ctx.clearRect(0, 0, W, H)

      bodies.forEach((b, i) => {
        const isHovered  = hoveredRef.current === i
        const isDragging = dragRef.current === i

        ctx.save()
        ctx.translate(b.x, b.y)

        // Glow
        if (isHovered || isDragging) {
          ctx.shadowColor  = b.color
          ctx.shadowBlur   = 30
        }

        // Circle body
        ctx.beginPath()
        ctx.arc(0, 0, b.radius * (isHovered ? 1.15 : 1), 0, Math.PI * 2)
        ctx.fillStyle = b.color + '22'
        ctx.strokeStyle = b.color
        ctx.lineWidth = 1.5
        ctx.fill()
        ctx.stroke()

        // Label
        ctx.shadowBlur = 0
        ctx.fillStyle  = '#0a0a0a'
        ctx.font       = `500 ${b.radius > 40 ? 11 : 9}px Inter, sans-serif`
        ctx.textAlign  = 'center'
        ctx.textBaseline = 'middle'
        const words = b.name.split(' ')
        if (words.length === 1) {
          ctx.fillText(b.name, 0, 0)
        } else {
          words.forEach((w, wi) => ctx.fillText(w, 0, (wi - (words.length - 1) / 2) * 14))
        }

        ctx.restore()
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [reducedMotion])

  return (
    <section id="clients" className="relative bg-[#FFE900] py-24 px-[5%]" aria-label="Client brands">
      <h2 className="font-bebas text-black mb-2" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
        Brands That Trust Phantom Code
      </h2>
      <p className="font-light text-black/50 text-sm mb-8 tracking-widest uppercase font-mono">
        Drag. Drop. Interact.
      </p>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '600px', cursor: 'none' }}
        aria-label="Interactive physics playground with client brand logos"
      />
    </section>
  )
}
