"use client";

import * as THREE from "three";

interface TreeClusterProps {
  position?: [number, number, number];
  scale?: number;
}

const COLOR = {
  trunk: "#9A7A55",
  foliage: "#88C07A",
  foliageDark: "#72AA64",
  foliageLight: "#9ECF8F",
};

function RoundedTree({
  position,
  scale = 3.2,
  height = 3,
  trunkHeight = 1,
  foliageSize = 0.8,
  foliageShape = "round" as "round" | "tall" | "wide",
}: {
  position: [number, number, number];
  scale?: number;
  height?: number;
  trunkHeight?: number;
  foliageSize?: number;
  foliageShape?: "round" | "tall" | "wide";
}) {
  return (
    <group position={position} scale={scale * height}>
      {/* Trunk — thinner, shorter */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, trunkHeight, 8]} />
        <meshStandardMaterial color={COLOR.trunk} roughness={0.9} />
      </mesh>

      {/* Foliage — smaller blobs */}
      {foliageShape === "round" && (
        <>
          <mesh
            position={[0, trunkHeight + foliageSize * 0.45, 0]}
            castShadow
          >
            <icosahedronGeometry args={[foliageSize * 0.5, 0]} />
            <meshStandardMaterial
              color={COLOR.foliage}
              roughness={0.8}
              flatShading={false}
            />
          </mesh>

          <mesh
            position={[foliageSize * 0.15, trunkHeight + foliageSize * 0.55, foliageSize * 0.08]}
            rotation={[0.3, 0.5, 0.2]}
            castShadow
          >
            <icosahedronGeometry args={[foliageSize * 0.35, 0]} />
            <meshStandardMaterial
              color={COLOR.foliageLight}
              roughness={0.8}
              flatShading={false}
            />
          </mesh>
        </>
      )}

      {foliageShape === "tall" && (
        <>
          <mesh
            position={[0, trunkHeight + foliageSize * 0.5, 0]}
            scale={[0.8, 1.2, 0.8]}
            castShadow
          >
            <sphereGeometry args={[foliageSize * 0.45, 8, 8]} />
            <meshStandardMaterial
              color={COLOR.foliage}
              roughness={0.8}
            />
          </mesh>
          <mesh
            position={[0, trunkHeight + foliageSize * 0.25, 0]}
            scale={[0.9, 0.75, 0.9]}
            castShadow
          >
            <sphereGeometry args={[foliageSize * 0.4, 8, 8]} />
            <meshStandardMaterial
              color={COLOR.foliageDark}
              roughness={0.8}
            />
          </mesh>
        </>
      )}

      {foliageShape === "wide" && (
        <>
          <mesh
            position={[0, trunkHeight + foliageSize * 0.35, 0]}
            scale={[1.1, 0.75, 1.0]}
            castShadow
          >
            <sphereGeometry args={[foliageSize * 0.5, 8, 8]} />
            <meshStandardMaterial
              color={COLOR.foliage}
              roughness={0.8}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export function TreeCluster({
  position = [0, 0, 0],
  scale = 1,
}: TreeClusterProps) {
  return (
    <group position={position} scale={scale}>
      {/* Tighter cluster — reduced spread and size */}
      <RoundedTree
        position={[-0.4, 0, 0.15]}
        height={0.55}
        trunkHeight={0.7}
        foliageSize={0.65}
        foliageShape="round"
      />

      <RoundedTree
        position={[0.05, 0, -0.25]}
        height={0.75}
        trunkHeight={1.0}
        foliageSize={0.85}
        foliageShape="tall"
      />

      <RoundedTree
        position={[0.35, 0, 0.2]}
        height={0.6}
        trunkHeight={0.8}
        foliageSize={0.7}
        foliageShape="wide"
      />
    </group>
  );
}

// Backward-compatible single tree
export function Tree({ position = [0, 0, 0], scale = 1 }: TreeClusterProps) {
  return <TreeCluster position={position} scale={scale} />;
}