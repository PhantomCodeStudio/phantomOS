'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2, Color, InstancedMesh, Object3D } from 'three'
import { BubbleMesh } from './BubbleMesh'
import { useStore } from '@/lib/store'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const BUBBLE_LARGE  = [[-2, 1, -1], [2.5, -0.5, -0.5], [0, -1.5, 0.5]] as [number,number,number][]
const BUBBLE_SMALL  = [[-4, 2, 0], [4, 1.5, -1], [-1.5, 2.5, 0.5], [3, -2, 0], [-3, -1.5, -0.5], [1, 3, -0.5]] as [number,number,number][]
const RADII_LARGE   = [1.1, 0.9, 0.8]
const RADII_SMALL   = [0.4, 0.35, 0.3, 0.45, 0.25, 0.35]
const PARTICLE_COLORS = [0x4169FF, 0x7B00FF, 0x00FF87]
const COUNT = 5000
const CHROMATIC_OFFSET = new Vector2(0.002, 0.002)
const _colors = [new Color(PARTICLE_COLORS[0]), new Color(PARTICLE_COLORS[1]), new Color(PARTICLE_COLORS[2])]

function BackgroundParticles() {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy   = useRef(new Object3D())
  const reducedMotion = useStore((s) => s.reducedMotion)

  useFrame(({ clock }) => {
    if (reducedMotion || !meshRef.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const seed = i * 2.39996
      const x = Math.cos(seed) * (3 + (i % 7))
      const y = Math.sin(seed * 1.3) * (2 + (i % 5)) + Math.sin(t * 0.2 + i) * 0.1
      const z = -2 - (i % 4)
      dummy.current.position.set(x, y, z)
      dummy.current.scale.setScalar(0.02 + (i % 3) * 0.01)
      dummy.current.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.current.matrix)
      meshRef.current.setColorAt(i, _colors[i % 3])
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}

function CameraRig() {
  const mouse = useMouseParallax()
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#FFE900' }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <BackgroundParticles />
          {BUBBLE_LARGE.map((pos, i) => (
            <BubbleMesh key={`l${i}`} position={pos} radius={RADII_LARGE[i]} phase={i * 2.1} />
          ))}
          {BUBBLE_SMALL.map((pos, i) => (
            <BubbleMesh key={`s${i}`} position={pos} radius={RADII_SMALL[i]} phase={i * 1.3} />
          ))}
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={CHROMATIC_OFFSET} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
            <Vignette eskil={false} offset={0.3} darkness={0.4} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
