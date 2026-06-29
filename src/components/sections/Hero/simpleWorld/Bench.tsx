"use client";

import { RoundedBox } from "@react-three/drei";

interface BenchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const COLOR = {
  wood: "#D4C4A8",
  support: "#B8A88C",
  leg: "#A8987C",
};

export function Bench({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BenchProps) {
  return (
    <group position={position} rotation={rotation} scale={[1.2, 1.2, 1.2]}>
      {/* Seat */}
      <RoundedBox
        args={[2, 0.15, 0.6]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={COLOR.wood} roughness={0.8} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox
        args={[2, 0.7, 0.08]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.9, -0.25]}
        castShadow
      >
        <meshStandardMaterial color={COLOR.wood} roughness={0.8} />
      </RoundedBox>

      {/* Left support frame */}
      <RoundedBox
        args={[0.12, 0.8, 0.65]}
        radius={0.03}
        smoothness={4}
        position={[-0.9, 0.7, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLOR.support} roughness={0.8} />
      </RoundedBox>

      {/* Right support frame */}
      <RoundedBox
        args={[0.12, 0.8, 0.65]}
        radius={0.03}
        smoothness={4}
        position={[0.9, 0.7, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLOR.support} roughness={0.8} />
      </RoundedBox>

      {/* Legs */}
      {[-0.8, 0.8].map((x) => (
        <RoundedBox
          key={x}
          args={[0.1, 0.5, 0.1]}
          radius={0.02}
          smoothness={4}
          position={[x, 0.25, 0]}
          castShadow
        >
          <meshStandardMaterial color={COLOR.leg} roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  );
}