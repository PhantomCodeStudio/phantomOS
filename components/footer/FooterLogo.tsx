'use client'
import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Mesh, TextureLoader, Color } from 'three'
import type { IridescentMaterialInstance } from '@/lib/shaders/iridescent'
import '@/lib/shaders/iridescent'

function LogoMesh() {
  const ref = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, '/images/logo.png')

  useFrame(({ clock, camera }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.4
    const mat = ref.current.material as IridescentMaterialInstance
    if (mat) { mat.uTime = clock.getElapsedTime(); mat.uCameraPosition = camera.position }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[3, 3]} />
      <iridescentMaterial transparent uAlphaMap={texture} uUseAlphaMap uColor={new Color('#0a0a0a')} uFresnelPower={2.5} uAlpha={1} />
    </mesh>
  )
}

export function FooterLogo() {
  return (
    <div className="w-40 h-40 mx-auto" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <LogoMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}
