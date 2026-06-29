"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface BuildingCProps {
  position?: [number, number, number];
}

/* ------------------------------------------------------------------ */
/*  BLOCK — beveled cube                                              */
/* ------------------------------------------------------------------ */
function Block({
  color,
  size = 0.88,
  height = 0.88,
}: {
  color: string;
  size?: number;
  height?: number;
}) {
  const geometry = useMemo(() => {
    const s = size / 2;
    const shape = new THREE.Shape();

    shape.moveTo(-s, -s);
    shape.lineTo(s, -s);
    shape.lineTo(s, s);
    shape.lineTo(-s, s);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 6,
      curveSegments: 12,
    });

    geo.center();
    return geo;
  }, [size, height]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.0} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  FLOOR GRID — n×n blocks (generalized for setback tiers)          */
/* ------------------------------------------------------------------ */
function FloorGrid({
  color,
  y,
  n = 3,
  size = 0.88,
  gap = 0.17,
}: {
  color: string;
  y: number;
  n?: number;
  size?: number;
  gap?: number;
}) {
  const step = size + gap;
  const start = -((n - 1) / 2) * step;

  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => {
          const x = start + col * step;
          const z = start + row * step;
          return (
            <group key={`${row}-${col}`} position={[x, 0, z]}>
              <Block color={color} size={size} height={size} />
            </group>
          );
        }),
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SOLID ROOF with inset & lip (width-aware)                        */
/* ------------------------------------------------------------------ */
function Roof({
  y,
  colors,
  w = 3.12,
}: {
  y: number;
  colors: typeof COLORS;
  w?: number;
}) {
  return (
    <group position={[0, y, 0]}>
      {/* Main roof slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 0.32, w]} />
        <meshStandardMaterial color={colors.roof} roughness={0.6} />
      </mesh>

      {/* Inset */}
      <mesh position={[0, 0.17, 0]} receiveShadow>
        <boxGeometry args={[w * 0.77, 0.08, w * 0.77]} />
        <meshStandardMaterial color={colors.roofInset} roughness={0.6} />
      </mesh>

      {/* Lip */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <boxGeometry args={[w * 0.91, 0.06, w * 0.91]} />
        <meshStandardMaterial color={colors.roofLip} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOF CROWN — slim vertical spire/mast for the hero tower          */
/* ------------------------------------------------------------------ */
function RoofCrown({ y, colors }: { y: number; colors: typeof COLORS }) {
  return (
    <group position={[0, y, 0]}>
      {/* Tapered mechanical penthouse */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color={colors.roofInset} roughness={0.6} />
      </mesh>
      {/* Slim mast */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.4, 10]} />
        <meshStandardMaterial color={colors.roofLip} roughness={0.5} />
      </mesh>
      {/* Beacon tip */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#bfe4ff"
          emissive="#7fbfff"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// React atom logo — 3 orbital rings + nucleus
function ReactAtom({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const mat = (
    <meshStandardMaterial
      color="#61DAFB"
      roughness={0.08}
      metalness={0.55}
      emissive="#1898C0"
      emissiveIntensity={0.18}
    />
  );
  return (
    <group position={position} scale={scale}>
      {/* Nucleus */}
      <mesh castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        {mat}
      </mesh>
      {/* Three orbital rings at 60° intervals around Y */}
      {([0, Math.PI / 3, -Math.PI / 3] as const).map((rotY, i) => (
        <mesh key={i} rotation={[Math.PI / 2, rotY, 0]} castShadow>
          <torusGeometry args={[0.88, 0.068, 8, 48]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  COLORS — soft pastel blue (more saturation than before)             */
/* ------------------------------------------------------------------ */
const COLORS = {
  base: "#79c1fc", // slightly darker foundation
  floor: "#99cefa", // clear light blue
  roof: "#69b9fa", // very light blue-white
  door: "#69b9fa",
  roofInset: "#69b9fa",
  roofLip: "#69b9fa",
};

export function BuildingC({ position = [0, 0, 0] }: BuildingCProps) {
  // ── HERO SETBACK TOWER ────────────────────────────────────────────
  // Three stacked tiers of decreasing footprint create a strong vertical
  // silhouette: wide base (3×3) → mid (2×2) → slim crown. Dominant skyline.
  const floorHeight = 1.02;

  // Tier 1 — wide base (3×3 grid)
  const baseFloors = 4;
  const baseStep = 0.88 + 0.17; // grid step for n=3
  const baseW = 3 * baseStep; // ≈ 3.15

  // Tier 2 — setback mid (2×2 grid)
  const midN = 2;
  const midSize = 0.82;
  const midGap = 0.16;
  const midStep = midSize + midGap;
  const midFloors = 3;
  const midW = midN * midStep; // ≈ 1.96
  const midStartY = 1 + baseFloors * floorHeight; // top of base tier

  const baseRoofY = 0.8 + baseFloors * floorHeight; // small ledge over base
  const midRoofY = midStartY + midFloors * (midSize + 0);
  const crownY = midRoofY + 0.5;

  return (
    <group position={position} scale={[2.4, 2.4, 2.4]}>
      {/* ===== TIER 1 — WIDE BASE (3×3) ===== */}
      <group position={[0, 0, 0]}>
        <FloorGrid color={COLORS.base} y={0} n={3} />
        <ReactAtom position={[0, 8.8 + 1.75, 0]} scale={1.2} />

        {/* Entrance door */}
        <mesh position={[0, -0.8, 1.55]} castShadow>
          <boxGeometry args={[0.5, 0.9, 0.12]} />
          <meshStandardMaterial color={COLORS.door} roughness={0.8} />
        </mesh>
      </group>

      {Array.from({ length: baseFloors }).map((_, i) => (
        <FloorGrid
          key={`b${i}`}
          color={COLORS.floor}
          y={1 + i * floorHeight}
          n={3}
        />
      ))}

      {/* Ledge slab marking the first setback */}
      <Roof y={baseRoofY} colors={COLORS} w={baseW} />

      {/* ===== TIER 2 — SETBACK MID (2×2) ===== */}
      {Array.from({ length: midFloors }).map((_, i) => (
        <FloorGrid
          key={`m${i}`}
          color={COLORS.floor}
          y={midStartY + i * (midSize + 0.18)}
          n={midN}
          size={midSize}
          gap={midGap}
        />
      ))}

      {/* Mid roof slab */}
      <Roof y={midRoofY} colors={COLORS} w={midW + 0.5} />

      {/* ===== CROWN — slim mast for skyline dominance ===== */}
      <RoofCrown y={crownY} colors={COLORS} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SUNLIGHT — the "soft outdoor" look                                */
/* ------------------------------------------------------------------ */
