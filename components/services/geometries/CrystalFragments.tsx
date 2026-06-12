'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Color, Group } from 'three'
import type { IridescentMaterialInstance } from '@/lib/shaders/iridescent'
import '@/lib/shaders/iridescent'

export function CrystalFragments() {
  const groupRef = useRef<Group>(null)
  const fragments = Array.from({ length: 12 }, () => ({
    pos: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1] as [number,number,number],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number,number,number],
    scale: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  }))

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof Mesh)) return
      const f = fragments[i]
      const drift = Math.sin(t * 0.5 + f.phase) * 0.3
      child.position.set(f.pos[0] + drift, f.pos[1] + Math.cos(t * 0.3 + f.phase) * 0.2, f.pos[2])
      child.rotation.x = f.rot[0] + t * 0.2
      child.rotation.y = f.rot[1] + t * 0.15
      const mat = child.material as IridescentMaterialInstance
      if (mat) { mat.uTime = t; mat.uCameraPosition = camera.position }
    })
  })

  return (
    <group ref={groupRef}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          <octahedronGeometry args={[1, 0]} />
          <iridescentMaterial transparent uColor={new Color('#4169FF')} uFresnelPower={4} uAlpha={0.9} />
        </mesh>
      ))}
    </group>
  )
}
