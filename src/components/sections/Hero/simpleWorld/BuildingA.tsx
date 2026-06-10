"use client";

import { Pond } from "./Pond";
import { RoundedBox } from "@react-three/drei";

interface BuildingAProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
}

function WindowFace({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, row) => {
        const leftLit = true;
        const rightLit = true;

        return (
          <group key={row}>
            <mesh position={[-width * 0.18, 5 + row * 4, depth / 2 + 0.02]}>
              <planeGeometry args={[width * 0.28, 2.5]} />
              <meshStandardMaterial
                color={leftLit ? "#fff6c4" : "#555555"}
                emissive={leftLit ? "#fff6c4" : "#000000"}
                emissiveIntensity={leftLit ? 1.5 : 0}
              />
            </mesh>

            <mesh position={[width * 0.18, 5 + row * 4, depth / 2 + 0.02]}>
              <planeGeometry args={[width * 0.28, 2.5]} />
              <meshStandardMaterial
                color={rightLit ? "#fff6c4" : "#555555"}
                emissive={rightLit ? "#fff6c4" : "#000000"}
                emissiveIntensity={rightLit ? 1.5 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export function BuildingA({
  position = [0, 0, 0],
  width = 8,
  height = 20,
  depth = 8,
}: BuildingAProps) {
  const rows = Math.floor(height / 2);

  return (
    <group position={position}>
      {/* Foundation */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width + 5, 0.2, depth + 15]} />
        <meshLambertMaterial color="#9a9a9a" />
      </mesh>

      {/* Front Neon Edge */}
      <mesh position={[0, 0.12, (depth + 15) / 2]}>
        <boxGeometry args={[width + 5, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Back Neon Edge */}
      <mesh position={[0, 0.12, -(depth + 15) / 2]}>
        <boxGeometry args={[width + 5, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left Neon Edge */}
      <mesh position={[-(width + 5) / 2, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.04, depth + 15]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Right Neon Edge */}
      <mesh position={[(width + 5) / 2, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.04, depth + 15]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      <Pond position={[0, 0.15, 7]} />

      {/* Main Building */}
      <mesh position={[0, height / 2.1 + 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color="#bfbfbf" />
      </mesh>

      {/* Building Base Neon Trim */}
      {/* Front */}
      <mesh position={[0, 1.05, depth / 2 + 0.02]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Back */}
      <mesh position={[0, 1.05, -depth / 2 - 0.02]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left */}
      <mesh position={[-width / 2 - 0.02, 1.05, 0]}>
        <boxGeometry args={[0.08, 0.08, depth]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Right */}
      <mesh position={[width / 2 + 0.02, 1.05, 0]}>
        <boxGeometry args={[0.08, 0.08, depth]} />
        <meshStandardMaterial
          color="#ffd36b"
          emissive="#ffd36b"
          emissiveIntensity={4}
        />
      </mesh>

      {/* AC Unit */}
      <mesh
        position={[width * 0.3, height + 1, depth * 0.15]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.7, 3.2]} />
        <meshLambertMaterial color="#8a8a8a" />
      </mesh>

      {/* Rooftop Railing */}
      <group position={[0, height + 0.7, 4]}>
        {/* Front */}
        <mesh>
          <boxGeometry args={[width + 0.2, 0.5, 0.15]} />
          <meshLambertMaterial color="#9a9a9a" />
        </mesh>

        {/* Back */}
        <mesh position={[0, 0, -depth]}>
          <boxGeometry args={[width + 0.2, 0.5, 0.15]} />
          <meshLambertMaterial color="#9a9a9a" />
        </mesh>

        {/* Left */}
        <mesh position={[-width / 2, 0, -depth / 2]}>
          <boxGeometry args={[0.15, 0.5, depth]} />
          <meshLambertMaterial color="#9a9a9a" />
        </mesh>

        {/* Right */}
        <mesh position={[width / 2, 0, -depth / 2]}>
          <boxGeometry args={[0.15, 0.5, depth]} />
          <meshLambertMaterial color="#9a9a9a" />
        </mesh>
      </group>

      {/* Front Windows */}
      {/* Front */}
      <WindowFace width={width} height={height} depth={depth} />

      {/* Back */}
      <group rotation={[0, Math.PI, 0]}>
        <WindowFace width={width} height={height} depth={depth} />
      </group>

      {/* Left */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <WindowFace width={depth} height={height} depth={width} />
      </group>

      {/* Right */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <WindowFace width={depth} height={height} depth={width} />
      </group>
    </group>
  );
}
