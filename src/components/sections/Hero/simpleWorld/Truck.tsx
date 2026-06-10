'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TruckProps {
  startPosition?: [number, number, number]
  endPosition?: [number, number, number]
  speed?: number
  color?: string
}

export function Truck({
  startPosition = [-60, 0.9, 5],
  endPosition   = [ 60, 0.9, 5],
  speed = 5,
  color = '#c0392b',
}: TruckProps) {
  const ref = useRef<THREE.Group>(null)
  const t   = useRef(0.5)

  const dx = endPosition[0] - startPosition[0]
  const dz = endPosition[2] - startPosition[2]
  const len = Math.sqrt(dx * dx + dz * dz)
  const rotY = Math.atan2(dx, dz)

  useFrame((_, delta) => {
    t.current = (t.current + (speed * delta) / len) % 1
    if (ref.current) {
      ref.current.position.set(
        startPosition[0] + dx * t.current,
        startPosition[1],
        startPosition[2] + dz * t.current,
      )
    }
  })

  return (
    <group ref={ref} rotation={[0, rotY, 0]}>
      {/* Cab */}
      <mesh position={[2.5, 1.0, 0]} castShadow>
        <boxGeometry args={[2.2, 2.0, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Cargo box */}
      <mesh position={[-1.5, 1.0, 0]} castShadow>
        <boxGeometry args={[5.5, 2.0, 2.2]} />
        <meshStandardMaterial color="#888888" roughness={0.7} />
      </mesh>
      {/* Wheels */}
      {([ [2.2, -1.0], [2.2, 1.0], [-0.5, -1.0], [-0.5, 1.0], [-2.5, -1.0], [-2.5, 1.0] ] as [number, number][]).map(([bx, bz], i) => (
        <mesh key={i} position={[bx, 0.35, bz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.22, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  )
}
