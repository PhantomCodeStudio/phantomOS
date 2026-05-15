'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { MagneticInkCanvas } from './MagneticInkCanvas'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { useStore } from '@/lib/store'

const LINKS = ['About', 'Services', 'Work', 'Contact']
const ANCHORS: Record<string, string> = {
  About: '#problem',
  Services: '#services',
  Work: '#cases',
  Contact: '#footer',
}

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const scrollProgress = useStore((s) => s.scrollProgress)

  useEffect(() => {
    if (!navRef.current) return
    if (scrollProgress > 0.02) {
      navRef.current.classList.add('sc')
    } else {
      navRef.current.classList.remove('sc')
    }
  }, [scrollProgress])

  const scrollTo = (anchor: string) => {
    const el = document.querySelector(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] transition-[background,backdrop-filter,border-color] duration-500 [&.sc]:bg-[rgba(255,233,0,0.9)] [&.sc]:backdrop-blur-[12px] [&.sc]:border-b [&.sc]:border-black/[0.08]"
    >
      <MagneticInkCanvas />
      <div className="relative z-10 flex items-center">
        <Image src="/images/logo.png" alt="Phantom Code" width={36} height={36} />
      </div>
      <ul className="relative z-10 flex gap-8 list-none">
        {LINKS.map((link) => (
          <li key={link}>
            <button
              onClick={() => scrollTo(ANCHORS[link])}
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-black/50 hover:text-black transition-colors duration-200 cursor-none"
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative z-10">
        <AudioToggle />
      </div>
    </nav>
  )
}
