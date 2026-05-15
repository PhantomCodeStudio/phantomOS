'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'

const COUNT = 2000

export function PlasmaVortex() {
  const ref   = useRef<InstancedMesh>(null)
  const dummy = useRef(new Object3D())

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2 * 8 + t * 0.3
      const r = 0.5 + (i / COUNT) * 2
      const y = (i / COUNT) * 4 - 2
      dummy.current.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      dummy.current.scale.setScalar(0.03)
      dummy.current.updateMatrix()
      ref.current.setMatrixAt(i, dummy.current.matrix)
      const hue = (i / COUNT + t * 0.05) % 1
      const col = new Color().setHSL(hue < 0.5 ? 0.78 : 0.42, 1, 0.6)
      ref.current.setColorAt(i, col)
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}
