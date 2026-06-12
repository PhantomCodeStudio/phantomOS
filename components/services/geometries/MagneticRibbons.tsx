'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3, Color } from 'three'
import { Mesh } from 'three'
import type { IridescentMaterialInstance } from '@/lib/shaders/iridescent'
import '@/lib/shaders/iridescent'

export function MagneticRibbons() {
  const ribbons = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const pts = Array.from({ length: 8 }, (_, j) => new Vector3(
        Math.sin((j / 7) * Math.PI * 2 + i) * 2,
        (j / 7) * 4 - 2,
        Math.cos((j / 7) * Math.PI * 2 + i * 0.7) * 1.5,
      ))
      return { curve: new CatmullRomCurve3(pts), phase: i * 0.5 }
    }), [])

  const refs = useRef<(Mesh | null)[]>([])

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    ribbons.forEach((r, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.rotation.y = Math.sin(t * 0.2 + r.phase) * 0.3
      mesh.rotation.z = Math.cos(t * 0.15 + r.phase) * 0.2
      const mat = mesh.material as IridescentMaterialInstance
      if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }
    })
  })

  return (
    <group>
      {ribbons.map((r, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }}>
          <tubeGeometry args={[r.curve, 20, 0.05, 8, false]} />
          <iridescentMaterial transparent uColor={new Color('#7B00FF')} uFresnelPower={3} uAlpha={0.85} />
        </mesh>
      ))}
    </group>
  )
}
