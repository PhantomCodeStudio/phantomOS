'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ServiceChapter } from './ServiceChapter'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  { tier: 1, name: 'Interactive Installations', color: '#4169FF', geometry: 'crystal' as const,
    features: ['2D & 3D interactive experiences', 'Spatial design consultation', 'Installation prototyping', 'On-site technical direction'] },
  { tier: 2, name: 'Brand Activations', color: '#7B00FF', geometry: 'ribbons' as const,
    features: ['Immersive brand worlds', 'Event & experiential activations', 'AR social filters', 'Multi-sensory environments'] },
  { tier: 3, name: 'XR Experiences', color: '#CC0033', geometry: 'plasma' as const,
    features: ['WebXR & native AR/VR', 'Mixed reality installations', 'Real-time 3D environments', 'Spatial audio design'] },
  { tier: 4, name: 'Full Immersive Experiences', color: '#00FF87', geometry: 'vortex' as const,
    features: ['Complete world-building', 'Multi-sensory design', 'Custom hardware integration', 'Unlimited scope'] },
]

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive]   = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      start: 'top top',
      end: `+=${window.innerHeight * 4}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(3, Math.floor(self.progress * 4))
        setActive(idx)
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative h-screen overflow-hidden bg-[#FFE900]" aria-label="Services">
      {CHAPTERS.map((ch, i) => (
        <ServiceChapter key={ch.tier} {...ch} active={active === i} />
      ))}
    </section>
  )
}
