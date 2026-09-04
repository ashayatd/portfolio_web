"use client";

// StreetDetail.tsx — ground clutter that only pays for itself at eye level.
//
// From the docked camera 150 units away every one of these is a few pixels, so
// it renders in explore mode only. Materials are unlit (meshBasicMaterial is
// too flat for solids, so lambert): the scene runs its lighting through
// standard materials, and clutter this small doesn't need PBR.

import { solidRadius } from "./Obstacles";

/** Road surface height — see ROAD_SURFACE_Y in MiniCityScene. */
const ROAD_Y = -0.47;

const COLOR = {
  metal: "#6b7280",
  metalDark: "#4b5563",
  paint: "#e5e7eb",
  bin: "#3f4854",
};

/* The four roads run out along the diagonals. Everything below is placed in
   that frame: `r` is distance from the plaza, `side` the offset across it. */
const DIAGONALS: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

function onDiagonal(dx: number, dz: number, r: number, side: number) {
  const len = Math.hypot(dx, dz);
  const ux = dx / len;
  const uz = dz / len;
  // Perpendicular, to push things off the centre line onto the kerb.
  return [ux * r - uz * side, uz * r + ux * side] as const;
}

/** Flat, walk-over. Drain covers break up the empty asphalt underfoot. */
function DrainCover({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshLambertMaterial color={COLOR.metalDark} />
      </mesh>
      {/* Slats, so it reads as a grate rather than a dark disc. */}
      {[-0.2, -0.07, 0.07, 0.2].map((o) => (
        <mesh key={o} position={[o, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 0.6]} />
          <meshLambertMaterial color={COLOR.metal} />
        </mesh>
      ))}
    </group>
  );
}

/** Short post. Solid, with a tight radius so it deflects rather than traps. */
function Bollard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} {...solidRadius(0.2)}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.9, 8]} />
        <meshLambertMaterial color={COLOR.metal} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 8]} />
        <meshLambertMaterial color={COLOR.paint} />
      </mesh>
    </group>
  );
}

function LitterBin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} {...solidRadius(0.3)}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.8, 10]} />
        <meshLambertMaterial color={COLOR.bin} />
      </mesh>
      <mesh position={[0, 0.83, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.07, 10]} />
        <meshLambertMaterial color={COLOR.metal} />
      </mesh>
    </group>
  );
}

// Two drains per road, offset to one side like real gutter drains.
const drains = DIAGONALS.flatMap(([dx, dz]) =>
  [9, 17].map((r) => {
    const [x, z] = onDiagonal(dx, dz, r, 2.6);
    return [x, ROAD_Y + 0.015, z] as [number, number, number];
  }),
);

// Bollards guard the plaza mouth where each road meets the roundabout.
const bollards = DIAGONALS.flatMap(([dx, dz]) =>
  [-3.2, 3.2].map((side) => {
    const [x, z] = onDiagonal(dx, dz, 7.5, side);
    return [x, ROAD_Y, z] as [number, number, number];
  }),
);

// One bin beside each bench. Bench spots mirror MiniCityScene.
const bins: [number, number, number][] = [
  [5.4, 0, -17],
  [-5.4, 0, 17],
  [-17, 0, 5.4],
  [17, 0, 2.9],
];

export function StreetDetail() {
  return (
    <group>
      {drains.map((p, i) => (
        <DrainCover key={`drain-${i}`} position={p} />
      ))}
      {bollards.map((p, i) => (
        <Bollard key={`bollard-${i}`} position={p} />
      ))}
      {bins.map((p, i) => (
        <LitterBin key={`bin-${i}`} position={p} />
      ))}
    </group>
  );
}
