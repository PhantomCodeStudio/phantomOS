'use client'
import { useRef } from 'react'

export function useScrollVelocity() {
  const velocity = useRef(0)
  return velocity
}
