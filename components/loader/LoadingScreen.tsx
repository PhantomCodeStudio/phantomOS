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
  const [exited, setExited] = useState(false)
  const setLoading = useStore((s) => s.setLoading)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const exitStartedRef = useRef(false)
  const progressTweenRef = useRef<gsap.core.Tween | null>(null)
  const fadeTweenRef = useRef<gsap.core.Tween | null>(null)
  const rafRef = useRef<number | null>(null)
  const escTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (exited) return

    exitStartedRef.current = false
    document.body.classList.add('loading')

    const shouldReduceMotion =
      reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animating = true
    let escEnabled = false
    let keyListenerActive = false

    const clearEscTimer = () => {
      if (escTimerRef.current !== null) {
        clearTimeout(escTimerRef.current)
        escTimerRef.current = null
      }
    }

    const cancelRaf = () => {
      animating = false
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const killTweens = () => {
      progressTweenRef.current?.kill()
      fadeTweenRef.current?.kill()
      progressTweenRef.current = null
      fadeTweenRef.current = null
    }

    const removeBodyLoading = () => {
      document.body.classList.remove('loading')
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escEnabled) exit()
    }

    const removeKeyListener = () => {
      if (!keyListenerActive) return
      window.removeEventListener('keydown', onKey)
      keyListenerActive = false
    }

    if (!shouldReduceMotion) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (canvas && ctx) {
        canvas.width = window.innerWidth
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
          rafRef.current = requestAnimationFrame(draw)
        }

        rafRef.current = requestAnimationFrame(draw)
      }
    }

    const obj = { val: 0 }
    progressTweenRef.current = gsap.to(obj, {
      val: 100,
      duration: shouldReduceMotion ? 0.2 : 2.5,
      ease: shouldReduceMotion ? 'none' : 'power2.inOut',
      onUpdate: () => {
        setPct(Math.round(obj.val))
        if (barRef.current) barRef.current.style.width = `${obj.val}%`
      },
      onComplete: exit,
    })

    escTimerRef.current = setTimeout(() => { escEnabled = true }, shouldReduceMotion ? 0 : 1000)
    window.addEventListener('keydown', onKey)
    keyListenerActive = true

    function finishExit() {
      killTweens()
      cancelRaf()
      clearEscTimer()
      removeKeyListener()
      removeBodyLoading()
      setLoading(false)
      setExited(true)
    }

    function exit() {
      if (exitStartedRef.current) return
      exitStartedRef.current = true
      progressTweenRef.current?.kill()
      progressTweenRef.current = null
      cancelRaf()
      clearEscTimer()
      removeKeyListener()

      if (!ref.current) {
        finishExit()
        return
      }

      fadeTweenRef.current = gsap.to(ref.current, {
        opacity: 0,
        duration: shouldReduceMotion ? 0.001 : 0.3,
        onComplete: finishExit,
      })
    }

    return () => {
      killTweens()
      cancelRaf()
      clearEscTimer()
      removeKeyListener()
      removeBodyLoading()
    }
  }, [exited, reducedMotion, setLoading])

  if (exited) return null

  return (
    <div ref={ref} className="fixed inset-0 z-[99999] bg-[#FFE900] flex flex-col items-center justify-center gap-8">
      <canvas ref={canvasRef} className={reducedMotion ? 'hidden' : 'absolute inset-0 pointer-events-none'} aria-hidden="true" />
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
