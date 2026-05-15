// components/providers/LenisProvider.tsx
'use client'
import { useLenis } from '@/hooks/useLenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useLenis()
  return <>{children}</>
}
