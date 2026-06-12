'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'
import { CaseChapter } from './CaseChapter'

gsap.registerPlugin(ScrollTrigger)

const CASES = [
  {
    title: 'Dress Code: Digital',
    color: '#FF006E',
    bgColor: '#FFE900',
    image: '/images/cases/case-1.svg',
    imageAlt: 'Abstract visual of an immersive web interface field',
    metrics: [
      { label: 'Reach',       value: '2.5M+' },
      { label: 'Engagement',  value: '45%' },
      { label: 'Conversions', value: '+180%' },
    ],
    detail: 'WebGL + Three.js real-time cloth simulation. 45 product variations. Built in 6 weeks.',
  },
  {
    title: 'Reality Redefined',
    color: '#A100F2',
    bgColor: '#FFE900',
    image: '/images/cases/case-2.svg',
    imageAlt: 'Abstract visual of an AR spatial interface composition',
    metrics: [
      { label: 'Visitors',    value: '50K+' },
      { label: 'Avg Time',    value: '12min' },
      { label: 'Repeat Rate', value: '65%' },
    ],
    detail: 'TouchDesigner + motion capture. 8-week development. Real-time motion simulation on custom hardware.',
  },
  {
    title: 'The Past Meets Tomorrow',
    color: '#00D9FF',
    bgColor: '#FFE900',
    image: '/images/cases/case-3.svg',
    imageAlt: 'Abstract visual of an interactive projection installation',
    metrics: [
      { label: 'Interactions', value: '1M+' },
      { label: 'Impact Score', value: '9.2/10' },
      { label: 'Accessibility', value: 'AAA' },
    ],
    detail: 'Custom gesture recognition. 3D environment design. Accessibility-first approach with screen reader support.',
  },
]

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (reducedMotion || isMobile || !sectionRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: `+=${window.innerHeight * 3}`,
        scrub: 0.5,
        onUpdate: (self) => {
          const numChapters = CASES.length
          const segment = 1 / numChapters
          const activeIndex = Math.min(numChapters - 1, Math.floor(self.progress * numChapters))

          // Calculate progress (0 to 1) within the current chapter's segment
          const rawProgress = (self.progress - (activeIndex * segment)) / segment
          const roundedProgress = Math.round(rawProgress * 100) / 100

          setActive(activeIndex)
          setRevealProgress(roundedProgress)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion, isMobile])

  const isStatic = reducedMotion || isMobile

  return (
    <section 
      id="cases" 
      ref={sectionRef} 
      className={`relative ${isStatic ? 'min-h-screen py-24' : 'h-screen overflow-hidden'} bg-[#FFE900]`} 
      aria-label="Case studies"
    >
      <div className={isStatic ? 'flex flex-col gap-32' : ''}>
        {CASES.map((c, i) => (
          <div key={c.title} className={isStatic ? 'relative h-[50vh] min-h-[400px]' : ''}>
            <CaseChapter 
              {...c} 
              active={isStatic ? true : active === i} 
              revealProgress={active === i ? revealProgress : (i < active ? 1 : 0)}
              isStatic={isStatic}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

