// components/ui/ScrollProgress.tsx
'use client'
import { useStore } from '@/lib/store'

export function ScrollProgress() {
  const progress = useStore((s) => s.scrollProgress)
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none">
      <div
        className="h-full bg-black transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
