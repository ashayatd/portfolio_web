"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface GardenProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  length?: number;
}

const COLOR = {
  grass: "#7cb342",
  dirt: "#5d4037",
  curb: "#9e9e9e",
  plantLight: "#aed581",
  plantDark: "#689f38",
  plantYellow: "#dce775",
};

function PlantCluster({
  x,
  z,
  scale = 1,
}: {
  x: number;
  z: number;
  scale?: number;
}) {
  const height = 0.3 + Math.random() * 0.4;
  const type = Math.floor(Math.random() * 3);

  return (
    <group position={[x, height / 2, z]} scale={scale}>
      {type === 0 && (
        // Round bush
        <mesh castShadow>
          <sphereGeometry args={[0.25, 8, 6]} />
          <meshStandardMaterial
            color={Math.random() > 0.5 ? COLOR.plantLight : COLOR.plantDark}
            roughness={0.9}
          />
        </mesh>
      )}
      {type === 1 && (
        // Tall thin plant
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.06, height, 6]} />
            <meshStandardMaterial color={COLOR.plantDark} roughness={0.9} />
          </mesh>
          <mesh position={[0, height / 2 + 0.05, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color={COLOR.plantLight} roughness={0.9} />
          </mesh>
        </group>
      )}
      {type === 2 && (
        // Low cluster
        <group>
          <mesh position={[-0.08, 0, 0.06]} castShadow>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial color={COLOR.plantDark} roughness={0.9} />
          </mesh>
          <mesh position={[0.1, 0.02, -0.05]} castShadow>
            <sphereGeometry args={[0.13, 6, 6]} />
            <meshStandardMaterial color={COLOR.plantLight} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.04, 0.08]} castShadow>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color={COLOR.plantYellow} roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Garden({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 3,
  length = 8,
}: GardenProps) {
  const plants = useMemo(() => {
    const arr: { x: number; z: number; scale: number }[] = [];
    const rows = Math.floor(length / 0.6);
    const cols = Math.floor(width / 0.5);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip some for natural look
        if (Math.random() > 0.75) continue;

        const x =
          -width / 2 + 0.3 + (c * width) / cols + (Math.random() - 0.5) * 0.15;
        const z =
          -length / 2 + 0.4 + (r * length) / rows + (Math.random() - 0.5) * 0.2;
        arr.push({ x, z, scale: 0.7 + Math.random() * 0.5 });
      }
    }
    return arr;
  }, [width, length]);

  const curbHeight = 0.12;
  const curbThickness = 0.15;

  return (
    <group position={position} rotation={rotation}>
      {/* Dirt bed */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.08, length]} />
        <meshStandardMaterial color={COLOR.dirt} roughness={1} />
      </mesh>

      {/* Grass surface */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.06, length - 0.1]} />
        <meshStandardMaterial color={COLOR.grass} roughness={0.95} />
      </mesh>

      {/* Curb — front */}
      <mesh
        position={[0, curbHeight / 2, length / 2 + curbThickness / 2]}
        castShadow
      >
        <boxGeometry
          args={[width + curbThickness * 2, curbHeight, curbThickness]}
        />
        <meshStandardMaterial color={COLOR.curb} roughness={0.6} />
      </mesh>

      {/* Curb — back */}
      <mesh
        position={[0, curbHeight / 2, -(length / 2 + curbThickness / 2)]}
        castShadow
      >
        <boxGeometry
          args={[width + curbThickness * 2, curbHeight, curbThickness]}
        />
        <meshStandardMaterial color={COLOR.curb} roughness={0.6} />
      </mesh>

      {/* Curb — left */}
      <mesh
        position={[-(width / 2 + curbThickness / 2), curbHeight / 2, 0]}
        castShadow
      >
        <boxGeometry args={[curbThickness, curbHeight, length]} />
        <meshStandardMaterial color={COLOR.curb} roughness={0.6} />
      </mesh>

      {/* Curb — right */}
      <mesh
        position={[width / 2 + curbThickness / 2, curbHeight / 2, 0]}
        castShadow
      >
        <boxGeometry args={[curbThickness, curbHeight, length]} />
        <meshStandardMaterial color={COLOR.curb} roughness={0.6} />
      </mesh>

      {/* Plants */}
      {plants.map((p, i) => (
        <PlantCluster key={i} x={p.x} z={p.z} scale={p.scale} />
      ))}
    </group>
  );
}
