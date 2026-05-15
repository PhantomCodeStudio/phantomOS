'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CaseChapter } from './CaseChapter'

gsap.registerPlugin(ScrollTrigger)

const CASES = [
  {
    title: 'Dress Code: Digital',
    color: '#FF006E',
    bgColor: '#FFE900',
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

  useEffect(() => {
    if (!sectionRef.current) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      start: 'top top',
      end: `+=${window.innerHeight * 3}`,
      scrub: 0.5,
      onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
    })
    return () => st.kill()
  }, [])

  return (
    <section id="cases" ref={sectionRef} className="relative h-screen overflow-hidden bg-[#FFE900]" aria-label="Case studies">
      {CASES.map((c, i) => (
        <CaseChapter key={c.title} {...c} active={active === i} />
      ))}
    </section>
  )
}
