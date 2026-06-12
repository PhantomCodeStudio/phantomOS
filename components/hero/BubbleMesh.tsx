'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useStore } from '@/lib/store'
import type { IridescentMaterialInstance } from '@/lib/shaders/iridescent'
import '@/lib/shaders/iridescent'

interface Props {
  position: [number, number, number]
  radius: number
  phase: number
}

export function BubbleMesh({ position, radius, phase }: Props) {
  const meshRef   = useRef<Mesh>(null)
  const vel       = useRef(new Vector3(0, 0, 0))
  const pos       = useRef(new Vector3(...position))
  const reducedMotion = useStore((s) => s.reducedMotion)

  useFrame(({ clock, camera, pointer }) => {
    if (reducedMotion) return
    const t   = clock.getElapsedTime()
    const mat = meshRef.current?.material as IridescentMaterialInstance | undefined
    if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }

    // Buoyancy
    const buoy = Math.sin(t * 0.4 + phase) * 0.008
    vel.current.y += buoy
    vel.current.y -= 0.002  // gravity
    vel.current.multiplyScalar(0.98) // drag

    // Mouse repulsion
    const mouseWorld = new Vector3(pointer.x * 8, pointer.y * 4, 0)
    const diff = pos.current.clone().sub(mouseWorld)
    const dist = diff.length()
    if (dist < 1.5) vel.current.add(diff.normalize().multiplyScalar(0.05 / (dist + 0.1)))

    pos.current.add(vel.current)

    // Bounds
    if (Math.abs(pos.current.x) > 8)  { pos.current.x  = Math.sign(pos.current.x) * 8;  vel.current.x *= -0.6 }
    if (Math.abs(pos.current.y) > 4.5) { pos.current.y = Math.sign(pos.current.y) * 4.5; vel.current.y *= -0.6 }

    if (meshRef.current) meshRef.current.position.copy(pos.current)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <iridescentMaterial
        transparent
        uFresnelPower={3.0}
        uRefractionStrength={0.15}
        uAlpha={0.75}
        depthWrite={false}
      />
    </mesh>
  )
}
