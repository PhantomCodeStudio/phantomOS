// components/providers/ReducedMotionProvider.tsx
'use client'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ReducedMotionProvider() {
  useReducedMotion()
  return null
}
