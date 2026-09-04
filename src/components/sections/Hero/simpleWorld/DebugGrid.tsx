"use client";

// DebugGrid.tsx — TEMPORARY collision-debugging overlay.
//
// Paints a numbered grid over the city floor so a location can be reported by
// cell number ("I walk through 214") instead of described in prose. Cells the
// collision model currently treats as solid are tinted red, so a mismatch
// between what you see and what the code believes is visible at a glance.
//
// Delete this file and the DEBUG_GRID flag in MiniCityScene once collision is
// dialled in.

import { useMemo } from "react";
import * as THREE from "three";
import { COLLISION_RADIUS, type Bounds } from "./Obstacles";

/**
 * TEMPORARY: freezes the docked view into a straight overhead shot, so the
 * grid can be photographed without the oblique angle squashing the digits or
 * the auto-rotation blurring them. Flip on, screenshot, flip off.
 */
export const DEBUG_TOP_VIEW = false;

/** Half-extent of the walkable platform — matches Character's clamp. */
export const GRID_HALF = 31;
/** 20 x 20 = 400 cells. Cell is 3.1 units, i.e. ~1.7 character widths. */
export const GRID_DIVISIONS = 20;
export const GRID_SIZE = GRID_HALF * 2;
export const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;
/** Shared with Character.blocked() so the tint can't drift from the rule. */
const BLOCK_RADIUS = COLLISION_RADIUS;

/**
 * Local XZ -> 1-based cell number, numbered row-major from the -X/-Z corner:
 * cell 1 is the corner nearest (-31, -31), cell 20 ends the first row at +X,
 * cell 400 is the far corner at (+31, +31).
 */
export function cellFromLocal(x: number, z: number): number | null {
  const col = Math.floor((x + GRID_HALF) / CELL_SIZE);
  const row = Math.floor((z + GRID_HALF) / CELL_SIZE);
  if (col < 0 || col >= GRID_DIVISIONS) return null;
  if (row < 0 || row >= GRID_DIVISIONS) return null;
  return row * GRID_DIVISIONS + col + 1;
}

/** Inverse of cellFromLocal — the local-space footprint of a cell. */
export function cellBounds(cell: number) {
  const i = cell - 1;
  const col = i % GRID_DIVISIONS;
  const row = Math.floor(i / GRID_DIVISIONS);
  const minX = -GRID_HALF + col * CELL_SIZE;
  const minZ = -GRID_HALF + row * CELL_SIZE;
  return {
    minX,
    maxX: minX + CELL_SIZE,
    minZ,
    maxZ: minZ + CELL_SIZE,
    centerX: minX + CELL_SIZE / 2,
    centerZ: minZ + CELL_SIZE / 2,
  };
}

/** Mirrors Character.blocked() so the tint reflects the real rule. */
function isBlocked(x: number, z: number, bounds: Bounds[]): boolean {
  if (Math.abs(x) > GRID_HALF || Math.abs(z) > GRID_HALF) return true;
  return bounds.some(
    (b) =>
      x > b.min[0] - BLOCK_RADIUS &&
      x < b.max[0] + BLOCK_RADIUS &&
      z > b.min[2] - BLOCK_RADIUS &&
      z < b.max[2] + BLOCK_RADIUS,
  );
}

function useGridTexture(bounds: Bounds[]) {
  return useMemo(() => {
    const S = 2048;
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    const px = S / GRID_DIVISIONS;

    ctx.clearRect(0, 0, S, S);

    // Canvas top-left maps to local (-X, -Z), so row/col here match
    // cellFromLocal directly — no flipping to reason about.
    for (let row = 0; row < GRID_DIVISIONS; row++) {
      for (let col = 0; col < GRID_DIVISIONS; col++) {
        const { centerX, centerZ } = cellBounds(row * GRID_DIVISIONS + col + 1);
        if (isBlocked(centerX, centerZ, bounds)) {
          ctx.fillStyle = "rgba(220, 38, 38, 0.30)";
          ctx.fillRect(col * px, row * px, px, px);
        }
      }
    }

    // Minor lines, then every 5th redrawn heavier: from the docked camera a
    // cell is only ~30px on screen, so counting in blocks of five is more
    // reliable than reading individual digits.
    for (let i = 0; i <= GRID_DIVISIONS; i++) {
      const major = i % 5 === 0;
      ctx.strokeStyle = major
        ? "rgba(15, 23, 42, 0.9)"
        : "rgba(15, 23, 42, 0.45)";
      ctx.lineWidth = major ? 8 : 3;
      const p = i * px;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, S);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(S, p);
      ctx.stroke();
    }

    // White halo behind every digit so the numbers stay readable over the grey
    // road, the green/orange/blue/purple buildings and the red block tint.
    ctx.font = `bold ${Math.round(px * 0.52)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(6, px * 0.09);
    for (let row = 0; row < GRID_DIVISIONS; row++) {
      for (let col = 0; col < GRID_DIVISIONS; col++) {
        const n = row * GRID_DIVISIONS + col + 1;
        const { centerX, centerZ } = cellBounds(n);
        const x = col * px + px / 2;
        const y = row * px + px / 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.strokeText(String(n), x, y);
        ctx.fillStyle = isBlocked(centerX, centerZ, bounds)
          ? "#991b1b"
          : "#0f172a";
        ctx.fillText(String(n), x, y);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [bounds]);
}

/**
 * Drawn with depthTest off and a high renderOrder so it stays readable through
 * the raised plots and buildings — otherwise the cells you most need to talk
 * about (the ones under a building) would be the ones you cannot see.
 */
export function DebugGrid({
  bounds = [],
  y = -0.45,
}: {
  bounds?: Bounds[];
  y?: number;
}) {
  const texture = useGridTexture(bounds);

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={999}>
      <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.9}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Live cell readout                                                   */
/* ------------------------------------------------------------------ */
// A one-slot emitter rather than React state threaded up through the scene:
// the position changes every frame, and lifting that into the Hero component
// would re-render the whole 3D tree. Only the readout re-renders.

export interface CellInfo {
  cell: number | null;
  x: number;
  z: number;
  blocked: boolean;
}

type Listener = (info: CellInfo) => void;
let listener: Listener | null = null;

export function subscribeCell(fn: Listener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function publishCell(info: CellInfo) {
  listener?.(info);
}
