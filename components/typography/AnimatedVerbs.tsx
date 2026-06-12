'use client'

import React from 'react'
import { useStore } from '@/lib/store'

interface AnimatedVerbsProps {
  words: string[]
  className?: string
  as?: React.ElementType
}

export function AnimatedVerbs({
  words: rawWords,
  className = '',
  as: Tag = 'span',
}: AnimatedVerbsProps) {
  const reducedMotion = useStore((s) => s.reducedMotion)
  const words = rawWords.slice(0, 3)

  if (words.length === 0) return null

  // Reduced motion or single word: static, no cycling
  if (reducedMotion || words.length === 1) {
    return <Tag className={className || undefined}>{words[0]}</Tag>
  }

  const count = words.length

  return (
    <Tag className={`av-root${className ? ` ${className}` : ''}`}>
      {/* Screen-reader reads all words; visual track is aria-hidden */}
      <span className="av-sr-only">{words.join(' / ')}</span>
      <span
        className={`av-track av-track--${count}`}
        aria-hidden="true"
      >
        {words.map((word, i) => (
          <span key={i} className="av-word">
            {word}
          </span>
        ))}
      </span>
    </Tag>
  )
}
