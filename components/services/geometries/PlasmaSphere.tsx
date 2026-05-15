'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Color } from 'three'
import '@/lib/shaders/iridescent'

export function PlasmaSphere() {
  const ref = useRef<Mesh>(null)

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (!ref.current) return
    ref.current.rotation.y = t * 0.3
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.2
    const mat = ref.current.material as any
    if (mat) {
      mat.uTime = t
      mat.uCameraPosition = camera.position
      mat.uFresnelPower = 2.5 + Math.sin(t * 0.5) * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <iridescentMaterial transparent uColor={new Color('#CC0033')} uFresnelPower={2.5} uAlpha={0.8} depthWrite={false} />
    </mesh>
  )
}
