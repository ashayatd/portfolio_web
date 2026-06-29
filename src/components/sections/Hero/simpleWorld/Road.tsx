"use client";

import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

interface RoadProps {
  position?: [number, number, number];
  width?: number;
  length?: number;
  rotation?: [number, number, number];
}

export function Road({
  position = [0, 0, 0],
  width = 4,
  length = 70,
  rotation = [0, 0, 0],
}: RoadProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main road surface — rounded edges */}
      <RoundedBox
        args={[width, 0.3, length]}
        radius={0.15}
        smoothness={4}
        receiveShadow
      >
        <meshStandardMaterial color="#979696" roughness={0.9} metalness={0} />
      </RoundedBox>

      {/* Edge strips — rounded too */}
      <RoundedBox
        position={[-width / 2 + 0.15, 0.01, 0]}
        args={[0.3, 0.02, length]}
        radius={0.05}
        smoothness={2}
        receiveShadow
      >
        <meshStandardMaterial color="#878686" roughness={0.9} />
      </RoundedBox>

      <RoundedBox
        position={[width / 2 - 0.15, 0.01, 0]}
        args={[0.3, 0.02, length]}
        radius={0.05}
        smoothness={2}
        receiveShadow
      >
        <meshStandardMaterial color="#878686" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

/* Intersection — rounded cross in the center */
export function RoadIntersection({
  position = [0, 0, 0],
  size = 14,
}: {
  position?: [number, number, number];
  size?: number;
}) {
  return (
    <group position={position}>
      {/* Main intersection surface — rounded square */}
      <RoundedBox
        args={[size, 0.05, size]}
        radius={0.3}
        smoothness={4}
        receiveShadow
      >
        <meshStandardMaterial color="#D8D8D8" roughness={0.9} />
      </RoundedBox>

      {/* Cross pattern lines — vertical */}
      <RoundedBox
        args={[4, 0.02, size]}
        radius={0.05}
        smoothness={2}
        receiveShadow
      >
        <meshStandardMaterial color="#C8C8C8" roughness={0.9} />
      </RoundedBox>

      {/* Cross pattern lines — horizontal */}
      <RoundedBox
        args={[size, 0.02, 4]}
        radius={0.05}
        smoothness={2}
        receiveShadow
      >
        <meshStandardMaterial color="#C8C8C8" roughness={0.9} />
      </RoundedBox>

      {/* Center monument base — rounded */}
      <RoundedBox
        position={[0, 0.3, 0]}
        args={[0.8, 0.6, 0.8]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#B0B8C0" roughness={0.7} />
      </RoundedBox>

      {/* Center monument top — rounded */}
      <RoundedBox
        position={[0, 0.7, 0]}
        args={[0.5, 0.4, 0.5]}
        radius={0.08}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color="#A0B0C0" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}