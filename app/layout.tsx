// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Cursor }         from '@/components/ui/Cursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { LenisProvider }  from '@/components/providers/LenisProvider'
import { ReducedMotionProvider } from '@/components/providers/ReducedMotionProvider'

export const metadata: Metadata = {
  title: 'Phantom Code — Immersive by Design',
  description: 'We architect immersive experiences. AR, XR, interactive installations, spatial computing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Cursor />
        <ReducedMotionProvider />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
