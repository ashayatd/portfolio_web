"use client";

import { useMemo } from "react";

// Single straight road along Z axis
// Road: 7 units wide, sidewalks 1.5 units each side
// Dashes every 2.5 units along 100 unit length

export function Road({
  position = [0, 0, 0],
  width = 8,
  length = 100,
}: {
  position?: [number, number, number];
  width?: number;
  length?: number;
}) {
  return (
    <group position={position}>
      {/* Road */}
      <mesh receiveShadow>
        <boxGeometry args={[width, 0.05, length]} />
        <meshLambertMaterial color="#4e4d4d" />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.15, 0.01, length * 0.95]} />
        <meshLambertMaterial color="#bfbfbf" />
      </mesh>
    </group>
  );
}
