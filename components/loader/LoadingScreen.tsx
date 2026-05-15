'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useStore } from '@/lib/store'

const COLORS = ['#4169FF', '#7B00FF', '#00FF87']

export function LoadingScreen() {
  const ref        = useRef<HTMLDivElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [pct, setPct] = useState(0)
  const setLoading = useStore((s) => s.setLoading)

  useEffect(() => {
    document.body.classList.add('loading')

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const particles = Array.from({ length: 500 }, () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 200 + Math.random() * 300
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        tx: cx + (Math.random() - 0.5) * 40,
        ty: cy + (Math.random() - 0.5) * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2 + 1,
        speed: 0.3 + Math.random() * 0.5,
        progress: 0,
      }
    })

    let raf: number
    let animating = true
    const draw = () => {
      if (!animating) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.progress = Math.min(1, p.progress + p.speed * 0.01)
        p.x += (p.tx - p.x) * 0.05
        p.y += (p.ty - p.y) * 0.05
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.progress
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const obj = { val: 0 }
    gsap.to(obj, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        setPct(Math.round(obj.val))
        if (barRef.current) barRef.current.style.width = `${obj.val}%`
      },
      onComplete: exit,
    })

    let escEnabled = false
    const escTimer = setTimeout(() => { escEnabled = true }, 1000)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && escEnabled) exit() }
    window.addEventListener('keydown', onKey)

    function exit() {
      animating = false
      cancelAnimationFrame(raf)
      gsap.to(ref.current, {
        opacity: 0, duration: 0.3, onComplete: () => {
          document.body.classList.remove('loading')
          setLoading(false)
        }
      })
    }

    return () => {
      clearTimeout(escTimer)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [setLoading])

  return (
    <div ref={ref} className="fixed inset-0 z-[99999] bg-[#FFE900] flex flex-col items-center justify-center gap-8">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image src="/images/logo.png" alt="Phantom Code" width={200} height={200} priority className="animate-[fadeScale_0.5s_ease-out_forwards]" />
        <div className="w-[300px] h-[4px] bg-black/10 overflow-hidden">
          <div ref={barRef} className="h-full bg-black transition-none" style={{ width: '0%' }} />
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.25em] text-black/40">{pct}%</span>
      </div>
    </div>
  )
}
