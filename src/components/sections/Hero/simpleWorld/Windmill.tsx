"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WindmillProps {
  position?: [number, number, number];
}

export function Windmill({
  position = [0, 0, 0],
}: WindmillProps) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 3.5;
    }
  });

  return (
    <group position={position}>
      {/* ===================== */}
      {/* FOUNDATION */}
      {/* ===================== */}

      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[8, 0.3, 8]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      {/* Foundation Boundary Light */}

      <mesh position={[0, 0.32, 4]}>
        <boxGeometry args={[8, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 0.32, -4]}>
        <boxGeometry args={[8, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-4, 0.32, 0]}>
        <boxGeometry args={[0.08, 0.04, 8]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[4, 0.32, 0]}>
        <boxGeometry args={[0.08, 0.04, 8]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* TOWER */}
      {/* ===================== */}

      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 10, 3]} />
        <meshLambertMaterial color="#d0d0d0" />
      </mesh>

      {/* Tower Base Trim */}

      <mesh position={[0, 0.2, 1.55]}>
        <boxGeometry args={[3, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, 0.2, -1.55]}>
        <boxGeometry args={[3, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[-1.55, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.08, 3]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[1.55, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.08, 3]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* ROOF */}
      {/* ===================== */}

      <mesh
        position={[0, 11.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry args={[2.2, 3, 4]} />
        <meshLambertMaterial color="#777777" />
      </mesh>

      {/* ===================== */}
      {/* DOOR */}
      {/* ===================== */}

      <mesh position={[0, 2, 1.55]}>
        <planeGeometry args={[1, 2]} />
        <meshBasicMaterial color="#444444" />
      </mesh>

      {/* ===================== */}
      {/* WINDOW */}
      {/* ===================== */}

      <mesh position={[0, 6, 1.55]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Window Light */}

      <pointLight
        position={[0, 6, 1.2]}
        color="#fff4d6"
        intensity={1.5}
        distance={6}
      />

      {/* ===================== */}
      {/* ROTATING BLADES */}
      {/* ===================== */}

      <group ref={bladesRef} position={[0, 9, 1.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 8, 0.1]} />
          <meshLambertMaterial color="#cfcfcf" />
        </mesh>

        <mesh castShadow>
          <boxGeometry args={[8, 0.2, 0.1]} />
          <meshLambertMaterial color="#cfcfcf" />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[8, 0.15, 0.1]} />
          <meshLambertMaterial color="#cfcfcf" />
        </mesh>

        <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[8, 0.15, 0.1]} />
          <meshLambertMaterial color="#cfcfcf" />
        </mesh>

        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
      </group>
    </group>
  );
}