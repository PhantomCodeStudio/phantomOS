'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedVerbs } from '@/components/typography/AnimatedVerbs'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

const METRICS = [
  { label: 'Years Active',         value: 10 },
  { label: 'Projects Delivered',   value: 150 },
  { label: 'Clients Served',       value: 45 },
  { label: 'AR Activations',       value: 200 },
  { label: 'Team Members',         value: 25 },
  { label: 'Awards Won',           value: 12 },
]

const PHILOSOPHY = [
  "We don't follow trends.",
  "We create them.",
  "",
  "Immersive experiences aren't a trend.",
  "They're the future of connection.",
  "",
  "Every interaction matters.",
  "Every detail counts.",
  "",
  "We architect experiences that transform",
  "how brands connect with their audience.",
  "",
  "Not through screens.",
  "Through presence.",
]

const KEY_PHRASES = ['Immersive experiences', 'future of connection', 'Through presence']

export function WhyPhantom() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (!sectionRef.current) return
    const counterTweens: gsap.core.Tween[] = []

    const ctx = gsap.context(() => {
      const counters = sectionRef.current!.querySelectorAll<HTMLElement>('.metric-num')
      counters.forEach((el) => {
        const target = parseInt(el.dataset.value!)
        const obj = { val: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          onEnter: () => {
          const tween = gsap.to(obj, {
              val: target,
              duration: reducedMotion ? 0.001 : 1.5,
              ease: 'power2.out',
              onUpdate: () => { el.textContent = `${Math.round(obj.val)}+` },
            })
            counterTweens.push(tween)
          },
        })
      })

      const words = sectionRef.current!.querySelectorAll<HTMLElement>('.phil-word')
      gsap.fromTo(words,
        { opacity: 0, y: reducedMotion ? 0 : 10 },
        {
          opacity: 1, y: 0,
          stagger: 0.05,
          duration: reducedMotion ? 0.001 : 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current!.querySelector('.philosophy'), start: 'top 70%' },
        }
      )
    }, sectionRef)

    return () => {
      counterTweens.forEach((tween) => tween.kill())
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <section id="why" ref={sectionRef} className="bg-[#FFE900] py-32 px-[5%] relative overflow-hidden" aria-label="Why Phantom Code">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-6xl mx-auto">
        {/* Left â€” metrics */}
        <div>
          <h2 className="font-bebas text-black mb-12" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="font-bebas text-[#4169FF]" style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}>
                  <span className="metric-num" data-value={m.value}>0+</span>
                </div>
                <div className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right â€” philosophy */}
        <div className="philosophy">
          <p className="font-mono text-[0.65rem] tracking-widest uppercase text-black/40 mb-3">
            <AnimatedVerbs words={['BUILD', 'DESIGN', 'SHIP']} />
          </p>
          <h2 className="font-bebas text-black mb-12" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Our Philosophy
          </h2>
          <div className="flex flex-col gap-1">
            {PHILOSOPHY.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-4" />
              ) : (
                <p key={i} className="leading-relaxed">
                  {line.split(' ').map((word, wi) => (
                    <span
                      key={wi}
                      className="phil-word inline-block mr-[0.25em] opacity-0"
                      style={{ color: KEY_PHRASES.some(kp => kp.includes(word)) ? '#00FFFF' : '#0a0a0a' }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

