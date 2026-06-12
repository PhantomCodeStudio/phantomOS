'use client'

import React from 'react'
import { useStore } from '@/lib/store'

type SplitMode = 'words' | 'chars'

interface TextSplitterProps {
  text: string
  splitBy?: SplitMode
  className?: string
  wordClassName?: string
  charClassName?: string
  as?: React.ElementType
}

/**
 * Splits text into animated-ready word or character spans.
 * Keeps full text accessible via aria-label; visual fragments are aria-hidden.
 * Renders static plain text when reduced motion is preferred.
 * No GSAP. No animation. No external packages.
 */
export function TextSplitter({
  text,
  splitBy = 'words',
  className,
  wordClassName = '',
  charClassName = '',
  as: Tag = 'span',
}: TextSplitterProps) {
  const reducedMotion = useStore((s) => s.reducedMotion)

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  const words = text.split(/\s+/).filter(Boolean)

  if (splitBy === 'chars') {
    return (
      <Tag className={className} aria-label={text}>
        {words.map((word, wi) => (
          <React.Fragment key={wi}>
            <span
              className={wordClassName}
              aria-hidden="true"
              data-word={word}
              data-word-index={wi}
              style={{ display: 'inline-block' }}
            >
              {word.split('').map((char, ci) => (
                <span
                  key={ci}
                  className={charClassName}
                  aria-hidden="true"
                  data-char={char}
                  data-char-index={ci}
                  data-word-index={wi}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && (
              <span aria-hidden="true" style={{ display: 'inline-block', width: '0.3em' }}>
                {' '}
              </span>
            )}
          </React.Fragment>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            className={wordClassName}
            aria-hidden="true"
            data-word={word}
            data-word-index={i}
            style={{ display: 'inline-block' }}
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span aria-hidden="true" style={{ display: 'inline-block', width: '0.3em' }}>
              {' '}
            </span>
          )}
        </React.Fragment>
      ))}
    </Tag>
  )
}
