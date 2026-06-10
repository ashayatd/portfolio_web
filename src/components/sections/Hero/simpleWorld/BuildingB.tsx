"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { Text } from "@react-three/drei";

interface BuildingBProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
}

export function BuildingB({
  position = [0, 0, 0],
  width = 24,
  height = 10,
  depth = 14,
}: BuildingBProps) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();

    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(width / 2, height);
    s.lineTo(0, height + 3);
    s.lineTo(-width / 2, height);
    s.closePath();

    return s;
  }, [width, height]);

  return (
    <group position={position}>
      {/* ===================== */}
      {/* FOUNDATION */}
      {/* ===================== */}

      <mesh position={[0, 0.1, depth / 2]} receiveShadow>
        <boxGeometry args={[width + 6, 0.2, depth + 6]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      {/* Foundation Boundary Light */}

      {/* Front */}
      <mesh position={[0, 0.22, depth + 3]}>
        <boxGeometry args={[width + 6, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0.22, -3]}>
        <boxGeometry args={[width + 6, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left */}
      <mesh position={[-(width + 6) / 2, 0.22, depth / 2]}>
        <boxGeometry args={[0.08, 0.04, depth + 6]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Right */}
      <mesh position={[(width + 6) / 2, 0.22, depth / 2]}>
        <boxGeometry args={[0.08, 0.04, depth + 6]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* FACTORY BODY */}
      {/* ===================== */}

      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth,
              bevelEnabled: false,
            },
          ]}
        />
        <meshLambertMaterial color="#bfbfbf" />
      </mesh>

      {/* Building Base Light */}

      {/* Front */}
      <mesh position={[0, 0.08, depth + 0.02]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0.08, -0.02]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left */}
      <mesh position={[-width / 2 - 0.02, 0.08, depth / 2]}>
        <boxGeometry args={[0.08, 0.08, depth]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Right */}
      <mesh position={[width / 2 + 0.02, 0.08, depth / 2]}>
        <boxGeometry args={[0.08, 0.08, depth]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* ===================== */}
      {/* FACTORY NAME */}
      {/* ===================== */}

      <Text
        position={[0, 7.5, depth + 0.2]}
        fontSize={1.1}
        letterSpacing={0.1}
        lineHeight={1}
        fontWeight={700}
        maxWidth={15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        BUILDING{"\n"}SCALABLE{"\n"}SYSTEMS
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={2}
        />
      </Text>

      {/* ===================== */}
      {/* FACTORY ENTRANCE */}
      {/* ===================== */}

      <mesh position={[0, 1.2, depth + 1]} receiveShadow>
        <boxGeometry args={[width * 0.7, 0.4, 2]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      <mesh position={[0, 3.5, depth + 1]} castShadow>
        <boxGeometry args={[width * 0.7, 0.3, 2]} />
        <meshLambertMaterial color="#8a8a8a" />
      </mesh>

      {[-6, -3, 0, 3, 6].map((x, i) => (
        <mesh key={i} position={[x, 2.2, depth + 0.8]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshLambertMaterial color="#d0d0d0" />
        </mesh>
      ))}

      {/* Entrance Glass */}
      <mesh position={[0, 2.2, depth + 0.2]}>
        <planeGeometry args={[width * 0.5, 3.5]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Entrance Light */}
      <pointLight
        position={[0, 4.5, depth + 1]}
        color="#fff4d6"
        intensity={2}
        distance={10}
      />

      {/* ===================== */}
      {/* WINDOWS */}
      {/* ===================== */}

      {[-7, 7].map((x) =>
        [5, 7.5].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, depth + 0.15]}>
            <planeGeometry args={[2.5, 1.2]} />
            <meshStandardMaterial
              color="#fff4d6"
              emissive="#fff4d6"
              emissiveIntensity={3}
            />
          </mesh>
        )),
      )}

      {/* ===================== */}
      {/* ROOF AC */}
      {/* ===================== */}

      <mesh position={[width * 0.15, height + 2, depth / 2]} castShadow>
        <boxGeometry args={[5, 1, 3]} />
        <meshLambertMaterial color="#7f7f7f" />
      </mesh>

      {/* ===================== */}
      {/* SMOKESTACKS */}
      {/* ===================== */}

      {[
        { x: -8, h: 12, z: depth * 0.45 },
        { x: -3, h: 14, z: depth * 0.45 },
        { x: 4, h: 16, z: depth * 0.45 },
        { x: 10, h: 18, z: depth * 0.45 },
      ].map((stack, i) => (
        <mesh
          key={i}
          position={[stack.x, height + stack.h / 2, stack.z]}
          castShadow
        >
          <cylinderGeometry args={[0.8, 0.9, stack.h, 8]} />
          <meshLambertMaterial color="#7a7a7a" />
        </mesh>
      ))}
    </group>
  );
}
