"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WindmillProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Windmill({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: WindmillProps) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 2.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* ===================== */}
      {/* TOWER */}
      {/* ===================== */}

      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.6, 12, 16]} />
        <meshStandardMaterial color="#ece8e4" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* ===================== */}
      {/* NACELLE */}
      {/* ===================== */}

      <mesh position={[0, 12, 0.4]} castShadow>
        <boxGeometry args={[1.2, 1, 2]} />
        <meshStandardMaterial color="#e8e4e0" roughness={0.4} metalness={0.15} />
      </mesh>

      <mesh position={[0, 12, 1.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 16]} />
        <meshStandardMaterial color="#e0dcd8" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* ===================== */}
      {/* ROTATING BLADES */}
      {/* ===================== */}

      <group ref={bladesRef} position={[0, 12, 2]} rotation={[Math.PI /42, 0, 0]}>
        {/* Blade 1 — top */}
        <group>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[0.35, 8, 0.08]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.05} />
          </mesh>
        </group>

        {/* Blade 2 — 120° */}
        <group rotation={[0, 0, (Math.PI * 2) / 3]}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[0.35, 8, 0.08]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.05} />
          </mesh>
        </group>

        {/* Blade 3 — 240° */}
        <group rotation={[0, 0, -(Math.PI * 2) / 3]}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[0.35, 8, 0.08]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.05} />
          </mesh>
        </group>

        {/* Hub center */}
        <mesh castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#d4d0cc" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}