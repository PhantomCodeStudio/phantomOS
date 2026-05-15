'use client'
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'

const GEOMETRIES = {
  crystal: lazy(() => import('./geometries/CrystalFragments').then(m => ({ default: m.CrystalFragments }))),
  ribbons: lazy(() => import('./geometries/MagneticRibbons').then(m => ({ default: m.MagneticRibbons }))),
  plasma:  lazy(() => import('./geometries/PlasmaSphere').then(m => ({ default: m.PlasmaSphere }))),
  vortex:  lazy(() => import('./geometries/PlasmaVortex').then(m => ({ default: m.PlasmaVortex }))),
}

interface Props {
  tier: number
  name: string
  color: string
  features: string[]
  geometry: keyof typeof GEOMETRIES
  active: boolean
}

export function ServiceChapter({ tier, name, color, features, geometry, active }: Props) {
  const Geo = GEOMETRIES[geometry]

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: active ? 'auto' : 'none' }}
    >
      {/* Left: text */}
      <div className="w-1/2 px-[8%] flex flex-col gap-6">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-black/30">
          Tier 0{tier}
        </span>
        <h2
          className="font-bebas text-black leading-none"
          style={{ fontSize: 'clamp(12vw, 15vw, 18vw)', color: active ? '#0a0a0a' : '#0a0a0a' }}
        >
          {name}
        </h2>
        <ul className="flex flex-col gap-2 mt-2">
          {features.map((f, i) => (
            <li key={i} className="font-light text-sm text-black/60 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: color }} />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="mailto:studio@enterphantomcode.com"
          className="mt-4 font-mono text-sm tracking-widest uppercase text-black hover:opacity-60 transition-opacity group inline-flex items-center gap-2"
        >
          Book a Call →
          <span className="block h-[1px] w-0 group-hover:w-16 transition-all duration-500" style={{ background: color }} />
        </a>
      </div>

      {/* Right: 3D canvas */}
      <div className="w-1/2 h-screen" aria-label={`3D visualization for ${name}`}>
        {active && (
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: 'transparent' }}>
            <Suspense fallback={null}>
              <Geo />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  )
}
