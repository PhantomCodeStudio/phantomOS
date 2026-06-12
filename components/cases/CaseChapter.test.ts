import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('CaseChapter', () => {
  it('includes a mobile-visible image container for static mode', () => {
    const source = readFileSync(new URL('./CaseChapter.tsx', import.meta.url), 'utf8')

    expect(source).toContain('md:hidden')
    expect(source).toContain('imageAlt')
  })
})
