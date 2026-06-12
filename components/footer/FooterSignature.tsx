'use client'
import { useState } from 'react'

const SIGNATURE = 'Designed by Phantom Code \u00AE 2026'

export function FooterSignature() {
  const [isPointerNear, setIsPointerNear] = useState(false)
  const [isTappedOpen, setIsTappedOpen] = useState(false)
  const isRevealed = isPointerNear || isTappedOpen

  return (
    <button
      type="button"
      aria-pressed={isRevealed}
      aria-label="Reveal Phantom Code design signature"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setIsPointerNear(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') setIsPointerNear(false)
      }}
      onFocus={() => setIsPointerNear(true)}
      onBlur={() => setIsPointerNear(false)}
      onClick={() => setIsTappedOpen((value) => !value)}
      className="group mt-24 cursor-none border-0 bg-transparent p-3 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4169FF]"
    >
      <span
        className={[
          'block font-mono text-[0.58rem] uppercase tracking-[0.32em] text-black transition duration-500 ease-out',
          isRevealed ? 'opacity-80 blur-0 translate-y-0' : 'opacity-20 blur-[1.5px] translate-y-1',
        ].join(' ')}
      >
        {SIGNATURE}
      </span>
      <span
        aria-hidden="true"
        className={[
          'mx-auto mt-2 block h-px w-10 bg-black transition-all duration-500 ease-out',
          isRevealed ? 'opacity-50 scale-x-100' : 'opacity-20 scale-x-50',
        ].join(' ')}
      />
    </button>
  )
}
